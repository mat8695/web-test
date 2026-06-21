"use client";

import { useEffect, useState } from "react";
import PageTransition from "@/components/PageTransition/PageTransition";
import Hero from "@/components/Hero/Hero";
import AboutOverlay from "@/components/AboutOverlay/AboutOverlay";

type IntroStatus = "checking" | "playing" | "done";

export default function HomeClient() {
  const [introStatus, setIntroStatus] = useState<IntroStatus>("checking");
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("introPlayed")) {
      setIntroStatus("done");
    } else {
      setIntroStatus("playing");
    }
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem("introPlayed", "true");
    setIntroStatus("done");
  };

  return (
    <>
      {/*
        Cover sits above the page while we check sessionStorage.
        Prevents the Hero from flashing before the intro decision is made.
        Matches the intro loader background so there is no colour jump.
      */}
      {introStatus === "checking" && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99,
            backgroundColor: "#ffcde0",
          }}
          aria-hidden="true"
        />
      )}

      {introStatus === "playing" && (
        <PageTransition
          variant="heartLoader"
          duration={1200}
          exitDuration={800}
          onComplete={handleIntroComplete}
        />
      )}

      <Hero onOpenAbout={() => setShowAbout(true)} />
      <AboutOverlay isOpen={showAbout} onClose={() => setShowAbout(false)} />
    </>
  );
}
