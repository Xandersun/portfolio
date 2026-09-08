import type { Metadata } from "next";

import { LandingContent } from "./landing-content";

/**
 * portfolio-import — migrated landing page (source: index.html).
 * Server component so it can export metadata directly; the actual markup
 * lives in landing-content.tsx (a client component, needed for the
 * source's one inline reveal-on-scroll script).
 */
export const metadata: Metadata = {
  title: "Alex Sun — Senior Product Designer",
  description:
    "Senior product designer specializing in complex enterprise platforms, data-heavy products, and scalable workflows.",
  icons: { icon: "/portfolio-import/favicon.png" },
  openGraph: {
    type: "website",
    title: "Alex Sun — Senior Product Designer",
    description:
      "Senior product designer specializing in complex enterprise platforms, data-heavy products, and scalable workflows.",
    images: ["/portfolio-import/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alex Sun — Senior Product Designer",
    description:
      "Senior product designer specializing in complex enterprise platforms, data-heavy products, and scalable workflows.",
    images: ["/portfolio-import/og-image.png"],
  },
};

export default function PortfolioImportLandingPage() {
  return <LandingContent />;
}
