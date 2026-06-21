import styles from "./BackgroundGrid.module.css";

// Number of cells per axis. Increase for a denser grid, decrease for a sparser one.
// Lines count = GRID_DENSITY + 1 (edge lines included on both sides).
const GRID_DENSITY = 12;

export function BackgroundGrid() {
  const indices = Array.from({ length: GRID_DENSITY + 1 }, (_, i) => i);

  return (
    <svg
      className={styles.grid}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {indices.map((i) => (
        <line
          key={`v${i}`}
          x1={`${(i / GRID_DENSITY) * 100}%`}
          y1="0"
          x2={`${(i / GRID_DENSITY) * 100}%`}
          y2="100%"
          className={styles.line}
        />
      ))}
      {indices.map((i) => (
        <line
          key={`h${i}`}
          x1="0"
          y1={`${(i / GRID_DENSITY) * 100}%`}
          x2="100%"
          y2={`${(i / GRID_DENSITY) * 100}%`}
          className={styles.line}
        />
      ))}
    </svg>
  );
}
