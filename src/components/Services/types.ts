import type { SanityImageRef } from "@/components/Works/types";

// Service Items are now the subcategories of a Service Category — each
// references its parent category and is joined back in via GROQ.
export interface SanityServiceItem {
  _id: string;
  title: string;
  description?: string;
  image?: SanityImageRef;
  order?: number;
}

export interface SanityServiceCategory {
  _id: string;
  title: string;
  image?: SanityImageRef;
  subcategories?: SanityServiceItem[];
  order?: number;
}

export type { SanityImageRef };
