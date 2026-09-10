"use client";

import { useState } from "react";
import { Bold, Check, Italic, List, Minus } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Portfolio illustration (not the real Capital One production UI) for the
 * "Analysis Placement" decision: AI evaluation embedded directly beside the
 * control description being authored, rather than a separate report or
 * chat surface. Clicking a criterion on the right highlights the text it
 * was evaluated against on the left — for "Frequency" (not detected),
 * there's no matching text, so selecting it instead calls out the missing
 * placeholder inline.
 */

type CriterionKey = "activity" | "ownership" | "frequency";

interface Criterion {
  key: CriterionKey;
  name: string;
  detected: boolean;
  explanation: string;
}

const CRITERIA: Criterion[] = [
  {
    key: "activity",
    name: "Control activity",
    detected: true,
    explanation: "Reviews privileged-access activity and investigates exceptions.",
  },
  {
    key: "ownership",
    name: "Ownership",
    detected: true,
    explanation: "Identifies the Security Operations team as responsible.",
  },
  {
    key: "frequency",
    name: "Frequency",
    detected: false,
    explanation: "No clear review frequency is specified.",
  },
];

function ToolbarGlyph({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <span
      aria-label={label}
      className="flex size-6 items-center justify-center rounded text-slate-400"
    >
      {children}
    </span>
  );
}

export function AnalysisPlacementIllustration() {
  const [selected, setSelected] = useState<CriterionKey>("activity");

  return (
    <div className="mx-auto w-full max-w-[1100px] overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-col md:flex-row">
        {/* LEFT — Control Description */}
        <div className="w-full border-b border-slate-200 p-6 md:w-[58%] md:border-r md:border-b-0">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-[12px] font-semibold tracking-wide text-slate-500 uppercase">
              Control Description
            </span>
            <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">Draft</span>
          </div>

          <div className="mb-2 flex items-center gap-1 border-b border-slate-100 pb-2">
            <ToolbarGlyph label="Bold">
              <Bold className="size-3.5" />
            </ToolbarGlyph>
            <ToolbarGlyph label="Italic">
              <Italic className="size-3.5" />
            </ToolbarGlyph>
            <ToolbarGlyph label="Bulleted list">
              <List className="size-3.5" />
            </ToolbarGlyph>
          </div>

          <p className="text-[14px] leading-relaxed text-slate-700">
            This control{" "}
            <span
              className={cn(
                "rounded-sm px-0.5",
                selected === "activity" && "bg-amber-100 text-slate-900",
              )}
            >
              reviews privileged-access activity across production systems and investigates any exceptions
              identified during the review
            </span>
            , performed on{" "}
            <span className="whitespace-nowrap">
              <span
                className={cn(
                  "rounded-sm border-b border-dashed border-slate-400 px-0.5 text-slate-500 italic",
                  selected === "frequency" && "border-slate-500 bg-slate-100 text-slate-700",
                )}
              >
                an unspecified basis
              </span>
              {selected === "frequency" && (
                <span className="ml-1.5 inline-block rounded bg-slate-200 px-1.5 py-0.5 align-middle text-[11px] font-medium text-slate-600">
                  Missing
                </span>
              )}
            </span>
            .{" "}
            <span
              className={cn(
                "rounded-sm px-0.5",
                selected === "ownership" && "bg-amber-100 text-slate-900",
              )}
            >
              The Security Operations team
            </span>{" "}
            is responsible for monitoring access logs and documenting findings in the case management system.
            Escalations are routed to the Information Security Officer when further evaluation is required.
          </p>
        </div>

        {/* RIGHT — AI Analysis */}
        <div className="w-full bg-slate-50/60 p-6 md:w-[42%]">
          <h4 className="mb-4 text-[16px] font-semibold text-slate-900">AI Analysis</h4>
          <p className="mb-6 text-[12px] leading-snug text-slate-500">
            This description is evaluated against 3 required criteria.
          </p>

          <div className="flex flex-col gap-2">
            {CRITERIA.map((criterion) => (
              <button
                key={criterion.key}
                type="button"
                onClick={() => setSelected(criterion.key)}
                aria-pressed={selected === criterion.key}
                className={cn(
                  "rounded-md border p-4 text-left",
                  selected === criterion.key
                    ? "border-slate-300 bg-white shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300",
                )}
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-[13px] font-semibold text-slate-800">{criterion.name}</span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium whitespace-nowrap",
                      criterion.detected ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500",
                    )}
                  >
                    {criterion.detected ? <Check className="size-3" /> : <Minus className="size-3" />}
                    {criterion.detected ? "Detected" : "Not Detected"}
                  </span>
                </div>
                <p className="text-[12px] leading-snug text-slate-500">{criterion.explanation}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
