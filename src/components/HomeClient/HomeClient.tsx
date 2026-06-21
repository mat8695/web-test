"use client";

import { useState } from "react";
import PageTransition from "@/components/PageTransition/PageTransition";
import Hero from "@/components/Hero/Hero";
import AboutOverlay from "@/components/AboutOverlay/AboutOverlay";

export default function HomeClient() {
  const [showTransition, setShowTransition] = useState(true);
  const [showAbout, setShowAbout] = useState(false);

  return (
    <>
      {showTransition && (
        <PageTransition
          variant="heartLoader"
          duration={950}
          exitDuration={1000}
          onComplete={() => setShowTransition(false)}
        />
      )}
      <Hero onOpenAbout={() => setShowAbout(true)} />
      <AboutOverlay isOpen={showAbout} onClose={() => setShowAbout(false)} />
    </>
  );
}
