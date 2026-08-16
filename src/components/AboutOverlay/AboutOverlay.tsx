"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SHARP_EASE } from "@/lib/easing";
import Arrow from "@/components/Arrow";
import styles from "./AboutOverlay.module.css";

interface AboutOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

function HeartLogo() {
  return (
    <svg
      width="20"
      height="18"
      viewBox="0 0 20 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M10 18C10.6536 17.6444 19.6079 12.8793 19.9869 6.50693C20.0523 5.36901 19.9216 3.15005 18.4314 1.48583C17.4902 0.433247 16.3137 0.177214 15.8954 0.0918696C12.7974 -0.548214 10.3007 2.48152 10 2.80867C9.71242 2.48152 7.20261 -0.562439 4.10456 0.0918696C3.68626 0.177214 2.50979 0.433247 1.56861 1.48583C0.0784135 3.13582 -0.0523058 5.36901 0.0130538 6.50693C0.392139 12.8793 9.3464 17.6586 10 18Z"
        fill="#1e1e1e"
      />
    </svg>
  );
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
