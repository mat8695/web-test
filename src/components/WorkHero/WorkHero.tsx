"use client";

import { useEffect, useId, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "@/components/Button";
import { SHARP_EASE } from "@/lib/easing";
import { urlFor } from "@/sanity/lib/image";
import type { SanityProject, SanityImageRef } from "@/components/Works/types";
import styles from "./WorkHero.module.css";

gsap.registerPlugin(ScrollTrigger);

type Language = "en" | "pl";

// Figma's small (resting) hero-image box on desktop — the scroll tween
// grows it from here up to a large state, capped by both the hero's own
// 80px side margins (matches --hero-side-padding in the CSS) and the
// image's own aspect ratio, so it never overflows the pinned stage
// vertically even for portrait/square sources.
const SMALL_IMAGE_WIDTH = 474;
const HORIZONTAL_MARGIN = 80;
// The hero image expands only until its height reaches this fraction of
// the available (nav-adjusted) viewport height — not the full height.
const HERO_HEIGHT_RATIO = 0.6;

function getAspectRatio(image: SanityImageRef | undefined): number | null {
  const dims = image?.metadata?.dimensions;
  if (!dims) return null;
  if (dims.aspectRatio) return dims.aspectRatio;
  if (dims.width && dims.height) return dims.width / dims.height;
  return null;
}

interface LanguageSwitchProps {
  language: Language;
  onChange: (language: Language) => void;
}

function LanguageSwitch({ language, onChange }: LanguageSwitchProps) {
  return (
    <div className={styles.languageSwitch}>
      <button
        type="button"
        className={styles.languageOption}
        data-active={language === "en"}
        onClick={() => onChange("en")}
      >
        EN
      </button>
      <span className={styles.languageDivider} aria-hidden="true">
        {" | "}
      </span>
      <button
        type="button"
        className={styles.languageOption}
        data-active={language === "pl"}
        onClick={() => onChange("pl")}
      >
        PL
      </button>
    </div>
  );
}

interface WorkHeroProps {
  project: SanityProject;
}

export default function WorkHero({ project }: WorkHeroProps) {
  const descriptionId = useId();
  const heroRef = useRef<HTMLElement>(null);
  const pinStageRef = useRef<HTMLDivElement>(null);
  const galleryViewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const actionsRowRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [language, setLanguage] = useState<Language>("en");
  // Bumped every time a hero/gallery <img> finishes loading, so the
  // scroll-trigger effect below re-measures and rebuilds — aspect-ratio +
  // an explicit height already give correct box sizes before load, but
  // this is a safety net per the "refresh on image load" requirement.
  const [loadTick, setLoadTick] = useState(0);
  const bumpLoadTick = () => setLoadTick((t) => t + 1);

  // Same isMobile-detection pattern as Hero/BackgroundGrid/Navigation.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 810px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const gallery = project.gallery ?? [];
  const heroAspectRatio = getAspectRatio(project.coverImage);

  // Desktop-only: one continuous GSAP-pinned sequence.
  //
  // Stage A — the hero image expands in place (width tweened; height
  // follows automatically via its aspect-ratio style) while the track
  // recenters it, and the headline/button fade out as the image grows
  // large enough to cover them.
  //
  // Stage B1 — image 2 (the first gallery item) slides in from off-screen
  // right toward its natural, already-24px-gapped flex position, while
  // the track itself — and so image 1 — stays completely still.
  //
  // Stage B2 — once image 2 has landed, the whole track (now including
  // it) moves left together as one unit, revealing any further images.
  //
  // A single pin + single timeline, rather than several independently
  // pinned/animated pieces, is what keeps every handoff seamless: each
  // stage picks up exactly where the shared track/image state left off.
  useEffect(() => {
    if (isMobile) return;
    const hero = heroRef.current;
    const pinStage = pinStageRef.current;
    const viewport = galleryViewportRef.current;
    const track = trackRef.current;
    const wrapper = imageWrapperRef.current;
    const headlineEl = headlineRef.current;
    const actionsRow = actionsRowRef.current;
    if (!hero || !pinStage || !viewport || !track || !wrapper || !heroAspectRatio) return;

    let tl: gsap.core.Timeline | null = null;
    let resizeRaf: number | null = null;

    const build = () => {
      tl?.scrollTrigger?.kill();
      tl?.kill();

      const viewportWidth = window.innerWidth - HORIZONTAL_MARGIN * 2;
      // .galleryViewport starts below the fixed Navigation bar (see CSS),
      // so this already measures the actually-visible height — centering
      // against it (rather than the full 100vh pinned stage) is what
      // keeps the image looking centered in the viewport you can really
      // see, not just centered behind the nav bar.
      const availableHeight = viewport.getBoundingClientRect().height;
      // Height target is 60% of available height, not the full height —
      // largeWidth is derived from that target and still capped by the
      // available horizontal width for wide/landscape images.
      const targetHeight = availableHeight * HERO_HEIGHT_RATIO;
      const largeWidth = Math.min(viewportWidth, targetHeight * heroAspectRatio);
      const largeHeight = largeWidth / heroAspectRatio;
      const initialOffset = Math.max(0, (viewportWidth - SMALL_IMAGE_WIDTH) / 2);
      // Center the LARGE image too (not just flush it left) — matters for
      // portrait/narrow images whose largeWidth is less than the full
      // viewport width.
      const finalCenterOffset = Math.max(0, (viewportWidth - largeWidth) / 2);

      // Read by .descriptionAnchor's `left` (CSS) so it stays positioned
      // just right of the image's actual (centered) edge instead of
      // assuming the image sits flush against the side padding.
      pinStage.style.setProperty("--gallery-initial-offset", `${initialOffset}px`);

      // Every gallery item shares the hero's own final height (custom
      // property); width follows automatically from each image's own
      // aspect-ratio style, not JS math — so measuring the track's
      // rendered width here already reflects each image's real,
      // un-hardcoded proportions.
      track.style.setProperty("--gallery-item-height", `${largeHeight}px`);

      const galleryItemEls = Array.from(
        track.querySelectorAll<HTMLElement>(`.${styles.galleryItem}`)
      );
      const lastImage = galleryItemEls[galleryItemEls.length - 1] ?? null;

      // Measure the track's TRUE final layout directly — hero temporarily
      // set to largeWidth — rather than deriving it arithmetically from
      // scrollWidth at the small width. The centering target comes from
      // the actual last .galleryItem's real offsetLeft + rendered width,
      // not total scrollWidth alone. Reset happens via the gsap.set()
      // below, which puts the hero back to its real starting (small)
      // width before the timeline itself begins.
      wrapper.style.width = `${largeWidth}px`;
      const finalTrackWidth = track.scrollWidth;
      const lastImageOffsetLeft = lastImage?.offsetLeft ?? 0;
      const lastImageWidth = lastImage?.getBoundingClientRect().width ?? 0;
      const lastImageCenter = lastImageOffsetLeft + lastImageWidth / 2;

      // Stage B2's target: center the LAST image in the viewport (not
      // just bring its right edge flush to the edge) — so the sequence
      // ends on the last photo sitting centered, the same way it started
      // on the hero image centered. Only engages when there's actually
      // more track than fits in the viewport; otherwise everything
      // already sits comfortably and no further scroll is needed.
      const needsStageB2 = lastImage !== null && finalTrackWidth > viewportWidth;
      const stageB2Target = needsStageB2 ? viewportWidth / 2 - lastImageCenter : finalCenterOffset;
      const stageB2Distance = needsStageB2 ? Math.abs(finalCenterOffset - stageB2Target) : 0;

      // Every gallery image starts a full viewport-width off to the right
      // of its natural (already-gapped) flex position, capped to a
      // reasonable scroll budget so very wide viewports don't demand an
      // excessively long "entrance" scroll. All of them get this same
      // explicit offset — not just the first — because a narrow (portrait)
      // first gallery image shrinks the cumulative width standing between
      // the hero image and the ones after it; relying on natural flex
      // position alone to keep those later images off-screen breaks the
      // moment that cumulative width gets too small to clear the viewport.
      const entryOffset = window.innerWidth;
      const stageADistance = window.innerHeight * 0.5;
      const stageB1Distance = galleryItemEls.length
        ? Math.min(entryOffset, window.innerHeight * 0.6)
        : 0;
      const totalDistance = stageADistance + stageB1Distance + stageB2Distance;

      gsap.set(wrapper, { width: SMALL_IMAGE_WIDTH });
      gsap.set(track, { x: initialOffset });
      if (galleryItemEls.length) gsap.set(galleryItemEls, { x: entryOffset });
      gsap.set([headlineEl, actionsRow].filter(Boolean) as HTMLElement[], { opacity: 1 });

      tl = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: `+=${totalDistance}`,
          scrub: true,
          pin: pinStage,
          invalidateOnRefresh: true,
        },
      });

      // Stage A: expand + recenter for the new (possibly narrower) large size.
      tl.to(wrapper, { width: largeWidth, duration: stageADistance, ease: "none" }, 0);
      tl.to(track, { x: finalCenterOffset, duration: stageADistance, ease: "none" }, 0);

      // Fade the headline/button during the last part of Stage A, as the
      // image grows large enough to visually cover them. .metaRow
      // (title/year) is intentionally NOT included here — it stays
      // visible throughout, see .metaRow's z-index in the CSS.
      const fadeTargets = [headlineEl, actionsRow].filter(Boolean) as HTMLElement[];
      if (fadeTargets.length) {
        tl.to(
          fadeTargets,
          { opacity: 0, duration: stageADistance * 0.3, ease: "none" },
          stageADistance * 0.7
        );
      }

      // Stage B1: all gallery images slide in from off-screen to their
      // natural (24px-gapped) flex positions together; the track — and so
      // the hero image — stays still. Images beyond the first are already
      // off-screen throughout this stage in the common (landscape) case,
      // so animating them in lockstep with the first is visually
      // unchanged there — it only matters once one of them is narrow
      // enough to otherwise be visible early (see the entryOffset note).
      if (galleryItemEls.length) {
        tl.to(galleryItemEls, { x: 0, duration: stageB1Distance, ease: "none" }, stageADistance);
      }

      // Stage B2: from here on the whole track (image 2 now in its
      // natural place) moves together, ending with the LAST image
      // centered in the viewport.
      if (stageB2Distance > 0) {
        tl.to(
          track,
          { x: stageB2Target, duration: stageB2Distance, ease: "none" },
          stageADistance + stageB1Distance
        );
      }
    };

    build();

    // Recalculates widths/distances and rebuilds the trigger from scratch
    // on resize — simpler and more predictable than trying to keep a
    // single timeline's proportional stage durations correct via
    // functional values alone. Coalesced through requestAnimationFrame
    // (not a setTimeout debounce) so there's no artificial delay: any
    // number of resize events within the same frame collapse into one
    // rebuild on the very next frame, keeping the gallery centered
    // responsively while the viewport is actively being dragged, instead
    // of visibly lagging and then snapping into place afterward.
    const handleResize = () => {
      if (resizeRaf !== null) return;
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = null;
        build();
      });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeRaf !== null) cancelAnimationFrame(resizeRaf);
      tl?.scrollTrigger?.kill();
      tl?.kill();
    };
  }, [isMobile, heroAspectRatio, gallery.length, loadTick]);

  // Read-more/less reveal — unchanged mechanism. The description lives
  // in its own absolutely-positioned anchor (see CSS), not inside the
  // gallery track, so opening/closing it never changes any container's
  // size and can't affect the ScrollTrigger geometry built above.
  useEffect(() => {
    const desc = descriptionRef.current;
    if (!desc) return;

    const axis = isMobile ? "y" : "x";
    const closedOffset = isMobile ? 12 : -16;

    let tween: gsap.core.Tween;

    if (isExpanded) {
      gsap.set(desc, { pointerEvents: "auto" });
      tween = gsap.to(desc, { opacity: 1, [axis]: 0, duration: 0.5, ease: SHARP_EASE });
    } else {
      tween = gsap.to(desc, {
        opacity: 0,
        [axis]: closedOffset,
        duration: 0.4,
        ease: SHARP_EASE,
        onComplete() {
          gsap.set(desc, { pointerEvents: "none" });
        },
      });
    }

    return () => {
      tween.kill();
    };
  }, [isExpanded, isMobile]);

  const headline = project.hoverDescription;
  const description = language === "en" ? project.descriptionEN : project.descriptionPL;

  const desktopImageUrl = project.coverImage
    ? urlFor(project.coverImage).width(1920).url()
    : null;
  const mobileImageUrl = project.coverImage
    ? urlFor(project.coverImage).width(900).url()
    : null;
  const heroDims = project.coverImage?.metadata?.dimensions;

  const readMoreButton = (
    <Button
      onClick={() => setIsExpanded((v) => !v)}
      aria-expanded={isExpanded}
      aria-controls={descriptionId}
    >
      {isExpanded ? "read less" : "read more"}
    </Button>
  );

  if (isMobile) {
    return (
      <section className={styles.hero} key="mobile">
        <div className={styles.mobileStage}>
          <div className={styles.mobileTopGroup}>
            <div className={styles.mobileMetaBlock}>
              <div className={styles.metaRow}>
                <span>{project.title}</span>
                {project.year && <span>{project.year}</span>}
              </div>
              {headline && <h1 className={styles.mobileHeadline}>{headline}</h1>}
            </div>

            {mobileImageUrl && (
              <img
                src={mobileImageUrl}
                alt={project.title}
                width={heroDims?.width}
                height={heroDims?.height}
                className={styles.mobileImage}
              />
            )}
          </div>

          <div className={styles.mobileActionsGroup}>
            {readMoreButton}
            <div
              id={descriptionId}
              ref={descriptionRef}
              className={styles.mobileDescriptionBlock}
              aria-hidden={!isExpanded}
            >
              <LanguageSwitch language={language} onChange={setLanguage} />
              {description && <p className={styles.mobileDescriptionText}>{description}</p>}
            </div>
          </div>

          {gallery.length > 0 && (
            <div className={styles.mobileGallery}>
              {gallery.map((img, i) => {
                const dims = img.metadata?.dimensions;
                const url = urlFor(img).width(900).url();
                return (
                  <img
                    key={img.asset._ref}
                    src={url}
                    alt={`${project.title} — image ${i + 2}`}
                    width={dims?.width}
                    height={dims?.height}
                    className={styles.mobileImage}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className={styles.hero} ref={heroRef} key="desktop">
      <div className={styles.pinStage} ref={pinStageRef}>
        <div className={styles.metaBlock}>
          <div className={styles.metaRow}>
            <span>{project.title}</span>
            {project.year && <span>{project.year}</span>}
          </div>
          {headline && (
            <h1 className={styles.headline} ref={headlineRef}>
              {headline}
            </h1>
          )}
        </div>

        <div className={styles.galleryViewport} ref={galleryViewportRef}>
          <div className={styles.galleryTrack} ref={trackRef}>
            {desktopImageUrl && (
              <div
                className={styles.imageWrapper}
                ref={imageWrapperRef}
                style={heroAspectRatio ? { aspectRatio: heroAspectRatio } : undefined}
              >
                <img
                  src={desktopImageUrl}
                  alt={project.title}
                  className={styles.image}
                  onLoad={bumpLoadTick}
                />
              </div>
            )}

            {gallery.map((img, i) => {
              const ratio = getAspectRatio(img) ?? 1;
              const url = urlFor(img).width(1920).url();
              return (
                <div key={img.asset._ref} className={styles.galleryItem} style={{ aspectRatio: ratio }}>
                  <img
                    src={url}
                    alt={`${project.title} — image ${i + 2}`}
                    className={styles.image}
                    onLoad={bumpLoadTick}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.descriptionAnchor}>
          <div
            id={descriptionId}
            ref={descriptionRef}
            className={styles.description}
            aria-hidden={!isExpanded}
          >
            <LanguageSwitch language={language} onChange={setLanguage} />
            {description && <p className={styles.descriptionText}>{description}</p>}
          </div>
        </div>

        <div className={styles.actionsRow} ref={actionsRowRef}>
          {readMoreButton}
        </div>
      </div>
    </section>
  );
}
