#!/usr/bin/env node
/**
 * Generates public/tokens.json from lib/design-tokens.ts, in Tokens Studio
 * for Figma's import format ({ value, type } per leaf token, nested groups).
 *
 * This file intentionally re-declares the primitive values rather than
 * importing lib/design-tokens.ts directly, since that module is TypeScript
 * and this script runs under plain Node with no build step. Keep the two
 * files in sync — lib/design-tokens.ts is the source of truth the app reads;
 * this mirrors it for design tooling.
 *
 * Run: node scripts/export-design-tokens.mjs
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public");
const outFile = join(outDir, "tokens.json");

const color = {
  primary: "#10b981",
  bgBase: "#020617",
  bgContainer: "#0f172a",
  bgLayout: "#020617",
  border: "rgba(255,255,255,0.08)",
  menuSelectedBg: "rgba(16, 185, 129, 0.18)",
  siderBg: "#0f172a",
  success: "#49aa19",
  warning: "#d89614",
  error: "#dc4446",
  info: "#1668dc",
  bgElevated: "#041252",
  borderSecondary: "#051a75",
  riskLow: "#34d399",
  riskMedium: "#fbbf24",
  riskHigh: "#f87171",
};

const spacing = {
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
};

const radius = {
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  "2xl": 16,
  pill: 999,
};

const typography = {
  heading1: { fontSize: 38, lineHeight: 1.21, fontWeight: 600 },
  heading2: { fontSize: 30, lineHeight: 1.35, fontWeight: 600 },
  heading3: { fontSize: 24, lineHeight: 1.35, fontWeight: 600 },
  heading4: { fontSize: 20, lineHeight: 1.4, fontWeight: 600 },
  heading5: { fontSize: 16, lineHeight: 1.5, fontWeight: 600 },
  body: { fontSize: 14, lineHeight: 1.5714, fontWeight: 400 },
  bodyStrong: { fontSize: 14, lineHeight: 1.5714, fontWeight: 600 },
  caption: { fontSize: 12, lineHeight: 1.6667, fontWeight: 400 },
};

function colorGroup(entries) {
  return Object.fromEntries(
    Object.entries(entries).map(([key, value]) => [key, { value, type: "color" }]),
  );
}

function spacingGroup(entries) {
  return Object.fromEntries(
    Object.entries(entries).map(([key, value]) => [key, { value: `${value}px`, type: "spacing" }]),
  );
}

function radiusGroup(entries) {
  return Object.fromEntries(
    Object.entries(entries).map(([key, value]) => [key, { value: `${value}px`, type: "borderRadius" }]),
  );
}

function typographyGroup(entries) {
  return Object.fromEntries(
    Object.entries(entries).map(([key, spec]) => [
      key,
      {
        type: "typography",
        value: {
          fontFamily: "Geist",
          fontWeight: spec.fontWeight,
          fontSize: `${spec.fontSize}px`,
          lineHeight: `${Math.round(spec.lineHeight * 100)}%`,
        },
      },
    ]),
  );
}

const tokens = {
  color: colorGroup(color),
  spacing: spacingGroup(spacing),
  radius: radiusGroup(radius),
  typography: typographyGroup(typography),
};

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, `${JSON.stringify(tokens, null, 2)}\n`, "utf-8");

console.log(`Wrote ${Object.values(tokens).reduce((n, g) => n + Object.keys(g).length, 0)} tokens to ${outFile}`);
