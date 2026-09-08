# Alex Sun — Product Design Portfolio

## Project

This repository is Alex Sun's product design portfolio, rebuilt from a clean
foundation. Immediate goal: a visually exceptional portfolio ready for an
upcoming interview with Obviant. Longer-term: the same system becomes the
permanent portfolio.

**Audience**: a VP or senior leader in visual/product design. Visual design
quality is a primary requirement here, not just usability or clean
implementation — the work has to be strong enough on sight that they want to
interview or hire Alex.

## Current state of the repo

- `app/page.tsx` (root, `/`) — the portfolio. Currently a bare placeholder
  (name + title only). This is the active work.
- `app/(defense-app)/` — an earlier, unrelated prototype ("Defense Analytics
  Platform", an Ant Design + AG Grid enterprise dashboard) relocated to
  `/dashboard` and `/sandbox` so it doesn't interfere with the portfolio root.
  It's kept for reference/reuse, not part of the portfolio. Its dependencies
  (`antd`, `ag-grid-community`/`ag-grid-react`, `jspdf`, `xlsx`) remain
  installed but are not part of the portfolio's design system.
- Stack: Next.js (App Router) + TypeScript + React 19 + Tailwind v4
  (CSS-first config, no `tailwind.config.js`).

## Design direction

Aim for: strong visual design, excellent typography, clear hierarchy,
sophisticated composition, strong use of whitespace, intentional color,
high-quality interaction design, the ability to make complex enterprise
interfaces read as visually clear, and personality without sacrificing
professionalism.

Avoid generic portfolio/SaaS aesthetics. Specifically avoid defaulting to:
grids of identical cards, generic SaaS dashboard styling, excessive rounded
rectangles, decorative gradients, arbitrary shadows, excessive pills,
unnecessary containers, or generic AI-generated visual treatments.

Do not generate imagery unless explicitly requested. Prefer real interface
elements — typography, CSS, layout, icons, interaction, charts, tables, and
existing project imagery — over illustration or stock-style graphics.

## Technology

- React + Tailwind is the primary styling system for the portfolio.
- Third-party libraries are welcome when they solve an actual interface
  problem instead of recreating mature functionality from scratch (e.g. AG
  Grid for a sophisticated data grid, AG Charts for a chart that calls for
  it, an established icon library for icons).
- Do not install a library speculatively because it might be useful later —
  only when a concrete need in front of us calls for it.

## Architecture

Prefer reusable components, centralized design tokens, consistent spacing
and typography, shared components for genuinely repeated patterns,
straightforward component APIs, and minimal duplication.

Avoid over-engineering. Don't build abstractions for hypothetical future
requirements, and don't create components purely for architectural purity —
a pattern earns a shared component by actually repeating.

## Design workflow

Alex is the designer and drives design decisions. Don't independently
redesign major parts of the portfolio unless explicitly asked to explore a
direction.

The normal loop is: design direction → implementation → browser review →
visual critique → targeted refinement. The browser is the primary
design/testing environment — implement the requested direction so it can
actually be evaluated there. Expect multiple iterations; iteration is the
normal process, not a sign something went wrong — don't read it as failure
or try to prematurely finalize a design.

## Experimentation

Keep visual experiments easy to modify or remove. When asked to explore one
section, keep the work isolated from unrelated sections — don't touch
unrelated components while iterating on one, and don't perform unsolicited
cleanup or refactoring alongside a design task.

## Content

Never invent metrics, project outcomes, employers, responsibilities, quotes,
awards, research findings, product details, or biographical information. If
required content is missing, use an obvious, clearly-marked placeholder or
ask for the real content — don't fabricate something plausible-sounding to
fill the gap.

`alexandersun.com` (the existing live portfolio) may be used as a reference
for content only. Its visual design and code are explicitly not the template
for this rebuild.

## Visual system

The new visual system hasn't been finalized. Don't prematurely establish a
comprehensive design system (color palette, type scale, spacing scale,
component library) based on placeholder screens — let tokens and reusable
patterns emerge from actual design decisions as sections get built out.

## Current priority

We're intentionally starting with visually rich, lower-stakes material
before touching the enterprise case studies, to establish the visual
language first:

1. Speaking & Media
2. Independent Projects / children's books

Enterprise case studies (Capital One, Monster) come after — once we know how
the visual language established above translates to that kind of work.

## Working on a targeted request

1. Inspect the relevant existing files first.
2. Make only the changes needed for that request.
3. Preserve unrelated working code.
4. Don't expand scope without asking.
5. Run the appropriate checks after implementing (typecheck at minimum;
   verify visually in the browser for anything UI-facing).
6. Briefly report what changed and any issues found — don't pad it with a
   restatement of these rules.
