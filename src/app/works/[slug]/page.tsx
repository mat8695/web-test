import { notFound } from "next/navigation";
import { getProjects, getProjectBySlug } from "@/lib/sanity";
import { urlFor } from "@/sanity/lib/image";
import styles from "./page.module.css";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects
    .filter((p) => !!p.slug)
    .map((p) => ({ slug: p.slug }));
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const imageUrl = project.coverImage
    ? urlFor(project.coverImage).width(1200).url()
    : null;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>{project.title}</h1>
        {project.year && <p className={styles.meta}>{project.year}</p>}
        {project.services && project.services.length > 0 && (
          <ul className={styles.services}>
            {project.services.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        )}
      </header>

      {imageUrl && (
        <div className={styles.coverWrapper}>
          <img src={imageUrl} alt={project.title} className={styles.cover} />
        </div>
      )}
    </main>
  );
}
