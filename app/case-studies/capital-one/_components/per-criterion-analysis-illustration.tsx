"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import {
  ACTION_BLUE,
  ANNOTATION_HEADING_HALF_LINE,
  BORDER,
  BRACKET_STROKE,
  ENTERPRISE_FONT_STACK,
  FeedbackRow,
  GAP_LEADER_TO_TEXT,
  GAP_PANEL_TO_BRACKET,
  INTERACTIVE_BLUE,
  InfoBox,
  LEADER_LENGTH,
  MUTED,
  PRIMARY_TEXT,
  RAIL_WIDTH,
  ROW_SURFACE,
  SECONDARY_TEXT,
  SECTION_LABEL_STYLE,
  TICK_LENGTH,
  type SectionMetrics,
} from "./panel-structure-illustration";
import {
  AIAnalysisResultPanel,
  AnimatedCursor,
  ControlDescriptionFormPanel,
  ControlDescriptionIntro,
  CURSOR_HIDE_DELAY_AFTER_CLICK,
  type Point,
} from "./analysis-placement-illustration-animated";

// Hover shade for the Replay link — same value used locally (not exported,
// same reasoning) by the approved animated Capital One mock, so this reuses
// it verbatim without coupling the two files together.
const ACTION_BLUE_HOVER = "#1d4ed8";

// Sequence timing (ms). Mirrors the approved animated mock's own style of
// flat, cumulative-delay scheduling (see runSequence below) rather than a
// deeply nested callback chain.
const T_HOLD = 1000; // cursor rests at its start position before moving
const T_MOVE = 700; // cursor travel time to the "?"
const T_HOVER_PAUSE = 250; // pause over the "?" before the click pulse
const T_CLICK_PULSE = 300; // the existing click-pulse's own duration
const T_POST_CLICK_WAIT = 200; // "hold the clicked state" before the modal opens
const T_REPLAY_WAIT = 500; // Replay's own wait before rerunning the sequence

// Opening-transition timing (ms) — the backdrop and modal fade/scale in
// together but staggered, per spec: backdrop starts first, the modal starts
// 100ms into the backdrop's own 350ms fade.
const T_BACKDROP_FADE = 350;
const T_MODAL_DELAY = 100;
const T_MODAL_EASE = 300;

// Post-open "click thumbs-up" beat — timed from the moment modalOpen becomes
// true (comfortably after the modal/annotations' own ~400ms entrance
// transition above, so the 7s wait always starts once they're fully
// visible). Mirrors the same thumbs-up beat pattern already approved in
// analysis-placement-illustration-animated.tsx and reused again for
// PanelStructureIllustration — same AnimatedCursor, same press/selected
// treatment on the button, just this illustration's own timing and trigger.
const T_THUMBS_WAIT = 7000;
const T_THUMBS_MOVE = 900;
const T_THUMBS_PAUSE = 250;
const T_THUMBS_CLICK = 180;

const MODAL_WIDTH = 460;
// Annotation column's own width — per spec (400–420px) so the existing
// annotation copy has enough room; not the shared ANNOTATION_MAX_WIDTH,
// which other illustrations still use unchanged.
const ANNOTATION_COLUMN_WIDTH = 400;
// The connector zone between the modal's right edge and the annotation
// column reuses the shared Bracket/Annotation system's own geometry exactly
// (GAP_PANEL_TO_BRACKET/TICK_LENGTH/LEADER_LENGTH/GAP_LEADER_TO_TEXT/
// RAIL_WIDTH/BRACKET_STROKE, all imported above) — the same spacing already
// used by the other approved Capital One bracket annotations, rather than a
// one-off value invented for this illustration.
// The annotations sit directly on the darkened lightbox (no card/box of
// their own), so they need light-on-dark colors instead of the shared
// Bracket/Annotation system's dark-on-light ones. Both heading and body are
// pure white at full opacity per spec (no muted/reduced-opacity text on the
// dark backdrop). The bracket color is a step below white — visibly dimmer
// than the annotation headings, so the hierarchy (modal > white annotations
// > brackets > backdrop) holds — but lighter than the shared CONNECTOR_COLOR
// (#94a3b8, still used as-is by the other illustrations on light panels) for
// more headroom against the now much darker 0.82-opacity backdrop.
const ANNOTATION_HEADING_COLOR = "#FFFFFF";
const ANNOTATION_BODY_COLOR = "#FFFFFF";
const BRACKET_COLOR = "#CBD5E1";
// Padding on all sides of the foreground (modal + annotations) layer inside
// the fixed stage, so it never centers flush against the stage's own edges.
const STAGE_PADDING = 16;
// The fixed stage height at desktop widths, per spec — generous enough that
// the modal composition (~740px tall) centers with real breathing room on
// both sides. 768px matches the md: breakpoint already governing the
// bracket rail/annotation column's own visibility elsewhere in this file;
// below it, the stage falls back to the measured (workspace vs. composition)
// max — see the stageHeight effect below — since mobile's stacked annotation
// fallback can run taller than any single fixed number would safely fit.
const DESKTOP_STAGE_HEIGHT = 900;
const DESKTOP_BREAKPOINT = 768;

