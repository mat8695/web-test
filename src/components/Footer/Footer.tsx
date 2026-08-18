"use client";

import { useEffect, useRef, useState, type SubmitEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "@/components/Button";
import Arrow from "@/components/Arrow";
import AboutOverlay from "@/components/AboutOverlay/AboutOverlay";
import { SHARP_EASE } from "@/lib/easing";
import styles from "./Footer.module.css";

gsap.registerPlugin(ScrollTrigger);

type LeadStatus = "idle" | "submitting" | "success" | "error";

export default function Footer() {
  const [showAbout, setShowAbout] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const leadFormRef = useRef<HTMLFormElement>(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [leadStatus, setLeadStatus] = useState<LeadStatus>("idle");
  const [leadError, setLeadError] = useState("");

  const handleLeadSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (leadStatus === "submitting") return;

    setLeadStatus("submitting");
    setLeadError("");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Something went wrong. Please try again.");
      }

      setLeadStatus("success");
      setEmail("");
      setPhone("");
    } catch (err) {
      setLeadStatus("error");
      setLeadError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    if (!section || !card) return;

    // Desktop-only, same scrollTrigger trigger/toggleActions as before.
    // Runs purely on transform: scale instead of width/height — those
    // force a layout recalculation on every tick, which is what caused
    // scroll stutter. transform is compositor-only, no reflow.
    const mm = gsap.matchMedia();

    mm.add("(min-width: 811px)", () => {
      // Collapsed, centered resting state — set immediately and
      // independent of scroll position, so the card is genuinely small
      // before it's ever scrolled into view (a tl.set() as the first
      // entry of a scrollTrigger'd timeline doesn't apply until the
      // trigger fires, which left it at full size until then).
      gsap.set(card, { scale: 0.6 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top center",
          toggleActions: "play none none reverse",
        },
      });

      // Pause: hold the collapsed, centered card in place for 0.5s.
      tl.to(card, { duration: 0.2 });

      // Expand to fill the section.
      tl.to(card, { scale: 1, duration: 0.8, ease: SHARP_EASE });
    });

    return () => mm.revert();
  }, []);

  return (
    <footer className={styles.footer} ref={sectionRef}>
      <div className={styles.card} ref={cardRef}>
        <div className={styles.topRow}>
          <div className={styles.columns}>
            <div className={styles.column}>
              <span className={styles.label}>Explore</span>
              <nav className={styles.linkList} aria-label="Explore">
                <Button variant="footer" className={styles.link} onClick={() => setShowAbout(true)}>
                  About
                </Button>
                <Button variant="footer" className={styles.link} href="/works">
                  Works
                </Button>
                <Button variant="footer" className={styles.link} href="/#services">
                  Services
                </Button>
              </nav>
            </div>

            <div className={styles.column}>
              <span className={styles.label}>Socials</span>
              <nav className={styles.linkList} aria-label="Socials">
                <Button variant="footer" className={styles.link}>
                  Instagram
                </Button>
                <Button variant="footer" className={styles.link}>
                  Spotify
                </Button>
              </nav>
            </div>
          </div>

          <p className={styles.email}>halo@katszewczyk.com</p>
        </div>

        <div className={styles.footerBottom}>
          <div className={styles.formBlock}>
            <form className={styles.leadForm} ref={leadFormRef} onSubmit={handleLeadSubmit}>
              <div className={styles.fieldGroup}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  autoComplete="email"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={leadStatus === "submitting"}
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  autoComplete="tel"
                  className={styles.input}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={leadStatus === "submitting"}
                />
              </div>
              <Arrow
                onClick={() => leadFormRef.current?.requestSubmit()}
                ariaLabel="Submit contact form"
                size={54}
                className={`${styles.submitArrow} ${styles.submitArrowDesktop}`}
              />
              <Arrow
                onClick={() => leadFormRef.current?.requestSubmit()}
                ariaLabel="Submit contact form"
                size={58}
                className={`${styles.submitArrow} ${styles.submitArrowMobile}`}
              />
            </form>
            {leadStatus !== "idle" && (
              <p className={styles.formStatus} role="status">
                {leadStatus === "submitting" && "Sending…"}
                {leadStatus === "success" && "Thanks — we'll be in touch."}
                {leadStatus === "error" && leadError}
              </p>
            )}
          </div>

          <p className={`${styles.email} ${styles.emailMobileOnly}`}>halo@katszewczyk.com</p>

          <div className={styles.bottomRow}>
            <span>KAT.SZEWCZYK</span>
            <span>2026</span>
          </div>
        </div>
      </div>

      <AboutOverlay isOpen={showAbout} onClose={() => setShowAbout(false)} />
    </footer>
  );
}
