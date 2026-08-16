import { defineField, defineType } from "sanity";

// One answer within a preBrief submission. Links back to the question via
// `questionKey` (matching preBriefQuestion.key) rather than a Sanity
// reference, since the question lives inside an array on a singleton, not
// as its own document. `questionLabel` snapshots the wording at submission
// time so past answers stay legible if a question is later reworded.
export const preBriefAnswerType = defineType({
  name: "preBriefAnswer",
  title: "Answer",
  type: "object",
  fields: [
    defineField({
      name: "questionKey",
      title: "Question Key",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "questionLabel",
      title: "Question (at submission time)",
      type: "string",
    }),
    defineField({
      name: "value",
      title: "Value",
      description: "Used for single-value answers (short/long text, email, phone, single select).",
      type: "text",
    }),
    defineField({
      name: "values",
      title: "Values",
      description: "Used for multiple select answers.",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
  preview: {
    select: { title: "questionLabel", subtitle: "value" },
  },
});
