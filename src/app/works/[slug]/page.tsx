import { notFound } from "next/navigation";
import { getProjects, getProjectBySlug } from "@/lib/sanity";
import Navigation from "@/components/Navigation/Navigation";
import WorkHero from "@/components/WorkHero/WorkHero";
import WorkQuote from "@/components/WorkQuote/WorkQuote";
import Footer from "@/components/Footer/Footer";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects
    .filter((p) => !!p.slug)
    .map((p) => ({ slug: p.slug }));
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <main>
      <Navigation />
      <WorkHero project={project} />
      <WorkQuote project={project} />
      <Footer />
    </main>
  );
}
