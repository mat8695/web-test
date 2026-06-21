import Link from "next/link";
import type { Project } from "./types";
import styles from "./ProjectCard.module.css";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        {project.coverImage ? (
          <img
            src={project.coverImage}
            alt={project.title}
            className={styles.image}
          />
        ) : (
          <div className={styles.placeholder} />
        )}
      </div>
      <p className={styles.title}>{project.title}</p>
    </Link>
  );
}
