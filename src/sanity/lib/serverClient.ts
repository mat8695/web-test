import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

const token = assertValue(
  process.env.SANITY_API_WRITE_TOKEN,
  "Missing environment variable: SANITY_API_WRITE_TOKEN"
);

// Only import this from server-side code (Route Handlers, Server
// Components/Actions) — SANITY_API_WRITE_TOKEN is not NEXT_PUBLIC_-prefixed,
// so Next.js already keeps it out of the client bundle, but importing this
// module from a "use client" file would still try to read it at runtime in
// the browser and fail. `useCdn: false` because writes must hit the API
// directly, not the CDN.
export const serverClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }

  return v;
}
