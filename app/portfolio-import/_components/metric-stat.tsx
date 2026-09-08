import type { ReactNode } from "react";

/**
 * portfolio-import — repeated "big number + label" stat pattern, used both
 * in the light-background case cards and the dark Outcomes band (which
 * also carries a small company eyebrow above the number).
 */
export function MetricStat({
  eyebrow,
  value,
  label,
  tone = "light",
  className,
}: {
  eyebrow?: ReactNode;
  value: ReactNode;
  label: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  const isDark = tone === "dark";
  return (
    <div className={className}>
      {eyebrow && (
        <p className={isDark ? "text-xs font-bold text-[#CBD5E1]" : "text-sm font-bold text-[#FF5733] uppercase tracking-[0.08em]"}>
          {eyebrow}
        </p>
      )}
      <p
        className={
          isDark
            ? "mt-4 text-[56px] leading-none font-bold tracking-[-0.03em] text-white"
            : "text-[40px] leading-none font-bold tracking-[-0.04em] text-[#0F172A]"
        }
      >
        {value}
      </p>
      <p className={isDark ? "mt-3.5 text-base leading-[1.5] text-[#94A3B8]" : "mt-2.5 text-[15px] leading-[1.5] text-[#334155]"}>
        {label}
      </p>
    </div>
  );
}