/**
 * TEMPORARY — local-only HTML replacement candidate for the "Per-Criterion
 * Analysis" PNG (reasoning2.png), shown below it for comparison.
 *
 * Structure: one fixed-size stage (position:relative). The Control
 * Description + AI Analysis workspace, rendered exactly once and never
 * unmounted, is its one normal-flow layer. Every animated state (cursor,
 * click pulse, lightbox backdrop, modal + bracket rail + annotations) is a
 * position:absolute layer stacked inside that same stage, toggled via
 * opacity/visibility rather than mount/unmount, so nothing about the stage
 * changes shape as the sequence advances. The modal + brackets + annotations
 * are one foreground composition (its own wrapper, sized to their combined
 * width on desktop) centered as a group within the stage — the modal sits at
 * that group's left edge with the bracket rail and annotation column
 * immediately to its right. The backdrop is one continuous layer behind that
 * entire composition, including behind the annotation column, and doubles as
 * the annotations' own background — the annotations sit directly on it in
 * light-on-dark colors (LightAnnotation/LightBracket below) rather than in a
 * card or surface of their own.
 *
 * The modal composition is taller than the compact product workspace, so the
 * stage's height can't just come from the workspace alone (that would clip
 * the modal) or grow when the modal opens (that would move the workspace and
 * shove the next section down). At desktop widths the stage is a fixed
 * DESKTOP_STAGE_HEIGHT (900px, per spec), applied via a plain CSS rule
 * (.pca-stage below) rather than JS, so it's full height on the very first
 * frame — before hydration, before any effect runs — and never depends on
 * modalOpen, so it can't grow/shrink/move at any point. Below the md
 * breakpoint it falls back to the larger of the workspace's and the
 * composition's own measured natural height (via the stageHeight JS state),
 * since mobile's stacked annotation fallback can run taller than any single
 * fixed number would safely fit. The workspace itself is plain normal flow
 * (no centering) — it renders at the TOP of the stage at its own natural
 * size, any unused height simply left empty below it; the modal composition
 * centers within the full stage independently, on its own separate absolute
 * layer. overflow:hidden on the stage backstops the brief pre-measurement
 * window on mobile.
 *
 * The PNG is a content/information-architecture reference only (which
 * sections exist in the finding-detail modal, which annotation explains
 * which part) — not a visual reference.
 *
 * Per an explicit request to reuse existing Capital One SaaS components
 * rather than rebuilding them, this file imports its shared pieces — tokens,
 * InfoBox (the surface used for Conclusion), and FeedbackRow — from
 * panel-structure-illustration.tsx, and the Control Description form, AI
 * Analysis result panel, and AnimatedCursor — exported from
 * analysis-placement-illustration-animated.tsx alongside (not instead of)
 * its own untouched animated sequence — from there. Neither shared file's
 * own rendering is changed by this reuse (both were regression-checked).
 * The bracket/annotation system itself is a local LightBracket/
 * LightAnnotation pair (below) rather than the shared Bracket/Annotation —
 * same geometry math, but recolored for the dark lightbox and sized to this
 * illustration's own rail/column widths per spec; the shared components stay
 * exactly as they are for the other illustrations that still use them on a
 * light background.
 */

function ModalDetailBox({ children }: { children: React.ReactNode }) {
  // Same InfoBox surface Panel Structure uses for Attribution/AI Confidence,
  // just without the "Learn more" link this modal doesn't call for.
  return <InfoBox learnMore={false}>{children}</InfoBox>;
}

// Local light-on-dark counterparts to Panel Structure's own Bracket/
// Annotation — same "]"-shaped connector geometry (the imported
// GAP_PANEL_TO_BRACKET/TICK_LENGTH/LEADER_LENGTH/GAP_LEADER_TO_TEXT/
// RAIL_WIDTH/BRACKET_STROKE, unchanged from the shared component — same
// spacing as the other approved Capital One bracket annotations) and the
// same annotation layout math (metrics-based vertical centering), just
// recolored for sitting directly on the darkened lightbox instead of a
// light panel.
function LightBracket({ metrics }: { metrics: SectionMetrics }) {
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
        stroke={BRACKET_COLOR}
        strokeWidth={BRACKET_STROKE}
      />
      <line x1={lineX} y1={midY} x2={lineX + LEADER_LENGTH} y2={midY} stroke={BRACKET_COLOR} strokeWidth={BRACKET_STROKE} />
    </svg>
  );
}

function LightAnnotation({
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
        width: ANNOTATION_COLUMN_WIDTH,
      }}
    >
      <h6 style={{ margin: "0 0 4px 0", fontSize: 16, lineHeight: "22px", fontWeight: 600, color: ANNOTATION_HEADING_COLOR }}>
        {heading}
      </h6>
      <p style={{ margin: 0, fontSize: 14, lineHeight: "21px", fontWeight: 400, color: ANNOTATION_BODY_COLOR }}>
        {children}
      </p>
    </div>
  );
}

