import type { Metadata } from "next";

import { CapitalOneContent } from "./capital-one-content";

/**
 * portfolio-import — Capital One case study (source: case-studies/capital-one.html).
 * Server component so it can export metadata directly; the markup lives in
 * capital-one-content.tsx (a client component, needed for the source's
 * reveal-on-scroll script and its "?from=gaming" query-param variant).
 */
export const metadata: Metadata = {
  title: "Capital One — AI-Powered Decision Support | Alex Sun",
  description:
    "How I designed an explainable AI decision-support framework that made model-generated risk findings readable and usable for Capital One analysts.",
  icons: { icon: "/portfolio-import/favicon.png" },
  openGraph: {
    type: "website",
    title: "Capital One — AI-Powered Decision Support | Alex Sun",
    description:
      "How I designed an explainable AI decision-support framework that made model-generated risk findings readable and usable for Capital One analysts.",
    images: ["/portfolio-import/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Capital One — AI-Powered Decision Support | Alex Sun",
    description:
      "How I designed an explainable AI decision-support framework that made model-generated risk findings readable and usable for Capital One analysts.",
    images: ["/portfolio-import/og-image.png"],
  },
};

export default function CapitalOneCaseStudyPage() {
  return <CapitalOneContent />;
}
