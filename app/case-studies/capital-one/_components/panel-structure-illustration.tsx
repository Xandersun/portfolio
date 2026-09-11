"use client";

import { useEffect, useRef, useState } from "react";
import { HelpCircle, ThumbsDown, ThumbsUp } from "lucide-react";
import { AnimatedCursor, CURSOR_HIDE_DELAY_AFTER_CLICK, type Point } from "./analysis-placement-illustration-animated";

/**
 * TEMPORARY — local-only HTML replacement candidate for the "Panel
 * Structure" PNG (before-after-detected-placement.png), shown directly
 * below the existing image for comparison. Static only: no cursor, no
 * animation, no Replay — that's a later decision once the visual design
 * itself is approved.
 *
 * The PNG is a content/information-architecture reference only for the
 * product UI (which sections exist, what belongs in each) — not a visual
 * reference. Product-UI styling follows the approved animated Capital One
 * mockup / Legacy design system.
 *
 * The one exception is the annotation BRACKET system below: per an explicit
 * later request, its geometry (vertical bracket spanning a section, top/
 * bottom ticks pointing at the panel, a center leader pointing at the
 * annotation) is deliberately modeled on the PNG's own bracket structure —
 * everything else about the PNG (its typography, spacing, colors) is still
 * not used as a reference anywhere in this file.
 *
 * Tokens/sub-components mirror analysis-placement-illustration-animated.tsx
 * (same hex values, same StatusPill/question-mark treatment) but are
 * re-declared locally rather than imported, so nothing here can affect that
 * already-approved, animated mockup.
 */

// Exported: reused directly by per-criterion-analysis-illustration.tsx (and
// any future Capital One SaaS-style illustration in this same route) rather
// than being re-declared per file. The approved animated mockup is a
// separate, untouched file and does not import from here.
export const PRIMARY_TEXT = "#0F172A";
export const SECONDARY_TEXT = "#334155";
export const MUTED = "#475569";
export const BORDER = "#E2E8F0";
export const INPUT_BG = "#eaf0fa";
// Neutral (not blue-tinted) row surface — kept distinct from the badge's own
// DETECTED_BG blue so the badge still reads as its own chip on the row,
// rather than blending into it. Exported so other illustrations reuse this
// same light-neutral surface instead of inventing a new one.
export const ROW_SURFACE = "#F8FAFC";
export const DETECTED_BG = "#e7eef9";
export const DETECTED_TEXT = "#5b7290";
export const NOT_DETECTED_BG = "#fdf0e3";
export const NOT_DETECTED_TEXT = "#b5651d";
// Bracket lines use their own lighter slate — intentionally decoupled from
// DETECTED_TEXT (still used for question-mark icons/badges) so brackets can
// be lightened without affecting that UI.
export const CONNECTOR_COLOR = "#94a3b8";

// Sized for a comfortable, realistic enterprise-product scale — not scaled
// down to match the small original Panel Structure screenshot.
export const ENTERPRISE_FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
export const SECTION_LABEL_STYLE: React.CSSProperties = {
  fontSize: 12,
  lineHeight: "16px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "#64748b",
};
// "Medium" keeps the pre-existing interactive blue (out of scope for this
// pass — only Learn more / utility-link color was requested to change).
export const INTERACTIVE_BLUE = "#315B8A";
// Enterprise Blue action-element color (distinct from the muted body/label
// tokens above and from INTERACTIVE_BLUE) — used for "Learn more" and other
// interactive utility text specifically.
export const ACTION_BLUE = "#2563eb";
export const LEARN_MORE_STYLE: React.CSSProperties = {
  fontSize: 12,
  lineHeight: "16px",
  fontWeight: 500,
  textDecoration: "none",
  color: ACTION_BLUE,
  display: "block",
};
// Shared surface for both AI Confidence's explanation and Attribution's
// reference — one component so the two are guaranteed to stay identical
// rather than two hand-maintained copies of the same style.
export const INFO_BOX_TEXT_STYLE: React.CSSProperties = {
  fontSize: 13,
  lineHeight: "21px",
  fontWeight: 400,
  color: SECONDARY_TEXT,
};

