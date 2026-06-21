"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
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
  const fillRef = useRef<HTMLSpanElement>(null);
  const textHoverRef = useRef<HTMLSpanElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    tlRef.current = gsap
      .timeline({ paused: true })
      .fromTo(
        fillRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.45, ease: "power2.inOut" },
        0
      )
      .fromTo(
        textHoverRef.current,
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", duration: 0.45, ease: "power2.inOut" },
        0
      );

    return () => {
      tlRef.current?.kill();
    };
  }, []);

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

  if (href) {
    return (
      <a
        href={href}
        className={cls}
        data-variant={variant}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
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
}
