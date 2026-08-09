"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./BackgroundGrid.module.css";

gsap.registerPlugin(ScrollTrigger);

const GRID_DENSITY = 12;

export function BackgroundGrid() {
  const svgRef = useRef<SVGSVGElement>(null);
  const indices = Array.from({ length: GRID_DENSITY + 1 }, (_, i) => i);

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
          }
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

  return (
    <svg
      ref={svgRef}
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
          className={`${styles.line} ${styles.verticalLine}`}
        />
      ))}

      {indices.map((i) => (
        <line
          key={`h${i}`}
          x1="0"
          y1={`${(i / GRID_DENSITY) * 100}%`}
          x2="100%"
          y2={`${(i / GRID_DENSITY) * 100}%`}
          className={`${styles.line} ${styles.horizontalLine}`}
        />
      ))}
    </svg>
  );
}