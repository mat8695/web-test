import { defineField, defineType } from "sanity";

export const testimonialType = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "clientName",
      title: "Client Name",
      type: "string",
    }),
    defineField({
      name: "quotePl",
      title: "Quote (Polish)",
      type: "text",
    }),
    defineField({
      name: "quoteEn",
      title: "Quote (English)",
      type: "text",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
    }),
  ],
});
