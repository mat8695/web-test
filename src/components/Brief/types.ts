// Mirrors preBriefQuestion.ts in the Sanity schema. `key` is projected from
// the schema's slug field (key.current) so it's a plain string here.
export type PreBriefFieldType =
  | "shortText"
  | "longText"
  | "email"
  | "phone"
  | "singleSelect"
  | "multiSelect";

export interface SanityPreBriefQuestion {
  key: string;
  label: string;
  fieldType?: PreBriefFieldType;
  required?: boolean;
  helperText?: string;
  options?: string[];
}
