import type { Metadata } from "next";
import { getPreBriefQuestions } from "@/lib/sanity";
import { getPageMetadata } from "@/lib/seo";
import HeartLogo from "@/components/HeartLogo/HeartLogo";
import BriefForm from "@/components/Brief/BriefForm";
import styles from "@/components/Brief/Brief.module.css";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("/brief");
}

export default async function BriefPage() {
  // Questions come from the Pre-Brief Questions singleton in Studio, in the
  // order they're arranged there — adding, reordering or removing one needs
  // no code change.
  const questions = await getPreBriefQuestions();

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Pre-Brief notes</h1>
          <p className={styles.intro}>Here&apos;s some questions</p>
        </div>
        <HeartLogo width={26} className={styles.heart} />
      </header>

      <BriefForm questions={questions} />
    </main>
  );
}
