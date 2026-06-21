"use client";

import { useState } from "react";
import PageTransition from "@/components/PageTransition/PageTransition";
import Hero from "@/components/Hero/Hero";
import Testimonials from "@/components/Testimonials/Testimonials";
import AboutOverlay from "@/components/AboutOverlay/AboutOverlay";

export default function Home() {
  const [showTransition, setShowTransition] = useState(true);
  const [showAbout, setShowAbout] = useState(false);

  return (
    <div>
      {showTransition && (
        <PageTransition
          variant="heartLoader"
          duration={950}
          exitDuration={1000}
          onComplete={() => setShowTransition(false)}
        />
      )}
      <Hero onOpenAbout={() => setShowAbout(true)} />
      <Testimonials />
      <AboutOverlay isOpen={showAbout} onClose={() => setShowAbout(false)} />
    </div>
  );
}
