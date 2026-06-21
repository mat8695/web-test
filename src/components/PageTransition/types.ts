export type PageTransitionVariant =
  | "counter"
  | "heartLoader"
  | "logo"
  | "wordmark"
  | "curtain"
  | "overlay";

export interface PageTransitionProps {
  /** Visual style of the transition. */
  variant: PageTransitionVariant;
  /** Text shown alongside the variant's visual (e.g. a page name). */
  label?: string;
  /** Time in ms the transition stays in its "entering/loading" phase before exiting. */
  duration?: number;
  /** Time in ms the exit animation takes once the loading phase finishes. */
  exitDuration?: number;
  /** Whether to render the 0-100 progress counter (counter variant only). */
  showPercentage?: boolean;
  /** Called once the exit animation has fully finished. */
  onComplete?: () => void;
}

export interface PageTransitionContentProps {
  label?: string;
  progress: number;
  showPercentage?: boolean;
}
