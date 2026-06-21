import { getTestimonials } from "@/lib/sanity";
import TestimonialsClient from "./TestimonialsClient";

export default async function Testimonials() {
  const testimonials = await getTestimonials();
  return <TestimonialsClient testimonials={testimonials} />;
}
