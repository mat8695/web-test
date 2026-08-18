"use client";

import { useRef } from "react";
import GridAnimation from "@/components/GridAnimation/GridAnimation";
import type { SanityProject } from "@/components/Works/types";
import styles from "./WorkQuote.module.css";

interface WorkQuoteProps {
  project: SanityProject;
}

// Full-screen quote section between the gallery and the footer — only
// renders when the project actually has a quote set in Sanity. The
// background animation is optional independently of the quote: same
// JSON grid-animation format as the homepage hero (see GridAnimation),
// just a different per-project file uploaded through Sanity instead of
// the one fixed homepage asset.
export default function WorkQuote({ project }: WorkQuoteProps) {
  const animationWrapperRef = useRef<HTMLDivElement>(null);

  if (!project.quote) return null;

  const animationSrc = project.quoteBackgroundAnimation?.fileUrl;

  return (
    <section className={styles.section} aria-label="Client quote">
      {animationSrc && (
        <GridAnimation
          src={animationSrc}
          wrapperRef={animationWrapperRef}
          className={styles.animation}
        />
      )}
      <p className={styles.quote}>{project.quote}</p>
    </section>
  );
}
