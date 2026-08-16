import HomeClient from "@/components/HomeClient/HomeClient";
import Works from "@/components/Works/Works";
import Testimonials from "@/components/Testimonials/Testimonials";
import Services from "@/components/Services/Services";
import Footer from "@/components/Footer/Footer";

export default function Home() {
  return (
    <div>
      <HomeClient />
      <Works />
      <Testimonials />
      <Services />
      <Footer />
    </div>
  );
}
