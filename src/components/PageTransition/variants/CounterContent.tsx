import type { PageTransitionContentProps } from "../types";
import styles from "./CounterContent.module.css";

export function CounterContent({ label, progress, showPercentage = true }: PageTransitionContentProps) {
  return (
    <div className={styles.counter}>
      {label && <p className={styles.label}>{label}</p>}
      {showPercentage && <p className={styles.percentage}>{progress}%</p>}
    </div>
  );
}
