"use client";

/**
 * Forms & Workflows — a single-page, non-linear enterprise form workspace.
 * Deliberately NOT a wizard/stepper: every section (General, Configuration,
 * Items, Additional Details, Review & Submit) is part of one continuous
 * scrollable page, reachable in any order via sticky in-page section
 * navigation with scroll-spy, rather than being gated behind "Next" steps.
 *
 * Demonstrates, with real interaction rather than static markup:
 *  - deferred validation (blur/submit, not every keystroke) with inline
 *    recovery as errors are corrected
 *  - a dependent field whose valid values (and existence) change with a
 *    parent selection, and is explicitly cleared — not silently kept —
 *    when the parent changes to a type that invalidates it
 *  - a repeatable Items list with add/remove/reorder (Move Up/Down is the
 *    ONLY reorder mechanism — no drag — so it's keyboard-operable by
 *    construction, not as a fallback)
 *  - progressive disclosure via a plain show/hide toggle (not an accordion,
 *    since this whole demo already lives inside one)
 *  - an actionable issue-count summary that jumps focus to the affected
 *    field
 *  - a Review & Submit recap at the end of the same page (not a separate
 *    step) with per-section Edit links back into the form
 *
 * Reuses the shared ThingsToTry component (things-to-try.tsx) for its
 * checklist, the same automatic-completion pattern as Navigation &
 * Hierarchy and Data & Tables, and the shared useSandboxNotify toast
 * queue is intentionally NOT used here — per spec this workspace's own
 * quiet inline status line/error summary is the feedback mechanism, not
 * a toast.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Input as AntInput, Select } from "antd";
import { CheckCircleOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import { ThingsToTry, type ThingsToTryItem } from "./things-to-try";

const FONT_STACK = 'system-ui, -apple-system, "Inter", sans-serif';

const SECTIONS = [
  { id: "general", label: "General" },
  { id: "configuration", label: "Configuration" },
  { id: "items", label: "Items" },
  { id: "additional-details", label: "Additional Details" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

interface GeneralState {
  name: string;
  referenceId: string;
  email: string;
  effectiveDate: string;
  type: string;
}

const RECORD_TYPE_OPTIONS = [
  { value: "standard", label: "Standard" },
  { value: "expedited", label: "Expedited" },
  { value: "recurring", label: "Recurring" },
];

interface GeneralErrors {
  name?: string;
  referenceId?: string;
  email?: string;
  effectiveDate?: string;
  type?: string;
}

const GENERAL_FIELD_META: Record<keyof GeneralErrors, { id: string; label: string }> = {
  name: { id: "field-name", label: "Name" },
  referenceId: { id: "field-reference-id", label: "Reference ID" },
  email: { id: "field-email", label: "Email" },
  effectiveDate: { id: "field-effective-date", label: "Effective Date" },
  type: { id: "field-type", label: "Type" },
};

function validateGeneral(g: GeneralState): GeneralErrors {
  const errors: GeneralErrors = {};
  if (!g.name.trim()) errors.name = "Name is required.";
  if (!g.referenceId.trim()) {
    errors.referenceId = "Reference ID is required.";
  } else if (!/^[A-Z]{2,4}-\d{3,6}$/.test(g.referenceId.trim())) {
    errors.referenceId = "Use the format ABC-1234 (2–4 letters, a dash, then digits).";
  }
  if (!g.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(g.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (!g.effectiveDate) errors.effectiveDate = "Effective date is required.";
  if (!g.type) errors.type = "Type is required.";
  return errors;
}

type ConfigType = "standard" | "advanced" | "custom";

const CONFIG_TYPE_OPTIONS: { value: ConfigType; label: string }[] = [
  { value: "standard", label: "Standard" },
  { value: "advanced", label: "Advanced" },
  { value: "custom", label: "Custom" },
];

const ADVANCED_MODE_OPTIONS = [
  { value: "automatic", label: "Automatic" },
  { value: "manual", label: "Manual" },
];

const CUSTOM_RULE_OPTIONS = [
  { value: "rule-a", label: "Rule A" },
  { value: "rule-b", label: "Rule B" },
  { value: "rule-c", label: "Rule C" },
];

interface FormItem {
  id: string;
  name: string;
  type: string;
  value: string;
}

const ITEM_TYPE_OPTIONS = ["Text", "Number", "Flag"];

const PRIORITY_OVERRIDE_OPTIONS = ["Low", "Medium", "High"];

/**
 * Reusable field-width convention so controls size to their content
 * instead of every field defaulting to fill the available grid cell.
 * "short" suits compact values (dates, short codes, short selects);
 * "default" suits standard text fields and most selects; "wide" is for
 * fields that genuinely benefit from more room (Notes).
 */
