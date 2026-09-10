import { HelpCircle, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";

import { CaseStudySubsectionHeader } from "../../../_components/case-study-subsection-header";

/**
 * Static HTML/CSS recreation of the original "Analysis Placement" screenshot
 * (public/portfolio-import/images/capital-one/panels.png) — a wireframe-style
 * product mockup, not the real Capital One production UI. Rebuilt at the
 * source image's own proportions (743px design width, measured directly from
 * the source pixels) rather than reinterpreted, per this pass's brief: match
 * the original image as closely as possible, no redesign.
 */

const NAVY = "#1b3a6b";
const MUTED = "#9aa0a9";
const DESC_GRAY = "#707e92";
const BORDER = "#dbe1ea";
const SKELETON = "#d7dee8";
const INPUT_BG = "#eaf0fa";
const DETECTED_BG = "#e7eef9";
const DETECTED_TEXT = "#5b7290";
const NOT_DETECTED_BG = "#fdf0e3";
const NOT_DETECTED_TEXT = "#b5651d";

function LabelBar({ width }: { width: number }) {
  return <div className="mb-1 h-2 rounded-[2px]" style={{ width, background: SKELETON }} />;
}

function InputBox({ height = 24, className = "" }: { height?: number; className?: string }) {
  return <div className={`mb-2 rounded ${className}`} style={{ height, background: INPUT_BG }} />;
}

const REPORT_ROWS = [
  { width: 72, detected: true },
  { width: 64, detected: true },
  { width: 80, detected: true },
  { width: 60, detected: false },
  { width: 70, detected: true },
];

function StatusPill({ detected }: { detected: boolean }) {
  return (
    <span className="inline-flex shrink-0 items-center" style={{ gap: 5 }}>
      <span
        className="rounded px-2 py-[3px] text-[10px] font-bold tracking-wide uppercase"
        style={{
          background: detected ? DETECTED_BG : NOT_DETECTED_BG,
          color: detected ? DETECTED_TEXT : NOT_DETECTED_TEXT,
        }}
      >
        {detected ? "Detected" : "Not Detected"}
      </span>
      <HelpCircle className="size-3" style={{ color: MUTED }} aria-hidden="true" />
    </span>
  );
}

export function AnalysisPlacementIllustration() {
  return (
    <div className="mx-auto w-full max-w-[743px]">
      <CaseStudySubsectionHeader
        heading="AI Analysis in the Authoring Workflow"
        description="The form and the AI report live in one interface, so analysts review AI findings without disrupting their workflow."
      />

      <div className="overflow-hidden rounded-[10px] border" style={{ borderColor: "#e6e6e6" }}>
        {/* Browser chrome bar */}
      <div className="flex h-[29px] items-center gap-1.5 px-3.5" style={{ background: "#c9d0da" }}>
        <span className="size-1.5 rounded-full" style={{ background: "#9aa4b2" }} />
        <span className="size-1.5 rounded-full" style={{ background: "#9aa4b2" }} />
        <span className="size-1.5 rounded-full" style={{ background: "#9aa4b2" }} />
        <span className="ml-2.5 h-4 w-[220px] rounded-full bg-white" />
      </div>

      {/* App header */}
      <div
        className="flex items-center justify-between border-b px-4 py-2.5"
        style={{ borderColor: "#eef0f2" }}
      >
        <span className="text-[13px] font-bold" style={{ color: NAVY }}>
          Enterprise Risk Management Platform
        </span>
        <div className="flex gap-4 text-[12px]" style={{ color: MUTED }}>
          <span>Dashboard</span>
          <span>Controls</span>
          <span>Reports</span>
          <span>Settings</span>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-5" style={{ paddingTop: 28 }}>
        <h4 style={{ margin: "0 0 4px 0", fontSize: 15, fontWeight: 700, color: NAVY }}>Control Description</h4>
        <p style={{ margin: "0 0 16px 0", fontSize: 14, lineHeight: 1.55, color: DESC_GRAY }}>
          Control descriptions document the business processes and safeguards used to reduce operational and
          regulatory risk.
        </p>

        <div className="flex flex-col gap-4 md:flex-row">
          {/* LEFT — form card */}
          <div className="rounded-md border p-4 md:basis-[65%]" style={{ borderColor: BORDER }}>
            <LabelBar width={130} />
            <InputBox />
            <LabelBar width={95} />
            <InputBox />
            <div className="flex gap-4">
              <div className="flex-1">
                <LabelBar width={110} />
              </div>
              <div className="flex-1">
                <LabelBar width={110} />
              </div>
            </div>
            <div className="flex gap-4">
              <InputBox className="flex-1" />
              <InputBox className="flex-1" />
            </div>
            <LabelBar width={70} />
            <InputBox height={48} />
            <div className="flex gap-4">
              <div className="flex-1">
                <LabelBar width={110} />
              </div>
              <div className="flex-1">
                <LabelBar width={110} />
              </div>
            </div>
            <div className="flex gap-4">
              <InputBox className="flex-1" />
              <InputBox className="flex-1" />
            </div>
            <LabelBar width={70} />
            <InputBox height={66} className="mb-3" />

            <button
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              className="inline-flex cursor-default items-center gap-1.5 rounded-md px-4 py-2.5 text-[13px] font-semibold text-white"
              style={{ background: NAVY }}
            >
              <Sparkles className="size-3.5" />
              Run Analysis
            </button>
          </div>

          {/* RIGHT — AI Analysis card */}
          <div className="flex flex-col rounded-md border p-4 md:basis-[35%]" style={{ borderColor: BORDER }}>
            <h5 className="mb-2.5 text-[14px] font-bold" style={{ color: NAVY }}>
              AI Analysis
            </h5>

            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-wide uppercase" style={{ color: MUTED }}>
                AI Confidence
              </span>
              <span className="text-[12px] font-semibold" style={{ color: NAVY }}>
                Medium
              </span>
            </div>
            <div className="mb-4 h-2 rounded-[2px]" style={{ background: SKELETON }} />

            <span className="mb-2 text-[10px] font-bold tracking-wide uppercase" style={{ color: MUTED }}>
              Report
            </span>
            <div className="flex flex-col gap-2">
              {REPORT_ROWS.map((row, i) => (
                <div key={i} className="flex items-center justify-between gap-2">
                  <div className="h-2 rounded-[2px]" style={{ width: row.width, background: SKELETON }} />
                  <StatusPill detected={row.detected} />
                </div>
              ))}
            </div>

            <span className="mt-4 mb-2 text-[10px] font-bold tracking-wide uppercase" style={{ color: MUTED }}>
              Attribution
            </span>
            <div className="h-2 rounded-[2px]" style={{ background: SKELETON }} />

            <div className="flex-1" />

            <div className="flex items-center justify-between pt-4">
              <span className="text-[11px]" style={{ color: MUTED }}>
                Was this helpful?
              </span>
              <div className="flex gap-1.5">
                <span
                  className="flex size-[22px] items-center justify-center rounded border"
                  style={{ borderColor: "#e2e6ea", color: MUTED }}
                >
                  <ThumbsUp className="size-3" />
                </span>
                <span
                  className="flex size-[22px] items-center justify-center rounded border"
                  style={{ borderColor: "#e2e6ea", color: MUTED }}
                >
                  <ThumbsDown className="size-3" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
