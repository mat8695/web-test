"use client";

import styles from "./LanguageSwitch.module.css";

export type Language = "en" | "pl";

export interface LanguageSwitchProps {
  language: Language;
  onChange: (language: Language) => void;
  className?: string;
}

// Extracted from WorkHero, where this originally lived as a local
// component, so the /works/[slug] pages and any other bilingual block
// (e.g. ServicesSection2) share one EN | PL control instead of each
// reimplementing it. Markup and styles are unchanged from the original.
export default function LanguageSwitch({ language, onChange, className }: LanguageSwitchProps) {
  const cls = [styles.languageSwitch, className].filter(Boolean).join(" ");

  return (
    <div className={cls}>
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
