"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SHARP_EASE } from "@/lib/easing";
import Arrow from "@/components/Arrow";
import HeartLogo from "@/components/HeartLogo/HeartLogo";
import styles from "./AboutOverlay.module.css";

interface AboutOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutOverlay({ isOpen, onClose }: AboutOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    let tween: gsap.core.Tween;

    if (isOpen) {
      // Make visible before the slide-up begins
      gsap.set(overlay, { opacity: 1, visibility: "visible", pointerEvents: "auto" });
      tween = gsap.to(overlay, { y: 0, duration: 0.7, ease: SHARP_EASE });
    } else {
      tween = gsap.to(overlay, {
        y: "100%",
        duration: 0.6,
        ease: SHARP_EASE,
        onComplete() {
          // Restore CSS-hidden state after slide-down finishes
          gsap.set(overlay, { opacity: 0, visibility: "hidden", pointerEvents: "none" });
        },
      });
    }

    return () => {
      tween.kill();
    };
  }, [isOpen]);

  return (
    <div
      ref={overlayRef}
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="About Kat"
      aria-hidden={!isOpen}
    >
      <div className={styles.logo}>
        <HeartLogo />
      </div>

      <img
        src="/kat-photo.png"
        alt="Kat Szewczyk"
        className={styles.photo}
      />

      <div className={styles.arrowRow}>
        <Arrow
          onClick={onClose}
          ariaLabel="Close about panel"
          size={68}
          className={styles.closeButton}
        />
      </div>

      <div className={styles.scrollArea}>
        <div className={styles.text}>
          <p>
            I studied Industrial Design at the Academy of Fine Arts in Łódź and Communication Design at the School of Design, University of Leeds. I gained my first professional experience in the United Kingdom, working as a designer at Matthew Brand Solutions in Leeds and The Spicery in Bristol. After returning to Poland, I joined the design studio Fajne Chłopaki in Łódź.
          </p>
          <p>
            Since 2019, I have been running my own design studio, specialising in visual communication for both commercial and social projects. In my practice, I draw on the principles of universal design, treating harmony, structure, and clarity as the foundations of responsible design.
          </p>
          <p>
            Alongside my professional projects, I also lead independent workshops for emerging designers and brand owners, sharing knowledge and practical tools in visual communication and branding. Since 2023, I have been teaching design courses at the Faculty of Arts at Jan Kochanowski University, and since 2026, I have been conducting doctoral research on accessibility in visual communication.
          </p>
          <p>
            Travel is an inseparable part of my life — the attentive observation of everyday life across different cultures and religions is a constant source of inspiration for me, shaping both my design solutions and my broader approach to life.
          </p>
        </div>
      </div>
    </div>
  );
}
