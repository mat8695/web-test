import { getServiceCategories } from "@/lib/sanity";
import ServicesClient from "./ServicesClient";

export default async function Services() {
  const categories = await getServiceCategories();
  return <ServicesClient categories={categories} />;
}