const REPORT_ROWS = [
  { label: "Access control review", detected: true },
  { label: "Third-party vendor", detected: true },
  { label: "Data retention", detected: false },
  { label: "Access logging", detected: true },
  { label: "Incident response", detected: false },
];

// PanelStructureIllustration's own cursor + thumbs-up click, timed from the
// moment the illustration enters the viewport (not page load). Mirrors the
// same "thumbs-up beat" already approved in
// analysis-placement-illustration-animated.tsx's AnalysisPlacementMockupAnimated
// (same AnimatedCursor, same press/selected treatment on the button) — just
// triggered by scroll-into-view instead of chained onto that file's own
// Run Analysis sequence, and with this task's own timing.
const VIEWPORT_ENTRY_DELAY = 10000; // before the cursor appears at all
const CURSOR_MOVE_DURATION = 900;
const HOVER_PAUSE_DURATION = 250;
const CLICK_PRESS_DURATION = 180;

export function StatusPill({ detected, showInspect = true }: { detected: boolean; showInspect?: boolean }) {
  return (
    <span className="inline-flex shrink-0 items-center" style={{ gap: 6 }}>
      <span
        className="rounded px-2 py-[3px] tracking-wide uppercase"
        style={{
          fontSize: 12,
          lineHeight: "16px",
          fontWeight: 600,
          background: detected ? DETECTED_BG : NOT_DETECTED_BG,
          color: detected ? DETECTED_TEXT : NOT_DETECTED_TEXT,
        }}
      >
        {detected ? "Detected" : "Not Detected"}
      </span>
      {/* ~16px — comfortably visible without competing with the badge. The
          same "? inspect" treatment reused wherever deeper supporting info
          could be inspected — not redrawn per call site. Optional per call
          site (showInspect=false) for contexts that don't want it. */}
      {showInspect && <HelpCircle className="size-4" style={{ color: DETECTED_TEXT }} aria-hidden="true" />}
    </span>
  );
}

// The "Was this helpful?" feedback row from this panel's own footer,
// extracted so other Capital One illustrations reuse this exact
// implementation (typography, icon size, button size, spacing, divider)
// instead of rebuilding it. Static/decorative by default — no hover/focus
// states are defined here, so plain reuse (per-criterion-analysis's own
// <FeedbackRow />, with no props) renders byte-identical to before.
//
// thumbsUpRef/thumbsUpSelected/thumbsUpPressed (and the equivalent
// thumbsDown* props) are optional, only used by a caller's own cursor+click
// animation (see PanelStructureIllustration's runThumbsUpSequence and
// ConfidenceDesignComparisonIllustration's own thumbs-up/thumbs-down beats)
// to expose either button for positioning and to drive its selected/pressed
// visual state — the same scale+border+background treatment already used
// for the thumbs-up beat in
// analysis-placement-illustration-animated.tsx's AnalysisPlacementMockupAnimated,
// reused here (for both buttons) rather than inventing a new "selected"
// treatment. Omitted entirely, every prop defaults to the original static
// appearance, so existing plain reuse (<FeedbackRow />, no props) stays
// byte-identical.
export function FeedbackRow({
  thumbsUpRef,
  thumbsUpSelected = false,
  thumbsUpPressed = false,
  thumbsDownRef,
  thumbsDownSelected = false,
  thumbsDownPressed = false,
}: {
  thumbsUpRef?: React.RefObject<HTMLSpanElement | null>;
  thumbsUpSelected?: boolean;
  thumbsUpPressed?: boolean;
  thumbsDownRef?: React.RefObject<HTMLSpanElement | null>;
  thumbsDownSelected?: boolean;
  thumbsDownPressed?: boolean;
} = {}) {
  return (
    <div
      className="flex items-center justify-between"
      style={{ marginTop: 24, paddingTop: 16, borderTop: `1px solid ${BORDER}` }}
    >
      <span style={{ fontSize: 14, lineHeight: "20px", fontWeight: 400, color: MUTED, opacity: 1 }}>
        Was this helpful?
      </span>
      <div className="flex gap-2">
        <span
          ref={thumbsUpRef}
          className="flex size-[32px] items-center justify-center rounded border"
          style={{
            borderColor: thumbsUpSelected ? INTERACTIVE_BLUE : "#e2e6ea",
            background: thumbsUpSelected ? INTERACTIVE_BLUE : "transparent",
            color: thumbsUpSelected ? "#FFFFFF" : MUTED,
            transform: thumbsUpPressed ? "scale(0.9)" : "scale(1)",
            transition: "background 150ms ease, border-color 150ms ease, color 150ms ease, transform 100ms ease",
          }}
        >
          <ThumbsUp className="size-[18px]" />
        </span>
        <span
          ref={thumbsDownRef}
          className="flex size-[32px] items-center justify-center rounded border"
          style={{
            borderColor: thumbsDownSelected ? INTERACTIVE_BLUE : "#e2e6ea",
            background: thumbsDownSelected ? INTERACTIVE_BLUE : "transparent",
            color: thumbsDownSelected ? "#FFFFFF" : MUTED,
            transform: thumbsDownPressed ? "scale(0.9)" : "scale(1)",
            transition: "background 150ms ease, border-color 150ms ease, color 150ms ease, transform 100ms ease",
          }}
        >
          <ThumbsDown className="size-[18px]" />
        </span>
      </div>
    </div>
  );
}

