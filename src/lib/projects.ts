import type { Project } from "@/components/Works/types";

// Local data source — swap this array for a Sanity fetch when ready.
export const PROJECTS: Project[] = [
  {
    title: "Kunert",
    slug: "kunert",
    description: "Visual identity for Kunert",
  },
  {
    title: "The Spicery",
    slug: "the-spicery",
    description: "Branding for The Spicery, Bristol",
  },
  {
    title: "Fajne Chłopaki",
    slug: "fajne-chlopaki",
    description: "Design studio collaboration",
  },
  {
    title: "JKU",
    slug: "jku",
    description: "Academic design project at Jan Kochanowski University",
  },
  {
    title: "MBS Leeds",
    slug: "mbs-leeds",
    description: "Matthew Brand Solutions, Leeds",
  },
  {
    title: "Project 6",
    slug: "project-6",
    description: "",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
