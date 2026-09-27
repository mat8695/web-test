import type { Metadata } from "next";
import type { SanityImageSource } from "@sanity/image-url";
import { client } from "@/sanity/lib/client";
import { urlFor, hasImageAsset } from "@/sanity/lib/image";

const fetchOptions =
  process.env.NODE_ENV === "production"
    ? { next: { revalidate: 60 } }
    : { cache: "no-store" as const };

export interface SanityPageSeo {
  pageName: string;
  path: string;
  metaTitle: string;
  metaDescription?: string;
  ogImage?: SanityImageSource;
}

export interface SanityWebSettings {
  ogImage?: SanityImageSource;
  favicon?: SanityImageSource;
  appIcon?: SanityImageSource;
  pages?: SanityPageSeo[];
}

const WEB_SETTINGS_QUERY = `
  *[_type == "webSettings" && _id == "webSettings"][0]{
    ogImage,
    favicon,
    appIcon,
    pages[]{
      pageName,
      path,
      metaTitle,
      metaDescription,
      ogImage
    }
  }
`;

export async function getWebSettings(): Promise<SanityWebSettings | null> {
  try {
    const settings = await client.fetch<SanityWebSettings | null>(
      WEB_SETTINGS_QUERY,
      {},
      fetchOptions
    );
    return settings ?? null;
  } catch {
    return null;
  }
}

// The one fallback rule every route needs applied identically: use the
// content's own image if it has one, otherwise Web Settings' global
// Default OG Image. Sized to the standard OG dimensions.
export function resolveOgImage(
  ownImage: SanityImageSource | undefined,
  fallbackImage: SanityImageSource | undefined
): { url: string; width: number; height: number } | undefined {
  // An image field left empty in Studio still serializes as an object with
  // no asset, so fall through to the global default rather than handing an
  // unresolvable value to urlFor().
  const source = hasImageAsset(ownImage)
    ? ownImage
    : hasImageAsset(fallbackImage)
      ? fallbackImage
      : undefined;
  if (!source) return undefined;
  return { url: urlFor(source).width(1200).height(630).fit("crop").url(), width: 1200, height: 630 };
}

// For statically-known routes only (home, /works, etc.) — looked up by
// exact path match against webSettings.pages. Dynamic per-entity routes
// (e.g. /works/[slug]) build their own metadata from that entity's own
// fields instead; see e.g. src/app/works/[slug]/page.tsx.
export async function getPageMetadata(path: string): Promise<Metadata> {
  const settings = await getWebSettings();
  const page = settings?.pages?.find((p) => p.path === path);
  if (!page) return {};

  const ogImage = resolveOgImage(page.ogImage, settings?.ogImage);

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}
