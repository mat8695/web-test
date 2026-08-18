"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { SHARP_EASE } from "@/lib/easing";
import styles from "./Navigation.module.css";

// Ignore scroll deltas smaller than this — trackpad/momentum jitter
// shouldn't toggle the nav in and out.
const SCROLL_THRESHOLD = 10;

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Same isMobile-detection pattern as Hero/BackgroundGrid.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 810px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Slide the whole bar out on scroll-down, back in on scroll-up.
  // Always visible at scroll position 0; movements below the threshold
  // are ignored so it doesn't jitter on tiny scroll noise.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    let lastScrollY = window.scrollY;
    let visible = true;
    let ticking = false;

    const show = () => {
      if (visible) return;
      visible = true;
      gsap.to(nav, { y: "0%", duration: 0.4, ease: SHARP_EASE });
    };

    const hide = () => {
      if (!visible) return;
      visible = false;
      gsap.to(nav, { y: "-100%", duration: 0.4, ease: SHARP_EASE });
    };

    const update = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 0) {
        show();
        lastScrollY = currentScrollY;
        ticking = false;
        return;
      }

      const delta = currentScrollY - lastScrollY;
      if (Math.abs(delta) >= SCROLL_THRESHOLD) {
        if (delta > 0) {
          hide();
        } else {
          show();
        }
        lastScrollY = currentScrollY;
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={styles.nav} ref={navRef} aria-label="katszewczyk">
      <Link href="/">KAT.SZEWCZYK</Link>
      {!isMobile && (
        <a href="mailto:halo@katszewczyk.com">halo@katszewczyk.com</a>
      )}
    </nav>
  );
}
