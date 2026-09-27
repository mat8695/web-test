import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'

import { dataset, projectId } from '../env'

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset })

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source)
}

/**
 * True when a Sanity image value actually points at an uploaded asset.
 *
 * An image field — or an array slot — that an editor added in Studio but
 * never picked a file for is stored as `{ _key, _type: "image" }` with no
 * `asset`. That object is truthy, so a plain `image ? urlFor(image) : null`
 * check waves it through, and `.url()` then throws
 * "Unable to resolve image URL from source", which fails the production
 * build while prerendering whichever page renders it.
 *
 * Guard with this instead of a truthiness check so empty slots are simply
 * skipped and the rest of the gallery still renders.
 */
export function hasImageAsset(source: unknown): boolean {
  // A bare string (asset _id or CDN URL) is resolvable on its own.
  if (typeof source === 'string') return source.length > 0

  if (!source || typeof source !== 'object') return false

  const asset = (source as { asset?: unknown }).asset
  if (!asset || typeof asset !== 'object') return false

  const { _ref, _id } = asset as { _ref?: unknown; _id?: unknown }
  return (
    (typeof _ref === 'string' && _ref.length > 0) ||
    (typeof _id === 'string' && _id.length > 0)
  )
}
