"use client";

import { type MouseEvent, type ReactNode } from "react";
import { usePageTransition } from "./TransitionProvider";

interface TransitionLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function TransitionLink({
  href,
  children,
  className,
  onMouseEnter,
  onMouseLeave,
}: TransitionLinkProps) {
  const { navigate } = usePageTransition();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Let the browser handle modifier-key clicks (new tab, etc.)
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    navigate(href);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={className}
    >
      {children}
    </a>
  );
}
