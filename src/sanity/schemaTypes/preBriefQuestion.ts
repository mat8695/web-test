import { defineField, defineType } from "sanity";

// Object type only — instances live in the `questions` array on
// `preBriefSettings`, which is what gives editors native drag-to-reorder
// in Studio (array-of-objects), add/remove, and inline editing.
export const preBriefQuestionType = defineType({
  name: "preBriefQuestion",
  title: "Pre-Brief Question",
  type: "object",
  fields: [
    defineField({
      name: "key",
      title: "Key",
      description:
        "Stable identifier used to match a submitted answer back to this question, even if the label changes later.",
      type: "slug",
      options: { source: "label" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "label",
      title: "Question / Label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "fieldType",
      title: "Field Type",
      type: "string",
      options: {
        layout: "dropdown",
        list: [
          { title: "Short text", value: "shortText" },
          { title: "Long text", value: "longText" },
          { title: "Email", value: "email" },
          { title: "Phone", value: "phone" },
          { title: "Single select", value: "singleSelect" },
          { title: "Multiple select", value: "multiSelect" },
        ],
      },
      initialValue: "shortText",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "required",
      title: "Required",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "helperText",
      title: "Placeholder / Helper Text",
      type: "string",
    }),
    defineField({
      name: "options",
      title: "Options",
      description: "Used only when the field type is Single select or Multiple select.",
      type: "array",
      of: [{ type: "string" }],
      hidden: ({ parent }) =>
        !["singleSelect", "multiSelect"].includes(parent?.fieldType),
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "fieldType" },
  },
});
