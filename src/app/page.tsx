import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient/HomeClient";
import Works from "@/components/Works/Works";
import Testimonials2 from "@/components/Testimonials2/Testimonials2";
import ServicesSection2 from "@/components/ServicesSection2/ServicesSection2";
import Footer from "@/components/Footer/Footer";
import { getPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("/");
}

export default function Home() {
  return (
    <div>
      <HomeClient />
      <Works />
      {/* Testimonials (the two-column PL/EN card) is hidden for now —
          Testimonials2 replaces it on the homepage. The component and its
          styles are left in place so it can be swapped back in. */}
      <Testimonials2 />
      {/* Services (the 3-column image-cycling section) is hidden for now —
          ServicesSection2 replaces it on the homepage. The component and its
          styles are left in place so it can be swapped back in. */}
      <ServicesSection2 />
      <Footer />
    </div>
  );
}
