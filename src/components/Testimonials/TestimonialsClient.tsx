"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Arrow from "@/components/Arrow";
import type { SanityTestimonial } from "./types";
import styles from "./Testimonials.module.css";

gsap.registerPlugin(ScrollTrigger);

type Panel = "intro" | "signature";

interface TestimonialsClientProps {
  testimonials: SanityTestimonial[];
}

export default function TestimonialsClient({ testimonials }: TestimonialsClientProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const leftQuoteRef = useRef<HTMLQuoteElement>(null);
  const rightQuoteRef = useRef<HTMLQuoteElement>(null);
  const authorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    if (!section || !card) return;

    // Desktop-only: tablet/mobile use the stacked .tabletCard/.mobileCard
    // layout (≤1200px) and aren't part of this reveal.
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1201px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      });

      // Container expands 60% -> 100%. The divider sits between two equal
      // flex columns, so it recenters for free as the card widens — no
      // separate tween needed.
      tl.fromTo(card, { width: "60%" }, { width: "100%", duration: 0.6, ease: "circ.out" });

      // Left testimonial reveals only once the width tween above finishes
      // (no explicit position = sequential placement in the timeline).
      if (leftQuoteRef.current) {
        tl.fromTo(
          leftQuoteRef.current,
          { opacity: 0, y: 40},
          { opacity: 1, duration: 0.4, y: 0, ease: "circ.out"}
        );
      }

      // Right testimonial + author reveal together, after the left one.
      if (rightQuoteRef.current) {
        tl.fromTo(
          [rightQuoteRef.current,],
          { opacity: 0, y: 40},
          { opacity: 1, duration: 0.3, y: 0, ease: "circ.out"}
        );
      }
      
      // Author reveal
      if (authorRef.current) {
        tl.fromTo(
          [authorRef.current,],
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: "circ.out" }
        );
      }
    });

    return () => mm.revert();
  }, []);

  const cycle = () => {
    setActiveIndex((i) => (i + 1) % testimonials.length);
  };

  const current = testimonials[activeIndex % testimonials.length];
  const quotePl = current?.quotePl ?? "";
  const quoteEn = current?.quoteEn ?? "";
  const author = current?.clientName ?? "";

  const renderPanel = (
    panel: Panel,
    arrowButton: React.ReactNode,
    quoteText: string,
    quoteRef: React.RefObject<HTMLQuoteElement | null>
  ) => {
    if (panel === "intro") {
      return (
        <>
          <h2 className={styles.title}>Love Notes</h2>
          <blockquote className={styles.quote} ref={quoteRef}>
            <p>{quoteText}</p>
          </blockquote>
          {arrowButton}
        </>
      );
    }

    return (
      <>
        <blockquote className={styles.quote} ref={quoteRef}>
          <p>{quoteText}</p>
        </blockquote>
        {arrowButton}
        <p className={styles.author} ref={authorRef}>{author}</p>
      </>
    );
  };

  const panelClassName = (panel: Panel) =>
    panel === "intro" ? styles.introPadding : styles.signaturePadding;

  const leftPanel: Panel = activeIndex % 2 === 0 ? "intro" : "signature";
  const rightPanel: Panel = leftPanel === "intro" ? "signature" : "intro";

  if (!testimonials.length) return null;

  return (
    <section className={styles.testimonials} aria-label="Testimonials" ref={sectionRef}>
      <div className={styles.card} ref={cardRef}>
        <div className={`${styles.column} ${styles.columnLeft} ${panelClassName(leftPanel)}`}>
          {renderPanel(
            leftPanel,
            <Arrow
              onClick={cycle}
              ariaLabel="Previous testimonial"
              size={62}
              className={styles.arrowPrev}
            />,
            quotePl,
            leftQuoteRef
          )}
        </div>
        <div className={styles.divider} aria-hidden="true" />
        <div className={`${styles.column} ${styles.columnRight} ${panelClassName(rightPanel)}`}>
          {renderPanel(
            rightPanel,
            <Arrow
              onClick={cycle}
              ariaLabel="Next testimonial"
              size={62}
              className={styles.arrowNext}
            />,
            quoteEn,
            rightQuoteRef
          )}
        </div>

        <div className={styles.tabletCard}>
          <div className={styles.tabletTop}>
            <h2 className={styles.mobileTitle}>Love Notes</h2>
            <blockquote className={styles.tabletQuote}>
              <p>{quotePl}</p>
            </blockquote>
          </div>
          <div className={styles.mobileDivider} aria-hidden="true" />
          <div className={styles.tabletContent}>
            <div className={styles.tabletQuoteRow}>
              <Arrow
                onClick={cycle}
                ariaLabel="Previous testimonial"
                size={58}
                className={styles.arrowPrev}
              />
              <blockquote className={styles.tabletQuoteEn}>
                <p>{quoteEn}</p>
              </blockquote>
            </div>
            <div className={styles.mobileBottom}>
              <p className={styles.mobileAuthor}>{author}</p>
              <Arrow
                onClick={cycle}
                ariaLabel="Next testimonial"
                size={58}
                className={styles.arrowNext}
              />
            </div>
          </div>
        </div>

        <div className={styles.mobileCard}>
          <div className={styles.mobileTop}>
            <h2 className={styles.mobileTitle}>Love Notes</h2>
            <blockquote className={styles.mobileQuote}>
              <p>{quotePl}</p>
            </blockquote>
          </div>
          <div className={styles.mobileDivider} aria-hidden="true" />
          <div className={styles.mobileContent}>
            <blockquote className={styles.mobileQuoteEn}>
              <p>{quoteEn}</p>
            </blockquote>
            <div className={styles.mobileBottom}>
              <p className={styles.mobileAuthor}>{author}</p>
              <Arrow
                onClick={cycle}
                ariaLabel="Next testimonial"
                size={58}
                className={styles.arrowNext}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
