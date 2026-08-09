export interface SanityImageRef {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
}

export interface SanityProject {
  title: string;
  slug: string;
  coverImage?: SanityImageRef;
  hoverDescription?: string;
  year?: string;
  services?: string[];
}

// Keep the old shape for lib/projects.ts compatibility
export interface Project {
  title: string;
  slug: string;
  coverImage?: string;
  description?: string;
}
