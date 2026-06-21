import { PROJECTS } from "@/lib/projects";
import { BackgroundGrid } from "./BackgroundGrid";
import { ProjectCard } from "./ProjectCard";
import styles from "./Works.module.css";

const leftProjects = PROJECTS.filter((_, i) => i % 3 === 0);
const centerProjects = PROJECTS.filter((_, i) => i % 3 === 1);
const rightProjects = PROJECTS.filter((_, i) => i % 3 === 2);

export default function Works() {
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
        {PROJECTS.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
