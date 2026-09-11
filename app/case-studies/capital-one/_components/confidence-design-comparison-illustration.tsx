"use client";

import { useEffect, useRef, useState } from "react";
import {
  ANNOTATION_HEADING_HALF_LINE,
  ANNOTATION_MAX_WIDTH,
  Bracket,
  ENTERPRISE_FONT_STACK,
  FeedbackRow,
  INTERACTIVE_BLUE,
  MUTED,
  PRIMARY_TEXT,
  RAIL_WIDTH,
  SECONDARY_TEXT,
  SECTION_LABEL_STYLE,
  type SectionMetrics,
} from "./panel-structure-illustration";
import { AnimatedCursor, CURSOR_HIDE_DELAY_AFTER_CLICK, type Point } from "./analysis-placement-illustration-animated";
import { Textarea } from "@/components/ui/textarea";

/**
 * TEMPORARY — local-only HTML/CSS replacement candidate for the
 * "AI Confidence Indicator Design Options" PNG
 * (pattern-2-certainty-vs-analytics.png), which stays in the project but is
 * no longer rendered on the page. A side-by-side comparison of the two
 * design options discussed in that image: a quantitative percentage (87%)
 * with a progress bar (rejected) vs. the qualitative tier actually shipped
 * ("Medium", no bar).
 *
 * Reuses this route's existing tokens/typography (SECTION_LABEL_STYLE,
 * PRIMARY_TEXT/SECONDARY_TEXT/MUTED, INTERACTIVE_BLUE, ENTERPRISE_FONT_STACK)
 * and the exact same Bracket/Annotation system as Panel Structure and
 * Per-Criterion Analysis — imported unmodified, not re-implemented. The two
 * panels themselves are new (this illustration's own AI Confidence /
 * Quarterly Report content doesn't exist elsewhere to reuse wholesale), but
 * are built from one shared ConfidencePanel so both sides are guaranteed
 * structurally identical except for the one product-UI difference the
 * comparison is about.
 */

// Identical hardcoded data for both panels' charts — the same values are
// rendered on both sides so the comparison reads as "same panel, same
// charts, only the confidence treatment differs," not two different charts
// that happen to look similar.
const VOLUME_BARS = [34, 52, 28, 61, 45, 58];
const TREND_POINTS = [18, 30, 26, 42, 38, 55, 50];

// Timing for the LEFT bar/number animation and the RIGHT "Medium" pulse
// that follows it — see the effect in ConfidenceDesignComparisonIllustration
// below.
const ANIMATION_START_DELAY = 700; // before the left animation begins
const LEFT_ANIMATION_DURATION = 1800; // 0% -> 87%, bar and number together

// "Medium" pulse — a literal text-color swap (blue -> white -> blue), never
// a background/highlight behind it. Starts MEDIUM_PULSE_WAIT_AFTER_87 after
// the 0% -> 87% animation finishes (not immediately). Each of the
// MEDIUM_PULSE_REPEAT_COUNT cycles: blue -> white over
// MEDIUM_PULSE_TRANSITION_MS, hold white for MEDIUM_PULSE_HOLD_MS, white ->
// blue over MEDIUM_PULSE_TRANSITION_MS, hold blue for MEDIUM_PULSE_HOLD_MS.
const MEDIUM_PULSE_WAIT_AFTER_87 = 5000;
const MEDIUM_PULSE_TRANSITION_MS = 250;
const MEDIUM_PULSE_HOLD_MS = 700;
const MEDIUM_PULSE_CYCLE_MS = MEDIUM_PULSE_TRANSITION_MS * 2 + MEDIUM_PULSE_HOLD_MS * 2; // 1900
const MEDIUM_PULSE_REPEAT_COUNT = 5;

// RIGHT panel only — cursor + thumbs-up click, timed from the moment this
// illustration enters the viewport (the same IntersectionObserver trigger
// the confidence bar/Medium pulse already use, not a separate one). Mirrors
// the same thumbs-up beat pattern already approved elsewhere (Panel
// Structure, Per-Criterion Analysis) — same AnimatedCursor, same FeedbackRow
// selected/pressed treatment — just this illustration's own 12s delay.
const RIGHT_THUMBS_WAIT = 12000;
const RIGHT_THUMBS_MOVE = 900;
const RIGHT_THUMBS_PAUSE = 250;
const RIGHT_THUMBS_CLICK = 180;

