import { defineField, defineType } from "sanity";

// Singleton — see structure.ts, which pins this to a fixed document ID
// ("webSettings") and opens it directly instead of a creatable list.
export const webSettingsType = defineType({
  name: "webSettings",
  title: "Web Settings",
  type: "document",
  groups: [
    { name: "general", title: "General", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "ogImage",
      title: "Default OG Image",
      description: "Used for any page below that doesn't set its own OG Image.",
      type: "image",
      options: { hotspot: true },
      group: "general",
    }),
    defineField({
      name: "favicon",
      title: "Favicon",
      type: "image",
      group: "general",
    }),
    defineField({
      name: "appIcon",
      title: "App Icon",
      type: "image",
      group: "general",
    }),
    defineField({
      name: "pages",
      title: "Pages",
      description:
        "One entry per route (path). Add an entry here to give a new page its own SEO — no schema changes needed.",
      type: "array",
      of: [{ type: "pageSeo" }],
      group: "seo",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Web Settings" };
    },
  },
});
