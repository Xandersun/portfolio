import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

import "./globals.css";

// Portfolio typeface. The old dashboard prototype under (defense-app) reads
// --font-geist-sans / --font-geist-mono directly (see lib/design-tokens.ts),
// so Geist stays loaded here to keep that unrelated subtree unaffected —
// only the portfolio's --font-sans mapping (globals.css) points at General
// Sans now.
const generalSans = localFont({
  variable: "--font-general-sans",
  src: [
    {
      path: "../public/fonts/general-sans/GeneralSans-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/general-sans/GeneralSans-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/general-sans/GeneralSans-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alex Sun — Product Designer",
  description: "Portfolio of Alex Sun, Senior / Lead Product Designer.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${generalSans.variable} ${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
