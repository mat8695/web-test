"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import Button from "@/components/Button";
import { urlFor } from "@/sanity/lib/image";
import type { SanityServiceItem } from "./types";
import styles from "./Services.module.css";

const FALLBACK_COLORS = ["#c9a0dc", "#f9a825", "#e91e63", "#1565c0", "#2e7d32"];

function getDisplayLabel(title: string): ReactNode {
  if (title === "/ visual communication") {
    return <>/ visual<br />communication</>;
  }
  return title;
}

interface ServicesClientProps {
  items: SanityServiceItem[];
}

export default function ServicesClient({ items }: ServicesClientProps) {
  const imageRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const zCounterRef = useRef(0);

  const handleCategoryEnter = (id: string, duration = 0.5) => {
    const el = imageRefs.current[id];
    if (!el) return;

    zCounterRef.current += 1;
    el.style.zIndex = String(zCounterRef.current);

    gsap.fromTo(el, { y: "100%" }, { y: "0%", duration, ease: "power3.out" });
  };

  // Mobile auto-cycle
  useEffect(() => {
    if (!items.length) return;

    const mq = window.matchMedia("(max-width: 767px)");
    if (!mq.matches) return;

    let index = 0;

    const cycle = () => {
      handleCategoryEnter(items[index]._id, 0.8);
      index = (index + 1) % items.length;
    };

    cycle();
    const id = setInterval(cycle, 1000);

    return () => clearInterval(id);
  }, [items]);

  return (
    <section className={styles.section} aria-label="Services">
      <div className={styles.content}>
        {/* Text content — left on desktop, bottom on mobile */}
        <div className={styles.left}>
          <div className={styles.heading}>
            <p className={styles.subtitle}>
              Visual identity systems for commercial and social brands.
            </p>
            <div className={styles.divider} aria-hidden="true" />
          </div>

          {/* Desktop: interactive buttons */}
          <nav className={styles.serviceList} aria-label="Service categories">
            {items.map((item) => (
              <Button
                key={item._id}
                variant="sectionTitle"
                onMouseEnter={() => handleCategoryEnter(item._id)}
              >
                {getDisplayLabel(item.title)}
              </Button>
            ))}
          </nav>

          {/* Mobile: plain text list */}
          <ul className={styles.mobileServiceList}>
            {items.map((item) => (
              <li key={item._id} className={styles.mobileServiceItem}>
                {item.title}
              </li>
            ))}
          </ul>
        </div>

        {/* Image stack — right on desktop, top on mobile */}
        <div className={styles.imageArea} aria-hidden="true">
          <div className={styles.defaultSlide} style={{ backgroundColor: "#2a2a2a" }} />
          {items.map((item, i) => {
            const imageUrl = item.image
              ? urlFor(item.image).width(1270).url()
              : null;

            return (
              <div
                key={item._id}
                ref={(el) => { imageRefs.current[item._id] = el; }}
                className={styles.imageSlide}
                style={imageUrl ? undefined : { backgroundColor: FALLBACK_COLORS[i % FALLBACK_COLORS.length] }}
              >
                {imageUrl && (
                  <img src={imageUrl} alt="" className={styles.image} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
