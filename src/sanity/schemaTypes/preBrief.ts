import { defineField, defineType } from "sanity";

export const preBriefType = defineType({
  name: "preBrief",
  title: "Pre-Brief Submission",
  type: "document",
  fields: [
    defineField({
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
    }),
    defineField({
      name: "answers",
      title: "Answers",
      type: "array",
      of: [{ type: "preBriefAnswer" }],
    }),
  ],
  preview: {
    select: { title: "submittedAt" },
  },
});
