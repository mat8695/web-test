import type { SanityImageRef } from "@/components/Works/types";

export interface SanityServiceItem {
  _id: string;
  title: string;
  description?: string;
  image?: SanityImageRef;
  order?: number;
}

export type { SanityImageRef };
