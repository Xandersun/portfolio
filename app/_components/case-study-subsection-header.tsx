/**
 * portfolio-import — reusable compact case-study subsection header: a
 * secondary heading + one-line supporting description (e.g. captioning an
 * embedded product/interface illustration) that should read as smaller and
 * quieter than a section's main narrative heading.
 *
 * Styled via inline styles rather than Tailwind classes: `CaseSection`
 * (case-section.tsx) applies its own descendant rules directly to any
 * bare `h4`/`p` inside it (`[&_h4]:text-lg`, `[&_p]:text-lg leading-[1.65]`,
 * etc.), and a descendant selector like `.util-class h4` outranks a plain
 * single-class utility (`text-[18px]`) on that same h4/p by specificity —
 * so a Tailwind size class here would silently lose. Inline styles always
 * win regardless of ancestor context, which is what makes this reliably
 * reusable across any case-study section.
 *
 * `CASE_STUDY_SUPPORTING_TEXT_STYLE` is exported so any other supporting
 * line in a case study — including one sitting inside an embedded product
 * mockup, not just this header's own paragraph — can be kept in exact sync
 * with this one by reusing the same object instead of re-typing its values.
 */
export const CASE_STUDY_SUPPORTING_TEXT_STYLE = {
  fontSize: 14,
  lineHeight: 1.6,
  color: "#333333",
} as const;

export function CaseStudySubsectionHeader({
  heading,
  description,
}: {
  heading: string;
  description: string;
}) {
  return (
    <div className="case-study-subsection-header" style={{ marginBottom: 24 }}>
      <h4 style={{ fontSize: 18, lineHeight: 1.35, fontWeight: 700, margin: "0 0 6px 0", color: "#111111" }}>
        {heading}
      </h4>
      <p style={{ ...CASE_STUDY_SUPPORTING_TEXT_STYLE, margin: 0, maxWidth: 720 }}>{description}</p>
    </div>
  );
}
