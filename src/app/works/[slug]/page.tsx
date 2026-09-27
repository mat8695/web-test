import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjects, getProjectBySlug } from "@/lib/sanity";
import Navigation from "@/components/Navigation/Navigation";
import WorkHero from "@/components/WorkHero/WorkHero";
import WorkQuote from "@/components/WorkQuote/WorkQuote";
import Footer from "@/components/Footer/Footer";
import { getWebSettings, resolveOgImage } from "@/lib/seo";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects
    .filter((p) => !!p.slug)
    .map((p) => ({ slug: p.slug }));
}

// Not a statically-known route in webSettings.pages (that's for fixed
// site pages like / and /works) — a per-project route builds its own
// metadata from the project's own fields instead, falling back to the
// same global Default OG Image when the project has no cover image.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [project, settings] = await Promise.all([getProjectBySlug(slug), getWebSettings()]);
  if (!project) return {};

  const ogImage = resolveOgImage(project.coverImage, settings?.ogImage);

  return {
    title: project.title,
    description: project.hoverDescription,
    openGraph: {
      title: project.title,
      description: project.hoverDescription,
      images: ogImage ? [ogImage] : undefined,
    },
  };
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
