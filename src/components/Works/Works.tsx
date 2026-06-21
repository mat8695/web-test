import { getProjects } from "@/lib/sanity";
import { BackgroundGrid } from "./BackgroundGrid";
import { ProjectCard } from "./ProjectCard";
import styles from "./Works.module.css";

export default async function Works() {
  const projects = await getProjects();

  const leftProjects = projects.filter((_, i) => i % 3 === 0);
  const centerProjects = projects.filter((_, i) => i % 3 === 1);
  const rightProjects = projects.filter((_, i) => i % 3 === 2);

  return (
    <section className={styles.section} aria-label="Selected works">
      <BackgroundGrid />

      {/* Desktop: 3-column staggered layout */}
      <div className={styles.desktopGrid}>
        <div className={styles.colLeft}>
          {leftProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
        <div className={styles.colCenter}>
          {centerProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
        <div className={styles.colRight}>
          {rightProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>

      {/* Tablet / mobile: flat list in original project order */}
      <div className={styles.responsiveGrid}>
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
