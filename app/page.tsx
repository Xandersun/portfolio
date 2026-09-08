import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SiteHeader } from "@/components/SiteHeader";
import { AssistantLauncher } from "@/components/portfolio/assistant/assistant-launcher";
import { AssistantPanel } from "@/components/portfolio/assistant/assistant-panel";
import { AssistantProvider } from "@/components/portfolio/assistant/assistant-context";
import { Approach } from "@/components/sections/Approach";
import { ChildrensBooks } from "@/components/sections/ChildrensBooks";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Outcomes } from "@/components/sections/Outcomes";
import { SpeakingMedia } from "@/components/sections/SpeakingMedia";

export default function Home() {
  return (
    <AssistantProvider>
      {/* min-w-0 lets <main> genuinely shrink for the assistant panel below,
          instead of overflowing — see AssistantPanel for how the width
          animation on the other side of this flex row works. */}
      <div className="flex min-h-dvh">
        <main className="min-w-0 flex-1">
          <SiteHeader />
          <div className="flex min-h-screen flex-col items-center justify-center px-6">
            <Header />
          </div>
          <Outcomes />
          <Experience />
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