// LEFT panel only — cursor + thumbs-down click, timed from the moment the
// left bar/number animation finishes (not viewport entry — this sequence
// chains off runConfidenceAnimation's own completion inside the effect
// below), followed by the panel's downward expansion and the feedback
// textarea's typing animation. Same AnimatedCursor/FeedbackRow treatment as
// the RIGHT thumbs-up beat, just its own timings and its own resulting
// feedback-field sequence.
const LEFT_THUMBS_PAUSE_AFTER_87 = 1000;
const LEFT_THUMBS_MOVE = 900;
const LEFT_THUMBS_HOVER_PAUSE = 250;
const LEFT_THUMBS_CLICK = 180;
const PANEL_EXPAND_DURATION = 400; // ease-out height transition
const FEEDBACK_TYPE_START_DELAY = 400; // after the field has fully expanded
const FEEDBACK_TYPE_CHAR_MS = 35;
const LEFT_FEEDBACK_TEXT =
  "The 87% looks like another data metric. It's hard to tell that it represents AI confidence rather than the report data.";

const CHART_LABEL_STYLE: React.CSSProperties = {
  fontSize: 11,
  lineHeight: "14px",
  fontWeight: 600,
  letterSpacing: "0.03em",
  textTransform: "uppercase",
  color: MUTED,
  display: "block",
  marginBottom: 8,
};

// The small eyebrow label ("Option Explored" / "Final Direction") — kept
// compact (small margin-bottom to the panel below) so it reads as belonging
// to the panel it sits above, not as a separate section.
const COMPARISON_EYEBROW_STYLE: React.CSSProperties = {
  fontSize: 11,
  lineHeight: "14px",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: MUTED,
  display: "block",
  marginBottom: 4,
};

function ComparisonHeader({ eyebrow }: { eyebrow: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <span style={COMPARISON_EYEBROW_STYLE}>{eyebrow}</span>
    </div>
  );
}
// Exact rendered height of ComparisonHeader (eyebrow line-height 14 + the
// wrapper's own margin-bottom 12 = 26), used to shift the annotation block
// up by that amount so the annotation's own heading still lands exactly on
// the bracket's center — the same position it held before this header
// existed — with the header simply added above it rather than the whole
// block being re-centered.
const COMPARISON_HEADER_HEIGHT = 26;

// The bracket/annotation system's own Annotation component (imported
// elsewhere in this codebase) renders only a heading + body; this local
// variant reuses its exact positioning formula and exact h6/p styling
// (copied verbatim from panel-structure-illustration.tsx's Annotation) but
// additionally renders the comparison eyebrow above the annotation heading,
// as part of the same positioned block.
function AnnotationWithHeader({
  metrics,
  eyebrow,
  annotationHeading,
  children,
}: {
  metrics: SectionMetrics;
  eyebrow: string;
  annotationHeading: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: metrics.top + metrics.height / 2 - ANNOTATION_HEADING_HALF_LINE - COMPARISON_HEADER_HEIGHT,
        maxWidth: ANNOTATION_MAX_WIDTH,
      }}
    >
      <ComparisonHeader eyebrow={eyebrow} />
      <h6 style={{ margin: "0 0 4px 0", fontSize: 16, lineHeight: "22px", fontWeight: 600, color: PRIMARY_TEXT }}>
        {annotationHeading}
      </h6>
      <p style={{ margin: 0, fontSize: 14, lineHeight: "21px", fontWeight: 400, color: SECONDARY_TEXT }}>
        {children}
      </p>
    </div>
  );
}

function VolumeBarChart() {
  const width = 220;
  const height = 64;
  const barWidth = 22;
  const gap = 12;
  const maxVal = Math.max(...VOLUME_BARS);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      {VOLUME_BARS.map((v, i) => {
        const barHeight = (v / maxVal) * (height - 4);
        return (
          <rect
            key={i}
            x={i * (barWidth + gap)}
            y={height - barHeight}
            width={barWidth}
            height={barHeight}
            rx={2}
            fill={INTERACTIVE_BLUE}
            opacity={0.85}
          />
        );
      })}
    </svg>
  );
}

function TrendLineChart() {
  const width = 220;
  const height = 64;
  const stepX = width / (TREND_POINTS.length - 1);
  const maxVal = Math.max(...TREND_POINTS);
  const toY = (v: number) => height - (v / maxVal) * (height - 6) - 2;
  const points = TREND_POINTS.map((v, i) => `${i * stepX},${toY(v)}`);
  const linePath = `M ${points.join(" L ")}`;
  const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <path d={areaPath} fill={INTERACTIVE_BLUE} opacity={0.08} />
      <path d={linePath} fill="none" stroke={INTERACTIVE_BLUE} strokeWidth={2} />
      {TREND_POINTS.map((v, i) => (
        <circle key={i} cx={i * stepX} cy={toY(v)} r={2.5} fill={INTERACTIVE_BLUE} />
      ))}
    </svg>
  );
}

