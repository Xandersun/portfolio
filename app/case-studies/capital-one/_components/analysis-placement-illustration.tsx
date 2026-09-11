import { HelpCircle, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";

/**
 * Static HTML/CSS recreation of the original "Analysis Placement" screenshot
 * (public/portfolio-import/images/capital-one/panels.png) — a wireframe-style
 * product mockup, not the real Capital One production UI. Proportions were
 * originally measured from the source image's own 743px design width; this
 * component renders width-agnostic now (no width/max-width of its own) so
 * its actual size is set entirely by the shared wrapper at the call site
 * (capital-one-content.tsx) — currently 1100px.
 */

// Text-color tiers match the Legacy case study's own hierarchy verbatim
// (app/case-studies/monster-modernization/_living-system/lds-light-embed.tsx's
// antd ConfigProvider tokens: colorText/colorTextSecondary/colorTextTertiary —
// Legacy has no exported JS constant for these, just hand-copied hex at each
// call site, so these mirror that same pattern with the same values rather
// than inventing a new palette). RUN_ANALYSIS_BG/_HOVER are Capital One's own
// blue, consistent with the blue tones already used throughout this mockup
// (INPUT_BG, DETECTED_BG/TEXT below) — deliberately not Legacy's teal.
const RUN_ANALYSIS_BG = "#315B8A";
const RUN_ANALYSIS_BG_HOVER = "#284D76";
const PRIMARY_TEXT = "#0F172A";
const SECONDARY_TEXT = "#334155";
const MUTED = "#475569";
const BORDER = "#E2E8F0";
const SKELETON = "#d7dee8";
const INPUT_BG = "#eaf0fa";
const DETECTED_BG = "#e7eef9";
const DETECTED_TEXT = "#5b7290";
const NOT_DETECTED_BG = "#fdf0e3";
const NOT_DETECTED_TEXT = "#b5651d";

// Exact typography for the AI Confidence / Report / Attribution section
// labels and their "Learn more" links, so Learn more stays unambiguously
// subordinate to the label above it (smaller, lighter weight, no caps).
const SECTION_LABEL_STYLE: React.CSSProperties = {
  fontSize: 12,
  lineHeight: "16px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: MUTED,
};
const LEARN_MORE_STYLE: React.CSSProperties = {
  fontSize: 11,
  lineHeight: "16px",
  fontWeight: 400,
  textDecoration: "none",
  color: MUTED,
};

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
        className="rounded px-2 py-[3px] text-[11px] font-bold tracking-wide uppercase"
        style={{
          background: detected ? DETECTED_BG : NOT_DETECTED_BG,
          color: detected ? DETECTED_TEXT : NOT_DETECTED_TEXT,
        }}
      >
        {detected ? "Detected" : "Not Detected"}
      </span>
      {/* Always the same blue, regardless of status — the question mark
          represents one consistent help/info action, not the row's own
          Detected/Not Detected state, so it deliberately does not switch
          to NOT_DETECTED_TEXT the way the badge itself does above. */}
      <HelpCircle className="size-3.5" style={{ color: DETECTED_TEXT }} aria-hidden="true" />
    </span>
  );
}

export function AnalysisPlacementMockup() {
  return (
      <div className="overflow-hidden rounded-[10px] border" style={{ borderColor: "#e6e6e6" }}>
        {/* Content */}
      <div className="px-4 pb-5" style={{ paddingTop: 24 }}>
        <h4 style={{ margin: "0 0 4px 0", fontSize: 16, fontWeight: 600, color: PRIMARY_TEXT }}>Control Description</h4>
        <p style={{ margin: "0 0 16px 0", fontSize: 13, lineHeight: 1.5, fontWeight: 400, color: SECONDARY_TEXT }}>
          Complete the form below to describe the control.
        </p>

        <div className="flex flex-col gap-4 md:flex-row">
          {/* LEFT — form card */}
          <div className="flex flex-col rounded-md border p-4 md:basis-[65%]" style={{ borderColor: BORDER }}>
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

            {/* Sized to match Legacy's own bespoke primary button (the
                "Submit" CTA in forms-workflows-panel.tsx: height 40,
                paddingInline 20, borderRadius 8, fontSize 14, fontWeight
                600) — background stays Capital One's own blue rather than
                Legacy's teal. Icon+gap are added since Legacy's own
                reference button has no icon (sized to match Legacy's
                smaller icon-button link text, gap 6). This button is a
                decorative mockup element (aria-hidden, no onClick); the
                hover rule below still applies on real mouse hover since
                :hover isn't gated on interactivity. */}
            <button
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              className="mt-auto w-fit cursor-default text-white run-analysis-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: 40,
                paddingLeft: 20,
                paddingRight: 20,
                gap: 6,
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                background: RUN_ANALYSIS_BG,
              }}
            >
              <Sparkles size={16} style={{ width: 16, height: 16 }} aria-hidden="true" />
              Run Analysis
            </button>
            <style jsx>{`
              .run-analysis-btn:hover {
                background: ${RUN_ANALYSIS_BG_HOVER};
              }
            `}</style>
          </div>

          {/* RIGHT — AI Analysis card */}
          <div className="flex flex-col rounded-md border p-4 md:basis-[35%]" style={{ borderColor: BORDER }}>
            <h5 className="mb-3 text-[16px] font-semibold" style={{ color: PRIMARY_TEXT }}>
              AI Analysis
            </h5>

            <span className="mb-2" style={SECTION_LABEL_STYLE}>
              AI Confidence
            </span>
            <div className="mb-1.5 h-2 rounded-[2px]" style={{ background: INPUT_BG }} />
            <span className="mb-5" style={LEARN_MORE_STYLE}>
              Learn more
            </span>

            <span className="mb-2" style={SECTION_LABEL_STYLE}>
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

            <span className="mt-4 mb-2" style={SECTION_LABEL_STYLE}>
              Attribution
            </span>
            <div className="mb-1.5 w-full rounded-[2px]" style={{ background: INPUT_BG, height: 42 }} />
            <span className="mb-5" style={LEARN_MORE_STYLE}>
              Learn more
            </span>

            <div className="flex-1" />

            <div className="flex items-center justify-between pt-4">
              <span className="text-[12px]" style={{ color: MUTED }}>
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
  );
}
