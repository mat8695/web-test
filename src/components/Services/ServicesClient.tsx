"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Button from "@/components/Button";
import { urlFor } from "@/sanity/lib/image";
import type { SanityServiceCategory, SanityServiceItem } from "./types";
import styles from "./Services.module.css";

const FALLBACK_COLORS = ["#c9a0dc", "#f9a825", "#e91e63", "#1565c0", "#2e7d32"];
const IMAGE_WIDTH = 960;

interface ServicesClientProps {
  categories: SanityServiceCategory[];
}

export default function ServicesClient({ categories }: ServicesClientProps) {
  const imageRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const zCounterRef = useRef(0);

  const [activeSubcategory, setActiveSubcategory] = useState<SanityServiceItem | null>(null);
  // Purely visual — which group is currently highlighted/expanded. Unlike
  // activeSubcategory (which drives the image and persists), this resets
  // to null on mouse leave so nothing stays highlighted once you're not
  // actually hovering it.
  const [hoveredCategory, setHoveredCategory] = useState<SanityServiceCategory | null>(null);

  // Same reveal mechanism as before: every possible image is a permanently
  // mounted, absolutely-stacked slide starting at y:100%. Activating one
  // bumps its z-index above the rest and slides it up into view.
  const revealImage = (key: string, duration = 0.5) => {
    const el = imageRefs.current[key];
    if (!el) return;

    zCounterRef.current += 1;
    el.style.zIndex = String(zCounterRef.current);

    gsap.fromTo(el, { y: "100%" }, { y: "0%", duration, ease: "power3.out" });
  };

  const handleCategoryEnter = (category: SanityServiceCategory, duration?: number) => {
    setActiveSubcategory(null);
    setHoveredCategory(category);
    revealImage(category._id, duration);
  };

  const handleSubcategoryEnter = (category: SanityServiceCategory, sub: SanityServiceItem) => {
    setActiveSubcategory(sub);
    setHoveredCategory(category);
    // Falls back to the parent category's own slide when the subcategory
    // has no image of its own.
    revealImage(sub.image ? sub._id : category._id);
  };

  // Clears the hover highlight once the pointer leaves the whole
  // left/image/right group — not per-item, so moving between a category
  // and its own subcategories never flickers back to neutral in between.
  const handleGroupLeave = () => setHoveredCategory(null);

  // Mobile auto-cycle through main categories — same pattern as before,
  // just driven by categories instead of the old flat item list.
  useEffect(() => {
    if (!categories.length) return;

    const mq = window.matchMedia("(max-width: 767px)");
    if (!mq.matches) return;

    let index = 0;

    const cycle = () => {
      handleCategoryEnter(categories[index], 0.8);
      index = (index + 1) % categories.length;
    };

    cycle();
    const id = setInterval(cycle, 2000);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  if (!categories.length) return null;

  // Every subcategory across every category is always visible (matches the
  // reference) — only its opacity changes depending on hover state.
  const allSubcategories = categories.flatMap((category) =>
    (category.subcategories ?? []).map((sub) => ({ category, sub }))
  );

  return (
    <section id="services" className={styles.section} aria-label="Services">
      <div className={styles.content} onMouseLeave={handleGroupLeave}>
        {/* Main categories */}
        <div className={styles.left}>
          <nav className={styles.categoryList} aria-label="Service categories">
            {categories.map((category) => {
              const isDimmed = hoveredCategory !== null && hoveredCategory._id !== category._id;
              return (
                <Button
                  key={category._id}
                  variant="plain"
                  style={{ fontSize: 24, opacity: isDimmed ? 0.4 : 1 }}
                  onMouseEnter={() => handleCategoryEnter(category)}
                >
                  {category.title}
                </Button>
              );
            })}
          </nav>

          {/* Mobile: fully static — every category and its subcategories are
              always shown (only the hero image cycles, via the interval
              above), matching the reference. */}
          <ul className={styles.mobileCategoryList}>
            {categories.map((category) => (
              <li key={category._id}>
                <p className={styles.mobileCategoryLabel}>{category.title}</p>
                {(category.subcategories?.length ?? 0) > 0 && (
                  <ul className={styles.mobileSubcategoryList}>
                    {category.subcategories!.map((sub) => (
                      <li key={sub._id} className={styles.mobileSubcategoryItem}>
                        /{sub.title}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Active image, centered */}
        <div className={styles.imageArea} aria-hidden="true">
          {(() => {
            const defaultImageUrl = categories[0]?.image
              ? urlFor(categories[0].image).width(IMAGE_WIDTH).url()
              : null;
            return (
              <div
                className={styles.defaultSlide}
                style={defaultImageUrl ? undefined : { backgroundColor: "#2a2a2a" }}
              >
                {defaultImageUrl && <img src={defaultImageUrl} alt="" className={styles.image} />}
              </div>
            );
          })()}

          {categories.map((category, i) => {
            const imageUrl = category.image ? urlFor(category.image).width(IMAGE_WIDTH).url() : null;
            return (
              <div
                key={category._id}
                ref={(el) => {
                  imageRefs.current[category._id] = el;
                }}
                className={styles.imageSlide}
                style={
                  imageUrl ? undefined : { backgroundColor: FALLBACK_COLORS[i % FALLBACK_COLORS.length] }
                }
              >
                {imageUrl && <img src={imageUrl} alt="" className={styles.image} />}
              </div>
            );
          })}

          {categories.flatMap((category) =>
            (category.subcategories ?? []).map((sub) => {
              if (!sub.image) return null;
              const imageUrl = urlFor(sub.image).width(IMAGE_WIDTH).url();
              return (
                <div
                  key={sub._id}
                  ref={(el) => {
                    imageRefs.current[sub._id] = el;
                  }}
                  className={styles.imageSlide}
                >
                  <img src={imageUrl} alt="" className={styles.image} />
                </div>
              );
            })
          )}
        </div>

        {/* Always shows every subcategory from every category. Hovering a
            category/subcategory dims the ones that don't belong to its
            group; with nothing hovered, everything stays at full opacity. */}
        <div className={styles.right}>
          <ul className={styles.subcategoryList} aria-label="Subcategories">
            {allSubcategories.map(({ category, sub }) => {
              const isOwnCategoryHighlighted = hoveredCategory ? hoveredCategory._id === category._id : true;
              const isActiveSub = activeSubcategory?._id === sub._id;
              return (
                <li key={sub._id}>
                  <button
                    type="button"
                    className={`${styles.subcategoryItem} ${isActiveSub ? styles.subcategoryItemActive : ""}`}
                    style={{ opacity: isOwnCategoryHighlighted ? 1 : 0.4 }}
                    onMouseEnter={() => handleSubcategoryEnter(category, sub)}
                  >
                    /{sub.title}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
