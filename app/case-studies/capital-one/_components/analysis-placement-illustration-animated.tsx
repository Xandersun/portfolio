"use client";

import { useEffect, useRef, useState } from "react";
import { HelpCircle, MousePointer2, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";

/**
 * TEMPORARY — local animated-interaction test, not part of the shipped case
 * study. A self-contained duplicate of analysis-placement-illustration.tsx's
 * AnalysisPlacementMockup (that file is intentionally untouched — every
 * token/style below is re-declared here rather than imported, so this file
 * can be deleted later with zero impact on the static mockup) with a
 * simulated cursor driving: author -> Run Analysis -> loading -> AI findings.
 *
 * Dimension locking: the AI Analysis panel's content area never resizes
 * across phases. An invisible, always-mounted clone of the final result
 * content (measureRef) is measured via ResizeObserver on mount; that
 * measured height is applied as a minHeight to the visible swapped content
 * for every phase, so the empty/loading states reserve the exact space the
 * populated results need instead of the panel growing when they appear.
 */

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
const RUN_ANALYSIS_BG = "#315B8A";
const RUN_ANALYSIS_BG_HOVER = "#284D76";

const ENTERPRISE_FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const SECTION_LABEL_STYLE: React.CSSProperties = {
  fontSize: 12,
  lineHeight: "16px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "#64748b",
};
// Enterprise Blue action-element color — used for the Replay link (this
// file's own "interactive utility link", the same role "Learn more" plays
// in the Panel Structure illustration). Distinct from RUN_ANALYSIS_BG,
// which stays untouched on the Run Analysis button itself.
const ACTION_BLUE = "#2563eb";
const ACTION_BLUE_HOVER = "#1d4ed8";

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
      <HelpCircle className="size-3.5" style={{ color: DETECTED_TEXT }} aria-hidden="true" />
    </span>
  );
}

// The exact final AI Analysis content — rendered both as the visible
// 'result' state and (off-screen) as the measurement clone that locks the
// panel's reserved height, so the two are guaranteed to match. thumbsUpRef
// is only passed on the visible instance (the cursor's thumbs-up target);
// the hidden measurement clone renders without it. Exported (with the
// additional optional firstRowRef) so other Capital One illustrations reuse
// this exact populated content instead of recreating it; both existing call
// sites here pass neither new prop, so their own rendering is unaffected.
export function ResultContent({
  thumbsUpRef,
  thumbsUpSelected,
  thumbsClickActive,
  firstRowRef,
}: {
  thumbsUpRef?: React.Ref<HTMLSpanElement>;
  thumbsUpSelected?: boolean;
  thumbsClickActive?: boolean;
  firstRowRef?: React.Ref<HTMLSpanElement>;
}) {
  return (
    <>
      <span className="mb-2" style={SECTION_LABEL_STYLE}>
        AI Confidence
      </span>
      <div className="h-2 rounded-[2px]" style={{ background: INPUT_BG, marginBottom: 18 }} />

      <span className="mb-2" style={SECTION_LABEL_STYLE}>
        Report
      </span>
      <div className="flex flex-col gap-2">
        {REPORT_ROWS.map((row, i) => (
          <div key={i} className="flex items-center justify-between gap-2">
            <div className="h-2 rounded-[2px]" style={{ width: row.width, background: SKELETON }} />
            <span ref={i === 0 ? firstRowRef : undefined}>
              <StatusPill detected={row.detected} />
            </span>
          </div>
        ))}
      </div>

      <span className="mb-2" style={{ ...SECTION_LABEL_STYLE, marginTop: 18 }}>
        Attribution
      </span>
      <div className="w-full rounded-[2px]" style={{ background: INPUT_BG, height: 42 }} />

      <div className="flex-1" />

      <div className="flex items-center justify-between pt-4" style={{ marginTop: 24 }}>
        <span className="text-[12px]" style={{ color: MUTED }}>
          Was this helpful?
        </span>
        <div className="flex gap-1.5">
          <span
            ref={thumbsUpRef}
            className="flex size-[22px] items-center justify-center rounded border"
            style={{
              borderColor: thumbsUpSelected ? RUN_ANALYSIS_BG : "#e2e6ea",
              background: thumbsUpSelected ? RUN_ANALYSIS_BG : "transparent",
              color: thumbsUpSelected ? "#FFFFFF" : MUTED,
              transform: thumbsClickActive ? "scale(0.9)" : "scale(1)",
              transition: "background 150ms ease, border-color 150ms ease, color 150ms ease, transform 100ms ease",
            }}
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
    </>
  );
}

