"use client";

import { Send, X } from "lucide-react";
import { useEffect, useRef, type FormEvent, type KeyboardEvent } from "react";

import { useAssistant } from "@/components/portfolio/assistant/assistant-context";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const SUGGESTED_QUESTIONS = [
  "Show me your AI work",
  "How do you work with engineers?",
  "What have you designed at enterprise scale?",
];

/**
 * The assistant panel — same content shell at every viewport, but the
 * outer container behaves differently by breakpoint:
 *
 *  - Wide desktop (xl+, 1280px): NOT modal, NOT an overlay. It's a normal
 *    flex sibling of <main> (see app/page.tsx) that animates its own
 *    `width` between 0 and 420px, so the portfolio content genuinely
 *    reflows to make room — no backdrop, no dimming, the portfolio stays
 *    fully interactive. (The installed shadcn Sheet is a Base UI Dialog
 *    under the hood — always a fixed-position modal with a backdrop — so
 *    it can't produce this push-layout behavior without being fought
 *    harder than it's worth; this outer shell is intentionally custom for
 *    that reason. Everything inside it — Button, Textarea, ScrollArea — is
 *    still the installed library.)
 *  - Below xl: a fixed, near-full-screen overlay that slides in from the
 *    right with a backdrop, closer to a conventional mobile sheet.
 *
 *    The switchover point is xl (1280px), not the portfolio's usual md
 *    (768px) breakpoint used everywhere else on the page. The portfolio's
 *    own sections switch to their multi-column desktop grids at md, and
 *    those grids assume something close to their full ~1152px container —
 *    if the push panel activated at md too, a 768px viewport would be left
 *    with only ~330px for <main> while its grids still tried to render in
 *    desktop mode (viewport-based media queries don't know the container
 *    shrank), producing exactly the "shift the portfolio into a tiny
 *    column" the spec says to avoid. xl leaves >=860px for <main> whenever
 *    the panel pushes, comfortably above md, so the portfolio's own grids
 *    never end up cramped into less room than they're designed for.
 *
 * Escape closes it; focus moves to the close button on open and back to
 * the launcher on close. aria-modal="false" because even the overlay
 * treatment here doesn't hard-trap focus (there's nothing usable behind
 * it to protect against, and the push-panel treatment explicitly must not
 * trap focus).
 */
export function AssistantPanel() {
  const { isOpen, close, messages, input, setInput, sendMessage, launcherRef } = useAssistant();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      wasOpenRef.current = true;
      closeButtonRef.current?.focus();

      const handleKeyDown = (event: globalThis.KeyboardEvent) => {
        if (event.key === "Escape") close();
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }

    if (wasOpenRef.current) {
      wasOpenRef.current = false;
      launcherRef.current?.focus();
    }
  }, [isOpen, close, launcherRef]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* Backdrop — overlay breakpoints only; the xl push-panel never dims the portfolio */}
      <div
        aria-hidden="true"
        onClick={close}
        className={cn(
          "fixed inset-0 z-40 bg-foreground/20 transition-opacity duration-[var(--motion-duration)] ease-in-out xl:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <div
        role="dialog"
        aria-modal="false"
        aria-label="Ask Alex — portfolio assistant"
        inert={!isOpen}
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-border bg-background shadow-2xl transition-transform duration-[var(--motion-duration)] ease-in-out sm:max-w-md",
          "xl:static xl:inset-auto xl:h-auto xl:w-0 xl:max-w-none xl:shrink-0 xl:translate-x-0 xl:overflow-hidden xl:border-l xl:shadow-none xl:transition-[width] xl:duration-[var(--motion-duration)] xl:ease-in-out",
          isOpen ? "translate-x-0 xl:w-[420px]" : "translate-x-full xl:w-0",
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border p-4 xl:w-[420px]">
          <div>
            <h2 className="portfolio-lead font-semibold text-foreground">Ask Alex</h2>
            <p className="portfolio-caption mt-1 text-muted-foreground">
              Ask about my work, experience, approach, or projects.
            </p>
          </div>
          <Button
            ref={closeButtonRef}
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={close}
            aria-label="Close assistant"
            className="shrink-0"
          >
            <X aria-hidden="true" />
          </Button>
        </div>

        <ScrollArea className="min-h-0 flex-1 xl:w-[420px]">
          <div className="flex flex-col gap-4 p-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-start gap-2">
                <p className="portfolio-caption text-muted-foreground">Suggested questions</p>
                {SUGGESTED_QUESTIONS.map((question) => (
                  <Button
                    key={question}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-auto rounded-lg py-1.5 text-left font-normal whitespace-normal"
                    onClick={() => setInput(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            ) : (
              messages.map((message) => (
                <p
                  key={message.id}
                  className="portfolio-body ml-auto max-w-[85%] rounded-lg bg-muted px-3 py-2 text-foreground"
                >
                  {message.content}
                </p>
              ))
            )}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="flex items-end gap-2 border-t border-border p-4 xl:w-[420px]">
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about my work..."
            rows={1}
            className="max-h-32 resize-none"
            aria-label="Ask a question"
          />
          <Button type="submit" size="icon" aria-label="Send" disabled={!input.trim()} className="shrink-0">
            <Send aria-hidden="true" />
          </Button>
        </form>
      </div>
    </>
  );
}