// Shared surface used for both the AI Confidence explanation and the
// Attribution reference — same background, border radius, padding, and
// typography so the two are visually identical, not just similar.
// learnMore defaults on (this file's own two call sites both want it) but
// can be turned off so other illustrations can reuse the exact same surface
// without inheriting a link they didn't ask for.
export function InfoBox({ children, learnMore = true }: { children: React.ReactNode; learnMore?: boolean }) {
  return (
    <div className="rounded-md" style={{ marginTop: 10, padding: "16px 18px", background: INPUT_BG }}>
      <span style={{ ...INFO_BOX_TEXT_STYLE, margin: 0, display: "block" }}>{children}</span>
      {learnMore && (
        <span className="ps-learn-more" style={{ ...LEARN_MORE_STYLE, marginTop: 8, marginBottom: 0 }}>
          Learn more
        </span>
      )}
    </div>
  );
}

// ---- Annotation bracket system --------------------------------------
// Modeled on the original PNG's own bracket geometry (per an explicit later
// request — the only part of this file that still uses the PNG as a visual
// reference). Each bracket's vertical span and each annotation's vertical
// position are measured from the actual rendered panel sections, not
// hand-guessed, so they track the real (now much taller) product UI.

export const GAP_PANEL_TO_BRACKET = 32;
export const TICK_LENGTH = 10;
export const LEADER_LENGTH = 28;
export const GAP_LEADER_TO_TEXT = 12;
export const BRACKET_STROKE = 1.5;
export const RAIL_WIDTH = GAP_PANEL_TO_BRACKET + LEADER_LENGTH + GAP_LEADER_TO_TEXT; // 72
export const ANNOTATION_MAX_WIDTH = 340;
export const ANNOTATION_HEADING_HALF_LINE = 11; // half of the 22px heading line-height

export type SectionMetrics = { top: number; height: number };

