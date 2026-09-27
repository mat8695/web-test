import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TransitionProvider } from "@/components/Transition/TransitionProvider";
import { getWebSettings, resolveOgImage } from "@/lib/seo";
import { urlFor } from "@/sanity/lib/image";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Global fallback only — favicon/app icon/default OG image from Web
// Settings, plus a baseline title so routes with no pages[] entry of
// their own (see src/lib/seo.ts) don't fall back to no title at all.
// Individual routes override title/description/openGraph themselves via
// their own generateMetadata.
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getWebSettings();
  const ogImage = resolveOgImage(undefined, settings?.ogImage);

  return {
    title: "Kat Szewczyk",
    icons: {
      icon: settings?.favicon ? urlFor(settings.favicon).url() : undefined,
      apple: settings?.appIcon ? urlFor(settings.appIcon).url() : undefined,
    },
    openGraph: ogImage ? { images: [ogImage] } : undefined,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <TransitionProvider>{children}</TransitionProvider>
      </body>
    </html>
  );
}
