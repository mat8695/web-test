import { client } from "@/sanity/lib/client";
import type { SanityProject } from "@/components/Works/types";
import type { SanityServiceItem } from "@/components/Services/types";

const PROJECTS_QUERY = `
  *[_type == "project"] | order(_createdAt asc) {
    title,
    "slug": slug.current,
    coverImage,
    year,
    services
  }
`;

const PROJECT_BY_SLUG_QUERY = `
  *[_type == "project" && slug.current == $slug][0] {
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

export async function getProjectBySlug(slug: string): Promise<SanityProject | null> {
  try {
    const project = await client.fetch<SanityProject | null>(
      PROJECT_BY_SLUG_QUERY,
      { slug },
      { next: { revalidate: 60 } }
    );
    return project ?? null;
  } catch {
    return null;
  }
}

const SERVICE_ITEMS_QUERY = `
  *[_type == "serviceItem"] | order(order asc) {
    _id,
    title,
    description,
    image,
    order
  }
`;

export async function getServiceItems(): Promise<SanityServiceItem[]> {
  try {
    const items = await client.fetch<SanityServiceItem[]>(SERVICE_ITEMS_QUERY, {}, {
      next: { revalidate: 60 },
    });
    return items ?? [];
  } catch {
    return [];
  }
}
