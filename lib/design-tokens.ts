/**
 * @design-spec Source of truth for the platform's design tokens.
 *
 * components/layout/app-shell.tsx reads the `color` primitives from here to
 * configure ConfigProvider, and scripts/export-design-tokens.mjs mirrors this
 * file into public/tokens.json for Figma variable import (Tokens Studio
 * format). Keep both in sync when editing.
 *
 * `semantic` colors are NOT set directly — they're antd's dark-algorithm
 * derivation from `color.primary`/`color.bgBase`, captured here as the
 * resolved values (verified live via theme.useToken()) so the Figma export
 * has real hex values instead of "computed by antd" placeholders.
 */

export const colorTokens = {
  primary: "#10b981",
  bgBase: "#020617",
  bgContainer: "#0f172a",
  bgLayout: "#020617",
  border: "rgba(255,255,255,0.08)",
  menuSelectedBg: "rgba(16, 185, 129, 0.18)",
  menuSelectedColor: "#ffffff",
  siderBg: "#0f172a",
} as const;

/** Resolved by antd's dark algorithm from colorTokens — not set directly. */
export const semanticColorTokens = {
  success: "#49aa19",
  warning: "#d89614",
  error: "#dc4446",
  info: "#1668dc",
  bgElevated: "#041252",
  borderSecondary: "#051a75",
} as const;

export const riskColorTokens = {
  low: "#34d399",
  medium: "#fbbf24",
  high: "#f87171",
} as const;

/** 4px base unit, used for padding/gap/margin across every sandbox page. */
export const spacingTokens = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  "6xl": 64,
} as const;

export const radiusTokens = {
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  "2xl": 16,
  pill: 999,
} as const;

/** antd's default heading scale (fontSizeHeading1-5) plus body/caption. */
export const typographyTokens = {
  heading1: { fontSize: 38, lineHeight: 1.21, fontWeight: 600 },
  heading2: { fontSize: 30, lineHeight: 1.35, fontWeight: 600 },
  heading3: { fontSize: 24, lineHeight: 1.35, fontWeight: 600 },
  heading4: { fontSize: 20, lineHeight: 1.4, fontWeight: 600 },
  heading5: { fontSize: 16, lineHeight: 1.5, fontWeight: 600 },
  body: { fontSize: 14, lineHeight: 1.5714, fontWeight: 400 },
  bodyStrong: { fontSize: 14, lineHeight: 1.5714, fontWeight: 600 },
  caption: { fontSize: 12, lineHeight: 1.6667, fontWeight: 400 },
  mono: { fontSize: 12, lineHeight: 1.5, fontWeight: 400, fontFamily: "var(--font-geist-mono)" },
} as const;

export const fontFamilyTokens = {
  sans: "var(--font-geist-sans)",
  mono: "var(--font-geist-mono)",
} as const;
