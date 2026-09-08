import type { Metadata } from "next";

import { Button } from "@/components/ui/button";

import { PrimaryNav } from "../_components/primary-nav";

/**
 * portfolio-import — About page (source: about.html).
 * IMPLEMENTATION REFACTOR pass: rebuilt on Tailwind + the shared
 * PrimaryNav + Button component instead of about.css/case-study-shared.css.
 * No inline script in the source, so this stays a plain server component.
 */

const RESUME_URL =
  "https://docs.google.com/document/d/1qfTNVm7pdK8m5son9igaz1lhZs7LPSXb/edit?usp=drive_link&ouid=101666787535519743600&rtpof=true&sd=true";

const DOMAINS = [
  "AI / ML workflow design",
  "Enterprise platform architecture",
  "High-density data interfaces",
  "Multi-role workflows",
  "Design systems",
  "Product strategy",
  "Research strategy",
  "Engineering handoff",
];

export const metadata: Metadata = {
  title: "About — Alex Sun",
  description: "Alex Sun — Product Designer specializing in enterprise SaaS, AI workflows, and platform architecture.",
  icons: { icon: "/portfolio-import/favicon.png" },
  openGraph: {
    type: "website",
    title: "About — Alex Sun",
    description: "Product Designer specializing in enterprise SaaS, AI workflows, and platform architecture.",
    images: ["/portfolio-import/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "About — Alex Sun",
    description: "Product Designer specializing in enterprise SaaS, AI workflows, and platform architecture.",
    images: ["/portfolio-import/og-image.png"],
  },
};

export default function PortfolioImportAboutPage() {
  return (
    <div
      className="portfolio-import"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}
    >
      <PrimaryNav
        links={[
          { label: "Work", href: "/portfolio-import" },
          { label: "About", href: "/portfolio-import/about" },
        ]}
        resume={{ href: RESUME_URL }}
        innerClassName="mx-auto max-w-[1080px] px-8"
      />

      <div className="mx-auto max-w-[1080px] px-8">
        <header className="border-b border-[#E2E8F0] py-16 sm:py-20">
          <h1 className="text-[34px] leading-[1.25] font-semibold tracking-[-0.025em] text-[#0F172A] sm:text-[46px]">
            About
          </h1>
          <p className="mt-4 max-w-[780px] text-lg leading-[1.7] text-[#475569]">
            I specialize in enterprise SaaS, data-heavy systems, and complex platform
            architecture.
          </p>
        </header>

        <section className="border-b border-[#E2E8F0] py-14">
          <h2 className="text-[13px] font-semibold tracking-[0.08em] text-[#475569] uppercase">Background</h2>
          <p className="mt-5 max-w-[820px] text-base leading-[1.7] text-[#475569]">
            I&apos;m a Product Designer specializing in enterprise SaaS, data-heavy systems, and
            complex platform architecture. My work bridges business strategy, user research, and
            deep technical collaboration to transform intricate workflows into clear, scalable
            products.
          </p>
          <p className="mt-4 max-w-[820px] text-base leading-[1.7] text-[#475569]">
            Most recently at <strong className="font-semibold text-[#0F172A]">Capital One</strong>,
            I served as the sole Product Designer architecting an explainable AI decision-support
            platform for internal risk management. Previously, I managed a design team at{" "}
            <strong className="font-semibold text-[#0F172A]">Monster Government Solutions</strong>{" "}
            modernizing legacy hiring platforms for complex B2G environments. My background also
            includes driving high-volume consumer impact, redesigning promotion experiences at{" "}
            <strong className="font-semibold text-[#0F172A]">Marriott</strong> for 100M+ members,
            and redesigning <strong className="font-semibold text-[#0F172A]">Blizzard&apos;s</strong>{" "}
            StarCraft II ranked progression system alongside data scientists to boost retention by
            40%.
          </p>
        </section>

        <section className="border-b border-[#E2E8F0] py-14">
          <h2 className="text-[13px] font-semibold tracking-[0.08em] text-[#475569] uppercase">
            Side Projects &amp; Ventures
          </h2>
          <div className="mt-4 max-w-[820px] rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-6">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="text-lg font-semibold text-[#0F172A]">Mr. Sun&apos;s Books — Marketing Platform</div>
              <a
                className="inline-flex items-center gap-1 border-b border-[#0F172A] pb-px text-sm font-semibold text-[#0F172A] hover:border-[#64748B] hover:text-[#64748B]"
                href="https://www.MrSunsBooks.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit Site ↗
              </a>
            </div>
            <p className="mt-3 text-base leading-[1.7] text-[#475569]">
              I designed and built this site as a promotional marketing platform for my
              self-publishing projects. Unlike standard publisher sites that cater strictly to
              adult buyers, I created a tablet-first experience packed with bright imagery,
              interactive book previews, and custom wishlist building. The goal was to give
              parents a compelling reason to hand the device to their kids, turning marketing
              into a fun, shared discovery experience that drives book sales.
            </p>
          </div>
        </section>

        <section className="border-b border-[#E2E8F0] py-14">
          <h2 className="text-[13px] font-semibold tracking-[0.08em] text-[#475569] uppercase">What I do well</h2>
          <div className="mt-4 grid max-w-[820px] grid-cols-1 gap-3 sm:grid-cols-2">
            {DOMAINS.map((domain) => (
              <div
                key={domain}
                className="rounded-md border border-[#E2E8F0] bg-[#F1F5F9] px-4 py-3 text-sm font-medium text-[#334155]"
              >
                {domain}
              </div>
            ))}
          </div>
        </section>

        <section className="border-b border-[#E2E8F0] py-14">
          <h2 className="text-[13px] font-semibold tracking-[0.08em] text-[#475569] uppercase">
            What I&apos;m looking for
          </h2>
          <p className="mt-5 max-w-[820px] text-base leading-[1.7] text-[#475569]">
            Product Design roles at B2B SaaS, enterprise software, and platform companies. The
            problems I&apos;m best suited for involve data-heavy interfaces, multiple user types
            with competing needs, or AI/ML components where design decisions have real downstream
            consequences.
          </p>
        </section>

        <section className="py-14">
          <h2 className="text-[13px] font-semibold tracking-[0.08em] text-[#475569] uppercase">Get in touch</h2>
          <p className="mt-5 text-base leading-[1.7] text-[#475569]">Open to Senior and Lead Product Design roles.</p>
          <div className="mt-4 flex flex-wrap gap-4">
            <Button
              render={<a href="mailto:alexandersun@gmail.com" />}
              nativeButton={false}
              className="h-auto rounded-lg bg-[#0F172A] px-6 py-3 text-[15px] font-semibold text-white hover:opacity-90"
            >
              Email me
            </Button>
            <Button
              render={<a href="https://www.linkedin.com/in/alexandersun/" target="_blank" rel="noopener noreferrer" />}
              nativeButton={false}
              variant="outline"
              className="h-auto rounded-lg border-[#E2E8F0] px-6 py-3 text-[15px] font-semibold text-[#0F172A] hover:opacity-90"
            >
              LinkedIn
            </Button>
            <Button
              render={<a href={RESUME_URL} target="_blank" rel="noopener noreferrer" />}
              nativeButton={false}
              variant="outline"
              className="h-auto rounded-lg border-[#E2E8F0] px-6 py-3 text-[15px] font-semibold text-[#0F172A] hover:opacity-90"
            >
              Resume
            </Button>
          </div>
        </section>
      </div>

      <footer className="mt-20 border-t border-[#E2E8F0] py-8 text-sm text-[#475569]">
        <div className="mx-auto flex max-w-[1080px] justify-between px-8">
          <p>Alex Sun — Product Designer</p>
          <a href="mailto:alexandersun@gmail.com" className="text-[#0F172A]">
            alexandersun@gmail.com
          </a>
        </div>
      </footer>
    </div>
  );
}
