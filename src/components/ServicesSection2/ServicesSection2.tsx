import { getServiceCategories } from "@/lib/sanity";
import ServicesSection2Client from "./ServicesSection2Client";

// Same server/client split as Services.tsx, and reads the same
// getServiceCategories() data — this is an alternative presentation of the
// service categories (expandable columns), not a second data source.
export default async function ServicesSection2() {
  const categories = await getServiceCategories();
  return <ServicesSection2Client categories={categories} />;
}
