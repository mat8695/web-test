"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import gsap from "gsap";
import Arrow, { type ArrowHandle } from "@/components/Arrow";
import { TransitionLink } from "@/components/Transition/TransitionLink";
import { SHARP_EASE } from "@/lib/easing";
import type { SanityProject } from "./types";
import styles from "./ProjectRow.module.css";

const HOVER_TEXT_COLOR = "#1e1e1e";

interface ProjectRowProps {
  project: SanityProject;
  onHoverStart: (project: SanityProject) => void;
  onHoverMove: (clientX: number, clientY: number) => void;
  onHoverEnd: () => void;
}

// Desktop row: whole row is the link (TransitionLink, same pattern as
// ProjectCard). Hover fill + text color swap reuse Button.tsx's own
// mechanism verbatim — a paused GSAP timeline built once, scaleX(0->1) on
// an inset:0 fill layer with transform-origin left, SHARP_EASE, 0.45s —
// just applied to a full row's text nodes instead of one button label.
// Arrow.tsx's own existing hover timeline is triggered in parallel via
// its imperative handle rather than reimplemented.
export function ProjectRow({ project, onHoverStart, onHoverMove, onHoverEnd }: ProjectRowProps) {
  const fillRef = useRef<HTMLSpanElement>(null);
  const borderRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const yearRef = useRef<HTMLParagraphElement>(null);
  const arrowRef = useRef<ArrowHandle>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const fill = fillRef.current;
    if (!fill) return;

    const colorTargets = [titleRef.current, descRef.current, yearRef.current].filter(
      (el): el is HTMLParagraphElement => el !== null
    );

    const tl = gsap.timeline({ paused: true }).fromTo(
      fill,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.45, ease: SHARP_EASE },
      0
    );

    if (colorTargets.length) {
      tl.to(colorTargets, { color: HOVER_TEXT_COLOR, duration: 0.45, ease: SHARP_EASE }, 0);
    }
    if (borderRef.current) {
      tl.to(borderRef.current, { backgroundColor: HOVER_TEXT_COLOR, duration: 0.45, ease: SHARP_EASE }, 0);
    }

    tlRef.current = tl;

    return () => {
      tl.kill();
    };
  }, []);

  const handleMouseEnter = () => {
    tlRef.current?.play();
    arrowRef.current?.play();
    onHoverStart(project);
  };

  const handleMouseLeave = () => {
    tlRef.current?.reverse();
    arrowRef.current?.reverse();
    onHoverEnd();
  };

  const handleMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
    onHoverMove(e.clientX, e.clientY);
  };

  return (
    <TransitionLink
      href={`/works/${project.slug}`}
      className={styles.row}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <span className={styles.fill} ref={fillRef} aria-hidden="true" />
      <span className={styles.borderLine} ref={borderRef} aria-hidden="true" />
      <div className={styles.content}>
        <p className={styles.title} ref={titleRef}>
          {project.title}
        </p>
        <div className={styles.right}>
          {project.hoverDescription && (
            <p className={styles.description} ref={descRef}>
              {project.hoverDescription}
            </p>
          )}
          {project.year && (
            <p className={styles.year} ref={yearRef}>
              {project.year}
            </p>
          )}
          <Arrow
            ref={arrowRef}
            size={46}
            interactive={false}
            className={styles.arrow}
            ariaLabel={`View ${project.title}`}
          />
        </div>
      </div>
    </TransitionLink>
  );
}

interface MobileProjectRowProps {
  project: SanityProject;
}

// Mobile: same data, no hover fill/image — navigation only, per spec.
export function MobileProjectRow({ project }: MobileProjectRowProps) {
  return (
    <TransitionLink href={`/works/${project.slug}`} className={styles.mobileRow}>
      <div className={styles.mobileTopRow}>
        <p className={styles.mobileTitle}>{project.title}</p>
        {project.year && <p className={styles.mobileYear}>{project.year}</p>}
      </div>
      <div className={styles.mobileBottomRow}>
        {project.hoverDescription && (
          <p className={styles.mobileDescription}>{project.hoverDescription}</p>
        )}
        <Arrow size={46} interactive={false} className={styles.arrow} ariaLabel={`View ${project.title}`} />
      </div>
    </TransitionLink>
  );
}
