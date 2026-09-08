"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Shared "Things to try" checklist — originally built for the Navigation &
 * Hierarchy demo, generalized here so Data & Tables can reuse the exact
 * same visual pattern and interaction model instead of a second, slightly
 * different implementation. Purely presentational: completion state is
 * computed by the caller from its own real interaction state and passed
 * in as plain data. No item here is ever user-clickable — completion is
 * always automatic.
 */
export interface ThingsToTryItem {
  key: string;
  label: string;
  description: string;
  complete: boolean;
}

const COMPLETION_ANIMATION_MS = 800;

/**
 * Tracks which item keys just flipped from incomplete to complete, so the
 * one-time completion animation can be scoped to exactly that item and
 * exactly that transition — never on mount (even if a key somehow starts
 * complete), and never on an unrelated rerender that leaves `complete`
 * unchanged. `items` is a fresh array/objects from the caller every
 * render, so this compares against a ref snapshot rather than relying on
 * referential equality.
 */
function useJustCompletedKeys(items: ThingsToTryItem[]): Set<string> {
  const previousCompleteRef = useRef<Map<string, boolean>>(new Map());
  const timeoutsRef = useRef<Map<string, number>>(new Map());
  const [justCompletedKeys, setJustCompletedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const previous = previousCompleteRef.current;
    const newlyCompleted = items.filter((item) => item.complete && previous.get(item.key) === false);

    if (newlyCompleted.length > 0) {
      setJustCompletedKeys((current) => {
        const next = new Set(current);
        for (const item of newlyCompleted) next.add(item.key);
        return next;
      });
      for (const item of newlyCompleted) {
        const existing = timeoutsRef.current.get(item.key);
        if (existing !== undefined) window.clearTimeout(existing);
        const timeoutId = window.setTimeout(() => {
          setJustCompletedKeys((current) => {
            const next = new Set(current);
            next.delete(item.key);
            return next;
          });
          timeoutsRef.current.delete(item.key);
        }, COMPLETION_ANIMATION_MS);
        timeoutsRef.current.set(item.key, timeoutId);
      }
    }

    for (const item of items) previous.set(item.key, item.complete);
  }, [items]);

  // Clear any pending animation timers on unmount only.
  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      timeouts.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  return justCompletedKeys;
}

export function ThingsToTry({ items }: { items: ThingsToTryItem[] }) {
  const justCompletedKeys = useJustCompletedKeys(items);

  return (
    <div>
      <div style={{ color: "#0F172A", fontWeight: 600, fontSize: 18, marginBottom: 12 }}>Things to try</div>
      <div role="status" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((item) => {
          const justCompleted = justCompletedKeys.has(item.key);
          return (
            <div key={item.key} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div
                aria-hidden="true"
                className="pointer-events-none select-none"
                style={{
                  flexShrink: 0,
                  width: 22,
                  height: 18,
                  marginTop: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {item.complete ? (
                  <Check
                    focusable="false"
                    className={cn("ttt-check pointer-events-none select-none", justCompleted && "ttt-check-animate")}
                    style={{ width: 20, height: 20, color: "#0d9488" }}
                    strokeWidth={3}
                  />
                ) : (
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: "#CBD5E1" }} />
                )}
              </div>
              <div
                className={cn("ttt-text", justCompleted && "ttt-text-animate")}
                style={{ minWidth: 0, borderRadius: 6 }}
              >
                <div
                  className={cn("ttt-title", justCompleted && "ttt-title-animate")}
                  style={{ fontSize: 16, fontWeight: 600, color: item.complete ? "#0F172A" : "#64748B" }}
                >
                  {item.label}
                  <span className="sr-only">{item.complete ? " — complete" : " — not yet complete"}</span>
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 400,
                    lineHeight: 1.5,
                    color: item.complete ? "#475569" : "#64748B",
                    marginTop: 4,
                  }}
                >
                  {item.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Durations below are written as literal values, not interpolated
          from COMPLETION_ANIMATION_MS: styled-jsx treats a `${}` value as
          dynamic and rewrites it through a CSS custom property, which
          doesn't reconstruct correctly inside an `animation` shorthand
          (confirmed — it silently produced `animation-duration: auto`).
          Keep these two literal 800ms values in sync with the constant
          above if the duration ever changes. */}
      <style jsx global>{`
        @media (prefers-reduced-motion: no-preference) {
          .ttt-check-animate {
            animation: ttt-check-pop 250ms ease-out;
          }
          .ttt-title-animate {
            animation: ttt-title-flash 800ms ease-out;
          }
          .ttt-text-animate {
            animation: ttt-highlight-fade 800ms ease-out;
          }
        }
        @keyframes ttt-check-pop {
          from {
            transform: scale(0.8);
            opacity: 0.5;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes ttt-title-flash {
          0% {
            color: #0f172a;
          }
          15% {
            color: #0d9488;
          }
          100% {
            color: #0f172a;
          }
        }
        @keyframes ttt-highlight-fade {
          0% {
            background-color: rgba(240, 253, 250, 0.9);
          }
          100% {
            background-color: rgba(240, 253, 250, 0);
          }
        }
      `}</style>
    </div>
  );
}
