"use client";

import { useState } from "react";
import styles from "./Testimonials.module.css";

const TESTIMONIAL_QUOTE =
  "“I highly recommend working with Kasia! She has her own vibe, can really sense your style and creates something truly special. On top of that, she’s professional, efficient and the kind of person you want to keep coming back to - like meeting a friend for coffee!”";

type Testimonial = {
  quote: string;
  author: string;
};

const TESTIMONIALS: Testimonial[] = [
  { quote: TESTIMONIAL_QUOTE, author: "Moi mili" },
  { quote: TESTIMONIAL_QUOTE, author: "mili moi" },
];

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 62 62"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M31 0C24.8688 0 18.8753 1.81812 13.7773 5.22444C8.67941 8.63076 4.70606 13.4723 2.35975 19.1368C0.0134318 24.8013 -0.600472 31.0344 0.59567 37.0478C1.79181 43.0612 4.74427 48.5849 9.0797 52.9203C13.4151 57.2557 18.9388 60.2082 24.9522 61.4043C30.9656 62.6005 37.1987 61.9866 42.8632 59.6402C48.5277 57.2939 53.3692 53.3206 56.7756 48.2227C60.1819 43.1247 62 37.1312 62 31C61.9913 22.7809 58.7225 14.901 52.9107 9.08927C47.099 3.27753 39.2191 0.00867946 31 0ZM31 57.2308C25.8121 57.2308 20.7406 55.6923 16.427 52.8101C12.1133 49.9278 8.75129 45.8311 6.76594 41.0381C4.7806 36.245 4.26114 30.9709 5.27326 25.8826C6.28538 20.7944 8.78362 16.1205 12.4521 12.452C16.1205 8.7836 20.7944 6.28537 25.8826 5.27325C30.9709 4.26113 36.245 4.78058 41.0381 6.76593C45.8311 8.75127 49.9278 12.1133 52.8101 16.427C55.6924 20.7406 57.2308 25.812 57.2308 31C57.2229 37.9544 54.4568 44.6217 49.5392 49.5392C44.6217 54.4567 37.9544 57.2229 31 57.2308ZM44.6102 29.3129C44.8319 29.5343 45.0078 29.7973 45.1278 30.0868C45.2478 30.3763 45.3096 30.6866 45.3096 31C45.3096 31.3134 45.2478 31.6237 45.1278 31.9132C45.0078 32.2026 44.8319 32.4656 44.6102 32.6871L35.0717 42.2256C34.6243 42.673 34.0174 42.9244 33.3846 42.9244C32.7518 42.9244 32.145 42.673 31.6975 42.2256C31.2501 41.7781 30.9987 41.1712 30.9987 40.5385C30.9987 39.9057 31.2501 39.2988 31.6975 38.8513L37.1672 33.3846H19.0769C18.4445 33.3846 17.838 33.1334 17.3908 32.6862C16.9436 32.239 16.6923 31.6324 16.6923 31C16.6923 30.3676 16.9436 29.761 17.3908 29.3138C17.838 28.8666 18.4445 28.6154 19.0769 28.6154H37.1672L31.6975 23.1486C31.2501 22.7012 30.9987 22.0943 30.9987 21.4615C30.9987 20.8287 31.2501 20.2219 31.6975 19.7744C32.145 19.327 32.7518 19.0756 33.3846 19.0756C34.0174 19.0756 34.6243 19.327 35.0717 19.7744L44.6102 29.3129Z"
        fill="currentColor"
      />
    </svg>
  );
}

type Panel = "intro" | "signature";

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const cycle = () => {
    setActiveIndex((index) => (index + 1) % TESTIMONIALS.length);
  };

  const renderPanel = (panel: Panel, arrowButton: React.ReactNode) => {
    if (panel === "intro") {
      return (
        <>
          <h2 className={styles.title}>Love Notes</h2>
          <blockquote className={styles.quote}>
            <p>{TESTIMONIAL_QUOTE}</p>
          </blockquote>
          {arrowButton}
        </>
      );
    }

    return (
      <>
        <blockquote className={styles.quote}>
          <p>{TESTIMONIAL_QUOTE}</p>
        </blockquote>
        {arrowButton}
        <p className={styles.author}>Moi mili</p>
      </>
    );
  };

  const panelClassName = (panel: Panel) =>
    panel === "intro" ? styles.introPadding : styles.signaturePadding;

  const leftPanel: Panel = activeIndex % 2 === 0 ? "intro" : "signature";
  const rightPanel: Panel = leftPanel === "intro" ? "signature" : "intro";

  const mobileTestimonial = TESTIMONIALS[activeIndex % TESTIMONIALS.length];

  return (
    <section className={styles.testimonials} aria-label="Testimonials">
      <div className={styles.card}>
        <div className={`${styles.column} ${styles.columnLeft} ${panelClassName(leftPanel)}`}>
          {renderPanel(
            leftPanel,
            <button
              type="button"
              className={styles.arrowButton}
              onClick={cycle}
              aria-label="Previous testimonial"
            >
              <ArrowIcon className={styles.arrowIconLeft} />
            </button>
          )}
        </div>
        <div className={styles.divider} aria-hidden="true" />
        <div className={`${styles.column} ${styles.columnRight} ${panelClassName(rightPanel)}`}>
          {renderPanel(
            rightPanel,
            <button
              type="button"
              className={styles.arrowButton}
              onClick={cycle}
              aria-label="Next testimonial"
            >
              <ArrowIcon />
            </button>
          )}
        </div>

        <div className={styles.mobileCard}>
          <div className={styles.mobileTop}>
            <div className={styles.mobileTitleRow}>
              <h2 className={styles.mobileTitle}>Love Notes</h2>
              <button
                type="button"
                className={styles.mobileArrowButton}
                onClick={cycle}
                aria-label="Next testimonial"
              >
                <ArrowIcon />
              </button>
            </div>
            <blockquote className={styles.mobileQuote}>
              <p>{mobileTestimonial.quote}</p>
            </blockquote>
          </div>
          <div className={styles.mobileDivider} aria-hidden="true" />
          <div className={styles.mobileBottom}>
            <p className={styles.mobileAuthor}>{mobileTestimonial.author}</p>
            <button
              type="button"
              className={styles.arrowButton}
              onClick={cycle}
              aria-label="Previous testimonial"
            >
              <ArrowIcon className={styles.arrowIconLeft} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