// Sequence timing (ms), from the moment the sequence starts.
// T_AUTOPLAY_DELAY is a single up-front wait used only for automatic,
// scroll-triggered playback — the cursor just rests near Run Analysis,
// nothing else happens. Replay uses 0ms here instead (passed in directly
// at its call site). Every step after this delay (T_INITIAL_PAUSE onward)
// is identical either way.
const T_AUTOPLAY_DELAY = 2500;
const T_INITIAL_PAUSE = 800;
const T_CURSOR_MOVE = 1200;
const T_HOVER_PAUSE = 500;
const T_CLICK_FEEDBACK = 150;
const T_LOADING = 1500;
const T_RESULT_REVEAL = 300;

// Thumbs-up beat — a small joke, not a feedback workflow: once results are
// visible, the viewer gets a full 10s to actually read them, then the
// cursor comes back and gives the result a thumbs-up, and the animation
// stops for good. Timed from the moment 'result' is reached, regardless of
// which path (autoplay or manual click) got there.
const T_RESULT_HOLD = 4000;
const T_THUMBS_MOVE = 900;
const T_THUMBS_PAUSE = 250;

// Global cursor rule (Capital One case study): every simulated cursor stays
// visible for exactly this long after its click completes, then hides —
// never left resting on the clicked control indefinitely. Exported so every
// other Capital One illustration's own cursor+click sequence reuses this one
// value instead of a hand-copied "3000".
export const CURSOR_HIDE_DELAY_AFTER_CLICK = 3000;

// The Control Description form (LEFT panel), extracted so other Capital One
// illustrations reuse this exact workspace instead of recreating it. All
// props are optional and default to the button's plain resting appearance —
// the original animated mockup below is the only caller that passes them.
export function ControlDescriptionFormPanel({
  buttonRef,
  onButtonClick,
  hoverActive = false,
  clickActive = false,
}: {
  buttonRef?: React.Ref<HTMLButtonElement>;
  onButtonClick?: () => void;
  hoverActive?: boolean;
  clickActive?: boolean;
}) {
  return (
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

      <button
        ref={buttonRef}
        type="button"
        onClick={onButtonClick}
        className="mt-auto w-fit text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
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
          background: hoverActive ? RUN_ANALYSIS_BG_HOVER : RUN_ANALYSIS_BG,
          transform: clickActive ? "scale(0.96)" : "scale(1)",
          transition: "background 150ms ease, transform 100ms ease",
          outlineColor: RUN_ANALYSIS_BG,
        }}
      >
        <Sparkles size={16} style={{ width: 16, height: 16 }} aria-hidden="true" />
        Run Analysis
      </button>
    </div>
  );
}

// The "Control Description" intro heading + paragraph shared by both
// panels below it — exported alongside the two panels so a caller reusing
// the whole workspace doesn't have to hand-copy this text separately.
export function ControlDescriptionIntro() {
  return (
    <>
      <h4 style={{ margin: "0 0 4px 0", fontSize: 16, fontWeight: 600, color: PRIMARY_TEXT }}>
        Control Description
      </h4>
      <p style={{ margin: "0 0 16px 0", fontSize: 13, lineHeight: 1.5, fontWeight: 400, color: SECONDARY_TEXT }}>
        Complete the form below to describe the control.
      </p>
    </>
  );
}

