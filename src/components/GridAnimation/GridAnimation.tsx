"use client";

import { useEffect, useRef, type RefObject } from "react";
import { inflate } from "pako";

// Custom lightweight sprite-grid animation format — NOT Lottie, NOT video.
// A JSON manifest plus gzip-compressed, base64-encoded per-cell brightness
// bytes, rendered frame-by-frame onto a <canvas>. Originally built just for
// the homepage Hero's heart animation; generalized here so any section can
// play its own JSON file (e.g. a per-project background animation uploaded
// through Sanity) through the same renderer.
interface GridAnimationData {
  cols: number;
  rows: number;
  fps: number;
  frameCount: number;
  aspect: number; // intended width / height of the rendered grid
  frames: string; // base64-encoded, gzip-compressed Uint8Array of per-cell brightness
}

const CELL_SIZE = 12;
const CELL_PADDING = 2;

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.trim().replace("#", "");
  const full =
    clean.length === 3
      ? clean.split("").map((ch) => ch + ch).join("")
      : clean;
  const int = parseInt(full, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

export interface GridAnimationProps {
  /** URL of the animation's JSON manifest. */
  src: string;
  /** Fill color for lit cells. Defaults to the brand pink used everywhere
   *  this animation currently appears. */
  color?: string;
  /** The wrapper div's own aspect-ratio is set from the JSON's "aspect"
   *  field once loaded — give it a ref if a consumer needs to animate the
   *  wrapper directly (as Hero.tsx does for its scroll-scrubbed heart). */
  wrapperRef: RefObject<HTMLDivElement | null>;
  className?: string;
}

export default function GridAnimation({
  src,
  color = "#f7a9c5",
  wrapperRef,
  className,
}: GridAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    let rafId = 0;

    (async () => {
      const res = await fetch(src);
      const data: GridAnimationData = await res.json();
      if (cancelled) return;

      const binary = atob(data.frames);
      const compressed = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        compressed[i] = binary.charCodeAt(i);
      }
      const pixels = inflate(compressed);

      const wrapper = wrapperRef.current;
      const canvas = canvasRef.current;
      if (!wrapper || !canvas || cancelled) return;

      const { cols, rows, frameCount, fps, aspect } = data;
      if (aspect) wrapper.style.aspectRatio = String(aspect);
      canvas.width = cols * CELL_SIZE;
      canvas.height = rows * CELL_SIZE;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const [r, g, b] = hexToRgb(color);

      const cellsPerFrame = cols * rows;
      const interval = 1000 / fps;
      let frameIndex = 0;
      let last = 0;

      const drawFrame = (index: number) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const base = index * cellsPerFrame;
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const value = pixels[base + row * cols + col];
            if (!value) continue;
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${value / 255})`;
            ctx.fillRect(
              col * CELL_SIZE + CELL_PADDING,
              row * CELL_SIZE + CELL_PADDING,
              CELL_SIZE - CELL_PADDING * 2,
              CELL_SIZE - CELL_PADDING * 2
            );
          }
        }
      };

      const tick = (now: number) => {
        if (cancelled) return;
        if (now - last >= interval) {
          last = now;
          drawFrame(frameIndex);
          frameIndex = (frameIndex + 1) % frameCount;
        }
        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, [src, color, wrapperRef]);

  return (
    <div className={className} ref={wrapperRef} aria-hidden="true">
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </div>
  );
}
