"use client";

/**
 * portfolio-import — landing page content.
 * IMPLEMENTATION REFACTOR pass: same content/structure/visual result as
 * before, rebuilt on Tailwind utilities + existing shadcn/Base UI
 * components (Button, Badge, Card, Separator) + this route's own shared
 * components (PrimaryNav, CaseFooter, SectionHeading, MetricStat) instead
 * of a large page-specific CSS file. See ./_components/reveal.css for the
 * one piece that's deliberately still plain CSS (ancestor-gated scroll
 * animation) and ./_components/use-reveal.ts for the shared hook.
 */

import Link from "next/link";
import { Fragment } from "react";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { manrope } from "./_components/fonts";
import { useReveal } from "./_components/use-reveal";
import { PrimaryNav } from "./_components/primary-nav";
import { SectionHeading } from "./_components/section-heading";
import { MetricStat } from "./_components/metric-stat";
import "./_components/reveal.css";

const RESUME_URL =
  "https://docs.google.com/document/d/1qfTNVm7pdK8m5son9igaz1lhZs7LPSXb/edit?usp=drive_link&ouid=101666787535519743600&rtpof=true&sd=true";

interface CaseImage {
  src: string;
  alt: string;
  className?: string;
}

const CASES: {
  num: string;
  company: string;
  title: string;
  blurb: string;
  href: string;
  statValue: string;
  statLabel: string;
  images: CaseImage[];
}[] = [
  {
    num: "01",
    company: "Monster Government Solutions",
    title: "Modernizing a live enterprise platform.",
    blurb:
      "I modernized a mature case-management platform, simplifying the navigation, data-heavy screens, and complex forms while creating patterns we could reuse across the product.",
    href: "/case-studies/monster-modernization",
    statValue: "100+",
    statLabel: "Legacy pages updated",
    images: [
      { src: "/portfolio-import/images/monster-government/monster-government-dashboard.png", alt: "Monster Government Solutions dashboard" },
      { src: "/portfolio-import/images/monster-government/navigation-consolidation.png", alt: "Consolidated navigation interface" },
    ],
  },
  {
    num: "02",
    company: "Capital One",
    title: "Designing human-in-the-loop AI for enterprise risk management.",
    blurb:
      "I redesigned how analysts reviewed AI-generated findings, giving them the confidence, evidence, and reasoning behind each result before they made a decision.",
    href: "/case-studies/capital-one",
    statValue: "5×",
    statLabel: "Estimated analyst review productivity",
images: [
  {
    src: "/portfolio-import/images/capital-one/panels.svg",
    alt: "Per-criteria status indicator pattern comparing certainty and analytics",
    className: "h-[420px] w-auto",
  },
  {
    src: "/portfolio-import/images/capital-one/reasoning.svg",
    alt: "Workflow diagram showing the human-in-the-loop AI review process",
    className: "h-[420px] w-auto",
  },
],
  },
  {
    num: "03",
    company: "Monster Government Solutions",
    title: "Building a recruiting platform from the ground up.",
    blurb:
      "I redesigned the recruiting workflow to bring candidate information, validation, and handoffs between systems into one experience.",
    href: "/case-studies/monster-talent",
    statValue: "5+",
    statLabel: "Enterprise system handoffs connected",
    images: [
      { src: "/portfolio-import/images/monster-talent/hiring-workflow.png", alt: "End-to-end hiring workflow diagram" },
      { src: "/portfolio-import/images/monster-talent/talent-pool-profile.png", alt: "Talent Pool candidate profile" },
    ],
  },
  {
    num: "04",
    company: "Marriott International",
    title: "Turning a $10M+ customer journey into a funded opportunity.",
    blurb:
      "I found an opportunity to simplify Bonvoy promotion registration, used the data to make the case for the redesign, and reduced the experience from six steps to two.",
    href: "/case-studies/marriott",
    statValue: "+30%",
    statLabel: "Promotional registrations",
    images: [
      { src: "/portfolio-import/images/marriott/bonvoy-account-promotions.png", alt: "Marriott Bonvoy account page showing a personalized promotion and Register button" },
      { src: "/portfolio-import/images/marriott/challenging-the-assumption.png", alt: "Diagram comparing the initial authentication assumption to the system reality" },
    ],
  },
];

