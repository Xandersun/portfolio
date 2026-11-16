"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

import { AfterApp } from "./after/after-app";
import { BeforeApp } from "./before/before-app";
import { FEATURED_CASE, SECOND_CASE } from "./data";

export type ReconstructionMode = "before" | "after";

export function Reconstruction() {
  const [mode, setMode] = useState<ReconstructionMode>("before");
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [inspectorOpen, setInspectorOpen] = useState(false);

  // Before only ever opens Marisol (see before-caseload.tsx) — Anna is an
  // After-only addition, so the toolbar label should not claim she's
  // "open" while Before is actually still showing the caseload list.
  const openableInMode = mode === "before" ? [FEATURED_CASE] : [FEATURED_CASE, SECOND_CASE];
  const openCase = openableInMode.find((c) => c.participantId === selectedCaseId);

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4">
        <span className="text-xs font-medium text-[#64748B]">
          {openCase ? `Working: ${openCase.participantName} — ${openCase.caseId}` : "Demonstration caseload"}
        </span>

        <div className="flex items-center gap-2.5">
          <span className="text-[11px] font-bold tracking-[0.06em] text-[#94A3B8] uppercase">Compare</span>
          <div className="flex items-center overflow-hidden rounded-md border border-[#E2E8F0] bg-white shadow-none">
            {(["before", "after"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  "px-5 py-2 text-sm font-bold capitalize transition-colors",
                  mode === m ? "bg-[#FF5733] text-white" : "text-[#64748B] hover:text-[#0F172A]",
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full rounded-md border border-[#E2E8F0] p-0 shadow-none">
        {mode === "before" ? (
          <BeforeApp selectedCaseId={selectedCaseId} onSelectCase={setSelectedCaseId} onBack={() => setSelectedCaseId(null)} />
        ) : (
          <AfterApp
            selectedCaseId={selectedCaseId}
            onSelectCase={setSelectedCaseId}
            onBack={() => setSelectedCaseId(null)}
            inspectorOpen={inspectorOpen}
            onOpenInspector={() => setInspectorOpen(true)}
            onCloseInspector={() => setInspectorOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
