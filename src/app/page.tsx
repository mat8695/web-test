import HomeClient from "@/components/HomeClient/HomeClient";
import Works from "@/components/Works/Works";
import Testimonials from "@/components/Testimonials/Testimonials";
import Services from "@/components/Services/Services";

export default function Home() {
  return (
    <div>
      <HomeClient />
      <Works />
      <Services />
      <Testimonials />
    </div>
  );
}
