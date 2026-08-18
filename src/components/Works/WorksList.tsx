"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { urlFor } from "@/sanity/lib/image";
import { SHARP_EASE } from "@/lib/easing";
import { ProjectRow, MobileProjectRow } from "./ProjectRow";
import type { SanityImageRef, SanityProject } from "./types";
import styles from "./WorksList.module.css";

interface WorksListProps {
  projects: SanityProject[];
}

function getAspectRatio(image: SanityImageRef | undefined): number | undefined {
  const dims = image?.metadata?.dimensions;
  if (!dims) return undefined;
  if (dims.aspectRatio) return dims.aspectRatio;
  if (dims.width && dims.height) return dims.width / dims.height;
  return undefined;
}

export default function WorksList({ projects }: WorksListProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [activeProject, setActiveProject] = useState<SanityProject | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 810px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Cursor position is applied via gsap.set — not a tweened quickTo — so
  // the image tracks the pointer with zero lag. (quickTo needs a nonzero
  // duration to work at all; passing 0 leaves it stuck.) Still routed
  // through GSAP rather than raw style writes, so it stays on GSAP's own
  // rAF-batched update path. Centering (xPercent/yPercent) is set once
  // here and composes with the x/y sets on every move, rather than living
  // in a plain CSS transform that these x/y sets would otherwise
  // overwrite.
  useEffect(() => {
    if (isMobile) return;
    const el = floatingRef.current;
    if (!el) return;

    gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0, scale: 0.96 });
  }, [isMobile]);

  const handleHoverStart = (project: SanityProject) => {
    setActiveProject(project);
    gsap.to(floatingRef.current, { opacity: 1, scale: 1, duration: 0.35, ease: SHARP_EASE });
  };

  const handleHoverMove = (clientX: number, clientY: number) => {
    const container = containerRef.current;
    const el = floatingRef.current;
    if (!container || !el) return;
    const rect = container.getBoundingClientRect();
    gsap.set(el, { x: clientX - rect.left, y: clientY - rect.top });
  };

  const handleHoverEnd = () => {
    gsap.to(floatingRef.current, { opacity: 0, scale: 0.96, duration: 0.3, ease: SHARP_EASE });
  };

  const activeImageUrl = activeProject?.coverImage
    ? urlFor(activeProject.coverImage).width(900).url()
    : null;
  const activeAspectRatio = getAspectRatio(activeProject?.coverImage);

  if (isMobile) {
    return (
      <div className={styles.list}>
        <h1 className={styles.heading}>Works</h1>
        <div className={styles.mobileRows}>
          {projects.map((project) => (
            <MobileProjectRow key={project.slug} project={project} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.list} ref={containerRef} onMouseLeave={handleHoverEnd}>
      <h1 className={styles.heading}>Works</h1>

      <div className={styles.rows}>
        {projects.map((project) => (
          <ProjectRow
            key={project.slug}
            project={project}
            onHoverStart={handleHoverStart}
            onHoverMove={handleHoverMove}
            onHoverEnd={handleHoverEnd}
          />
        ))}
      </div>

      <div className={styles.imageLayer} ref={floatingRef} aria-hidden="true">
        {activeImageUrl && (
          <img
            src={activeImageUrl}
            alt=""
            className={styles.image}
            style={activeAspectRatio ? { aspectRatio: activeAspectRatio } : undefined}
          />
        )}
      </div>
    </div>
  );
}
