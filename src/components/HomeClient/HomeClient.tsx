"use client";

import { useState } from "react";
import Hero from "@/components/Hero/Hero";
import AboutOverlay from "@/components/AboutOverlay/AboutOverlay";

export default function HomeClient() {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <>
      <Hero onOpenAbout={() => setShowAbout(true)} />
      <AboutOverlay isOpen={showAbout} onClose={() => setShowAbout(false)} />
    </>
  );
}