const OUTCOMES = [
  { eyebrow: "Capital One", value: "5×", label: "Estimated analyst productivity" },
  { eyebrow: "Activision Blizzard", value: "40%", label: "Increase in user retention" },
  { eyebrow: "Marriott International", value: "+30%", label: "Promotional registrations" },
  { eyebrow: "Marriott International", value: "100M+", label: "Loyalty accounts merged" },
  { eyebrow: "Monster Gov. Solutions", value: "100+", label: "Legacy pages modernized" },
  { eyebrow: "Monster Gov. Solutions", value: "5+", label: "Enterprise system handoffs connected" },
];

const LEVERAGE = [
  { eyebrow: "DIRECTION", title: "Finding the opportunity", body: "Identify where design can have the greatest impact using product data, customer needs, and business priorities." },
  { eyebrow: "USER INSIGHT", title: "Understanding the why", body: "Go beyond requests and metrics to uncover the behaviors, constraints, and underlying problems driving them." },
  { eyebrow: "EXECUTION", title: "Making it buildable", body: "Turn complex requirements into clear workflows and interaction patterns that account for technical constraints from the start." },
  { eyebrow: "ALIGNMENT", title: "Getting to a shared decision", body: "Bring Product, Engineering, users, and domain experts together when priorities or constraints compete." },
];

const TIMELINE = [
  { company: "Capital One", role: "Principal UX Designer", desc: "Translated low NPS scores and direct user feedback into actionable product improvements, partnering with Product, Engineering, and Methodology." },
  { company: "Monster Government Solutions", role: "Lead UX Designer", desc: "Led product design across enterprise government platforms while managing and contributing hands-on to the design team." },
  { company: "Marriott International", role: "Senior UX Designer", desc: "Shaped digital loyalty experiences across Marriott Bonvoy, Marriott’s global rewards program." },
  { company: "Activision Blizzard", role: "Senior UX Designer", desc: "Applied behavioral design across Blizzard’s online platform, shaping large-scale systems and experiences for millions of players worldwide." },
];

const SPEAKING_LEFT = [
  { image: "/portfolio-import/images/landing/wharton.png", alt: "Wharton School", category: "Guest Speaker", title: "Wharton School", copy: "Invited to speak to a Wharton class about behavioral design and its application to game systems." },
  { image: "/portfolio-import/images/landing/blizzcon.png", alt: "BlizzCon audience", category: "Presenter", title: "BlizzCon panelist", copy: "Presented at BlizzCon across multiple years to live audiences of hundreds." },
];

const SPEAKING_RIGHT = [
  { image: "/portfolio-import/images/landing/trophy.png", alt: "StarCraft II", category: "Industry Recognition", title: "Award-winning design work", copy: "Key contributor in award-winning ranking system which led to invitation to Wharton." },
  { image: "/portfolio-import/images/landing/signing.png", alt: "International press tour", category: "International Media", title: "Global press tours", copy: "Represented Blizzard on press tours in Moscow, Beijing, Seoul, and Anaheim, discussing products and launches with international media." },
];

