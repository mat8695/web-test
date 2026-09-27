import type { Metadata } from "next";
import { getProjects } from "@/lib/sanity";
import Navigation from "@/components/Navigation/Navigation";
import WorksList from "@/components/Works/WorksList";
import Footer from "@/components/Footer/Footer";
import { getPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("/works");
}

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