// The same Control Description + AI Analysis workspace the animated mock
// renders, composed from its exported pieces (same outer card chrome/
// padding the animated mock itself uses) rather than duplicated here.
// firstRowRef is passed straight through to AIAnalysisResultPanel so the
// cursor's end position can be measured; panelRef likewise, for the
// cursor's start position ("center-right area of the AI Analysis panel").
function ControlDescriptionWorkspace({
  firstRowRef,
  panelRef,
}: {
  firstRowRef?: React.Ref<HTMLSpanElement>;
  panelRef?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div className="overflow-hidden rounded-[10px] border" style={{ borderColor: "#e6e6e6" }}>
      <div className="px-4 pb-5" style={{ paddingTop: 24 }}>
        <ControlDescriptionIntro />
        <div className="flex flex-col gap-4 md:flex-row">
          <ControlDescriptionFormPanel />
          <AIAnalysisResultPanel firstRowRef={firstRowRef} panelRef={panelRef} />
        </div>
      </div>
    </div>
  );
}

const BODY_TEXT_STYLE: React.CSSProperties = {
  fontSize: 13,
  lineHeight: "20px",
  fontWeight: 400,
  color: SECONDARY_TEXT,
};
// Inline "Label: Value" pair (Confidence Level: Low / Status: Detected) —
// label and value share one line, differentiated by weight/color only.
const INLINE_LABEL_STYLE: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 400,
  color: SECONDARY_TEXT,
};
const INLINE_VALUE_STYLE: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: PRIMARY_TEXT,
};

const ANNOTATIONS: { key: SectionKey; heading: string; body: string }[] = [
  {
    key: "header",
    heading: "Per-criterion analysis",
    body: "Provides detailed analysis for the individual criterion selected in the AI Analysis report.",
  },
  {
    key: "confidence",
    heading: "Per-criteria AI Confidence",
    body: "The confidence rating applies to this specific check rather than the overall evaluation. Individual confidence ratings make uncertainty visible at the criterion level and aggregate to inform the overall confidence score.",
  },
  {
    key: "conclusion",
    heading: "Conclusion",
    body: "The final actionable decision, classification, or recommendation generated by the AI system.",
  },
  {
    key: "evidence",
    heading: "Evidence",
    body: "The data points retrieved to substantiate the output.",
  },
  {
    key: "reasoning",
    heading: "Reasoning",
    body: "The contextual explanation linking the evidence to the conclusion.",
  },
  {
    key: "logic",
    heading: "Logic",
    body: "The foundational rules governing how inputs are systematically processed into outcomes.",
  },
];

type SectionKey = "header" | "confidence" | "conclusion" | "evidence" | "reasoning" | "logic";
type MetricsState = Record<SectionKey, SectionMetrics | null>;

