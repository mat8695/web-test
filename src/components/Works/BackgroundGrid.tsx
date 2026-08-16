"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./BackgroundGrid.module.css";

gsap.registerPlugin(ScrollTrigger);

const GRID_DENSITY = 12;
const MOBILE_GRID_DENSITY = 8;

export function BackgroundGrid() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const updateSize = () => {
      const rect = svg.getBoundingClientRect();

      setSize({
        width: rect.width,
        height: rect.height,
      });
    };

    updateSize();

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(svg);

    return () => resizeObserver.disconnect();
  }, []);

  // Horizontal line count doubles on mobile only — vertical lines and
  // desktop are untouched.
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 810px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const section = svg.closest("section") ?? svg.parentElement;
    if (!section) return;

    const ctx = gsap.context(() => {
      const cards = section.querySelectorAll("[data-works-card]");

      gsap.fromTo(
        cards,
        {
          opacity: 1,
          y: 1080,
          x: (index) => {
            if (index === 0) return 420;
            if (index === 2) return -420;
            return 0;
          },
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.3,
          ease: "circ.out",
          stagger: {
            amount: 0.15,
            from: "start",
          },
          scrollTrigger: {
            trigger: section,
            start: "top center",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  // Mobile fits exactly 8 squares across the width — same cellSize for
  // both axes, so cells stay square. Desktop keeps its own density.
  const density = isMobile ? MOBILE_GRID_DENSITY : GRID_DENSITY;
  const cellSize = size.width / density;

  const verticalLines = Array.from(
    { length: density + 1 },
    (_, i) => i * cellSize
  );

  const horizontalLines =
    cellSize > 0
      ? Array.from(
          { length: Math.ceil(size.height / cellSize) + 1 },
          (_, i) => i * cellSize
        )
      : [];

  return (
    <svg
      ref={svgRef}
      className={styles.grid}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {verticalLines.map((x, i) => (
        <line
          key={`v${i}`}
          x1={x}
          y1="0"
          x2={x}
          y2={size.height}
          className={`${styles.line} ${styles.verticalLine}`}
        />
      ))}

      {horizontalLines.map((y, i) => (
        <line
          key={`h${i}`}
          x1="0"
          y1={y}
          x2={size.width}
          y2={y}
          className={`${styles.line} ${styles.horizontalLine}`}
        />
      ))}
    </svg>
  );
}