"use client";

import { useState } from "react";
import PageTransition from "@/components/PageTransition/PageTransition";
import Testimonials from "@/components/Testimonials/Testimonials";

export default function Home() {
  const [showTransition, setShowTransition] = useState(true);

  return (
    <div>
      {showTransition && (
        <PageTransition
          variant="counter"
          label="Loading"
          duration={2000}
          exitDuration={800}
          onComplete={() => setShowTransition(false)}
        />
      )}
      <Testimonials />
    </div>
  );
}