export function LandingContent() {
  const rootRef = useReveal<HTMLDivElement>();

  return (
    <div className={`${manrope.className} portfolio-import selection:bg-[#FF5733] selection:text-white`} ref={rootRef}>
      <a
        className="fixed top-3 left-3 z-[1000] -translate-y-[150%] bg-[#0F172A] px-3.5 py-2.5 font-bold text-white focus:translate-y-0"
        href="#top"
      >
        Skip to main content
      </a>

      <PrimaryNav
        links={[
          { label: "Case Studies", href: "#work" },
          { label: "About", href: "/about" },
        ]}
        resume={{ href: RESUME_URL }}
      />

      <main id="top">
        {/* HERO */}
        <header className="bg-[#F1F3F5] px-4 py-16 sm:px-8 md:px-[max(2rem,calc((100vw-1180px)/2))] md:py-[104px]">
          <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-start gap-12 md:grid-cols-[1fr_minmax(0,380px)] md:gap-[68px]">
            <div>
              <p className="text-sm font-bold tracking-[0.08em] text-[#FF5733] uppercase">Product Designer</p>

              <h1 className="mt-5 text-[clamp(56px,9.17vw,116px)] leading-none font-black tracking-[-0.055em] text-[#0F172A]">
                <span className="block">Designing</span>
                <span className="block">clarity</span>
                <span className="mt-3 block text-[clamp(38px,7vw,78px)] leading-[1] font-medium tracking-[-0.025em] text-[#FF5733]">
                  at enterprise scale.
                </span>
              </h1>

              <p className="mt-9 max-w-[680px] text-xl leading-[1.55] tracking-[-0.025em] text-[#334155] sm:text-[22px]">
                I bridge the gap between fragmented systems and buildable experiences, aligning
                customer insights, product strategy, design, and technical execution into a
                unified whole.
              </p>

              <ul className="mt-7 flex flex-wrap gap-2.5">
                {["Enterprise SaaS", "B2B & B2G", "Data-Dense UI", "Complex Workflows", "Design Systems", "Legacy Modernization"].map(
                  (pill) => (
                    <li key={pill}>
                      <Badge
                        variant="outline"
                        className="h-auto rounded-md border-[#E2E8F0] bg-white px-3.5 py-2.5 text-sm font-medium text-[#334155]"
                      >
                        {pill}
                      </Badge>
                    </li>
                  ),
                )}
              </ul>
            </div>

            <Card className="justify-self-stretch gap-4.5 rounded-2xl border-[#E2E8F0] bg-white p-8 shadow-none md:mt-[143px] md:w-[380px] md:justify-self-end">
              <p className="text-sm font-bold tracking-[0.08em] text-[#FF5733] uppercase">How I Work</p>

              <h3 className="text-[34px] leading-[1.12] font-extrabold tracking-[-0.035em] text-[#0F172A]">
                Success through
                <br />
                <span className="whitespace-nowrap">collaboration</span>
              </h3>

              <ul className="flex flex-col gap-4.5">
                {[
                  "I ask questions before prescribing answers",
                  "I have strong opinions held loosely",
                  "I invite different perspectives early",
                  "I care about getting the work into people's hands",
                ].map((item) => (
                  <li key={item} className="relative pl-5 text-[15px] leading-[1.5] text-[#334155]">
                    <span className="absolute top-2.5 left-px size-1.5 rounded-full bg-[#FF5733]" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </header>

        {/* LOGOS */}
        <div className="border-b border-[#E2E8F0] bg-white px-4 py-10 sm:px-8 md:px-[max(2rem,calc((100vw-1180px)/2))]">
          <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-x-11 gap-y-7">
            {["CAPITAL ONE", "MONSTER GOVERNMENT SOLUTIONS", "MARRIOTT INTERNATIONAL", "ACTIVISION BLIZZARD"].map((name) => (
              <span key={name} className="text-sm font-bold tracking-[0.06em] whitespace-nowrap text-[#64748B]">
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* CASE STUDIES */}
        <section id="work" className="bg-white px-4 py-16 sm:px-8 md:px-[max(2rem,calc((100vw-1180px)/2))] md:py-[104px]">
          <div className="mx-auto max-w-[1180px]">
            <SectionHeading
              className="reveal"
              eyebrow="Case Studies"
              heading="Selected work at a glance."
              lede="Product design across enterprise platforms, AI, recruiting, and customer experience."
            />

            {CASES.map((item) => (
              <article
                key={item.num}
                className="reveal grid grid-cols-1 gap-6 border-t border-[#E2E8F0] py-12 last:border-b md:grid-cols-[100px_1.7fr_1fr] md:gap-8"
              >
                <div className="pt-1 text-sm font-bold tracking-[0.02em] text-[#64748B]">{item.num}</div>

                <div>
                  <span className="mt-1.5 block text-sm font-bold tracking-[0.06em] text-[#FF5733] uppercase">
                    {item.company}
                  </span>

                  <h3 className="mt-3 text-[clamp(27px,3vw,32px)] leading-[1.15] font-bold tracking-[-0.04em] text-[#0F172A]">
                    {item.title}
                  </h3>

                  <p className="mt-4 max-w-[60ch] text-lg leading-[1.6] tracking-[-0.015em] text-[#334155]">
                    {item.blurb}
                  </p>

                  <Button
                    render={<Link href={item.href} />}
                    nativeButton={false}
                    variant="outline"
                    className="mt-6.5 h-11 rounded-md border-[#FF5733] px-5 text-base font-semibold text-[#FF5733] hover:bg-[#FF5733] hover:text-white"
                  >
                    View case study
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Button>
                </div>

                <div className="pt-1.5">
                  <MetricStat value={item.statValue} label={item.statLabel} />
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:col-start-2 md:col-end-4">
                  {item.images.map((img) => (
                    <img
                      key={img.src}
                      src={img.src}
                      alt={img.alt}
                      className={`block w-full rounded-sm border border-[#E2E8F0] bg-white ${img.className ?? "h-auto"}`}
                    />
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* DESIGN OUTCOMES */}
        <section className="reveal bg-[#0F172A] px-4 py-16 text-white sm:px-8 md:px-[max(2rem,calc((100vw-1180px)/2))] md:py-[104px] md:pb-[104px]">
          <div className="mx-auto max-w-[1180px]">
            <h2 className="text-[clamp(36px,4vw,44px)] leading-[1.08] font-bold tracking-[-0.045em] text-white">
              Outcomes
            </h2>

            <div className="mt-15 grid grid-cols-1 gap-x-16 gap-y-18 sm:grid-cols-2 md:grid-cols-3">
              {OUTCOMES.map((stat) => (
                <MetricStat key={`${stat.eyebrow}-${stat.label}`} tone="dark" {...stat} />
              ))}
            </div>
          </div>
        </section>

        {/* HOW I CONTRIBUTE */}
        <section id="how-i-work" className="reveal bg-[#F1F3F5] px-4 py-16 sm:px-8 md:px-[max(2rem,calc((100vw-1180px)/2))] md:py-[104px]">
          <div className="mx-auto max-w-[1180px]">
            <SectionHeading
              eyebrow="Approach"
              heading={
                <>
                  The product decisions behind
                  <br />
                  the outcomes.
                </>
              }
              lede="My contribution spans user insight, product strategy, execution, and alignment, connecting what users need with what the business and technology can deliver."
            />

            <div className="grid grid-cols-1 gap-x-[90px] md:grid-cols-2">
              {LEVERAGE.map((item, i) => (
                <Fragment key={item.title}>
                  {i % 2 === 0 && <Separator className={`col-span-full mb-7 bg-[#E2E8F0] ${i === 0 ? "" : "mt-16"}`} />}
                  <div className="mb-10 grid grid-cols-[56px_1px_1fr] gap-x-5 md:mb-0 md:grid-cols-[64px_1px_1fr] md:gap-x-7">
                    <p
                      aria-hidden="true"
                      className="row-span-full self-start text-[clamp(44px,5.5vw,64px)] leading-none font-extrabold tracking-[-0.02em] text-[#0F172A]"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <span className="row-span-full w-px bg-[#E2E8F0]" />
                    <div>
                      <p className="text-[13px] font-extrabold tracking-[0.08em] text-[#FF5733] uppercase">{item.eyebrow}</p>
                      <h3 className="mt-3.5 text-2xl leading-[1.2] font-bold tracking-[-0.035em] text-[#0F172A]">
                        {item.title}
                      </h3>
                      <p className="mt-3 max-w-[52ch] text-[17px] leading-[1.6] text-[#334155]">{item.body}</p>
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* EXPERIENCE */}
        <section id="experience" className="reveal bg-[#F8F9FA] px-4 py-16 sm:px-8 md:px-[max(2rem,calc((100vw-1180px)/2))] md:py-[104px]">
          <div className="mx-auto max-w-[1180px]">
            <SectionHeading
              eyebrow="Experience"
              heading={
                <>
                  Product design across
                  <br />
                  industries.
                </>
              }
              lede="Design experience across fintech, B2G, hospitality, and gaming, from complex enterprise platforms to global consumer products."
            />

            <div>
              {TIMELINE.map((row, i) => (
                <div key={row.company} className="relative py-6.5 pl-14 md:pl-[121px]">
                  {i < TIMELINE.length - 1 && (
                    <span
                      className="absolute top-[41px] bottom-[-41px] left-[11px] z-0 w-px -translate-x-1/2 bg-[#E2E8F0] md:left-[35px]"
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className="absolute top-[41px] left-[11px] z-10 size-[15px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#64748B] bg-[#F8F9FA] md:left-[35px]"
                    aria-hidden="true"
                  />
                  {i > 0 && (
                    <span
                      className="absolute top-0 right-0 left-14 h-px bg-[#E2E8F0] md:left-[121px] md:right-[300px]"
                      aria-hidden="true"
                    />
                  )}
                  <p className="text-xl font-semibold tracking-[-0.025em] text-[#0F172A]">
                    <span className="font-bold text-[#FF5733]">{row.company}</span> — {row.role}
                  </p>
                  <p className="mt-2.5 max-w-[64ch] text-[17px] leading-[1.6] text-[#334155]">{row.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SPEAKING & MEDIA */}
        <section id="speaking" className="bg-white px-5 py-16 sm:py-24 md:py-[88px]">
          <div className="mx-auto w-[min(calc(100%-40px),1116px)]">
            <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-[220px_minmax(0,1fr)] md:gap-10">
              <p className="mt-0 text-sm font-bold tracking-[0.06em] text-[#FF5733] uppercase md:mt-1.5">
                Speaking &amp; Media
              </p>

              <div>
                <h2 className="max-w-[850px] text-[clamp(38px,4vw,48px)] leading-[1.08] font-bold tracking-[-0.035em] text-[#0F172A]">
                  Speaking, media, and industry recognition
                </h2>
                <p className="mt-4 max-w-[720px] text-lg leading-[1.55] text-[#334155]">
                  Experience presenting to academic, industry, media, and large public audiences.
                </p>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-12 md:mt-16 md:grid-cols-2">
              {[
                { title: "Subject Matter Expert", items: SPEAKING_LEFT },
                { title: "Media & Recognition", items: SPEAKING_RIGHT },
              ].map((column) => (
                <div key={column.title} className="border-t border-[#E2E8F0]">
                  <h3 className="border-b border-[#E2E8F0] py-3.5 text-xl leading-[1.2] font-bold tracking-[-0.02em] text-[#0F172A]">
                    {column.title}
                  </h3>

                  {column.items.map((item) => (
                    <article
                      key={item.title}
                      className="grid grid-cols-[112px_minmax(0,1fr)] items-start gap-5 border-b border-[#E2E8F0] py-6 sm:grid-cols-[136px_minmax(0,1fr)] sm:gap-7"
                    >
                      <img
                        src={item.image}
                        alt={item.alt}
                        className="block size-28 rounded-lg bg-[#E8ECF2] object-cover sm:size-[136px]"
                      />
                      <div className="pt-0.5">
                        <p className="mt-0.5 mb-1.5 text-[13px] font-bold tracking-[0.03em] text-[#FF5733] uppercase">
                          {item.category}
                        </p>
                        <h4 className="mb-2 text-[22px] leading-[1.18] font-bold tracking-[-0.025em] text-[#0F172A]">
                          {item.title}
                        </h4>
                        <p className="text-base leading-[1.5] text-[#64748B]">{item.copy}</p>
                      </div>
                    </article>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* INDEPENDENT PROJECT */}
        <section id="project" className="reveal bg-white px-4 py-16 sm:px-8 md:px-[max(2rem,calc((100vw-1180px)/2))] md:py-[104px]">
          <div className="mx-auto max-w-[1180px]">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[220px_1fr] md:gap-10">
              <p className="text-sm font-bold tracking-[0.08em] text-[#FF5733] uppercase">Independent project</p>

              <div>
                <h2 className="text-[clamp(36px,4vw,44px)] leading-[1.08] font-bold tracking-[-0.045em] text-[#0F172A]">
                  Children&apos;s Books &amp; Website
                </h2>
                <p className="mt-4.5 max-w-[52ch] text-xl leading-[1.55] tracking-[-0.02em] text-[#334155]">
                  I created an independent children&apos;s publishing brand spanning books, visual
                  identity, a marketing site, AI-assisted illustration, promotional materials,
                  event design, activity pages, and 3D-printed booth elements.
                </p>

                <div className="mt-5.5 flex flex-wrap gap-2">
                  {["Visual Design", "Marketing", "Physical Experience", "Writing"].map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="h-auto rounded-full border-[#E2E8F0] bg-[#F8F9FA] px-3 py-1.5 text-sm font-medium text-[#334155]"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <img
                  src="/portfolio-import/images/mrsunsbooks/fables-parables-banner.png"
                  alt="Fables, Parables & Silly Tales with Morals banner for Mr. Sun's Books"
                  className="mt-6 block rounded-sm border border-[#E2E8F0] bg-white"
                />

                <Button
                  render={<a href="https://www.mrsunsbooks.com" target="_blank" rel="noopener noreferrer" />}
                  nativeButton={false}
                  variant="outline"
                  className="mt-6.5 h-11 rounded-md border-[#FF5733] px-5 text-base font-semibold text-[#FF5733] hover:bg-[#FF5733] hover:text-white"
                >
                  View website
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section
          id="contact"
          className="reveal bg-[#F8F9FA] px-4 py-16 sm:px-8 md:px-[max(2rem,calc((100vw-1180px)/2))] md:py-24"
        >
          <div className="mx-auto max-w-[1180px]">
            <h2 className="text-[clamp(36px,4vw,44px)] leading-[1.08] font-bold tracking-[-0.045em] text-[#0F172A]">
              Get in touch.
            </h2>
            <p className="mt-3.5 max-w-[46ch] text-lg leading-[1.5] text-[#64748B]">
              Open to Senior and Lead Product Design roles.
            </p>

            <div className="mt-8 flex flex-col flex-wrap items-start gap-3.5 sm:flex-row sm:items-center">
              <Button
                render={<a href="mailto:alexandersun@gmail.com" />}
                nativeButton={false}
                className="h-auto rounded-md bg-[#0F172A] px-5 py-3.5 text-base font-semibold text-white hover:bg-[#FF5733]"
              >
                Email me
              </Button>

              <Button
                render={<a href="https://www.linkedin.com/in/alexandersun/" target="_blank" rel="noopener noreferrer" />}
                nativeButton={false}
                variant="outline"
                className="h-auto rounded-md border-[#E2E8F0] px-5 py-3.5 text-base font-semibold text-[#0F172A] hover:border-[#FF5733] hover:text-[#FF5733]"
              >
                LinkedIn
              </Button>

              <Button
                render={<a href={RESUME_URL} target="_blank" rel="noopener noreferrer" />}
                nativeButton={false}
                variant="outline"
                className="h-auto rounded-md border-[#E2E8F0] px-5 py-3.5 text-base font-semibold text-[#0F172A] hover:border-[#FF5733] hover:text-[#FF5733]"
              >
                Resume
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#E2E8F0] bg-[#F8F9FA] px-4 py-8.5 sm:px-8 md:px-[max(2rem,calc((100vw-1180px)/2))]">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-3">
          <p className="text-[15px] text-[#64748B]">© 2026 Alex Sun</p>

          <ul className="flex gap-5 text-[15px] text-[#334155]">
            <li>
              <a href="#work" className="hover:text-[#FF5733]">
                Case Studies
              </a>
            </li>
            <li>
              <Link href="/about" className="hover:text-[#FF5733]">
                About
              </Link>
            </li>
            <li>
              <a href={RESUME_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[#FF5733]">
                Resume
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
