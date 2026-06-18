"use client";

import { useEffect, useState } from "react";
import styles from "./Loading.module.css";

const COUNT_DURATION_MS = 2000;
const COUNT_STEP_MS = COUNT_DURATION_MS / 100;
const EXIT_DURATION_MS = 800;

interface LoadingProps {
  onComplete: () => void;
}

export default function Loading({ onComplete }: LoadingProps) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (progress >= 100) {
      return;
    }
    const timeout = setTimeout(() => setProgress((value) => value + 1), COUNT_STEP_MS);
    return () => clearTimeout(timeout);
  }, [progress]);

  useEffect(() => {
    if (progress === 100) {
      setIsExiting(true);
    }
  }, [progress]);

  useEffect(() => {
    if (!isExiting) {
      return;
    }
    const timeout = setTimeout(onComplete, EXIT_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [isExiting, onComplete]);

  return (
    <div
      className={`${styles.loading} ${isExiting ? styles.exiting : ""}`}
      role="status"
      aria-live="polite"
    >
      <p className={styles.percentage}>{progress}%</p>
    </div>
  );
}
