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
import { useRouter } from "next/navigation";
import gsap from "gsap";

// useLayoutEffect causes a warning on the server.
// This resolves to useEffect during SSR and useLayoutEffect in the browser.
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

  // Initial page load / hard refresh
  useIsomorphicLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    if (sessionStorage.getItem("introPlayed")) {
      // Repeat visit or refresh: panel starts covering, reveal upward
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
    } else {
      // First ever visit: hide the panel instantly so the intro loader
      // (same colour, #ffcde0) can take over without a visible seam
      gsap.set(panel, { y: "100%" });
    }
  }, []);

  // Internal navigation
  const navigate = useCallback(
    (href: string) => {
      if (isAnimating.current) return;
      const panel = panelRef.current;

      if (!panel) {
        router.push(href);
        return;
      }

      isAnimating.current = true;

      const tl = gsap.timeline({
        onComplete() {
          isAnimating.current = false;
        },
      });

      // Reset position (safe if a previous animation was interrupted)
      tl.set(panel, { y: "100%" });

      // Cover: slide up from bottom to fill viewport (250ms)
      tl.to(panel, { y: "0%", duration: 0.25, ease: "power2.inOut" });

      // Route change fires only once the screen is fully covered
      tl.call(() => { router.push(href); });

      // Reveal: continue upward and exit through the top (250ms)
      tl.to(panel, { y: "-100%", duration: 0.25, ease: "power2.inOut" });

      // Reset for next navigation
      tl.set(panel, { y: "100%" });
    },
    [router],
  );

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {/*
        Panel starts at translateY(0) so the page is covered from the very
        first painted frame. useIsomorphicLayoutEffect then either reveals
        (repeat visit) or hides it (first visit) before the user interacts.
      */}
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
