import { getServiceItems } from "@/lib/sanity";
import ServicesClient from "./ServicesClient";

export default async function Services() {
  const items = await getServiceItems();
  return <ServicesClient items={items} />;
}