export function PerCriterionAnalysisIllustration() {
  // The fixed stage — the single positioned ancestor every layer (cursor,
  // backdrop, modal + annotations) shares. Also the reference frame for the
  // cursor's start position ("center-right area of the AI Analysis panel")
  // and end position (the first Report row's "?").
  const stageRef = useRef<HTMLDivElement>(null);
  const aiPanelRef = useRef<HTMLDivElement>(null);
  const firstRowRef = useRef<HTMLSpanElement>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  // Wraps the workspace — its own natural height is one of the two inputs
  // to stageHeight below (the other is the composition's, via compositionRef).
  const workspaceWrapRef = useRef<HTMLDivElement>(null);
  // Wraps the whole modal + rail + annotation group (the .pca-composition
  // div) — measured for its natural height even while hidden (visibility:
  // hidden preserves layout), so stageHeight accounts for it from first
  // mount, before the modal has ever opened.
  const compositionRef = useRef<HTMLDivElement>(null);

  // Modal-open-only: the card's own section refs, measured against
  // cardWrapRef (the position:relative box sized to the modal card, shared
  // by the card, the bracket rail, and the annotations) so brackets/
  // annotations stay aligned to their sections while the modal itself stays
  // centered — the rail/annotations are absolutely positioned overlays
  // attached to this same wrapper, not inside the card's own overflow-hidden
  // box, and don't affect what gets centered.
  const cardWrapRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const confidenceRef = useRef<HTMLDivElement>(null);
  const conclusionRef = useRef<HTMLDivElement>(null);
  const evidenceRef = useRef<HTMLDivElement>(null);
  const reasoningRef = useRef<HTMLDivElement>(null);
  const logicRef = useRef<HTMLDivElement>(null);
  // The thumbs-up button itself (inside FeedbackRow, forwarded through it) —
  // the target of the post-open cursor beat below.
  const thumbsUpRef = useRef<HTMLSpanElement>(null);
  const [metrics, setMetrics] = useState<MetricsState>({
    header: null,
    confidence: null,
    conclusion: null,
    evidence: null,
    reasoning: null,
    logic: null,
  });

  // The stage's own fixed height: DESKTOP_STAGE_HEIGHT (900) at desktop
  // widths, or (below the md breakpoint) the larger of the workspace's and
  // the composition's own natural height, plus the foreground layer's own
  // padding so centering the composition never needs to eat into it. Set on
  // mount/resize, never in response to modalOpen or Replay, so the stage
  // truly never changes size when the modal opens, closes, or replays. Null
  // only until the first measurement lands, in which case the stage falls
  // back to its own auto (workspace-only) height for that one frame.
  const [stageHeight, setStageHeight] = useState<number | null>(null);

  // modalOpen: false = the product workspace with the cursor demonstrating
  // the "?" click, true = the modal (no brackets/annotations — hidden
  // entirely while the modal is open). sequenceKey re-triggers the sequence
  // effect below on Replay.
  const [modalOpen, setModalOpen] = useState(false);
  const [sequenceKey, setSequenceKey] = useState(0);
  const [reducedMotion, setReducedMotionState] = useState(false);
  const reducedMotionRef = useRef(false);
  const [cursorActive, setCursorActive] = useState(false);
  const [cursorPos, setCursorPos] = useState<Point>({ x: 0, y: 0 });
  const [cursorMoveDuration, setCursorMoveDuration] = useState<number | null>(null);
  const [showPulse, setShowPulse] = useState(false);
  // Drives the backdrop/modal opening transition: false = start state
  // (backdrop transparent, modal faded/scaled down), true = end state.
  // Reset to false the instant modalOpen goes false (Replay), so the next
  // open always starts the transition fresh rather than resuming mid-fade.
  const [transitionIn, setTransitionIn] = useState(false);

  // Post-open "click thumbs-up" beat — a second, separate cursor from the
  // one above (that one lives on the pre-modal workspace layer and is
  // hidden once modalOpen is true; this one is positioned relative to
  // cardWrapRef, the same anchor brackets/annotations already use, and is
  // only ever active during this beat).
  const [modalCursorActive, setModalCursorActive] = useState(false);
  const [modalCursorPos, setModalCursorPos] = useState<Point>({ x: 0, y: 0 });
  const [modalCursorMoveDuration, setModalCursorMoveDuration] = useState<number | null>(null);
  const [thumbsUpSelected, setThumbsUpSelected] = useState(false);
  const [thumbsUpPressed, setThumbsUpPressed] = useState(false);

  function setReducedMotion(value: boolean) {
    reducedMotionRef.current = value;
    setReducedMotionState(value);
  }

  function clearTimers() {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }

  function schedule(fn: () => void, delay: number) {
    timeoutsRef.current.push(setTimeout(fn, delay));
  }

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => clearTimers, []);

  function computeStartPos(): Point | null {
    const wrap = stageRef.current;
    const panel = aiPanelRef.current;
    if (!wrap || !panel) return null;
    const wrapRect = wrap.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    // Center-right area of the AI Analysis panel.
    return {
      x: panelRect.left - wrapRect.left + panelRect.width * 0.65,
      y: panelRect.top - wrapRect.top + panelRect.height * 0.35,
    };
  }

  function computeTargetPos(): Point | null {
    const wrap = stageRef.current;
    const target = firstRowRef.current;
    if (!wrap || !target) return null;
    const icon = target.querySelector("svg") ?? target;
    const iconRect = icon.getBoundingClientRect();
    const wrapRect = wrap.getBoundingClientRect();
    return {
      x: iconRect.left + iconRect.width / 2 - wrapRect.left,
      y: iconRect.top + iconRect.height / 2 - wrapRect.top,
    };
  }

  // Neutral resting point for the post-open cursor beat, near the modal
  // header's own right side (close to the decorative close button) — inside
  // the modal, away from the thumbs-up button it's about to move to.
  // Relative to cardWrapRef, the same anchor brackets/annotations use.
  function computeThumbsNeutralPos(): Point | null {
    const container = cardWrapRef.current;
    const header = headerRef.current;
    if (!container || !header) return null;
    const containerRect = container.getBoundingClientRect();
    const headerRect = header.getBoundingClientRect();
    return {
      x: headerRect.left - containerRect.left + headerRect.width * 0.85,
      y: headerRect.top - containerRect.top + headerRect.height * 0.5,
    };
  }

  function computeThumbsUpPos(): Point | null {
    const container = cardWrapRef.current;
    const thumb = thumbsUpRef.current;
    if (!container || !thumb) return null;
    const containerRect = container.getBoundingClientRect();
    const thumbRect = thumb.getBoundingClientRect();
    return {
      x: thumbRect.left - containerRect.left + thumbRect.width / 2,
      y: thumbRect.top - containerRect.top + thumbRect.height / 2,
    };
  }

  // The interaction: hold at the start position -> move to the "?" -> pause
  // -> click pulse -> hold the clicked state -> open the modal. Flat,
  // cumulative-delay scheduling, the same style the approved animated mock
  // uses for its own sequence, rather than nested callbacks.
  function runSequence(holdDelay: number) {
    clearTimers();
    // Reset the post-open thumbs-up beat's own state every run (initial
    // mount and every Replay) — clearTimers above already cancels any of
    // its still-pending timers from a previous cycle; this undoes state
    // changes that already landed (e.g. a completed previous cycle's
    // selected thumbs-up) so each run starts from the same clean slate.
    setModalCursorActive(false);
    setThumbsUpPressed(false);
    setThumbsUpSelected(false);
    const start = computeStartPos();
    const target = computeTargetPos();
    if (!start || !target) return;

    if (reducedMotionRef.current) {
      // Reduced motion: no cursor, near-instant reset straight to the modal
      // — same contract the approved animated mock uses for this preference.
      setCursorActive(false);
      setShowPulse(false);
      schedule(() => setModalOpen(true), 50);
      return;
    }

    setShowPulse(false);
    setCursorMoveDuration(null);
    setCursorPos(start);
    setCursorActive(true);

    schedule(() => {
      setCursorMoveDuration(T_MOVE);
      setCursorPos(target);
    }, holdDelay);
    schedule(() => setShowPulse(true), holdDelay + T_MOVE + T_HOVER_PAUSE);
    schedule(() => setShowPulse(false), holdDelay + T_MOVE + T_HOVER_PAUSE + T_CLICK_PULSE);
    // Global cursor rule — hide exactly CURSOR_HIDE_DELAY_AFTER_CLICK after
    // this click completes. In practice the modal opening (T_POST_CLICK_WAIT
    // later, unchanged) already conceals this layer well before that, but
    // the cursor's own active state is still capped the same as every other
    // click for consistency.
    schedule(
      () => setCursorActive(false),
      holdDelay + T_MOVE + T_HOVER_PAUSE + T_CLICK_PULSE + CURSOR_HIDE_DELAY_AFTER_CLICK,
    );
    schedule(() => setModalOpen(true), holdDelay + T_MOVE + T_HOVER_PAUSE + T_CLICK_PULSE + T_POST_CLICK_WAIT);
  }

  // Runs the sequence once the workspace (and its measurement refs) are
  // mounted — on this component's own mount, and again whenever Replay
  // resets modalOpen back to false. First run holds T_HOLD; Replay's own
  // "wait 500ms" (T_REPLAY_WAIT) is shorter, per its own spec.
  useEffect(() => {
    if (modalOpen) return;
    runSequence(sequenceKey === 0 ? T_HOLD : T_REPLAY_WAIT);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen, sequenceKey, reducedMotion]);

  // The post-open "click thumbs-up" beat. Fires every time modalOpen
  // becomes true — including after Replay, since modalOpen goes
  // false -> true again on every cycle — never on the initial false state.
  // Reduced motion skips straight to the selected end state, same contract
  // as the rest of this sequence.
  useEffect(() => {
    if (!modalOpen) return;
    if (reducedMotionRef.current) {
      schedule(() => setThumbsUpSelected(true), 50);
      return;
    }
    schedule(() => {
      const start = computeThumbsNeutralPos();
      const end = computeThumbsUpPos();
      if (!start || !end) return;
      setModalCursorMoveDuration(null);
      setModalCursorPos(start);
      setModalCursorActive(true);
      schedule(() => {
        setModalCursorMoveDuration(T_THUMBS_MOVE);
        setModalCursorPos(end);
      }, 0);
      schedule(() => setThumbsUpPressed(true), T_THUMBS_MOVE + T_THUMBS_PAUSE);
      schedule(() => {
        setThumbsUpPressed(false);
        setThumbsUpSelected(true);
      }, T_THUMBS_MOVE + T_THUMBS_PAUSE + T_THUMBS_CLICK);
      // Global cursor rule — hide exactly CURSOR_HIDE_DELAY_AFTER_CLICK after
      // this click completes, never left resting on the button indefinitely.
      schedule(
        () => setModalCursorActive(false),
        T_THUMBS_MOVE + T_THUMBS_PAUSE + T_THUMBS_CLICK + CURSOR_HIDE_DELAY_AFTER_CLICK,
      );
    }, T_THUMBS_WAIT);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen, reducedMotion]);

  function handleReplay() {
    setModalOpen(false);
    setSequenceKey((k) => k + 1);
  }

  // Drives the opening transition. The moment modalOpen goes false, reset
  // immediately (no fade out — Replay's own reset, per spec, is instant).
  // The moment it goes true, a deferred setTimeout (not requestAnimationFrame
  // — rAF is suspended entirely while the tab/pane isn't visible, whereas a
  // timer still fires) flips to the "end" state on the next tick, after the
  // "start" state has had a chance to paint, so the CSS transition actually
  // animates instead of jumping straight to its end value.
  useEffect(() => {
    if (!modalOpen) {
      setTransitionIn(false);
      return;
    }
    if (reducedMotionRef.current) {
      setTransitionIn(true);
      return;
    }
    const t = setTimeout(() => setTransitionIn(true), 0);
    return () => clearTimeout(t);
  }, [modalOpen, reducedMotion]);

  // Re-measures whenever the modal mounts (its section refs are null until
  // modalOpen is true).
  useEffect(() => {
    function measure() {
      const container = cardWrapRef.current;
      const refs: Record<SectionKey, HTMLDivElement | null> = {
        header: headerRef.current,
        confidence: confidenceRef.current,
        conclusion: conclusionRef.current,
        evidence: evidenceRef.current,
        reasoning: reasoningRef.current,
        logic: logicRef.current,
      };
      if (!container || Object.values(refs).some((el) => !el)) return;
      const containerRect = container.getBoundingClientRect();
      const next = {} as MetricsState;
      (Object.keys(refs) as SectionKey[]).forEach((key) => {
        const r = refs[key]!.getBoundingClientRect();
        next[key] = { top: r.top - containerRect.top, height: r.height };
      });
      setMetrics(next);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [modalOpen]);

  // Sets the stage's fixed height. At desktop widths this JS value merely
  // matches the .pca-stage CSS rule above (DESKTOP_STAGE_HEIGHT, 900) — that
  // CSS rule, not this effect, is what's actually already correct on first
  // paint, since this effect can't run until after mount/hydration. Below
  // the md breakpoint (where that CSS rule doesn't apply) this is the real
  // source of the stage's height: the larger of the workspace's and the
  // composition's own natural height (compositionRef stays measurable even
  // while visibility:hidden, so this already accounts for the taller modal
  // before it has ever opened). Re-run on resize so crossing the breakpoint
  // updates live; deliberately NOT re-run when modalOpen changes — only
  // content/viewport changes should ever move this number, never which
  // layer is showing or whether Replay just fired.
  useEffect(() => {
    function measureStage() {
      if (window.innerWidth >= DESKTOP_BREAKPOINT) {
        setStageHeight(DESKTOP_STAGE_HEIGHT);
        return;
      }
      const workspace = workspaceWrapRef.current;
      const composition = compositionRef.current;
      if (!workspace || !composition) return;
      const workspaceHeight = workspace.getBoundingClientRect().height;
      const compositionHeight = composition.getBoundingClientRect().height;
      setStageHeight(Math.max(workspaceHeight, compositionHeight + STAGE_PADDING * 2));
    }
    measureStage();
    window.addEventListener("resize", measureStage);
    return () => window.removeEventListener("resize", measureStage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        fontFamily: ENTERPRISE_FONT_STACK,
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
    >
      <style>{`
        .pca-close-btn:hover {
          background: #f1f5f9;
          color: ${PRIMARY_TEXT};
        }
        .pca-close-btn:focus-visible {
          outline: 2px solid ${INTERACTIVE_BLUE};
          outline-offset: 2px;
        }
        .pca-replay-btn:hover {
          color: ${ACTION_BLUE_HOVER};
          text-decoration: underline;
        }
        .pca-replay-btn:focus-visible {
          outline: 2px solid ${ACTION_BLUE};
          outline-offset: 2px;
        }
        .pca-composition {
          width: ${MODAL_WIDTH}px;
        }
        @media (min-width: 768px) {
          .pca-composition {
            width: ${MODAL_WIDTH + RAIL_WIDTH + ANNOTATION_COLUMN_WIDTH}px;
          }
          /* Plain CSS, not JS — this is what actually guarantees the stage
             is full height on the very first frame (including the
             server-rendered HTML, before React ever hydrates or an effect
             can run). The stageHeight JS state below still sets the same
             value inline once mounted (inline styles win over this rule),
             which is what actually drives the mobile fallback below this
             breakpoint — on desktop the two simply agree. */
          .pca-stage {
            height: ${DESKTOP_STAGE_HEIGHT}px;
          }
        }
        @keyframes pcaClickPulse {
          0% {
            transform: scale(0.4);
            opacity: 0.7;
          }
          70% {
            transform: scale(1.6);
            opacity: 0.15;
          }
          100% {
            transform: scale(1.9);
            opacity: 0;
          }
        }
      `}</style>

      {/* ONE fixed stage. The .pca-stage CSS rule above (not JS) is what
          makes it full height from the very first frame, including before
          hydration — stageHeight below fills in the same value inline once
          mounted (a no-op on desktop, where it just matches the CSS; it's
          what actually drives the mobile fallback, which needs the real
          measured content height instead of a fixed number). Either way the
          stage's own size never depends on modalOpen, so it can't grow,
          shrink, or move at any point in the sequence, on Replay, or once
          settled. overflow:hidden backstops the one frame before mobile's
          own measurement lands. */}
      <div
        ref={stageRef}
        className="pca-stage"
        style={{
          position: "relative",
          height: stageHeight ?? undefined,
          overflow: "hidden",
        }}
      >
        {/* Layer 1 — product workspace. Rendered exactly once, unconditionally;
            never unmounts, resizes, or reflows across the sequence. Plain
            normal flow (no centering) — it sits at the TOP of the stage,
            exactly at its own natural size, with any unused stage height
            simply left empty below it. This holds in every state (initial,
            cursor movement, modal open, Replay) since it's just where a
            normal-flow child renders, not something toggled per state. */}
        <div ref={workspaceWrapRef}>
          <ControlDescriptionWorkspace firstRowRef={firstRowRef} panelRef={aiPanelRef} />
        </div>

        {/* Layer — cursor + click pulse. Hidden the instant the modal opens
            (no fade of its own, matching how it simply unmounted before). */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            opacity: modalOpen ? 0 : 1,
            pointerEvents: "none",
          }}
        >
          <AnimatedCursor pos={cursorPos} active={cursorActive} moveDurationMs={cursorMoveDuration} easing="ease-in-out" />
          {showPulse && (
            <span
              key={sequenceKey}
              aria-hidden="true"
              style={{
                position: "absolute",
                left: cursorPos.x - 10,
                top: cursorPos.y - 10,
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: INTERACTIVE_BLUE,
                animation: `pcaClickPulse ${T_CLICK_PULSE}ms ease-out forwards`,
                pointerEvents: "none",
              }}
            />
          )}
        </div>

        {/* Layer 2 — lightbox. Covers the full stage continuously (inset:0),
            including the area behind the annotation column — no split. Also
            the annotations' own background now (no separate white surface
            behind them), so its opacity is tuned high enough that the
            underlying workspace stays only faintly recognizable as context —
            never readable or competing with the white modal/annotations. No
            blur; contrast comes entirely from the color/opacity here plus
            the fully white (not muted) annotation text below. */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(15, 23, 42, 0.82)",
            borderRadius: 10,
            opacity: modalOpen && transitionIn ? 1 : 0,
            pointerEvents: modalOpen ? "auto" : "none",
            transition: reducedMotion ? "none" : `opacity ${T_BACKDROP_FADE}ms ease-out`,
          }}
        />

        {/* Layer 3 — modal + brackets + annotations, one foreground
            composition. Hidden via visibility (not unmounted) until the
            modal first opens, so there is no initial flash; once modalOpen
            flips true the composition appears and the card itself runs its
            own opacity/transform transition exactly as before — brackets
            and annotations are still never animated. */}
        <div
          aria-hidden={!modalOpen || undefined}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: STAGE_PADDING,
            visibility: modalOpen ? "visible" : "hidden",
            pointerEvents: modalOpen ? "auto" : "none",
          }}
        >
          {/* Sized to the modal + rail + annotation combined width on
              desktop (modal width only on mobile, where the rail/annotation
              column is hidden) via the .pca-composition rule above, so this
              whole group — not just the card — centers within the stage.
              compositionRef captures its true rendered height (including any
              annotation text that runs slightly past the card's own bottom
              edge) for the stageHeight measurement above. */}
          <div ref={compositionRef} className="pca-composition" style={{ position: "relative", maxWidth: "100%" }}>
            <div ref={cardWrapRef} style={{ position: "relative", width: MODAL_WIDTH, maxWidth: "100%" }}>
              {/* The modal card itself — fixed 460px width, compact section
                  spacing (font sizes untouched) so it fits the workspace with
                  no internal scrollbar. */}
              <div
                className="overflow-hidden rounded-[10px] border"
                style={{
                  borderColor: "#e6e6e6",
                  padding: 20,
                  background: "#fff",
                  boxShadow: "0 20px 45px -12px rgba(15, 23, 42, 0.35)",
                  opacity: transitionIn ? 1 : 0,
                  transform: transitionIn ? "translateY(0) scale(1)" : "translateY(8px) scale(0.98)",
                  transition: reducedMotion
                    ? "none"
                    : `opacity ${T_MODAL_EASE}ms ease-out ${T_MODAL_DELAY}ms, transform ${T_MODAL_EASE}ms ease-out ${T_MODAL_DELAY}ms`,
                }}
              >
              <div ref={headerRef} className="flex items-start justify-between">
                <div>
                  <span style={SECTION_LABEL_STYLE}>Access Control Review</span>
                  <h4
                    style={{
                      margin: "4px 0 0 0",
                      fontSize: 18,
                      lineHeight: "26px",
                      fontWeight: 600,
                      letterSpacing: "-0.01em",
                      color: PRIMARY_TEXT,
                    }}
                  >
                    AI Finding &amp; Explanation
                  </h4>
                </div>
                {/* Decorative — this is a static mockup with no real modal to
                    close, matching the same aria-hidden/tabIndex=-1 pattern used
                    for the decorative "Run Analysis" button elsewhere in this
                    system. Hover/focus-visible states are still styled so the
                    affordance itself can be reviewed. */}
                <button
                  type="button"
                  tabIndex={-1}
                  aria-hidden="true"
                  className="pca-close-btn flex shrink-0 items-center justify-center rounded-md"
                  style={{ width: 32, height: 32, color: MUTED, cursor: "default" }}
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </div>

              {/* AI Confidence — its own section, fully separate from status.
                  Qualitative confidence only ("Low"), no numerical score. */}
              <div ref={confidenceRef} style={{ marginTop: 16 }}>
                <span style={SECTION_LABEL_STYLE}>AI Confidence</span>
                <ModalDetailBox>
                  <span style={{ display: "block", marginBottom: 8 }}>
                    <span style={INLINE_LABEL_STYLE}>Confidence Level: </span>
                    <span style={INLINE_VALUE_STYLE}>Low</span>
                  </span>
                  <span style={BODY_TEXT_STYLE}>
                    The Device ID behind this session could not be fully verified, which limits confidence even
                    though the velocity anomaly itself was clearly detected.
                  </span>
                </ModalDetailBox>
              </div>

              {/* Conclusion is the modal's primary/actionable section — given
                  the strongest visual weight instead of matching AI
                  Confidence's neutral blue box. Reuses the same light-neutral
                  ROW_SURFACE already established for Report rows, plus a 3px
                  blue left border/rule (INTERACTIVE_BLUE) to read as the
                  callout that drives the suggested action. */}
              <div ref={conclusionRef} style={{ marginTop: 18 }}>
                <span style={SECTION_LABEL_STYLE}>Conclusion</span>
                <div
                  className="rounded-md"
                  style={{ marginTop: 8, padding: 16, background: ROW_SURFACE, borderLeft: `3px solid ${INTERACTIVE_BLUE}` }}
                >
                  <span style={{ display: "block", marginBottom: 8 }}>
                    <span style={INLINE_LABEL_STYLE}>Status: </span>
                    <span style={INLINE_VALUE_STYLE}>Detected</span>
                  </span>
                  <span style={BODY_TEXT_STYLE}>
                    Suggested action:{" "}
                    <span style={{ fontSize: 14, fontWeight: 600, color: INTERACTIVE_BLUE }}>
                      Escalate to Tier-2 Manual Review
                    </span>
                  </span>
                </div>
              </div>

              {/* Evidence / Reasoning / Attribution-Logic are quieter
                  supporting information, kept compact — no blue box, content
                  sits directly on the modal's white background, separated by
                  subtle BORDER-colored dividers. */}
              <div ref={evidenceRef} style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${BORDER}` }}>
                <span style={SECTION_LABEL_STYLE}>Evidence</span>
                <p style={{ ...BODY_TEXT_STYLE, margin: "6px 0 0 0" }}>Session logs, geo shift, device ID</p>
              </div>

              <div ref={reasoningRef} style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${BORDER}` }}>
                <span style={SECTION_LABEL_STYLE}>Reasoning</span>
                <p style={{ ...BODY_TEXT_STYLE, margin: "6px 0 0 0" }}>
                  Velocity exceeded the 120mph threshold. Conflicting spatial signals triggered a risk exception.
                </p>
              </div>

              <div ref={logicRef} style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${BORDER}` }}>
                <span style={SECTION_LABEL_STYLE}>Attribution / Logic</span>
                <p style={{ ...BODY_TEXT_STYLE, margin: "6px 0 0 0" }}>Enterprise Risk Policy v2026.04, Section 4.2</p>
              </div>

              {/* Reused verbatim from Panel Structure's own AI Analysis panel —
                  same component, so typography/icons/button size/spacing/divider
                  are guaranteed identical rather than hand-matched.
                  thumbsUpRef/thumbsUpSelected/thumbsUpPressed drive the
                  post-open cursor beat below — the same optional props
                  PanelStructureIllustration's own thumbs-up beat already
                  uses, so this reuses FeedbackRow's existing selected/
                  pressed treatment rather than a new one. */}
              <FeedbackRow thumbsUpRef={thumbsUpRef} thumbsUpSelected={thumbsUpSelected} thumbsUpPressed={thumbsUpPressed} />
              </div>

              {/* Cursor for the post-open "click thumbs-up" beat — a second,
                  separate AnimatedCursor instance from the one on the
                  pre-modal workspace layer above (which is hidden once
                  modalOpen is true). Positioned relative to cardWrapRef, the
                  same anchor brackets/annotations use; only ever visible
                  while modalCursorActive is true. */}
              <AnimatedCursor
                pos={modalCursorPos}
                active={modalCursorActive}
                moveDurationMs={modalCursorMoveDuration}
                easing="ease-in-out"
              />

              {/* Bracket rail — absolutely positioned overlay attached to
                  cardWrapRef, starting exactly at the card's own right edge.
                  Uses the shared Bracket system's own geometry (imported
                  RAIL_WIDTH etc.) — the same spacing as the other approved
                  Capital One bracket annotations. Desktop only. */}
              <div
                className="relative hidden md:block"
                style={{ position: "absolute", left: MODAL_WIDTH, top: 0, width: RAIL_WIDTH, height: "100%" }}
              >
                {ANNOTATIONS.map(({ key }) => {
                  const m = metrics[key];
                  return m ? <LightBracket key={key} metrics={m} /> : null;
                })}
              </div>

              {/* Annotations — sit directly on the lightbox (no card/box of
                  their own), in light-on-dark colors (LightAnnotation),
                  starting right after the bracket rail. Column is
                  ANNOTATION_COLUMN_WIDTH (400) so the existing copy has room
                  to breathe. */}
              <div
                className="relative hidden md:block"
                style={{
                  position: "absolute",
                  left: MODAL_WIDTH + RAIL_WIDTH,
                  top: 0,
                  width: ANNOTATION_COLUMN_WIDTH,
                  height: "100%",
                }}
              >
                {ANNOTATIONS.map(({ key, heading, body }) => {
                  const m = metrics[key];
                  return m ? (
                    <LightAnnotation key={key} metrics={m} heading={heading}>
                      {body}
                    </LightAnnotation>
                  ) : null;
                })}
              </div>

              {/* Mobile fallback — same six annotations without the bracket
                  geometry (which requires the side-by-side desktop layout).
                  Same light-on-dark colors as the desktop annotations, since
                  this also sits directly on the lightbox, just stacked
                  below the modal card instead of positioned beside it. */}
              <div className="mt-6 flex flex-col gap-6 md:hidden">
                {ANNOTATIONS.map(({ key, heading, body }) => (
                  <div key={key}>
                    <h6
                      style={{
                        margin: "0 0 4px 0",
                        fontSize: 16,
                        lineHeight: "22px",
                        fontWeight: 600,
                        color: ANNOTATION_HEADING_COLOR,
                      }}
                    >
                      {heading}
                    </h6>
                    <p style={{ margin: 0, fontSize: 14, lineHeight: "21px", fontWeight: 400, color: ANNOTATION_BODY_COLOR }}>
                      {body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 flex justify-end">
        <button
          type="button"
          onClick={handleReplay}
          className="pca-replay-btn focus-visible:outline-none"
          style={{
            fontSize: 12,
            lineHeight: "16px",
            fontWeight: 500,
            color: ACTION_BLUE,
            background: "none",
            border: "none",
            padding: 0,
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          ↻ Replay interaction
        </button>
      </div>
    </div>
  );
}
