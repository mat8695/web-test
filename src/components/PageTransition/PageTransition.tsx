"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import styles from "./PageTransition.module.css";
import { CounterContent } from "./variants/CounterContent";
import { HeartLoader } from "./variants/HeartLoader";
import type { PageTransitionProps } from "./types";

const DEFAULT_DURATION_MS = 1500;
const DEFAULT_EXIT_DURATION_MS = 800;

export default function PageTransition({
  variant,
  label,
  duration = DEFAULT_DURATION_MS,
  exitDuration = DEFAULT_EXIT_DURATION_MS,
  showPercentage = true,
  onComplete,
}: PageTransitionProps) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Count up 0 -> 100 over `duration` ms.
  useEffect(() => {
    if (progress >= 100) {
      return;
    }
    const step = duration / 100;
    const timeout = setTimeout(() => setProgress((value) => Math.min(value + 1, 100)), step);
    return () => clearTimeout(timeout);
  }, [progress, duration]);

  // Once the count finishes, start the exit animation.
  useEffect(() => {
    if (progress === 100) {
      setIsExiting(true);
    }
  }, [progress]);

  // Notify the parent once the exit animation has finished.
  useEffect(() => {
    if (!isExiting) {
      return;
    }
    const timeout = setTimeout(() => onComplete?.(), exitDuration);
    return () => clearTimeout(timeout);
  }, [isExiting, exitDuration, onComplete]);

  const exitDurationStyle = { "--pt-exit-duration": `${exitDuration}ms` } as CSSProperties;

  const renderContent = (): ReactNode => {
    switch (variant) {
      case "counter":
        return <CounterContent label={label} progress={progress} showPercentage={showPercentage} />;
      case "heartLoader":
        return <HeartLoader label={label} progress={progress} showPercentage={showPercentage} />;
      // Future variants plug in here, each backed by its own component
      // under `variants/`. Returning null keeps the switch exhaustive so
      // TypeScript flags this file when a new variant is added.
      case "logo":
      case "wordmark":
      case "curtain":
      case "overlay":
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.overlay} ${isExiting ? styles.exiting : ""}`}
      style={exitDurationStyle}
      role="status"
      aria-live="polite"
    >
      {renderContent()}
    </div>
  );
}
