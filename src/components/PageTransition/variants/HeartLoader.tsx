"use client";

import { useEffect, useRef } from "react";
import { HeartIcon } from "./HeartIcon";
import type { PageTransitionContentProps } from "../types";
import styles from "./HeartLoader.module.css";

const HEART_PATH =
  "M10 18C10.6536 17.6444 19.6079 12.8793 19.9869 6.50693C20.0523 5.36901 19.9216 3.15005 18.4314 1.48583C17.4902 0.433247 16.3137 0.177214 15.8954 0.0918696C12.7974 -0.548214 10.3007 2.48152 10 2.80867C9.71242 2.48152 7.20261 -0.562439 4.10456 0.0918696C3.68626 0.177214 2.50979 0.433247 1.56861 1.48583C0.0784135 3.13582 -0.0523058 5.36901 0.0130538 6.50693C0.392139 12.8793 9.3464 17.6586 10 18Z";

const RESOLUTIONS = [4, 6, 8, 11, 15, 20];

// Normalize global 0–100 progress to a 0–1 value for a given segment range
function toSegmentProgress(global: number, start: number, end: number): number {
  return Math.min(Math.max((global - start) / (end - start), 0), 1);
}

// progress is a 0–1 normalized value for this heart's segment
function PixelHeart({ progress }: { progress: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgWrapperRef = useRef<HTMLDivElement>(null);
  const heartPathRef = useRef<Path2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const svgWrapper = svgWrapperRef.current;
    if (!canvas || !svgWrapper) return;

    // Lazily create Path2D on first run (browser-only API)
    if (!heartPathRef.current) {
      heartPathRef.current = new Path2D(HEART_PATH);
    }

    if (progress >= 1) {
      canvas.style.visibility = "hidden";
      svgWrapper.style.visibility = "visible";
      return;
    }

    const index = Math.min(
      Math.floor(progress * RESOLUTIONS.length),
      RESOLUTIONS.length - 1
    );
    const w = RESOLUTIONS[index];
    const h = Math.round((w * 18) / 20);

    // Resizing clears the canvas and resets context state
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.save();
    ctx.scale(w / 20, h / 18);
    ctx.fillStyle = "#DE2228";
    ctx.fill(heartPathRef.current);
    ctx.restore();
  }, [progress]);

  return (
    <div className={styles.heartWrapper}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div ref={svgWrapperRef} className={styles.svgWrapper}>
        <HeartIcon />
      </div>
    </div>
  );
}

export function HeartLoader({ progress, showPercentage }: PageTransitionContentProps) {
  return (
    <div className={styles.loader}>
      <div className={styles.hearts}>
        <PixelHeart progress={toSegmentProgress(progress, 0, 33)} />
        <PixelHeart progress={toSegmentProgress(progress, 33, 66)} />
        <PixelHeart progress={toSegmentProgress(progress, 66, 100)} />
      </div>
      {showPercentage && <p className={styles.percentage}>{progress}%</p>}
    </div>
  );
}