// The AI Analysis panel (RIGHT), always showing the completed result — for
// callers that want this workspace already finished rather than the
// animated mockup's own loading/hidden phase-gating. Reuses ResultContent
// exactly (same Confidence bar/Report rows/Attribution/feedback row), just
// without the phase logic that only makes sense inside the animated mockup
// itself. firstRowRef is passed straight through to ResultContent; panelRef
// is on this panel's own root (for callers that need to measure it, e.g. to
// position a cursor relative to it).
export function AIAnalysisResultPanel({
  firstRowRef,
  panelRef,
}: {
  firstRowRef?: React.Ref<HTMLSpanElement>;
  panelRef?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={panelRef}
      className="flex flex-col rounded-md border md:basis-[35%]"
      style={{ borderColor: BORDER, padding: "22px 20px 20px" }}
    >
      <h5
        style={{
          fontSize: 16,
          lineHeight: "24px",
          fontWeight: 600,
          letterSpacing: "-0.01em",
          color: PRIMARY_TEXT,
          marginBottom: 14,
        }}
      >
        AI Analysis
      </h5>
      <div className="flex flex-1 flex-col">
        <ResultContent firstRowRef={firstRowRef} />
      </div>
    </div>
  );
}

type Phase =
  | "pre"
  | "moving"
  | "hover"
  | "click"
  | "loading"
  | "result"
  | "thumbsMoving"
  | "thumbsPause"
  | "thumbsClick"
  | "done";

export type Point = { x: number; y: number };

// The simulated cursor itself — extracted so other Capital One illustrations
// reuse this exact icon/fill/drop-shadow treatment and translate-transform
// positioning instead of recreating it. `easing` defaults to this mockup's
// own cubic-bezier (unchanged for every call site below); a caller wanting
// literal CSS `ease-in-out` instead just passes that string.
export function AnimatedCursor({
  pos,
  active,
  moveDurationMs,
  easing = "cubic-bezier(0.4, 0, 0.2, 1)",
}: {
  pos: Point;
  active: boolean;
  moveDurationMs: number | null;
  easing?: string;
}) {
  if (!active) return null;
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: `translate(${pos.x - 2}px, ${pos.y - 2}px)`,
        transition: moveDurationMs ? `transform ${moveDurationMs}ms ${easing}` : "none",
        pointerEvents: "none",
        zIndex: 20,
      }}
    >
      <MousePointer2 size={18} style={{ color: "#1F2937", filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.3))" }} fill="#F8FAFC" />
    </div>
  );
}

