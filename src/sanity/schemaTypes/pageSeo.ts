import { defineField, defineType } from "sanity";

// Object type only — instances live in the `pages` array on `webSettings`.
// Adding SEO for a new route is just adding a new array entry here, no
// schema change needed (see webSettings.ts).
export const pageSeoType = defineType({
  name: "pageSeo",
  title: "Page SEO",
  type: "object",
  fields: [
    defineField({
      name: "pageName",
      title: "Page Name",
      description: 'Editor-facing label only, e.g. "Homepage", "Works index" — not shown on the site.',
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "path",
      title: "Path",
      description: "The route this SEO entry applies to, e.g. /, /works, /pre-brief.",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "metaTitle",
      title: "Meta Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "ogImage",
      title: "OG Image",
      description:
        "Overrides the global Default OG Image (Web Settings → General) for this page only. Leave empty to use the global one.",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { title: "pageName", subtitle: "path" },
  },
});