// A single "]"-shaped bracket: a vertical line spanning the section, short
// ticks at top/bottom pointing left (toward the panel), and a center leader
// pointing right (toward the annotation). No arrows, dots, or floating rules.
// Exported so other Capital One illustrations reuse this exact
// implementation ("#94a3b8", 32px gap) instead of rebuilding it.
export function Bracket({ metrics }: { metrics: SectionMetrics }) {
  const lineX = GAP_PANEL_TO_BRACKET;
  const midY = metrics.height / 2;
  return (
    <svg
      aria-hidden="true"
      width={GAP_PANEL_TO_BRACKET + LEADER_LENGTH}
      height={metrics.height}
      style={{ position: "absolute", left: 0, top: metrics.top, overflow: "visible" }}
    >
      <path
        d={`M ${lineX - TICK_LENGTH} 0 L ${lineX} 0 L ${lineX} ${metrics.height} L ${lineX - TICK_LENGTH} ${metrics.height}`}
        fill="none"
        stroke={CONNECTOR_COLOR}
        strokeWidth={BRACKET_STROKE}
      />
      <line
        x1={lineX}
        y1={midY}
        x2={lineX + LEADER_LENGTH}
        y2={midY}
        stroke={CONNECTOR_COLOR}
        strokeWidth={BRACKET_STROKE}
      />
    </svg>
  );
}

export function Annotation({
  metrics,
  heading,
  children,
}: {
  metrics: SectionMetrics;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: metrics.top + metrics.height / 2 - ANNOTATION_HEADING_HALF_LINE,
        maxWidth: ANNOTATION_MAX_WIDTH,
      }}
    >
      <h6 style={{ margin: "0 0 4px 0", fontSize: 16, lineHeight: "22px", fontWeight: 600, color: PRIMARY_TEXT }}>
        {heading}
      </h6>
      <p style={{ margin: 0, fontSize: 14, lineHeight: "21px", fontWeight: 400, color: SECONDARY_TEXT }}>
        {children}
      </p>
    </div>
  );
}

// The LEFT-column "AI Analysis" panel card, extracted so other Capital One
// illustrations (per-criterion's own pre-modal "report" state) reuse this
// exact panel instead of rebuilding it. The three section refs are optional
// and exist only so this panel's own bracket system (below) can still
// measure them when rendered inside PanelStructureIllustration itself.
// highlightRowRef is a second, unrelated optional ref — placed on the
// "Access control review" row's StatusPill wrapper specifically — so a
// caller elsewhere (per-criterion's cursor overlay) can measure exactly
// where that one row's "?" sits without this component knowing anything
// about cursors or overlays. panelRef (on this component's own root) and
// thumbsUpRef/thumbsUpSelected/thumbsUpPressed (forwarded straight through
// to FeedbackRow) exist for the same reason, for PanelStructureIllustration's
// own cursor+thumbs-up animation.
export function AIAnalysisPanel({
  panelRef,
  aiConfidenceRef,
  reportRef,
  attributionRef,
  highlightRowRef,
  thumbsUpRef,
  thumbsUpSelected,
  thumbsUpPressed,
}: {
  panelRef?: React.Ref<HTMLDivElement>;
  aiConfidenceRef?: React.RefObject<HTMLDivElement | null>;
  reportRef?: React.RefObject<HTMLDivElement | null>;
  attributionRef?: React.RefObject<HTMLDivElement | null>;
  highlightRowRef?: React.RefObject<HTMLSpanElement | null>;
  thumbsUpRef?: React.RefObject<HTMLSpanElement | null>;
  thumbsUpSelected?: boolean;
  thumbsUpPressed?: boolean;
} = {}) {
  return (
    <div ref={panelRef} className="overflow-hidden rounded-[10px] border p-4" style={{ borderColor: "#e6e6e6" }}>
      <h4
        style={{
          margin: "0 0 18px 0",
          fontSize: 18,
          lineHeight: "26px",
          fontWeight: 600,
          letterSpacing: "-0.01em",
          color: PRIMARY_TEXT,
        }}
      >
        AI Analysis
      </h4>

      <div ref={aiConfidenceRef}>
        <div className="flex items-center justify-between">
          <span style={SECTION_LABEL_STYLE}>AI Confidence</span>
          <span style={{ fontSize: 15, lineHeight: "20px", fontWeight: 700, color: INTERACTIVE_BLUE }}>Medium</span>
        </div>
        <InfoBox>
          The Device ID could not be verified as trusted. This evaluation may be incomplete or incorrect.
        </InfoBox>
      </div>

      <div ref={reportRef} style={{ marginTop: 24 }}>
        <span style={SECTION_LABEL_STYLE}>Report</span>
        <div className="flex flex-col gap-2" style={{ marginTop: 10 }}>
          {REPORT_ROWS.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-3 rounded-md"
              style={{ background: ROW_SURFACE, padding: "0 12px", minHeight: 44 }}
            >
              <span style={{ fontSize: 13, lineHeight: "20px", fontWeight: 400, color: PRIMARY_TEXT }}>
                {row.label}
              </span>
              <span ref={row.label === "Access control review" ? highlightRowRef : undefined}>
                <StatusPill detected={row.detected} />
              </span>
            </div>
          ))}
        </div>
      </div>

      <div ref={attributionRef} style={{ marginTop: 24 }}>
        <span style={SECTION_LABEL_STYLE}>Attribution</span>
        <InfoBox>Enterprise Risk Policy v2026.04</InfoBox>
      </div>

      <FeedbackRow thumbsUpRef={thumbsUpRef} thumbsUpSelected={thumbsUpSelected} thumbsUpPressed={thumbsUpPressed} />
    </div>
  );
}

