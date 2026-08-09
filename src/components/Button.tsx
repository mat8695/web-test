"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { SHARP_EASE } from "@/lib/easing";
import styles from "./Button.module.css";

export type ButtonVariant = "default" | "sectionTitle";

export interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  className?: string;
  variant?: ButtonVariant;
}

export default function Button({
  children,
  href,
  onClick,
  onMouseEnter: onMouseEnterProp,
  className,
  variant = "default",
}: ButtonProps) {
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const buttonElRef = useRef<HTMLButtonElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const textHoverRef = useRef<HTMLSpanElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const rootEl = anchorRef.current || buttonElRef.current;

    const tl = gsap
      .timeline({ paused: true })
      .fromTo(
        fillRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.45, ease: SHARP_EASE },
        0
      )
      .fromTo(
        textHoverRef.current,
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", duration: 0.45, ease: SHARP_EASE },
        0
      );

    // Shape morph: rectangle -> rounded "three-circle" pill, driven by CSS
    // custom properties so it scales with any text length. Only the
    // "default" variant carries the bordered pill styling this targets.
    // Starts a third of the way into the fill animation. The button is
    // absolutely centered inside .wrapper, which is statically sized to the
    // hover-state footprint (see .sizer in CSS), so this growth never
    // shifts surrounding layout.
    if (rootEl && variant === "default") {
      tl.fromTo(
        rootEl,
        { "--pad-x": "8px", "--pad-y": "4px", "--radius": "0px" },
        {
          "--pad-x": "22px",
          "--pad-y": "16.5px",
          "--radius": "999px",
          duration: 0.45,
          ease: SHARP_EASE,
        },
        0.15
      );
    }

    tlRef.current = tl;

    return () => {
      tlRef.current?.kill();
    };
  }, [variant]);

  const handleMouseEnter = () => {
    tlRef.current?.play();
    onMouseEnterProp?.();
  };
  const handleMouseLeave = () => tlRef.current?.reverse();

  const cls = [styles.button, className].filter(Boolean).join(" ");

  const inner = (
    <>
      <span className={styles.fill} ref={fillRef} aria-hidden="true" />
      <span className={styles.textDefault}>{children}</span>
      <span className={styles.textHover} ref={textHoverRef} aria-hidden="true">
        {children}
      </span>
    </>
  );

  const button = href ? (
    <a
      ref={anchorRef}
      href={href}
      className={cls}
      data-variant={variant}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {inner}
    </a>
  ) : (
    <button
      ref={buttonElRef}
      type="button"
      className={cls}
      data-variant={variant}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {inner}
    </button>
  );

  if (variant !== "default") {
    return button;
  }

  // Wrapper reserves the hover-state footprint via an invisible .sizer
  // (same text/padding as the hover target), so the button itself can be
  // absolutely centered inside it and grow/shrink without ever nudging
  // surrounding layout.
  return (
    <span className={styles.wrapper}>
      <span className={styles.sizer} aria-hidden="true">
        {children}
      </span>
      {button}
    </span>
  );
}