function ConfidenceBar({ percent }: { percent: number }) {
  return (
    <div className="rounded-full" style={{ height: 8, background: "#E2E8F0", overflow: "hidden" }}>
      <div className="rounded-full" style={{ height: 8, width: `${percent}%`, background: INTERACTIVE_BLUE }} />
    </div>
  );
}

// The one product-UI difference the whole comparison is about: quantitative
// (87% + bar) vs. qualitative (Medium, no bar) — everything else in the
// panel is identical between the two variants.
//
// displayPercent (quantitative only) and pulseMedium (qualitative only)
// drive the two small animations described in ConfidenceDesignComparisonIllustration
// below; both default to their at-rest values so this component works
// unchanged if ever used without them. panelRef/thumbsUpRef/
// thumbsUpSelected/thumbsUpPressed exist only for the RIGHT (qualitative)
// panel's own cursor beat — the LEFT call site never passes them, so its
// FeedbackRow stays static/unselected, exactly like every other reuse of
// FeedbackRow across this codebase.
function ConfidencePanel({
  variant,
  confidenceRef,
  displayPercent = 87,
  pulseMedium = false,
  panelRef,
  thumbsUpRef,
  thumbsUpSelected = false,
  thumbsUpPressed = false,
  thumbsDownRef,
  thumbsDownSelected = false,
  thumbsDownPressed = false,
  feedbackVisible = false,
  feedbackHeight = null,
  feedbackContentRef,
  feedbackText = "",
  feedbackReducedMotion = false,
}: {
  variant: "quantitative" | "qualitative";
  confidenceRef: React.RefObject<HTMLDivElement | null>;
  displayPercent?: number;
  pulseMedium?: boolean;
  panelRef?: React.Ref<HTMLDivElement>;
  thumbsUpRef?: React.RefObject<HTMLSpanElement | null>;
  thumbsUpSelected?: boolean;
  thumbsUpPressed?: boolean;
  // LEFT (quantitative) only — the thumbs-down beat and the feedback field
  // it reveals. Omitted entirely for RIGHT, so its FeedbackRow stays exactly
  // as before.
  thumbsDownRef?: React.RefObject<HTMLSpanElement | null>;
  thumbsDownSelected?: boolean;
  thumbsDownPressed?: boolean;
  feedbackVisible?: boolean;
  feedbackHeight?: number | "auto" | null;
  feedbackContentRef?: React.RefObject<HTMLDivElement | null>;
  feedbackText?: string;
  feedbackReducedMotion?: boolean;
}) {
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

      <div ref={confidenceRef}>
        <div className="flex items-center justify-between">
          <span style={SECTION_LABEL_STYLE}>AI Confidence</span>
          <span
            className={variant === "qualitative" && pulseMedium ? "confidence-medium-pulse" : undefined}
            style={{ fontSize: 15, lineHeight: "20px", fontWeight: 700, color: INTERACTIVE_BLUE }}
          >
            {variant === "quantitative" ? `${Math.round(displayPercent)}%` : "Medium"}
          </span>
        </div>
        {variant === "quantitative" && (
          <div style={{ marginTop: 10 }}>
            <ConfidenceBar percent={displayPercent} />
          </div>
        )}
      </div>

      <div style={{ marginTop: 24 }}>
        <span style={SECTION_LABEL_STYLE}>Quarterly Report</span>
        <div style={{ marginTop: 14 }}>
          <span style={CHART_LABEL_STYLE}>Volume</span>
          <VolumeBarChart />
        </div>
        <div style={{ marginTop: 18 }}>
          <span style={CHART_LABEL_STYLE}>Trend</span>
          <TrendLineChart />
        </div>
      </div>

      {/* Reused verbatim from Panel Structure's own AI Analysis panel — same
          component (typography, icon size, button size, spacing, divider,
          selected/pressed treatment) as every other reuse of it, not
          hand-matched. */}
      <FeedbackRow
        thumbsUpRef={thumbsUpRef}
        thumbsUpSelected={thumbsUpSelected}
        thumbsUpPressed={thumbsUpPressed}
        thumbsDownRef={thumbsDownRef}
        thumbsDownSelected={thumbsDownSelected}
        thumbsDownPressed={thumbsDownPressed}
      />

      {/* LEFT (quantitative) only — the negative-feedback field revealed
          after thumbs-down is clicked. Height is JS-driven (browsers can't
          transition to/from `height: auto`): collapsed at 0 until
          feedbackVisible, then measured from feedbackContentRef and flipped
          to that pixel value so the height transition below actually
          animates. Growing only this wrapper (below FeedbackRow) keeps the
          panel's top edge — and everything above it — exactly where it was. */}
      {variant === "quantitative" && feedbackVisible && (
        <div
          style={{
            height: feedbackHeight === null ? 0 : feedbackHeight,
            overflow: "hidden",
            transition: feedbackReducedMotion ? "none" : `height ${PANEL_EXPAND_DURATION}ms ease-out`,
          }}
        >
          <div ref={feedbackContentRef} style={{ paddingTop: 16 }}>
            <Textarea
              readOnly
              tabIndex={-1}
              aria-hidden="true"
              value={feedbackText}
              className="resize-none"
              style={{ minHeight: 72 }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Mobile fallback heading/body typography copied verbatim from Annotation's
// own internal h6/p styling (Panel Structure / Per-Criterion Analysis use
// the identical values for their own mobile fallbacks). Also carries the
// comparison eyebrow above it, matching the desktop layout.
function MobileAnnotation({
  eyebrow,
  heading,
  children,
}: {
  eyebrow: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div className="md:hidden">
      <ComparisonHeader eyebrow={eyebrow} />
      <h6 style={{ margin: "0 0 4px 0", fontSize: 16, lineHeight: "22px", fontWeight: 600, color: PRIMARY_TEXT }}>
        {heading}
      </h6>
      <p style={{ margin: 0, fontSize: 14, lineHeight: "21px", fontWeight: 400, color: SECONDARY_TEXT }}>
        {children}
      </p>
    </div>
  );
}

export function ConfidenceDesignComparisonIllustration() {
  const leftLayoutRef = useRef<HTMLDivElement>(null);
  const leftConfidenceRef = useRef<HTMLDivElement>(null);
  const [leftMetrics, setLeftMetrics] = useState<SectionMetrics | null>(null);

  const rightLayoutRef = useRef<HTMLDivElement>(null);
  const rightConfidenceRef = useRef<HTMLDivElement>(null);
  const [rightMetrics, setRightMetrics] = useState<SectionMetrics | null>(null);

  // This illustration's own outer wrapper (in capital-one-content.tsx) is
  // centered via mx-auto inside a wider prose column, which insets the
  // whole illustration from the "AI Confidence Indicator" heading above it.
  // Rather than touching that shared wrapper (used by every illustration on
  // this page), only the LEFT group is pulled left by the exact measured
  // inset via a negative margin — the RIGHT group, the gap between them, and
  // every other section are untouched. rootRef is this component's own
  // outermost element; walking up from it to the first ancestor whose left
  // edge is further left finds that inset without hardcoding DOM depth.
  const rootRef = useRef<HTMLDivElement>(null);
  const [leftGroupOffset, setLeftGroupOffset] = useState(0);

  // LEFT — after ANIMATION_START_DELAY, the confidence bar and the "87%"
  // number animate together over LEFT_ANIMATION_DURATION, driven by one
  // shared value (never a separate CSS transition on the bar plus a
  // separate JS loop for the number — that would risk the two drifting out
  // of sync). RIGHT — once the left animation finishes, "Medium" pulses its
  // own text color (blue -> white -> blue), MEDIUM_PULSE_REPEAT_COUNT times
  // (a plain CSS animation with that iteration-count, whose own fill-mode
  // already leaves it back at its normal, statically-blue state after the
  // last cycle — no extra JS needed to reset it). Both are gated on
  // prefers-reduced-motion and run once, the first time this illustration
  // scrolls into view (it mounts off-screen, hidden by the page's own
  // scroll-reveal fade, so animating on mount would finish before anyone
  // could see it).
  const [displayPercent, setDisplayPercent] = useState(0);
  const [pulseMedium, setPulseMedium] = useState(false);
  // Ref only (no state) — this is read exclusively inside the
  // IntersectionObserver callback below, which needs a synchronous check,
  // not a reactive re-render; the CSS also independently respects
  // prefers-reduced-motion for the pulse (see the .confidence-medium-pulse
  // media query below) as a second, purely-CSS layer of the same guarantee.
  const reducedMotionRef = useRef(false);
  const hasAnimatedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const startTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pulseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // RIGHT panel only — cursor + thumbs-up click. rightPanelRef is the
  // qualitative ConfidencePanel's own root (for the cursor's neutral
  // starting position); rightThumbsUpRef is its thumbs-up button. Both are
  // reused as the coordinate anchor for the AnimatedCursor rendered as a
  // sibling of the panel below, in a shared position:relative wrapper.
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const rightThumbsUpRef = useRef<HTMLSpanElement>(null);
  const [cursorActive, setCursorActive] = useState(false);
  const [cursorPos, setCursorPos] = useState<Point>({ x: 0, y: 0 });
  const [cursorMoveDuration, setCursorMoveDuration] = useState<number | null>(null);
  const [thumbsUpSelected, setThumbsUpSelected] = useState(false);
  const [thumbsUpPressed, setThumbsUpPressed] = useState(false);
  const thumbsTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // LEFT panel only — cursor + thumbs-down click, then the panel's downward
  // expansion and the feedback textarea's typing animation. Mirrors the
  // RIGHT refs/state above one-for-one but kept as distinct variables since
  // both sequences can be mid-flight at once (LEFT's chains off the left
  // bar/number animation finishing; RIGHT's off its own 12s viewport-entry
  // wait).
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const leftThumbsDownRef = useRef<HTMLSpanElement>(null);
  const [leftCursorActive, setLeftCursorActive] = useState(false);
  const [leftCursorPos, setLeftCursorPos] = useState<Point>({ x: 0, y: 0 });
  const [leftCursorMoveDuration, setLeftCursorMoveDuration] = useState<number | null>(null);
  const [thumbsDownSelected, setThumbsDownSelected] = useState(false);
  const [thumbsDownPressed, setThumbsDownPressed] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackHeight, setFeedbackHeight] = useState<number | "auto" | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const feedbackContentRef = useRef<HTMLDivElement>(null);
  const leftTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

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
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (startTimeoutRef.current !== null) clearTimeout(startTimeoutRef.current);
      if (pulseTimeoutRef.current !== null) clearTimeout(pulseTimeoutRef.current);
      thumbsTimeoutsRef.current.forEach(clearTimeout);
      leftTimeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    function runConfidenceAnimation() {
      if (reducedMotionRef.current) {
        setDisplayPercent(87);
        runLeftThumbsDownSequence();
        return;
      }
      startTimeoutRef.current = setTimeout(() => {
        const start = performance.now();
        function tick(now: number) {
          const t = Math.min((now - start) / LEFT_ANIMATION_DURATION, 1);
          const eased = 1 - Math.pow(1 - t, 3); // ease-out (cubic)
          setDisplayPercent(eased * 87);
          if (t < 1) {
            rafRef.current = requestAnimationFrame(tick);
          } else {
            // Waits MEDIUM_PULSE_WAIT_AFTER_87 after this animation finishes,
            // then the CSS animation itself (5 color-pulse cycles) runs for
            // MEDIUM_PULSE_CYCLE_MS * MEDIUM_PULSE_REPEAT_COUNT; adding the
            // class is the only JS needed to start it — see
            // .confidence-medium-pulse below, whose iteration-count already
            // returns Medium to its normal (statically blue) state after
            // the 5th cycle on its own.
            pulseTimeoutRef.current = setTimeout(() => setPulseMedium(true), MEDIUM_PULSE_WAIT_AFTER_87);
            // LEFT's own thumbs-down + feedback-field sequence begins only
            // once this (the numerical confidence) animation has completely
            // finished, per spec — not on viewport entry like RIGHT's beat.
            runLeftThumbsDownSequence();
          }
        }
        rafRef.current = requestAnimationFrame(tick);
      }, ANIMATION_START_DELAY);
    }

    function scheduleLeft(fn: () => void, delay: number) {
      leftTimeoutsRef.current.push(setTimeout(fn, delay));
    }

    function computeLeftThumbsNeutralPos(): Point | null {
      const panel = leftPanelRef.current;
      if (!panel) return null;
      const rect = panel.getBoundingClientRect();
      return { x: rect.width * 0.82, y: 28 };
    }

    function computeLeftThumbsDownPos(): Point | null {
      const panel = leftPanelRef.current;
      const thumb = leftThumbsDownRef.current;
      if (!panel || !thumb) return null;
      const panelRect = panel.getBoundingClientRect();
      const thumbRect = thumb.getBoundingClientRect();
      return {
        x: thumbRect.left - panelRect.left + thumbRect.width / 2,
        y: thumbRect.top - panelRect.top + thumbRect.height / 2,
      };
    }

    function startLeftFeedbackTyping() {
      if (reducedMotionRef.current) {
        setFeedbackText(LEFT_FEEDBACK_TEXT);
        return;
      }
      for (let i = 1; i <= LEFT_FEEDBACK_TEXT.length; i++) {
        scheduleLeft(() => setFeedbackText(LEFT_FEEDBACK_TEXT.slice(0, i)), i * FEEDBACK_TYPE_CHAR_MS);
      }
    }

    // LEFT panel only — cursor moves to thumbs-down, clicks it, then the
    // panel expands downward to reveal the feedback field, which types out
    // the exact feedback copy character-by-character.
    function runLeftThumbsDownSequence() {
      if (reducedMotionRef.current) {
        scheduleLeft(() => {
          setThumbsDownSelected(true);
          setFeedbackVisible(true);
          setFeedbackHeight("auto");
          setFeedbackText(LEFT_FEEDBACK_TEXT);
        }, 50);
        return;
      }
      scheduleLeft(() => {
        const start = computeLeftThumbsNeutralPos();
        const end = computeLeftThumbsDownPos();
        if (!start || !end) return;
        setLeftCursorMoveDuration(null);
        setLeftCursorPos(start);
        setLeftCursorActive(true);
        scheduleLeft(() => {
          setLeftCursorMoveDuration(LEFT_THUMBS_MOVE);
          setLeftCursorPos(end);
        }, 0);
        scheduleLeft(() => setThumbsDownPressed(true), LEFT_THUMBS_MOVE + LEFT_THUMBS_HOVER_PAUSE);
        scheduleLeft(
          () => {
            setThumbsDownPressed(false);
            setThumbsDownSelected(true);
            // Global cursor rule — hide exactly CURSOR_HIDE_DELAY_AFTER_CLICK
            // after this click completes (independent of the panel
            // expansion/typing that continues below).
            scheduleLeft(() => setLeftCursorActive(false), CURSOR_HIDE_DELAY_AFTER_CLICK);
            // Panel expansion: mount the (still 0-height) wrapper now, then
            // on the next tick measure its natural content height and flip
            // to that pixel value so the height transition actually
            // animates (height:auto can't be transitioned directly).
            setFeedbackVisible(true);
            scheduleLeft(() => {
              const content = feedbackContentRef.current;
              const h = content ? content.getBoundingClientRect().height : 0;
              setFeedbackHeight(h);
              scheduleLeft(startLeftFeedbackTyping, PANEL_EXPAND_DURATION + FEEDBACK_TYPE_START_DELAY);
            }, 0);
          },
          LEFT_THUMBS_MOVE + LEFT_THUMBS_HOVER_PAUSE + LEFT_THUMBS_CLICK,
        );
      }, LEFT_THUMBS_PAUSE_AFTER_87);
    }

    function scheduleThumbs(fn: () => void, delay: number) {
      thumbsTimeoutsRef.current.push(setTimeout(fn, delay));
    }

    function computeThumbsNeutralPos(): Point | null {
      const panel = rightPanelRef.current;
      if (!panel) return null;
      const rect = panel.getBoundingClientRect();
      // A neutral resting point near the panel's own top-right, mirroring
      // the same proportional convention used for the other approved
      // thumbs-up beats' own cursor starting points.
      return { x: rect.width * 0.82, y: 28 };
    }

    function computeThumbsUpPos(): Point | null {
      const panel = rightPanelRef.current;
      const thumb = rightThumbsUpRef.current;
      if (!panel || !thumb) return null;
      const panelRect = panel.getBoundingClientRect();
      const thumbRect = thumb.getBoundingClientRect();
      return {
        x: thumbRect.left - panelRect.left + thumbRect.width / 2,
        y: thumbRect.top - panelRect.top + thumbRect.height / 2,
      };
    }

    // RIGHT panel only — timed from the same viewport-entry moment as
    // runConfidenceAnimation above, not a separate trigger.
    function runThumbsUpAnimation() {
      if (reducedMotionRef.current) {
        scheduleThumbs(() => setThumbsUpSelected(true), 50);
        return;
      }
      scheduleThumbs(() => {
        const start = computeThumbsNeutralPos();
        const end = computeThumbsUpPos();
        if (!start || !end) return;
        setCursorMoveDuration(null);
        setCursorPos(start);
        setCursorActive(true);
        scheduleThumbs(() => {
          setCursorMoveDuration(RIGHT_THUMBS_MOVE);
          setCursorPos(end);
        }, 0);
        scheduleThumbs(() => setThumbsUpPressed(true), RIGHT_THUMBS_MOVE + RIGHT_THUMBS_PAUSE);
        scheduleThumbs(() => {
          setThumbsUpPressed(false);
          setThumbsUpSelected(true);
        }, RIGHT_THUMBS_MOVE + RIGHT_THUMBS_PAUSE + RIGHT_THUMBS_CLICK);
        // Global cursor rule — hide exactly CURSOR_HIDE_DELAY_AFTER_CLICK
        // after this click completes, never left resting on the button
        // indefinitely.
        scheduleThumbs(
          () => setCursorActive(false),
          RIGHT_THUMBS_MOVE + RIGHT_THUMBS_PAUSE + RIGHT_THUMBS_CLICK + CURSOR_HIDE_DELAY_AFTER_CLICK,
        );
      }, RIGHT_THUMBS_WAIT);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            hasAnimatedRef.current = true;
            runConfidenceAnimation();
            runThumbsUpAnimation();
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
      const leftContainer = leftLayoutRef.current;
      const leftTarget = leftConfidenceRef.current;
      if (leftContainer && leftTarget) {
        const containerRect = leftContainer.getBoundingClientRect();
        const r = leftTarget.getBoundingClientRect();
        setLeftMetrics({ top: r.top - containerRect.top, height: r.height });
      }
      const rightContainer = rightLayoutRef.current;
      const rightTarget = rightConfidenceRef.current;
      if (rightContainer && rightTarget) {
        const containerRect = rightContainer.getBoundingClientRect();
        const r = rightTarget.getBoundingClientRect();
        setRightMetrics({ top: r.top - containerRect.top, height: r.height });
      }

      // Only at the md: breakpoint and up — below that the two groups stack
      // into one column and this offset doesn't apply (nor would shifting a
      // stacked block left be desirable).
      const root = rootRef.current;
      if (root && window.innerWidth >= 768) {
        // Walking up comparing raw `left` values against root is unreliable
        // — a small intermediate dip (e.g. a <figure> ancestor's own default
        // spacing) or overshooting all the way to the page's own
        // unconstrained section/main/body (all sitting at left: 0) can both
        // masquerade as "the" boundary. Target the actual cause directly
        // instead: find the ancestor with a finite max-width (the "mx-auto
        // max-w-[1100px]" wrapper — the only element in this chain that
        // centers a narrower box inside a wider parent; unrelated
        // unconstrained containers have max-width: none), then measure the
        // gap between root's own position and THAT wrapper's own parent —
        // the true prose-column boundary everything should align with.
        const rootLeft = root.getBoundingClientRect().left;
        let el: HTMLElement | null = root;
        let offset = 0;
        for (let hops = 0; el && hops < 8; hops++) {
          if (getComputedStyle(el).maxWidth !== "none" && el.parentElement) {
            offset = rootLeft - el.parentElement.getBoundingClientRect().left;
            break;
          }
          el = el.parentElement;
        }
        setLeftGroupOffset(offset);
      } else if (root) {
        setLeftGroupOffset(0);
      }
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div
      ref={rootRef}
      style={{
        fontFamily: ENTERPRISE_FONT_STACK,
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
    >
      <style>{`
        @media (min-width: 768px) {
          [data-confidence-comparison-side] {
            grid-template-columns: minmax(0, 1fr) ${RAIL_WIDTH}px minmax(140px, 210px);
          }
        }
        /* Literal text-color pulse — animates color only (no background,
           opacity, box-shadow, border, or transform, and never on the
           parent/label/panel — only this element's own color). Pure white
           against the panel's own white background makes the word visibly
           disappear at the peak of each pulse, then reappear as it moves
           back to blue. Four stops per cycle (blue -> white transition,
           hold white, white -> blue transition, hold blue), each stop's
           percentage computed from the actual millisecond durations so
           "linear" below maps them to exact times rather than approximating
           with an eased curve. */
        @keyframes pcaMediumColorPulse {
          0% { color: ${INTERACTIVE_BLUE}; }
          ${(MEDIUM_PULSE_TRANSITION_MS / MEDIUM_PULSE_CYCLE_MS) * 100}% { color: #FFFFFF; }
          ${((MEDIUM_PULSE_TRANSITION_MS + MEDIUM_PULSE_HOLD_MS) / MEDIUM_PULSE_CYCLE_MS) * 100}% { color: #FFFFFF; }
          ${((MEDIUM_PULSE_TRANSITION_MS * 2 + MEDIUM_PULSE_HOLD_MS) / MEDIUM_PULSE_CYCLE_MS) * 100}% { color: ${INTERACTIVE_BLUE}; }
          100% { color: ${INTERACTIVE_BLUE}; }
        }
        .confidence-medium-pulse {
          animation: pcaMediumColorPulse ${MEDIUM_PULSE_CYCLE_MS}ms linear ${MEDIUM_PULSE_REPEAT_COUNT};
        }
        @media (prefers-reduced-motion: reduce) {
          .confidence-medium-pulse {
            animation: none;
          }
        }
      `}</style>

      {/* Wide side-by-side comparison — two equal columns using the full
          available width, each an independent panel + bracket + annotation
          group (small brackets pointing only at each panel's AI Confidence
          section, not the whole panel). */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-8">
        {/* transform, not margin-left, and on this outer wrapper (not just
            the panel/bracket/annotation grid) so the new header above the
            panel shifts left in lockstep with it — a negative margin on a
            stretched grid item grows its own width instead of repositioning
            it; a pure transform on their shared ancestor moves both as one
            rigid unit without affecting either's own layout. */}
        <div style={leftGroupOffset ? { transform: `translateX(-${leftGroupOffset}px)` } : undefined}>
          <div
            ref={leftLayoutRef}
            data-confidence-comparison-side
            className="grid grid-cols-1 gap-6 md:items-stretch md:gap-0"
          >
            {/* position:relative wrapper mirrors the RIGHT side's own —
                exists only so the cursor below can be positioned relative
                to the panel, without touching ConfidencePanel's own
                layout/styling. */}
            <div style={{ position: "relative" }}>
              <ConfidencePanel
                variant="quantitative"
                confidenceRef={leftConfidenceRef}
                displayPercent={displayPercent}
                panelRef={leftPanelRef}
                thumbsDownRef={leftThumbsDownRef}
                thumbsDownSelected={thumbsDownSelected}
                thumbsDownPressed={thumbsDownPressed}
                feedbackVisible={feedbackVisible}
                feedbackHeight={feedbackHeight}
                feedbackContentRef={feedbackContentRef}
                feedbackText={feedbackText}
                feedbackReducedMotion={reducedMotionRef.current}
              />
              <AnimatedCursor
                pos={leftCursorPos}
                active={leftCursorActive}
                moveDurationMs={leftCursorMoveDuration}
                easing="ease-in-out"
              />
            </div>
            <div className="relative hidden md:block">{leftMetrics && <Bracket metrics={leftMetrics} />}</div>
            <div className="relative hidden md:block">
              {leftMetrics && (
                <AnnotationWithHeader
                  metrics={leftMetrics}
                  eyebrow="Option Explored"
                  annotationHeading="Quantitative Label"
                >
                  This approach was rejected because it displayed exact numerical probabilities (e.g., 87%) alongside
                  complex chart elements, leading users to mistake model confidence for hard data metrics.
                </AnnotationWithHeader>
              )}
            </div>
            <MobileAnnotation eyebrow="Option Explored" heading="Quantitative Label">
              This approach was rejected because it displayed exact numerical probabilities (e.g., 87%) alongside
              complex chart elements, leading users to mistake model confidence for hard data metrics.
            </MobileAnnotation>
          </div>
        </div>

        <div>
          <div
            ref={rightLayoutRef}
            data-confidence-comparison-side
            className="grid grid-cols-1 gap-6 md:items-stretch md:gap-0"
          >
            {/* position:relative wrapper exists only so the cursor below can
                be positioned relative to the panel (same bounding box,
                since the panel is this wrapper's only child) without
                touching ConfidencePanel's own layout/styling for the LEFT
                call site, which renders no wrapper or cursor at all. */}
            <div style={{ position: "relative" }}>
              <ConfidencePanel
                variant="qualitative"
                confidenceRef={rightConfidenceRef}
                pulseMedium={pulseMedium}
                panelRef={rightPanelRef}
                thumbsUpRef={rightThumbsUpRef}
                thumbsUpSelected={thumbsUpSelected}
                thumbsUpPressed={thumbsUpPressed}
              />
              <AnimatedCursor pos={cursorPos} active={cursorActive} moveDurationMs={cursorMoveDuration} easing="ease-in-out" />
            </div>
            <div className="relative hidden md:block">{rightMetrics && <Bracket metrics={rightMetrics} />}</div>
            <div className="relative hidden md:block">
              {rightMetrics && (
                <AnnotationWithHeader
                  metrics={rightMetrics}
                  eyebrow="Final Direction"
                  annotationHeading="Qualitative Label"
                >
                  This approach was selected because it communicates system certainty accurately using qualitative
                  tiers (e.g., Low, Medium, and High) and remains distinct from empirical data metrics.
                </AnnotationWithHeader>
              )}
            </div>
            <MobileAnnotation eyebrow="Final Direction" heading="Qualitative Label">
              This approach was selected because it communicates system certainty accurately using qualitative tiers
              (e.g., Low, Medium, and High) and remains distinct from empirical data metrics.
            </MobileAnnotation>
          </div>
        </div>
      </div>
    </div>
  );
}
