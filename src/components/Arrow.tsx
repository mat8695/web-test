"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SHARP_EASE } from "@/lib/easing";
import styles from "./Arrow.module.css";

export interface ArrowProps {
  /** Circle diameter in px. Defaults to the Figma spec (68px). */
  size?: number;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

// Ratios read off the Figma frames (icon size / circle size).
const DEFAULT_ARROW_RATIO = 29.333 / 68;
const HOVER_ARROW_RATIO = (25 / 68) * 1.2; // 20% bigger than the Figma spec
const TRAVEL_RATIO = 0.85;

function ArrowGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M12 4V18M12 18L6 12M12 18L18 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Arrow({ size = 68, onClick, className, ariaLabel = "Arrow" }: ArrowProps) {
  const circleRef = useRef<HTMLButtonElement>(null);
  const defaultArrowRef = useRef<HTMLSpanElement>(null);
  const hoverArrowRef = useRef<HTMLSpanElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const circle = circleRef.current;
    if (!circle) return;

    const travel = size * TRAVEL_RATIO;
    const fill = size / 2;

    const tl = gsap
      .timeline({ paused: true })
      // Circle fills from the outside toward the center.
      .fromTo(circle, { "--fill": "0px" }, { "--fill": `${fill}px`, duration: 0.45, ease: SHARP_EASE }, 0)
      // Dark arrow slides down and exits below the button.
      .fromTo(defaultArrowRef.current, { y: 0 }, { y: travel, duration: 0.45, ease: SHARP_EASE }, 0)
      // Pink arrow slides down from above into the center, scaling up slightly.
      .fromTo(
        hoverArrowRef.current,
        { y: -travel, scale: 1 },
        { y: 0, scale: 1.05, duration: 0.45, ease: SHARP_EASE },
        0
      );

    tlRef.current = tl;

    return () => {
      tlRef.current?.kill();
    };
  }, [size]);

  const handleMouseEnter = () => tlRef.current?.play();
  const handleMouseLeave = () => tlRef.current?.reverse();

  const cls = [styles.circle, className].filter(Boolean).join(" ");
  const defaultArrowSize = size * DEFAULT_ARROW_RATIO;
  const hoverArrowSize = size * HOVER_ARROW_RATIO;

  return (
    <button
      ref={circleRef}
      type="button"
      className={cls}
      style={{ width: size, height: size }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={ariaLabel}
    >
      <span
        className={styles.arrowDefault}
        ref={defaultArrowRef}
        style={{ width: defaultArrowSize, height: defaultArrowSize }}
        aria-hidden="true"
      >
        <ArrowGlyph />
      </span>
      <span
        className={styles.arrowHover}
        ref={hoverArrowRef}
        style={{ width: hoverArrowSize, height: hoverArrowSize }}
        aria-hidden="true"
      >
        <ArrowGlyph />
      </span>
    </button>
  );
}
