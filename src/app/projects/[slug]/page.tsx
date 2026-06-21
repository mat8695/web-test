import { notFound } from "next/navigation";
import { PROJECTS, getProjectBySlug } from "@/lib/projects";
import styles from "./page.module.css";

// Pre-generate a page for every known slug at build time.
// When Sanity is connected, replace PROJECTS here with a fetch.
export async function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>{project.title}</h1>
        {project.description && (
          <p className={styles.description}>{project.description}</p>
        )}
      </header>

      {project.coverImage && (
        <div className={styles.coverWrapper}>
          <img
            src={project.coverImage}
            alt={project.title}
            className={styles.cover}
          />
        </div>
      )}
    </main>
  );
}
