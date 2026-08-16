import { defineField, defineType } from "sanity";

export const leadType = defineType({
  name: "lead",
  title: "Lead",
  type: "document",
  fields: [
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "email", subtitle: "phone" },
  },
});
