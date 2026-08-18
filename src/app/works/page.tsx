import { getProjects } from "@/lib/sanity";
import Navigation from "@/components/Navigation/Navigation";
import WorksList from "@/components/Works/WorksList";
import Footer from "@/components/Footer/Footer";

export default async function WorksPage() {
  const projects = await getProjects();

  return (
    <main>
      <Navigation />
      <WorksList projects={projects} />
      <Footer />
    </main>
  );
}
