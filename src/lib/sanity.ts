import { client } from "@/sanity/lib/client";
import type { SanityProject } from "@/components/Works/types";

const PROJECTS_QUERY = `
  *[_type == "project"] | order(_createdAt asc) {
    title,
    "slug": slug.current,
    coverImage,
    year,
    services
  }
`;

export async function getProjects(): Promise<SanityProject[]> {
  try {
    const projects = await client.fetch<SanityProject[]>(PROJECTS_QUERY, {}, {
      next: { revalidate: 60 },
    });
    return projects ?? [];
  } catch {
    return [];
  }
}
