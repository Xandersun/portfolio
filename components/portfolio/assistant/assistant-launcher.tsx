"use client";

import { MessageCircle } from "lucide-react";

import { useAssistant } from "@/components/portfolio/assistant/assistant-context";
import { Button } from "@/components/ui/button";

/**
 * Fixed bottom-right "Ask Alex" launcher. Deliberately restrained — an
 * outline button, not a filled/branded support-widget bubble. Hidden while
 * the panel is open so it never competes with the panel's own close
 * control (the panel handles restoring focus back here on close).
 */
export function AssistantLauncher() {
  const { isOpen, open, launcherRef } = useAssistant();

  if (isOpen) return null;

  return (
    <Button
      ref={launcherRef}
      type="button"
      variant="outline"
      onClick={open}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      className="fixed right-6 bottom-6 z-40 h-10 gap-2 rounded-lg border-border bg-background px-4 text-foreground shadow-none hover:bg-muted"
    >
      <MessageCircle className="size-4" aria-hidden="true" />
      Ask Alex
    </Button>
  );
}
