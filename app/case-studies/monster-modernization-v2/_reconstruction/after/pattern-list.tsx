"use client";

/**
 * Shared "pattern card" UI — extracted from Navigation & Hierarchy's and
 * Data & Tables' explanatory areas, which rendered visually identical
 * card markup/styles independently (Navigation patterns / Data patterns).
 * PatternList renders a subsection heading plus a compact vertical stack
 * of PatternCards; PatternsSection additionally reuses the same
 * Patterns | Things to try two-column layout both demos were duplicating,
 * pairing a PatternList with the shared ThingsToTry component. Each demo
 * still supplies its own heading and pattern data — only the presentation
 * is shared.
 */

import type { ReactNode } from "react";

import { ThingsToTry, type ThingsToTryItem } from "./things-to-try";

export interface PatternItem {
  title: string;
  description: string;
  icon: ReactNode;
}

/** [icon]  Title / Description — description always below the title, never inline beside it. */
export function PatternCard({ title, description, icon }: PatternItem) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        paddingInline: 16,
        paddingBlock: 14,
        borderRadius: 8,
        border: "1px solid #E2E8F0",
        background: "#FFFFFF",
      }}
    >
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 28,
          height: 28,
          borderRadius: 6,
          background: "#F0FDFA",
          color: "#0f766e",
        }}
      >
        {icon}
      </div>
      <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ color: "#0F172A", fontWeight: 600, fontSize: 14 }}>{title}</div>
        <span style={{ fontSize: 14, fontWeight: 400, lineHeight: 1.4, color: "#475569" }}>{description}</span>
      </div>
    </div>
  );
}

/** A subsection heading plus a compact, capped-width stack of PatternCards. */
export function PatternList({ heading, items, maxWidth = 460 }: { heading: string; items: PatternItem[]; maxWidth?: number }) {
  return (
    <div>
      <div style={{ color: "#0F172A", fontWeight: 700, fontSize: 18, marginBottom: 12 }}>{heading}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth }}>
        {items.map((item) => (
          <PatternCard key={item.title} {...item} />
        ))}
      </div>
    </div>
  );
}

/**
 * The full "Patterns | Things to try" two-column composition — the other
 * piece Navigation and Data were duplicating verbatim. Both tracks are
 * content-sized (`auto`, not `fr`) so the two areas read as one related,
 * intentionally-grouped region instead of being stretched to opposite
 * sides of the container — any leftover width falls to the right of the
 * grid, not into the gap between the two columns. `patternsMaxWidth` /
 * `thingsToTryMaxWidth` / `gap` let a caller tune proportions for its own
 * content without forking this component; they don't need to match
 * between callers.
 */
export function PatternsSection({
  heading,
  items,
  checklist,
  patternsMaxWidth = 460,
  thingsToTryMaxWidth = 440,
  gap = 56,
}: {
  heading: string;
  items: PatternItem[];
  checklist: ThingsToTryItem[];
  patternsMaxWidth?: number;
  thingsToTryMaxWidth?: number;
  gap?: number;
}) {
  return (
    <div className="patterns-section-columns" style={{ marginTop: 32, display: "grid", gridTemplateColumns: "auto auto", justifyContent: "start", gap, alignItems: "start" }}>
      <PatternList heading={heading} items={items} maxWidth={patternsMaxWidth} />
      <div style={{ maxWidth: thingsToTryMaxWidth }}>
        <ThingsToTry items={checklist} />
      </div>
      <style jsx>{`
        @media (max-width: 1000px) {
          .patterns-section-columns {
            grid-template-columns: 1fr !important;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
