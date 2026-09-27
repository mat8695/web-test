"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Arrow from "@/components/Arrow";
import LanguageSwitch, { type Language } from "@/components/LanguageSwitch/LanguageSwitch";
import { SHARP_EASE } from "@/lib/easing";
import type { SanityTestimonial } from "@/components/Testimonials/types";
import styles from "./Testimonials2.module.css";

interface Testimonials2ClientProps {
  testimonials: SanityTestimonial[];
}

export default function Testimonials2Client({ testimonials }: Testimonials2ClientProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [language, setLanguage] = useState<Language>("en");

  const quoteRef = useRef<HTMLQuoteElement>(null);
  const isFirstRun = useRef(true);

  const count = testimonials.length;
  const current = count ? testimonials[activeIndex % count] : undefined;
  const quote = (language === "en" ? current?.quoteEn : current?.quotePl) ?? "";
  const author = current?.clientName ?? "";

  // Crossfade whenever the quote swaps — either a different testimonial or
  // the same one in the other language. Skipped on mount so the first
  // render doesn't flash. The client name is deliberately left out: it
  // swaps instantly rather than animating with the quote.
  useEffect(() => {
    const target = quoteRef.current;
    if (!target) return;

    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    const tween = gsap.fromTo(
      target,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.4, ease: SHARP_EASE }
    );

    return () => {
      tween.kill();
    };
  }, [activeIndex, language]);

  const goPrev = () => setActiveIndex((i) => (i - 1 + count) % count);
  const goNext = () => setActiveIndex((i) => (i + 1) % count);

  if (!count) return null;

  return (
    <section className={styles.section} aria-label="Testimonials">
      <div className={styles.card}>
        <div className={styles.upper}>
          <div className={styles.headerRow}>
            <h2 className={styles.title}>Love Notes</h2>
            <LanguageSwitch
              language={language}
              onChange={setLanguage}
              className={styles.languageSwitch}
            />
          </div>

          <blockquote className={styles.quote} ref={quoteRef}>
            <p>{quote}</p>
          </blockquote>
        </div>

        <div className={styles.divider} aria-hidden="true" />

        <div className={styles.lower}>
          <div className={styles.lowerTop}>
            <Arrow
              size={58}
              onClick={goPrev}
              ariaLabel="Previous testimonial"
              className={styles.arrowPrev}
            />
          </div>
          <div className={styles.lowerBottom}>
            <p className={styles.author}>
              {author}
            </p>
            <Arrow
              size={58}
              onClick={goNext}
              ariaLabel="Next testimonial"
              className={styles.arrowNext}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
