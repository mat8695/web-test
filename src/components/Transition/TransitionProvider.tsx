"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface TransitionContextValue {
  navigate: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function usePageTransition() {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error("usePageTransition must be used inside TransitionProvider");
  return ctx;
}

export function TransitionProvider({ children }: { children: ReactNode }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const router = useRouter();
  const pathname = usePathname();

  // Runs on initial mount and on every pathname change.
  // Both cases: panel is at y:0% covering the page — reveal upward.
  // On first visit the heart loader (same #ffcde0 colour) covers the page
  // underneath while the panel slides away, so there is no visible seam.
  useIsomorphicLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    // Sanity Studio has its own UI — skip the transition overlay entirely.
    if (pathname.startsWith("/studio")) {
      gsap.set(panel, { y: "100%" });
      return;
    }

    isAnimating.current = true;
    gsap.to(panel, {
      y: "-100%",
      duration: 0.50,
      ease: "power2.inOut",
      onComplete() {
        gsap.set(panel, { y: "100%" });
        isAnimating.current = false;
      },
    });
  }, [pathname]);

  const navigate = useCallback(
    (href: string) => {
      if (isAnimating.current) return;
      const panel = panelRef.current;

      if (!panel) {
        router.push(href);
        return;
      }

      isAnimating.current = true;

      const tl = gsap.timeline();

      // Ensure panel starts below the viewport
      tl.set(panel, { y: "100%" });

      // Cover: slide up until the panel fully hides the current page
      tl.to(panel, { y: "0%", duration: 0.25, ease: "power2.inOut" });

      // Navigate once fully covered. isAnimating stays true until the
      // reveal onComplete resets it after the new page is shown.
      tl.call(() => { router.push(href); });
    },
    [router],
  );

  return (
    <TransitionContext.Provider value={{ navigate }}>
      <div
        ref={panelRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          backgroundColor: "#ffcde0",
          transform: "translateY(0%)",
          pointerEvents: "none",
          willChange: "transform",
        }}
        aria-hidden="true"
      />
      {children}
    </TransitionContext.Provider>
  );
}