export function PanelStructureIllustration() {
  const layoutRef = useRef<HTMLDivElement>(null);
  const aiConfidenceRef = useRef<HTMLDivElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  const attributionRef = useRef<HTMLDivElement>(null);

  // Cursor + thumbs-up click — see the timing constants and the
  // IntersectionObserver effect below. panelRef is the AI Analysis panel's
  // own root, used only to compute the cursor's neutral starting position;
  // thumbsUpRef is the actual button the cursor moves to.
  const panelRef = useRef<HTMLDivElement>(null);
  const thumbsUpRef = useRef<HTMLSpanElement>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const hasPlayedRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const [cursorPos, setCursorPos] = useState<Point>({ x: 0, y: 0 });
  const [cursorActive, setCursorActive] = useState(false);
  const [cursorMoveDuration, setCursorMoveDuration] = useState<number | null>(null);
  const [thumbsUpSelected, setThumbsUpSelected] = useState(false);
  const [thumbsUpPressed, setThumbsUpPressed] = useState(false);

  const [metrics, setMetrics] = useState<{
    aiConfidence: SectionMetrics | null;
    report: SectionMetrics | null;
    attribution: SectionMetrics | null;
  }>({ aiConfidence: null, report: null, attribution: null });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = mq.matches;
    const handleChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
    };
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  // Plays once, the first time the illustration scrolls into view (not on
  // page load, and not more than once — the observer unobserves itself
  // right after triggering). Reduced motion skips the wait and the cursor
  // entirely and lands directly on the selected end state, matching the
  // same reduced-motion contract analysis-placement-illustration-animated.tsx
  // already uses for its own thumbs-up beat.
  useEffect(() => {
    const root = layoutRef.current;
    if (!root) return;

    function schedule(fn: () => void, delay: number) {
      timeoutsRef.current.push(setTimeout(fn, delay));
    }

    function computeNeutralPos(): Point | null {
      const container = layoutRef.current;
      const panel = panelRef.current;
      if (!container || !panel) return null;
      const containerRect = container.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();
      // A neutral resting point within the AI Analysis panel itself (near
      // its heading), not the bracket/annotation columns beside it.
      return {
        x: panelRect.left - containerRect.left + panelRect.width * 0.75,
        y: panelRect.top - containerRect.top + 28,
      };
    }

    function computeThumbsUpPos(): Point | null {
      const container = layoutRef.current;
      const thumb = thumbsUpRef.current;
      if (!container || !thumb) return null;
      const containerRect = container.getBoundingClientRect();
      const thumbRect = thumb.getBoundingClientRect();
      return {
        x: thumbRect.left - containerRect.left + thumbRect.width / 2,
        y: thumbRect.top - containerRect.top + thumbRect.height / 2,
      };
    }

    function runThumbsUpSequence() {
      if (reducedMotionRef.current) {
        schedule(() => setThumbsUpSelected(true), 50);
        return;
      }
      schedule(() => {
        const start = computeNeutralPos();
        const end = computeThumbsUpPos();
        if (!start || !end) return;
        // Cursor appears (no transition — phase hasn't set a duration yet)
        // at the neutral position first, then a deferred tick (not rAF —
        // suspended while the tab/pane isn't visible, whereas a timer still
        // fires) starts the actual move once that start position has had a
        // chance to paint.
        setCursorMoveDuration(null);
        setCursorPos(start);
        setCursorActive(true);
        schedule(() => {
          setCursorMoveDuration(CURSOR_MOVE_DURATION);
          setCursorPos(end);
        }, 0);
        schedule(() => setThumbsUpPressed(true), CURSOR_MOVE_DURATION + HOVER_PAUSE_DURATION);
        schedule(() => {
          setThumbsUpPressed(false);
          setThumbsUpSelected(true);
        }, CURSOR_MOVE_DURATION + HOVER_PAUSE_DURATION + CLICK_PRESS_DURATION);
        // Global cursor rule — hide exactly CURSOR_HIDE_DELAY_AFTER_CLICK
        // after this click completes, never left resting on the button
        // indefinitely.
        schedule(
          () => setCursorActive(false),
          CURSOR_MOVE_DURATION + HOVER_PAUSE_DURATION + CLICK_PRESS_DURATION + CURSOR_HIDE_DELAY_AFTER_CLICK,
        );
      }, VIEWPORT_ENTRY_DELAY);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasPlayedRef.current) {
            hasPlayedRef.current = true;
            runThumbsUpSequence();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function measure() {
      const container = layoutRef.current;
      const aiConf = aiConfidenceRef.current;
      const report = reportRef.current;
      const attribution = attributionRef.current;
      if (!container || !aiConf || !report || !attribution) return;
      const containerRect = container.getBoundingClientRect();
      const toMetrics = (el: HTMLDivElement): SectionMetrics => {
        const r = el.getBoundingClientRect();
        return { top: r.top - containerRect.top, height: r.height };
      };
      setMetrics({
        aiConfidence: toMetrics(aiConf),
        report: toMetrics(report),
        attribution: toMetrics(attribution),
      });
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div
      ref={layoutRef}
      data-panel-structure-grid
      className="grid grid-cols-1 gap-9 md:items-stretch md:gap-0"
      style={{
        position: "relative",
        fontFamily: ENTERPRISE_FONT_STACK,
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
    >
      {/* md: breakpoint sets the real 3-column layout — panel / bracket
          rail / annotations. Tailwind's arbitrary grid-cols syntax can't
          interpolate the RAIL_WIDTH constant, so this one responsive rule
          is a plain scoped <style> tag instead. Also carries the
          .ps-learn-more hover rule (inline styles can't express :hover). */}
      <style>{`
        @media (min-width: 768px) {
          [data-panel-structure-grid] {
            grid-template-columns: 43% ${RAIL_WIDTH}px 1fr;
          }
        }
        .ps-learn-more:hover {
          text-decoration: underline;
        }
      `}</style>
      {/* Cursor overlay — position:absolute, so (per the CSS Grid spec) it
          does not participate in grid auto-placement and can't disturb the
          3-column layout above. Positioned relative to this same grid
          container (position:relative, added above only for this). Reuses
          AnimatedCursor exactly as imported — same MousePointer2 icon,
          size, fill, and drop-shadow as the other approved Capital One
          animated illustrations. */}
      <AnimatedCursor pos={cursorPos} active={cursorActive} moveDurationMs={cursorMoveDuration} />
      {/* LEFT — AI Analysis panel, ~43% (about 10% narrower than the
          previous 48%) — still sized to feel substantial and readable, not
          compressed to match the old screenshot's proportions. */}
        <AIAnalysisPanel
          panelRef={panelRef}
          aiConfidenceRef={aiConfidenceRef}
          reportRef={reportRef}
          attributionRef={attributionRef}
          thumbsUpRef={thumbsUpRef}
          thumbsUpSelected={thumbsUpSelected}
          thumbsUpPressed={thumbsUpPressed}
        />

        {/* MIDDLE — bracket rail (desktop only; hidden on the mobile
            single-column fallback along with the annotations' absolute
            positioning). */}
        <div className="relative hidden md:block">
          {metrics.aiConfidence && <Bracket metrics={metrics.aiConfidence} />}
          {metrics.report && <Bracket metrics={metrics.report} />}
          {metrics.attribution && <Bracket metrics={metrics.attribution} />}
        </div>

        {/* RIGHT — annotations, desktop: absolutely positioned so each
            heading's vertical center lines up with its bracket's leader.
            Mobile: plain stacked blocks, no brackets. */}
        <div className="relative hidden md:block">
          {metrics.aiConfidence && (
            <Annotation metrics={metrics.aiConfidence} heading="AI Context">
              Positioned at the top of the hierarchy to establish immediate system intent. Incorporates scoping
              metadata and disclaimers to prevent users from treating AI outputs as absolute ground truth.
            </Annotation>
          )}
          {metrics.report && (
            <Annotation metrics={metrics.report} heading="Report">
              Houses the core evaluative data. Surfaces multi-criteria binary checks (
              <strong style={{ fontWeight: 600 }}>Detected</strong> / <strong style={{ fontWeight: 600 }}>Not Detected</strong>
              ) alongside inline inspect triggers (?) that allow analysts to audit granular rule matches and
              tooltips on demand without cognitive overload.
            </Annotation>
          )}
          {metrics.attribution && (
            <Annotation metrics={metrics.attribution} heading="Attribution">
              Provides governance and source traceability. Anchors the AI&apos;s output back to specific
              institutional compliance frameworks to maintain audit readiness and human accountability.
            </Annotation>
          )}
        </div>

        {/* Mobile fallback — same three annotations without the bracket
            geometry (which requires the side-by-side desktop layout). */}
        <div className="flex flex-col gap-6 md:hidden">
          <div>
            <h6 style={{ margin: "0 0 4px 0", fontSize: 16, lineHeight: "22px", fontWeight: 600, color: PRIMARY_TEXT }}>
              AI Context
            </h6>
            <p style={{ margin: 0, fontSize: 14, lineHeight: "21px", fontWeight: 400, color: SECONDARY_TEXT }}>
              Positioned at the top of the hierarchy to establish immediate system intent. Incorporates scoping
              metadata and disclaimers to prevent users from treating AI outputs as absolute ground truth.
            </p>
          </div>
          <div>
            <h6 style={{ margin: "0 0 4px 0", fontSize: 16, lineHeight: "22px", fontWeight: 600, color: PRIMARY_TEXT }}>
              Report
            </h6>
            <p style={{ margin: 0, fontSize: 14, lineHeight: "21px", fontWeight: 400, color: SECONDARY_TEXT }}>
              Houses the core evaluative data. Surfaces multi-criteria binary checks (
              <strong style={{ fontWeight: 600 }}>Detected</strong> / <strong style={{ fontWeight: 600 }}>Not Detected</strong>
              ) alongside inline inspect triggers (?) that allow analysts to audit granular rule matches and
              tooltips on demand without cognitive overload.
            </p>
          </div>
          <div>
            <h6 style={{ margin: "0 0 4px 0", fontSize: 16, lineHeight: "22px", fontWeight: 600, color: PRIMARY_TEXT }}>
              Attribution
            </h6>
            <p style={{ margin: 0, fontSize: 14, lineHeight: "21px", fontWeight: 400, color: SECONDARY_TEXT }}>
              Provides governance and source traceability. Anchors the AI&apos;s output back to specific
              institutional compliance frameworks to maintain audit readiness and human accountability.
            </p>
          </div>
        </div>
    </div>
  );
}
