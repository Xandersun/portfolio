import { Manrope } from "next/font/google";

/**
 * portfolio-import — shared Manrope loader.
 * The source site pulled Manrope via a plain `@import` in each page's own
 * inline <style>. This refactor pass replaces that with next/font/google
 * (already the pattern used elsewhere in this project — Geist in the root
 * layout, Inter in the monster-linear/linear-reference prototypes) so the
 * font loads once, self-hosted, instead of once per page via a render-
 * blocking Google Fonts request. Purely an implementation cleanup — same
 * visible typeface, same weights.
 */
export const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});
