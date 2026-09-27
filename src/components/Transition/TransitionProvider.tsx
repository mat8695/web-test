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
  // Set on the browser's own back/forward navigation (popstate). navigate()
  // below is the only path that ever puts the panel in its "covering"
  // state (y: 0%) — back/forward skips navigate() entirely, so the panel
  // is already sitting hidden (y: 100%) from the last reveal. Without this
  // flag, the reveal effect would animate it from 100% to -100%, sweeping
  // straight back through the covering position and flashing pink across
  // the screen for no reason.
  const isBackForwardNav = useRef(false);
  // Whether the panel is actually covering the page right now, and so has
  // something to reveal. True on first mount (the panel's inline transform
  // starts at 0%) and set again by navigate() once its cover step finishes.
  // Any pathname change that did NOT go through navigate() leaves the panel
  // parked below the viewport — revealing from there would drag it up
  // across a page that has already rendered, which reads as the transition
  // firing too late.
  const isCovering = useRef(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handlePopState = () => {
      isBackForwardNav.current = true;
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Runs on initial mount and on every pathname change.
  // Both cases: panel is at y:0% covering the page — reveal upward.
  useIsomorphicLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    // Sanity Studio has its own UI — skip the transition overlay entirely.
    if (pathname.startsWith("/studio")) {
      gsap.set(panel, { y: "100%" });
      return;
    }

    // Back/forward: the panel is already hidden and never covered, so
    // there's nothing to reveal — just leave it put, no animation.
    if (isBackForwardNav.current) {
      isBackForwardNav.current = false;
      gsap.set(panel, { y: "100%" });
      return;
    }

    // Nothing covering the page means nothing to reveal — park the panel
    // rather than sweeping it up over the already-rendered route.
    if (!isCovering.current) {
      gsap.set(panel, { y: "100%" });
      isAnimating.current = false;
      return;
    }

    isCovering.current = false;
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

      // Navigating to the route we're already on would never change
      // `pathname`, so the reveal effect below would never fire and the
      // cover would sit on screen forever, blocking the page. Bail out
      // before animating anything — matches what a plain link does.
      if (href.split(/[?#]/)[0] === pathname) return;

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
      tl.call(() => {
        isCovering.current = true;
        router.push(href);
      });
    },
    [router, pathname],
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
