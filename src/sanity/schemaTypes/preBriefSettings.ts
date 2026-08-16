import { defineField, defineType } from "sanity";

// Singleton — one document holds the whole configurable question list.
// The array's item order is what the future /pre-brief form renders in,
// so editors can just drag questions in Studio to reorder the form.
export const preBriefSettingsType = defineType({
  name: "preBriefSettings",
  title: "Pre-Brief Questions",
  type: "document",
  fields: [
    defineField({
      name: "questions",
      title: "Questions",
      description:
        "Drag to reorder — this order determines the field order on the /pre-brief form.",
      type: "array",
      of: [{ type: "preBriefQuestion" }],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Pre-Brief Questions" };
    },
  },
});
