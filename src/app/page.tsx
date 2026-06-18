"use client";

import { useState } from "react";
import PageTransition from "@/components/PageTransition/PageTransition";
import Hero from "@/components/Hero/Hero";
import Testimonials from "@/components/Testimonials/Testimonials";

export default function Home() {
  const [showTransition, setShowTransition] = useState(true);

  return (
    <div>
      {showTransition && (
        <PageTransition
          variant="counter"
          label="Loading"
          duration={1000}
          exitDuration={400}
          onComplete={() => setShowTransition(false)}
        />
      )}
      <Hero />
      <Testimonials />
    </div>
  );
}