const FIELD_WIDTH = { short: 180, default: 300, wide: 440 } as const;
type FieldWidth = keyof typeof FIELD_WIDTH;

/** Layout-only wrapper: label + control + inline error, sized via the shared FIELD_WIDTH scale rather than stretching to fill its row. */
function Field({
  id,
  label,
  required,
  error,
  children,
  width = "default",
  style,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  width?: FieldWidth;
  style?: CSSProperties;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, width: FIELD_WIDTH[width], flexShrink: 0, ...style }}>
      <label htmlFor={id} style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>
        {label}
        {required && <span style={{ color: "#dc2626" }}> *</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" style={{ margin: 0, fontSize: 13, color: "#dc2626" }}>
          {error}
        </p>
      )}
    </div>
  );
}

function SectionHeading({ children }: { children: ReactNode }) {
  return <div style={{ color: "#0F172A", fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{children}</div>;
}

export function FormsWorkflowsPanel() {
  // ---- General ----
  const [general, setGeneral] = useState<GeneralState>({ name: "", referenceId: "", email: "", effectiveDate: "", type: "" });
  const [generalTouched, setGeneralTouched] = useState<Partial<Record<keyof GeneralState, boolean>>>({});

  // ---- Configuration ----
  const [configType, setConfigType] = useState<ConfigType>("standard");
  const [advancedMode, setAdvancedMode] = useState("");
  const [customRule, setCustomRule] = useState("");
  const [dependencyNotice, setDependencyNotice] = useState<string | null>(null);

  // ---- Items ----
  const [items, setItems] = useState<FormItem[]>([{ id: "item-1", name: "", type: "Text", value: "" }]);
  const nextItemId = useRef(2);

  // ---- Additional Details ----
  const [notes, setNotes] = useState("");
  const [showAdvancedDetails, setShowAdvancedDetails] = useState(false);
  const [internalTag, setInternalTag] = useState("");
  const [priorityOverride, setPriorityOverride] = useState("");

  // ---- Form-wide status ----
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorSummaryOpen, setErrorSummaryOpen] = useState(false);

  // ---- "Things to try" completion flags — each is set once by a real
  // interaction and never reset for the rest of the session. ----
  const [hasTriggeredValidationError, setHasTriggeredValidationError] = useState(false);
  const [hasRevealedConditional, setHasRevealedConditional] = useState(false);
  const [hasTestedDependency, setHasTestedDependency] = useState(false);
  const [hasAddedItem, setHasAddedItem] = useState(false);
  const [hasJumpedToIssue, setHasJumpedToIssue] = useState(false);

  // ---- Sticky section nav + scroll-spy ----
  const [activeSection, setActiveSection] = useState<SectionId>("general");
  const sectionRefs = useRef<Partial<Record<SectionId, HTMLElement>>>({});
  const fieldRefs = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const id = visible[0]?.target.getAttribute("data-section-id") as SectionId | null;
        if (id) setActiveSection(id);
      },
      { rootMargin: "-120px 0px -60% 0px", threshold: 0 },
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function scrollToSection(id: SectionId) {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function focusField(fieldId: string) {
    const el = fieldRefs.current.get(fieldId);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.querySelector<HTMLElement>("input, select, textarea, button, [tabindex]")?.focus();
  }

  function jumpToIssue(fieldId: string) {
    focusField(fieldId);
    setHasJumpedToIssue(true);
  }

  const generalErrors = useMemo(() => validateGeneral(general), [general]);

  const issues = useMemo(() => {
    return (Object.keys(generalErrors) as (keyof GeneralErrors)[])
      .filter((key) => generalErrors[key] && (submitAttempted || generalTouched[key]))
      .map((key) => ({
        id: GENERAL_FIELD_META[key].id,
        label: GENERAL_FIELD_META[key].label,
        section: "General",
        message: generalErrors[key]!,
      }));
  }, [generalErrors, submitAttempted, generalTouched]);

  useEffect(() => {
    if (issues.length > 0) setHasTriggeredValidationError(true);
  }, [issues.length]);

  function displayedError(key: keyof GeneralErrors) {
    return submitAttempted || generalTouched[key] ? generalErrors[key] : undefined;
  }

  function handleGeneralChange(key: keyof GeneralState, value: string) {
    setGeneral((prev) => ({ ...prev, [key]: value }));
  }

  function handleGeneralBlur(key: keyof GeneralState) {
    setGeneralTouched((prev) => ({ ...prev, [key]: true }));
  }

  function handleConfigTypeChange(next: ConfigType) {
    const previous = configType;
    setConfigType(next);
    if (next === previous) return;

    if (previous === "advanced" && advancedMode) {
      setAdvancedMode("");
      setDependencyNotice("Advanced Mode was cleared — it isn't available for this configuration type.");
      setHasTestedDependency(true);
    } else if (previous === "custom" && customRule) {
      setCustomRule("");
      setDependencyNotice("Custom Rule was cleared — it isn't available for this configuration type.");
      setHasTestedDependency(true);
    } else {
      setDependencyNotice(null);
    }

    if (next !== "standard") setHasRevealedConditional(true);
  }

  function handleAddItem() {
    setItems((prev) => [...prev, { id: `item-${nextItemId.current++}`, name: "", type: "Text", value: "" }]);
    setHasAddedItem(true);
  }

  function handleRemoveItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function handleMoveItem(id: string, direction: -1 | 1) {
    setItems((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      const targetIndex = index + direction;
      if (index < 0 || targetIndex < 0 || targetIndex >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  }

  function handleUpdateItem(id: string, patch: Partial<FormItem>) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function handleSubmit() {
    setSubmitAttempted(true);
    const errors = validateGeneral(general);
    const errorKeys = Object.keys(errors) as (keyof GeneralErrors)[];
    if (errorKeys.length > 0) {
      setErrorSummaryOpen(true);
      window.setTimeout(() => focusField(GENERAL_FIELD_META[errorKeys[0]].id), 0);
      return;
    }
    setSubmitted(true);
  }

  const CHECKLIST: ThingsToTryItem[] = [
    {
      key: "trigger-error",
      label: "Trigger a validation error",
      description: "Leave a required field incomplete, then move on or submit the form.",
      complete: hasTriggeredValidationError,
    },
    {
      key: "reveal-conditional",
      label: "Reveal a conditional field",
      description: "Change a configuration option to reveal additional information.",
      complete: hasRevealedConditional,
    },
    {
      key: "test-dependency",
      label: "Test a dependency",
      description: "Change a parent selection after choosing a dependent value.",
      complete: hasTestedDependency,
    },
    {
      key: "add-item",
      label: "Add an item",
      description: "Add another item to the repeatable Items section.",
      complete: hasAddedItem,
    },
    {
      key: "jump-to-issue",
      label: "Jump to an issue",
      description: "Use the error summary to navigate directly to a field that needs attention.",
      complete: hasJumpedToIssue,
    },
  ];

  const registerSection = (id: SectionId) => (el: HTMLElement | null) => {
    if (el) sectionRefs.current[id] = el;
  };
  const registerField = (id: string) => (el: HTMLElement | null) => {
    if (el) fieldRefs.current.set(id, el);
  };

  return (
    <div
      style={{ fontFamily: FONT_STACK, display: "grid", gridTemplateColumns: "minmax(0, 680px) minmax(0, 420px)", justifyContent: "start", gap: 32, alignItems: "start" }}
      className="forms-workflows-columns"
    >
      <div style={{ minWidth: 0 }}>
        {/* Issue-count status */}
        {issues.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setErrorSummaryOpen((v) => !v)}
              aria-expanded={errorSummaryOpen}
              className="issue-summary-toggle"
              style={{ fontSize: 14, fontWeight: 600, color: "#dc2626", background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}
            >
              {issues.length} issue{issues.length === 1 ? "" : "s"}
            </button>
          </div>
        )}

        {errorSummaryOpen && issues.length > 0 && (
          <div role="alert" style={{ marginBottom: 16, padding: 12, borderRadius: 8, border: "1px solid #FCA5A5", background: "#FEF2F2" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#991B1B", marginBottom: 6 }}>Needs attention</div>
            <div style={{ display: "grid", gap: 4 }}>
              {issues.map((issue) => (
                <button
                  key={issue.id}
                  type="button"
                  onClick={() => jumpToIssue(issue.id)}
                  style={{ display: "flex", justifyContent: "space-between", gap: 8, textAlign: "left", background: "none", border: "none", padding: "4px 0", cursor: "pointer" }}
                >
                  <span style={{ fontSize: 14, color: "#991B1B" }}>
                    <strong>{issue.section}</strong> — {issue.label}: {issue.message}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#0f766e", flexShrink: 0 }}>Jump to field →</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sticky section nav */}
        <div style={{ position: "sticky", top: 0, zIndex: 5, background: "#FFFFFF", borderBottom: "1px solid #E2E8F0", marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 4, paddingBlock: 8 }}>
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => scrollToSection(s.id)}
                aria-current={activeSection === s.id ? "true" : undefined}
                className="form-section-nav-item"
                style={{
                  padding: "6px 12px",
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  background: activeSection === s.id ? "#F0FDFA" : "transparent",
                  color: activeSection === s.id ? "#115E59" : "#475569",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* General */}
        <section id="form-section-general" data-section-id="general" ref={registerSection("general")} style={{ scrollMarginTop: 56, marginBottom: 28 }}>
          <SectionHeading>General</SectionHeading>
          <p style={{ fontSize: 15, lineHeight: "22px", color: "#334155", marginBottom: 16, maxWidth: 560 }}>
            Conventional required fields with deferred validation — errors appear on blur or submit, not on every
            keystroke, and clear as soon as they're fixed.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", columnGap: 20, rowGap: 20 }}>
            <div ref={registerField(GENERAL_FIELD_META.name.id)}>
              <Field id={GENERAL_FIELD_META.name.id} label="Name" required error={displayedError("name")}>
                <AntInput
                  id={GENERAL_FIELD_META.name.id}
                  value={general.name}
                  onChange={(e) => handleGeneralChange("name", e.target.value)}
                  onBlur={() => handleGeneralBlur("name")}
                  status={displayedError("name") ? "error" : undefined}
                  aria-invalid={!!displayedError("name")}
                  aria-describedby={displayedError("name") ? `${GENERAL_FIELD_META.name.id}-error` : undefined}
                />
              </Field>
            </div>
            <div ref={registerField(GENERAL_FIELD_META.referenceId.id)}>
              <Field id={GENERAL_FIELD_META.referenceId.id} label="Reference ID" required error={displayedError("referenceId")} width="short">
                <AntInput
                  id={GENERAL_FIELD_META.referenceId.id}
                  placeholder="e.g. REF-1024"
                  value={general.referenceId}
                  onChange={(e) => handleGeneralChange("referenceId", e.target.value)}
                  onBlur={() => handleGeneralBlur("referenceId")}
                  status={displayedError("referenceId") ? "error" : undefined}
                  aria-invalid={!!displayedError("referenceId")}
                  aria-describedby={displayedError("referenceId") ? `${GENERAL_FIELD_META.referenceId.id}-error` : undefined}
                />
              </Field>
            </div>
            <div ref={registerField(GENERAL_FIELD_META.email.id)}>
              <Field id={GENERAL_FIELD_META.email.id} label="Email" required error={displayedError("email")}>
                <AntInput
                  id={GENERAL_FIELD_META.email.id}
                  type="email"
                  value={general.email}
                  onChange={(e) => handleGeneralChange("email", e.target.value)}
                  onBlur={() => handleGeneralBlur("email")}
                  status={displayedError("email") ? "error" : undefined}
                  aria-invalid={!!displayedError("email")}
                  aria-describedby={displayedError("email") ? `${GENERAL_FIELD_META.email.id}-error` : undefined}
                />
              </Field>
            </div>
            <div ref={registerField(GENERAL_FIELD_META.effectiveDate.id)}>
              <Field id={GENERAL_FIELD_META.effectiveDate.id} label="Effective Date" required error={displayedError("effectiveDate")} width="short">
                <AntInput
                  id={GENERAL_FIELD_META.effectiveDate.id}
                  type="date"
                  value={general.effectiveDate}
                  onChange={(e) => handleGeneralChange("effectiveDate", e.target.value)}
                  onBlur={() => handleGeneralBlur("effectiveDate")}
                  status={displayedError("effectiveDate") ? "error" : undefined}
                  aria-invalid={!!displayedError("effectiveDate")}
                  aria-describedby={displayedError("effectiveDate") ? `${GENERAL_FIELD_META.effectiveDate.id}-error` : undefined}
                />
              </Field>
            </div>
            <div ref={registerField(GENERAL_FIELD_META.type.id)}>
              <Field id={GENERAL_FIELD_META.type.id} label="Type" required error={displayedError("type")}>
                <Select
                  id={GENERAL_FIELD_META.type.id}
                  value={general.type || undefined}
                  placeholder="Select a type"
                  onChange={(value) => handleGeneralChange("type", value)}
                  onBlur={() => handleGeneralBlur("type")}
                  status={displayedError("type") ? "error" : undefined}
                  style={{ width: "100%" }}
                  options={RECORD_TYPE_OPTIONS}
                  aria-invalid={!!displayedError("type")}
                  aria-describedby={displayedError("type") ? `${GENERAL_FIELD_META.type.id}-error` : undefined}
                />
              </Field>
            </div>
          </div>
        </section>

        {/* Configuration */}
        <section id="form-section-configuration" data-section-id="configuration" ref={registerSection("configuration")} style={{ scrollMarginTop: 56, marginBottom: 28 }}>
          <SectionHeading>Configuration</SectionHeading>
          <p style={{ fontSize: 15, lineHeight: "22px", color: "#334155", marginBottom: 16, maxWidth: 560 }}>
            Changing Configuration Type can reveal a dependent field with its own valid values — and changing it
            again clears a dependent value that's no longer valid, rather than leaving it silently in place.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", columnGap: 20, rowGap: 20 }}>
            <Field id="field-config-type" label="Configuration Type">
              <Select
                id="field-config-type"
                value={configType}
                onChange={handleConfigTypeChange}
                style={{ width: "100%" }}
                options={CONFIG_TYPE_OPTIONS}
              />
            </Field>
            {configType === "advanced" && (
              <Field id="field-advanced-mode" label="Advanced Mode">
                <Select
                  id="field-advanced-mode"
                  value={advancedMode || undefined}
                  placeholder="Select a mode"
                  onChange={(value) => setAdvancedMode(value)}
                  style={{ width: "100%" }}
                  options={ADVANCED_MODE_OPTIONS}
                />
              </Field>
            )}
            {configType === "custom" && (
              <Field id="field-custom-rule" label="Custom Rule">
                <Select
                  id="field-custom-rule"
                  value={customRule || undefined}
                  placeholder="Select a rule"
                  onChange={(value) => setCustomRule(value)}
                  style={{ width: "100%" }}
                  options={CUSTOM_RULE_OPTIONS}
                />
              </Field>
            )}
          </div>
          {dependencyNotice && (
            <p role="status" style={{ marginTop: 10, fontSize: 13, color: "#92400E", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 6, padding: "8px 10px", maxWidth: 480 }}>
              {dependencyNotice}
            </p>
          )}
        </section>

        {/* Items */}
        <section id="form-section-items" data-section-id="items" ref={registerSection("items")} style={{ scrollMarginTop: 56, marginBottom: 28 }}>
          <SectionHeading>Items</SectionHeading>
          <p style={{ fontSize: 15, lineHeight: "22px", color: "#334155", marginBottom: 16, maxWidth: 560 }}>
            A repeatable list of simple form rows — add, edit, remove, and reorder with Move Up / Move Down, no
            drag required.
          </p>
          <div style={{ display: "grid", gap: 8, maxWidth: 640 }}>
            {items.map((item, index) => (
              <div
                key={item.id}
                style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr auto", gap: 8, alignItems: "center", padding: 10, border: "1px solid #E2E8F0", borderRadius: 8, background: "#FFFFFF" }}
              >
                <AntInput
                  aria-label={`Item ${index + 1} name`}
                  placeholder="Item name"
                  value={item.name}
                  onChange={(e) => handleUpdateItem(item.id, { name: e.target.value })}
                />
                <Select
                  aria-label={`Item ${index + 1} type`}
                  value={item.type}
                  onChange={(value) => handleUpdateItem(item.id, { type: value })}
                  options={ITEM_TYPE_OPTIONS.map((t) => ({ value: t, label: t }))}
                />
                <AntInput
                  aria-label={`Item ${index + 1} value`}
                  placeholder="Value"
                  value={item.value}
                  onChange={(e) => handleUpdateItem(item.id, { value: e.target.value })}
                />
                <div style={{ display: "flex", gap: 2 }}>
                  <button
                    type="button"
                    aria-label={`Move item ${index + 1} up`}
                    disabled={index === 0}
                    onClick={() => handleMoveItem(item.id, -1)}
                    className="item-row-btn"
                  >
                    <ArrowUp className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Move item ${index + 1} down`}
                    disabled={index === items.length - 1}
                    onClick={() => handleMoveItem(item.id, 1)}
                    className="item-row-btn"
                  >
                    <ArrowDown className="size-4" />
                  </button>
                  <button type="button" aria-label={`Remove item ${index + 1}`} onClick={() => handleRemoveItem(item.id)} className="item-row-btn item-row-btn--danger">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={handleAddItem} className="add-item-btn" style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "#0f766e", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <Plus className="size-4" /> Add item
          </button>
        </section>

        {/* Additional Details */}
        <section id="form-section-additional-details" data-section-id="additional-details" ref={registerSection("additional-details")} style={{ scrollMarginTop: 56, marginBottom: 28 }}>
          <SectionHeading>Additional Details</SectionHeading>
          <p style={{ fontSize: 15, lineHeight: "22px", color: "#334155", marginBottom: 16, maxWidth: 560 }}>
            Optional information stays out of the way by default — a plain show/hide control reveals more, rather
            than another accordion nested inside this one.
          </p>
          <Field id="field-notes" label="Notes" width="wide" style={{ marginBottom: 12 }}>
            <Textarea id="field-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" rows={2} />
          </Field>
          <button
            type="button"
            onClick={() => setShowAdvancedDetails((v) => !v)}
            aria-expanded={showAdvancedDetails}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "#0f766e", background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            {showAdvancedDetails ? <UpOutlined /> : <DownOutlined />}
            {showAdvancedDetails ? "Hide advanced options" : "Show advanced options"}
          </button>
          {showAdvancedDetails && (
            <div style={{ display: "flex", flexWrap: "wrap", columnGap: 20, rowGap: 20, marginTop: 12 }}>
              <Field id="field-internal-tag" label="Internal Tag" width="short">
                <AntInput id="field-internal-tag" value={internalTag} onChange={(e) => setInternalTag(e.target.value)} placeholder="Optional" />
              </Field>
              <Field id="field-priority-override" label="Priority Override" width="short">
                <Select
                  id="field-priority-override"
                  value={priorityOverride || undefined}
                  placeholder="None"
                  allowClear
                  onChange={(value) => setPriorityOverride(value ?? "")}
                  style={{ width: "100%" }}
                  options={PRIORITY_OVERRIDE_OPTIONS.map((p) => ({ value: p, label: p }))}
                />
              </Field>
            </div>
          )}
        </section>

        {/* Review & Submit — the closing part of the same page, not another step */}
        <section style={{ paddingTop: 8, borderTop: "1px solid #E2E8F0" }}>
          <SectionHeading>Review &amp; Submit</SectionHeading>
          <p style={{ fontSize: 15, lineHeight: "22px", color: "#334155", marginBottom: 16, maxWidth: 560 }}>
            Everything entered above, grouped by section. All entered data is preserved — nothing resets here.
          </p>

          <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
            <ReviewGroup title="General" onEdit={() => scrollToSection("general")}>
              <div>{general.name || "—"}</div>
              <div>{general.referenceId || "—"}</div>
              <div>{general.email || "—"}</div>
              <div>{general.effectiveDate || "—"}</div>
              <div>{RECORD_TYPE_OPTIONS.find((o) => o.value === general.type)?.label ?? "—"}</div>
            </ReviewGroup>
            <ReviewGroup title="Configuration" onEdit={() => scrollToSection("configuration")}>
              <div>{CONFIG_TYPE_OPTIONS.find((o) => o.value === configType)?.label}</div>
              {configType === "advanced" && <div>Advanced Mode: {advancedMode || "—"}</div>}
              {configType === "custom" && <div>Custom Rule: {customRule || "—"}</div>}
            </ReviewGroup>
            <ReviewGroup title="Items" onEdit={() => scrollToSection("items")}>
              <div>{items.length} item{items.length === 1 ? "" : "s"}</div>
            </ReviewGroup>
            <ReviewGroup title="Additional Details" onEdit={() => scrollToSection("additional-details")}>
              <div>{notes ? "Notes added" : "No notes"}</div>
              {showAdvancedDetails && <div>{internalTag || priorityOverride ? "Advanced options set" : "Advanced options shown, none set"}</div>}
            </ReviewGroup>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            style={{ height: 40, paddingInline: 20, borderRadius: 8, border: "none", background: "#0f766e", color: "#FFFFFF", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
          >
            Submit
          </button>

          {submitted && (
            <div role="status" style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <CheckCircleOutlined style={{ color: "#0f766e" }} />
              <span style={{ fontSize: 14, fontWeight: 600, color: "#0f766e" }}>Submitted successfully.</span>
            </div>
          )}
        </section>
      </div>

      <div style={{ minWidth: 0 }}>
        <ThingsToTry items={CHECKLIST} />
      </div>

      <style jsx global>{`
        .form-section-nav-item:hover {
          background-color: #f1f5f9 !important;
          color: #0f172a !important;
        }
        .form-section-nav-item:focus-visible {
          outline: none !important;
          box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #0d9488 !important;
        }
        .issue-summary-toggle:focus-visible {
          outline: none !important;
          box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #0d9488 !important;
        }
        .item-row-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          border: none;
          background: transparent;
          color: #475569;
          cursor: pointer;
        }
        .item-row-btn:hover:not(:disabled) {
          background-color: #f1f5f9;
          color: #0f172a;
        }
        .item-row-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
        .item-row-btn--danger:hover:not(:disabled) {
          background-color: #fef2f2;
          color: #dc2626;
        }
        .item-row-btn:focus-visible,
        .add-item-btn:focus-visible {
          outline: none !important;
          box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #0d9488 !important;
        }
        @media (max-width: 900px) {
          .forms-workflows-columns {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

function ReviewGroup({ title, onEdit, children }: { title: string; onEdit: () => void; children: ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: 12, border: "1px solid #E2E8F0", borderRadius: 8, background: "#FFFFFF" }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", marginBottom: 4 }}>{title}</div>
        <div style={{ display: "grid", gap: 2, fontSize: 14, color: "#334155" }}>{children}</div>
      </div>
      <button
        type="button"
        onClick={onEdit}
        style={{ flexShrink: 0, alignSelf: "flex-start", fontSize: 13, fontWeight: 600, color: "#0f766e", background: "none", border: "none", cursor: "pointer", padding: 0 }}
      >
        Edit
      </button>
    </div>
  );
}
