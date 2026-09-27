import { defineField, defineType } from "sanity";

export const preBriefType = defineType({
  name: "preBrief",
  title: "Pre-Brief Submission",
  type: "document",
  fields: [
    // Name and email are fixed fields on the /brief form (they sit above the
    // configurable questions in the design), so they're stored as their own
    // fields rather than inside `answers` — that keeps the person's contact
    // details readable at a glance no matter how the questions change.
    defineField({
      name: "name",
      title: "Name",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
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
    select: { title: "name", subtitle: "email", submittedAt: "submittedAt" },
    prepare({ title, subtitle, submittedAt }) {
      const date = submittedAt ? new Date(submittedAt).toLocaleString() : "";
      return {
        title: title || "(no name)",
        subtitle: [subtitle, date].filter(Boolean).join(" · "),
      };
    },
  },
});
