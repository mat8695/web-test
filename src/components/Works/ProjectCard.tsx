import { urlFor } from "@/sanity/lib/image";
import { TransitionLink } from "@/components/Transition/TransitionLink";
import type { SanityProject } from "./types";
import styles from "./ProjectCard.module.css";

interface ProjectCardProps {
  project: SanityProject;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const imageUrl = project.coverImage
    ? urlFor(project.coverImage).width(860).url()
    : null;

  return (
    <TransitionLink href={`/works/${project.slug}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        {imageUrl ? (
          <img src={imageUrl} alt={project.title} className={styles.image} />
        ) : (
          <div className={styles.placeholder} />
        )}
      </div>
      <p className={styles.title}>{project.title}</p>
    </TransitionLink>
  );
}
