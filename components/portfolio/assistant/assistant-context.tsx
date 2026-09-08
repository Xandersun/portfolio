"use client";

import { createContext, useContext, useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";

/**
 * Shared state for the portfolio assistant.
 *
 * One provider, mounted once on the portfolio page, backs the floating
 * launcher/panel today and is meant to back a future inline assistant on
 * the same page too — both would call useAssistant() and share the same
 * open/closed state, message list, and input, per:
 *
 *   Floating assistant  ─┐
 *                         ├─> shared assistant state (this file)
 *   Future inline assistant ┘
 *
 * No AI integration yet. sendMessage only appends the visitor's own
 * message to the transcript so the conversation UI can be exercised
 * end to end — it never fabricates a reply.
 */

export interface AssistantMessage {
  id: string;
  role: "user";
  content: string;
}

interface AssistantContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  messages: AssistantMessage[];
  input: string;
  setInput: (value: string) => void;
  sendMessage: (text: string) => void;
  launcherRef: RefObject<HTMLButtonElement | null>;
}

const AssistantContext = createContext<AssistantContextValue | null>(null);

export function AssistantProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [input, setInput] = useState("");
  const launcherRef = useRef<HTMLButtonElement>(null);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", content: trimmed }]);
    setInput("");
  };

  return (
    <AssistantContext.Provider
      value={{
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        toggle: () => setIsOpen((prev) => !prev),
        messages,
        input,
        setInput,
        sendMessage,
        launcherRef,
      }}
    >
      {children}
    </AssistantContext.Provider>
  );
}

export function useAssistant() {
  const ctx = useContext(AssistantContext);
  if (!ctx) {
    throw new Error("useAssistant must be used within an AssistantProvider");
  }
  return ctx;
}
