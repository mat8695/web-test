"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import Button from "@/components/Button";
import styles from "./Services.module.css";

interface Service {
  id: string;
  label: string;
  displayLabel?: ReactNode;
  color: string;
}

const SERVICES: Service[] = [
  { id: "visual-communication", label: "/ visual communication", displayLabel: <>/ visual<br />communication</>, color: "#c9a0dc" },
  { id: "accessibility", label: "/ accessibility", color: "#f9a825" },
  { id: "visual-identity", label: "/ visual identity", color: "#e91e63" },
  { id: "typography", label: "/ typography", color: "#1565c0" },
  { id: "education", label: "/ education", color: "#2e7d32" },
];

export default function Services() {
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
    const mq = window.matchMedia("(max-width: 767px)");
    if (!mq.matches) return;

    let index = 0;

    const cycle = () => {
      handleCategoryEnter(SERVICES[index].id, 0.8);
      index = (index + 1) % SERVICES.length;
    };

    cycle();
    const id = setInterval(cycle, 1000);

    return () => clearInterval(id);
  }, []);

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
            {SERVICES.map((service) => (
              <Button
                key={service.id}
                variant="sectionTitle"
                onMouseEnter={() => handleCategoryEnter(service.id)}
              >
                {service.displayLabel ?? service.label}
              </Button>
            ))}
          </nav>

          {/* Mobile: plain text list */}
          <ul className={styles.mobileServiceList}>
            {SERVICES.map((service) => (
              <li key={service.id} className={styles.mobileServiceItem}>
                {service.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Image stack — right on desktop, top on mobile */}
        <div className={styles.imageArea} aria-hidden="true">
          <div className={styles.defaultSlide} style={{ backgroundColor: "#2a2a2a" }} />
          {SERVICES.map((service) => (
            <div
              key={service.id}
              ref={(el) => { imageRefs.current[service.id] = el; }}
              className={styles.imageSlide}
              style={{ backgroundColor: service.color }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
