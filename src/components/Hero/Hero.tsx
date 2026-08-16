"use client";

import { useEffect, useRef, useState } from "react";
import { inflate } from "pako";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "@/components/Button";
import styles from "./Hero.module.css";

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  onOpenAbout?: () => void;
}

interface GridAnimation {
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

interface HeartAnimationProps {
  wrapperRef: React.RefObject<HTMLDivElement | null>;
}

function HeartAnimation({ wrapperRef }: HeartAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    let rafId = 0;

    (async () => {
      const res = await fetch("/animations/kat%20anim.json");
      const data: GridAnimation = await res.json();
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

      const heartColor = getComputedStyle(wrapper).getPropertyValue("--heart-color");
      const [r, g, b] = hexToRgb(heartColor || "#ffffff");

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
  }, []);

  return (
    <div className={styles.heartAnimation} ref={wrapperRef} aria-hidden="true">
      <canvas className={styles.heartCanvas} ref={canvasRef} />
    </div>
  );
}

const TAGLINE = (
  <>
    I'm a designer with a special love
    <br />
    for visual communication and
    <br />
    turning chaos into clarity.
  </>
);

export default function Hero({ onOpenAbout }: HeroProps) {
  const heartWrapRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Same isMobile-detection pattern as BackgroundGrid.tsx: render exactly
  // one JSX tree per breakpoint. Mobile and desktop stay genuinely
  // different structures — mobile keeps only the heart in a sticky,
  // scroll-scrubbed stage; the headline/buttons live in normal document
  // flow and just play a one-time entrance on load. Desktop is the
  // original static, centered layout.
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 810px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Mobile-only: the heart drifts up and shrinks slightly as the user
  // scrolls through .hero. This is the only scroll-linked animation —
  // the headline/buttons are handled separately below and never touch
  // ScrollTrigger, which is what was causing the Safari repaint bug
  // (position: sticky + overflow clipping + a scrubbed transform on the
  // text). Values are tuned by eye against the reference.
  useEffect(() => {
    if (!isMobile) return;
    const hero = heroRef.current;
    const heart = heartWrapRef.current;
    if (!hero || !heart) return;

    const tween = gsap.to(heart, {
      y: "-20vh",
      scale: 0.85,
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [isMobile]);

  // Mobile-only: one-time entrance once the Hero is mounted — not tied
  // to scroll at all. Headline and buttons move together as a single
  // block (heroContent), a small settle-into-place nudge rather than a
  // reveal, since they're already in normal flow, not hidden/clipped.
  useEffect(() => {
    if (!isMobile) return;
    const content = contentRef.current;
    if (!content) return;

    const tween = gsap.fromTo(
      content,
      { y: 80 },
      { y: 0, duration: 0.5, delay: 0.5, ease: "power2.out" }
    );

    return () => {
      tween.kill();
    };
  }, [isMobile]);

  if (isMobile) {
    return (
      <section className={styles.hero} ref={heroRef}>
        <div className={styles.topBar} aria-label="katszewczyk">
          <span>KAT.SZEWCZYK</span>
        </div>

        <div className={styles.heartStage}>
          <HeartAnimation wrapperRef={heartWrapRef} />
        </div>

        <div className={styles.heroContent} ref={contentRef}>
          <h1 className={styles.tagline}>{TAGLINE}</h1>
          <div className={styles.mobileActions}>
            <Button href="/works">works</Button>
            <Button onClick={onOpenAbout}>read about</Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.hero}>
      <div className={styles.topBar} aria-label="katszewczyk">
        <span>KAT.SZEWCZYK</span>
        <span>halo@katszewczyk.com</span>
      </div>

      <div className={styles.taglineWrap}>
        <HeartAnimation wrapperRef={heartWrapRef} />
        <h1 className={styles.tagline}>{TAGLINE}</h1>
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.bottomBarLeft}>
          <Button href="/works">works</Button>
        </div>
        <div className={styles.bottomBarRight}>
          <Button onClick={onOpenAbout}>read about</Button>
        </div>
      </div>
    </section>
  );
}
