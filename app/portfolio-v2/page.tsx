import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SiteHeader } from "@/components/SiteHeader";
import { AssistantLauncher } from "@/components/portfolio/assistant/assistant-launcher";
import { AssistantPanel } from "@/components/portfolio/assistant/assistant-panel";
import { AssistantProvider } from "@/components/portfolio/assistant/assistant-context";
import { Approach } from "@/components/sections/Approach";
import { ChildrensBooks } from "@/components/sections/ChildrensBooks";
import { Contact } from "@/components/sections/Contact";
import { Outcomes } from "@/components/sections/Outcomes";
import { SpeakingMedia } from "@/components/sections/SpeakingMedia";
import { ExperienceV2 } from "@/components/portfolio-v2/experience-v2";
import { LivingDesignSystemSection } from "@/components/portfolio-v2/living-design-system-section";

/**
 * portfolio-v2 — experimental version of the portfolio. Reuses the real
 * portfolio's own sections unmodified (Header, Outcomes, Approach,
 * SpeakingMedia, ChildrensBooks, Contact, Footer, SiteHeader, the
 * Assistant) exactly as app/page.tsx composes them. Two differences from
 * the current portfolio:
 *
 * 1. ExperienceV2 in place of Experience — an isolated copy (see
 *    components/portfolio-v2/experience-v2.tsx) that adds a "View case
 *    study" link on the Monster tile only; the original Experience.tsx is
 *    untouched.
 * 2. A new Living Design System section inserted after Experience and
 *    before Approach — right after "Places I've worked" establishes the
 *    professional-capability context, and before the more editorial
 *    Approach/Speaking/Books material.
 *
 * Nothing else about the page composition or existing sections changed.
 */
export default function PortfolioV2Home() {
  return (
    <AssistantProvider>
      <div className="flex min-h-dvh">
        <main className="min-w-0 flex-1">
          <SiteHeader />
          <div className="flex min-h-screen flex-col items-center justify-center px-6">
            <Header />
          </div>
          <Outcomes />
          <ExperienceV2 />
          <LivingDesignSystemSection />
          <Approach />
          <SpeakingMedia />
          <ChildrensBooks />
          <Contact />
          <Footer />
        </main>
        <AssistantPanel />
      </div>
      <AssistantLauncher />
    </AssistantProvider>
  );
}
