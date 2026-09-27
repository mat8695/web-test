import { getTestimonials } from "@/lib/sanity";
import Testimonials2Client from "./Testimonials2Client";

// Same server/client split as Testimonials.tsx, reading the same
// getTestimonials() data — this is an alternative presentation (one quote
// at a time with an EN|PL switch), not a second data source.
export default async function Testimonials2() {
  const testimonials = await getTestimonials();
  return <Testimonials2Client testimonials={testimonials} />;
}
