import type { Metadata } from "next";

import { MarriottContent } from "./marriott-content";

/**
 * portfolio-import — migrated Marriott case study page (source: marriott.html).
 * Server component holding metadata only; all markup + the ported
 * reveal-on-scroll script live in the client child (marriott-content.tsx)
 * per the established portfolio-import conversion pattern.
 */
export const metadata: Metadata = {
  title: "Marriott Bonvoy — Promotion Registration | Alex Sun",
  description:
    "How I identified and removed a redundant authentication gate in Marriott's promotions flow, producing a 30% increase in promotional registrations.",
  icons: { icon: "/portfolio-import/favicon.png" },
  openGraph: {
    type: "website",
    title: "Marriott Bonvoy — Promotion Registration | Alex Sun",
    description:
      "How I identified and removed a redundant authentication gate in Marriott's promotions flow, producing a 30% increase in promotional registrations.",
    images: ["/portfolio-import/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Marriott Bonvoy — Promotion Registration | Alex Sun",
    description:
      "How I identified and removed a redundant authentication gate in Marriott's promotions flow, producing a 30% increase in promotional registrations.",
    images: ["/portfolio-import/og-image.png"],
  },
};

export default function PortfolioImportMarriottPage() {
  return <MarriottContent />;
}