export function AnalysisPlacementMockupAnimated() {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const thumbsUpRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const hasAutoPlayedRef = useRef(false);
  const reducedMotionRef = useRef(false);
  // Guards the post-click cursor-hide timers below: this cursor is reused
  // across two sequential beats (Run Analysis, then thumbs-up), so a hide
  // scheduled for the first beat must not fire after a later beat has
  // already reactivated the cursor. Each hide call captures the current
  // generation; reactivating the cursor bumps it first, silently
  // invalidating any still-pending earlier hide.
  const cursorGenRef = useRef(0);

  function scheduleCursorHide(delay: number) {
    const gen = cursorGenRef.current;
    schedule(() => {
      if (cursorGenRef.current === gen) setCursorActive(false);
    }, delay);
  }

  const [phase, setPhase] = useState<Phase>("pre");
  const [reducedMotion, setReducedMotionState] = useState(false);
  const [cursorPos, setCursorPos] = useState<Point>({ x: 0, y: 0 });
  const [cursorActive, setCursorActive] = useState(false);
  const [resultHeight, setResultHeight] = useState<number | null>(null);
  const [thumbsUpSelected, setThumbsUpSelected] = useState(false);

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

  function computePositions(): { start: Point; end: Point } | null {
    const container = containerRef.current;
    const button = buttonRef.current;
    if (!container || !button) return null;
    const containerRect = container.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    return {
      // Away from Run Analysis (bottom-left of the left panel) — starts up
      // near the AI Analysis heading on the right instead.
      start: { x: containerRect.width * 0.78, y: 28 },
      end: {
        x: buttonRect.left - containerRect.left + buttonRect.width / 2,
        y: buttonRect.top - containerRect.top + buttonRect.height / 2,
      },
    };
  }

  function computeThumbsUpPosition(): Point | null {
    const container = containerRef.current;
    const thumb = thumbsUpRef.current;
    if (!container || !thumb) return null;
    const containerRect = container.getBoundingClientRect();
    const thumbRect = thumb.getBoundingClientRect();
    return {
      x: thumbRect.left - containerRect.left + thumbRect.width / 2,
      y: thumbRect.top - containerRect.top + thumbRect.height / 2,
    };
  }

  // Chains the thumbs-up beat onto whichever path just reached 'result' —
  // scheduled relative to that moment, not sequence-start, so it works
  // identically after autoplay's longer run-up and after a manual click.
  // The cursor is already visible (resting near Run Analysis) going into
  // this and stays visible the whole way through — it is never hidden.
  function scheduleThumbsUpBeat() {
    schedule(() => {
      const pos = computeThumbsUpPosition();
      if (!pos) return;
      // Reappear in place (no transition) in case the Run Analysis click's
      // own post-click hide already fired — same resting point it was
      // already at, so the move below is the exact same path as before.
      // Bumping the generation first invalidates that earlier hide if it's
      // still pending, so it can't fire mid-beat here.
      cursorGenRef.current++;
      setCursorActive(true);
      schedule(() => {
        setCursorPos(pos);
        setPhase("thumbsMoving");
      }, 0);
      schedule(() => setPhase("thumbsPause"), T_THUMBS_MOVE);
      schedule(() => {
        setThumbsUpSelected(true);
        setPhase("thumbsClick");
      }, T_THUMBS_MOVE + T_THUMBS_PAUSE);
      schedule(() => setPhase("done"), T_THUMBS_MOVE + T_THUMBS_PAUSE + T_CLICK_FEEDBACK);
      // Global cursor rule — hide exactly CURSOR_HIDE_DELAY_AFTER_CLICK after
      // this click completes, never left resting on the button indefinitely.
      scheduleCursorHide(T_THUMBS_MOVE + T_THUMBS_PAUSE + T_CLICK_FEEDBACK + CURSOR_HIDE_DELAY_AFTER_CLICK);
    }, T_RESULT_HOLD);
  }

  function playSequence(initialDelay: number) {
    const positions = computePositions();
    if (!positions) return;
    clearTimers();
    setThumbsUpSelected(false);
    setPhase("pre");
    // Resting near Run Analysis during the initial delay — the existing
    // sequence's own "away" starting point only takes over once that delay
    // ends and the sequence below actually begins. With initialDelay 0
    // (Replay) this is effectively instantaneous.
    setCursorPos(positions.end);
    cursorGenRef.current++;
    setCursorActive(true);
    schedule(() => {
      // Instant (phase is still "pre", so no transition applies) — this is
      // the existing sequence's own unmodified starting point and timing.
      setCursorPos(positions.start);
      schedule(() => {
        setPhase("moving");
        setCursorPos(positions.end);
      }, T_INITIAL_PAUSE);
      schedule(() => setPhase("hover"), T_INITIAL_PAUSE + T_CURSOR_MOVE);
      schedule(() => setPhase("click"), T_INITIAL_PAUSE + T_CURSOR_MOVE + T_HOVER_PAUSE);
      // Cursor stays put and visible here — clicking Run Analysis does not
      // move or hide it; it simply rests near the button while analysis runs.
      schedule(() => setPhase("loading"), T_INITIAL_PAUSE + T_CURSOR_MOVE + T_HOVER_PAUSE + T_CLICK_FEEDBACK);
      // Global cursor rule — hide exactly CURSOR_HIDE_DELAY_AFTER_CLICK after
      // the Run Analysis click completes (reappears for the thumbs-up beat).
      scheduleCursorHide(T_INITIAL_PAUSE + T_CURSOR_MOVE + T_HOVER_PAUSE + T_CLICK_FEEDBACK + CURSOR_HIDE_DELAY_AFTER_CLICK);
      schedule(() => {
        setPhase("result");
        scheduleThumbsUpBeat();
      }, T_INITIAL_PAUSE + T_CURSOR_MOVE + T_HOVER_PAUSE + T_CLICK_FEEDBACK + T_LOADING);
    }, initialDelay);
  }

  // Reduced motion: no cursor, near-instant reset so Replay still visibly
  // does something without introducing motion. Lands directly on the fully
  // completed state (results + thumbs-up already selected), consistent
  // with the existing reduced-motion contract.
  function playReducedMotionSequence() {
    clearTimers();
    cursorGenRef.current++;
    setCursorActive(false);
    setPhase("pre");
    schedule(() => {
      setPhase("done");
      setThumbsUpSelected(true);
    }, 50);
  }

  function runIntro(initialDelay: number) {
    if (reducedMotionRef.current) {
      playReducedMotionSequence();
    } else {
      playSequence(initialDelay);
    }
  }

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Lock the panel's reserved height to the final result content's natural
  // size, measured off-screen, so pre/loading never differ in height from
  // the populated result. A plain synchronous getBoundingClientRect read
  // (on mount + on window resize) rather than ResizeObserver, whose
  // notification callback does not fire in this preview environment.
  useEffect(() => {
    function measure() {
      const el = measureRef.current;
      if (!el) return;
      const height = el.getBoundingClientRect().height;
      if (height > 0) setResultHeight(height);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Autoplay once, on first viewport entry — with the 7s autoplay-only
  // delay. Scrolling away and back does nothing further: hasAutoPlayedRef
  // is set the moment it fires and the observer is disconnected right
  // after, so this can only ever run once per mount.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      if (!hasAutoPlayedRef.current) {
        hasAutoPlayedRef.current = true;
        runIntro(T_AUTOPLAY_DELAY);
      }
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !hasAutoPlayedRef.current) {
            hasAutoPlayedRef.current = true;
            runIntro(T_AUTOPLAY_DELAY);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => clearTimers, []);

  function handleManualClick() {
    clearTimers();
    setThumbsUpSelected(false);
    if (reducedMotionRef.current) {
      cursorGenRef.current++;
      setCursorActive(false);
      setPhase("done");
      setThumbsUpSelected(true);
      return;
    }
    // The viewer's own click already put a cursor at the button — rest the
    // simulated one there too (no transition: it just appears, already
    // resting) and keep it visible through the rest of the demonstration.
    const positions = computePositions();
    if (positions) setCursorPos(positions.end);
    cursorGenRef.current++;
    setCursorActive(true);
    setPhase("click");
    schedule(() => setPhase("loading"), T_CLICK_FEEDBACK);
    scheduleCursorHide(T_CLICK_FEEDBACK + CURSOR_HIDE_DELAY_AFTER_CLICK);
    schedule(() => {
      setPhase("result");
      scheduleThumbsUpBeat();
    }, T_CLICK_FEEDBACK + T_LOADING);
  }

  function handleReplay() {
    // Replay always starts immediately — no autoplay-style delay.
    runIntro(0);
  }

  const showCursor = cursorActive && !reducedMotion;
  const hoverActive = phase === "hover" || phase === "click";
  const clickActive = phase === "click";
  const cursorMoveDuration = phase === "moving" ? T_CURSOR_MOVE : phase === "thumbsMoving" ? T_THUMBS_MOVE : null;
  const thumbsClickActive = phase === "thumbsClick";
  // Hidden (but still occupying its full reserved box via visibility, not
  // display) until Run Analysis is actually clicked.
  const panelHidden = phase === "pre" || phase === "moving" || phase === "hover" || phase === "click";
  const showResultContent =
    phase === "result" || phase === "thumbsMoving" || phase === "thumbsPause" || phase === "thumbsClick" || phase === "done";

  return (
    <div
      style={{
        fontFamily: ENTERPRISE_FONT_STACK,
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
    >
      <div
        ref={containerRef}
        className="overflow-hidden rounded-[10px] border"
        style={{ borderColor: "#e6e6e6", position: "relative" }}
      >
        <div className="px-4 pb-5" style={{ paddingTop: 24 }}>
          <ControlDescriptionIntro />

          <div className="flex flex-col gap-4 md:flex-row">
            {/* LEFT — form card */}
            <ControlDescriptionFormPanel
              buttonRef={buttonRef}
              onButtonClick={handleManualClick}
              hoverActive={hoverActive}
              clickActive={clickActive}
            />

            {/* RIGHT — AI Analysis card. Fully invisible (visibility, not
                display, so it keeps reserving its box — border, background,
                heading, everything) until Run Analysis is clicked; nothing
                about the mockup's dimensions changes when it appears. */}
            <div
              className="flex flex-col rounded-md border md:basis-[35%]"
              style={{
                borderColor: BORDER,
                position: "relative",
                visibility: panelHidden ? "hidden" : "visible",
                padding: "22px 20px 20px",
              }}
            >
              <h5
                style={{
                  fontSize: 16,
                  lineHeight: "24px",
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  color: PRIMARY_TEXT,
                  marginBottom: 14,
                }}
              >
                AI Analysis
              </h5>

              {/* Reserved space — locked to the measured height of the final
                  result content for every phase, so nothing here ever
                  resizes the panel. */}
              <div className="flex flex-1 flex-col" style={{ minHeight: resultHeight ?? undefined }}>
                {phase === "loading" ? (
                  <div className="flex flex-1 flex-col items-center justify-center" style={{ gap: 12 }} aria-live="polite">
                    <span
                      aria-hidden="true"
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        border: `3px solid ${BORDER}`,
                        borderTopColor: RUN_ANALYSIS_BG,
                        animation: reducedMotion ? "none" : "analysisSpin 900ms linear infinite",
                      }}
                    />
                    <span style={{ fontSize: 13, fontWeight: 500, color: SECONDARY_TEXT }}>Analyzing…</span>
                  </div>
                ) : showResultContent ? (
                  <div
                    className="flex flex-1 flex-col"
                    // Fade in only on first arrival at 'result' — the thumbs-up
                    // beat that follows must not re-trigger this animation.
                    style={{ animation: reducedMotion || phase !== "result" ? "none" : `resultFadeIn ${T_RESULT_REVEAL}ms ease` }}
                  >
                    <ResultContent
                      thumbsUpRef={thumbsUpRef}
                      thumbsUpSelected={thumbsUpSelected}
                      thumbsClickActive={thumbsClickActive}
                    />
                  </div>
                ) : (
                  <div className="flex-1" />
                )}
              </div>

              {/* Off-screen measurement clone — always mounted, never
                  visible, drives resultHeight above. */}
              <div
                ref={measureRef}
                aria-hidden="true"
                style={{ position: "absolute", visibility: "hidden", pointerEvents: "none", left: 16, right: 16, top: 0 }}
              >
                <div className="flex flex-col">
                  <ResultContent />
                </div>
              </div>
            </div>
          </div>
        </div>

        <AnimatedCursor pos={cursorPos} active={showCursor} moveDurationMs={cursorMoveDuration} />
      </div>

      <div className="mt-2 flex justify-end">
        <button
          type="button"
          onClick={handleReplay}
          className="replay-btn focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          style={{
            fontSize: 12,
            lineHeight: "16px",
            fontWeight: 500,
            color: ACTION_BLUE,
            opacity: 1,
            background: "none",
            border: "none",
            padding: 0,
            textDecoration: "none",
            cursor: "pointer",
            outlineColor: ACTION_BLUE,
          }}
        >
          ↻ Replay interaction
        </button>
      </div>

      <style jsx>{`
        .replay-btn:hover {
          color: ${ACTION_BLUE_HOVER};
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        @keyframes resultFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes analysisSpin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
