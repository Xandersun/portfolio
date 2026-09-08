"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

import { CommandPaletteModal } from "@/components/sandbox/command-palette-modal";
import { useSandboxNotify } from "@/components/sandbox/notification-provider";
import { getActionById } from "@/lib/sandbox-actions";

/**
 * @design-spec Suite-wide keyboard shortcut bindings, mounted once at the
 * sandbox layout level so they work identically from every sandbox page:
 *   ⌘K / Ctrl+K  — toggle the command palette
 *   /            — open the command palette (ignored while typing in a field)
 *   Alt+N        — run "New Program Intake" directly, no palette needed
 * See app/sandbox/keyboard-shortcuts for the full interactive reference.
 */

interface CommandPaletteContextValue {
  open: boolean;
  openPalette: () => void;
  closePalette: () => void;
}

const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(null);

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable;
}

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const notify = useSandboxNotify();
  const [open, setOpen] = useState(false);

  const openPalette = useCallback(() => setOpen(true), []);
  const closePalette = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isModK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      const isSlash = event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey;
      const isAltN = event.altKey && event.key.toLowerCase() === "n";

      if (isModK) {
        event.preventDefault();
        setOpen((prev) => !prev);
        return;
      }

      if (isSlash && !isEditableTarget(event.target) && !open) {
        event.preventDefault();
        setOpen(true);
        return;
      }

      if (isAltN) {
        event.preventDefault();
        const action = getActionById("action-new-intake");
        action?.run({ router, notify });
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, router, notify]);

  return (
    <CommandPaletteContext.Provider value={{ open, openPalette, closePalette }}>
      {children}
      <CommandPaletteModal open={open} onClose={closePalette} />
    </CommandPaletteContext.Provider>
  );
}

export function useCommandPalette() {
  const ctx = useContext(CommandPaletteContext);
  if (!ctx) {
    throw new Error("useCommandPalette must be used within CommandPaletteProvider");
  }
  return ctx;
}
