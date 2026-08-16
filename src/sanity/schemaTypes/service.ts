import { defineField, defineType } from "sanity";

export const serviceType = defineType({
  name: "service",
  title: "Service Category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "image",
      title: "Default Image",
      description:
        "Shown centered when this category is active, or when an active subcategory has no image of its own.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
    }),
  ],
});
