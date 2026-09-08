"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bell,
  ChevronRight,
  FileText,
  Layers,
  ListTree,
  Menu as MenuIcon,
  PanelsTopLeft,
  Pin,
  Settings,
  User,
  UserCircle,
} from "lucide-react";
import { Menu, Typography } from "antd";
import type { MenuProps } from "antd";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useSandboxNotify } from "../../_living-system/monster-notification-provider";

import { PatternsSection } from "./pattern-list";

const { Text } = Typography;

const NAV_MENU_ITEMS: MenuProps["items"] = [
  { key: "overview", icon: <PanelsTopLeft className="size-4" />, label: "Overview" },
  { key: "page-1", icon: <FileText className="size-4" />, label: "Page 1" },
  { key: "page-2", icon: <FileText className="size-4" />, label: "Page 2" },
  { key: "page-3", icon: <FileText className="size-4" />, label: "Page 3" },
  {
    key: "menu-1",
    icon: <ListTree className="size-4" />,
    label: "Menu 1",
    children: [
      { key: "page-4", label: "Page 4" },
      {
        key: "submenu-1",
        label: "Submenu 1",
        children: [
          { key: "page-5", label: "Page 5" },
          { key: "tabbed-page", label: "Page with Tabs" },
          { key: "page-6", label: "Page 6" },
        ],
      },
    ],
  },
  {
    key: "menu-2",
    icon: <User className="size-4" />,
    label: "Menu 2",
    children: [
      { key: "page-7", label: "Page 7" },
      {
        key: "submenu-2",
        label: "Submenu 2",
        children: [
          { key: "page-8", label: "Page 8" },
          { key: "page-9", label: "Page 9" },
          { key: "page-10", label: "Page 10" },
        ],
      },
    ],
  },
];

/**
 * Page with Tabs' own sub-navigation — a deeper tab layer scoped to this
 * one page, demonstrating local tab navigation within a single
 * destination.
 */
const TABBED_PAGE_TAB_KEYS = ["overview", "details", "history"] as const;

const TABBED_PAGE_TAB_LABELS: Record<(typeof TABBED_PAGE_TAB_KEYS)[number], string> = {
  overview: "Overview",
  details: "Details",
  history: "History",
};

/** A short heading + one line of copy per tab, so switching tabs visibly changes what's on screen. */
const TABBED_PAGE_TAB_CONTENT: Record<(typeof TABBED_PAGE_TAB_KEYS)[number], { heading: string; copy: string }> = {
  overview: {
    heading: "Explore local navigation",
    copy: "This page demonstrates navigation within a destination. Use the tabs above to move between related views without leaving the current page.",
  },
  details: {
    heading: "A related local view",
    copy: "This is a different view within the same destination — the page hasn't changed, only what's displayed inside it.",
  },
  history: {
    heading: "Another related view",
    copy: "Local tabs let several closely related views share one destination instead of requiring separate navigation entries for each.",
  },
};

/** Leaf destinations only — "menu-1", "menu-2", "submenu-1", and "submenu-2" are pure expand/collapse groups, not selectable pages, so they're intentionally absent here. */
const NAV_LABELS: Record<string, string> = {
  overview: "Overview",
  "page-1": "Page 1",
  "page-2": "Page 2",
  "page-3": "Page 3",
  "page-4": "Page 4",
  "tabbed-page": "Page with Tabs",
  "page-5": "Page 5",
  "page-6": "Page 6",
  "page-7": "Page 7",
  "page-8": "Page 8",
  "page-9": "Page 9",
  "page-10": "Page 10",
};

/** One descriptive sentence per destination page, shown directly below its heading. */
const PAGE_DESCRIPTIONS: Record<string, string> = {
  "page-1": "A direct destination in the primary navigation.",
  "page-2": "A direct destination in the primary navigation.",
  "page-3": "A direct destination in the primary navigation.",
  "page-4": "A destination nested within Menu 1.",
  "tabbed-page": "This destination adds a local navigation layer within the current page.",
  "page-5": "A destination nested within Submenu 1.",
  "page-6": "A destination nested within Submenu 1.",
  "page-7": "A destination nested within Menu 2.",
  "page-8": "A destination nested within Submenu 2.",
  "page-9": "A destination nested within Submenu 2.",
  "page-10": "A destination nested within Submenu 2.",
};

/**
 * Parallel, deliberately simpler description of the same hierarchy as
 * NAV_MENU_ITEMS, used only to render the collapsed icon-rail's flyout
 * menus (antd's MenuProps["items"] shape isn't a natural fit for driving
 * a shadcn/Base UI DropdownMenu). "Menu 1" and "Menu 2" stay pure submenu
 * openers here too — same non-selectable-group rule as the expanded antd
 * Menu, not a click destination.
 */
interface RailLeaf {
  key: string;
  label: string;
}
interface RailGroup {
  key: string;
  label: string;
  children: RailLeaf[];
}
type RailChild = RailLeaf | RailGroup;

function isRailGroup(child: RailChild): child is RailGroup {
  return "children" in child;
}

interface RailItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  children?: RailChild[];
}

const RAIL_ITEMS: RailItem[] = [
  { key: "overview", label: "Overview", icon: <PanelsTopLeft className="size-[18px]" /> },
  { key: "page-1", label: "Page 1", icon: <FileText className="size-[18px]" /> },
  { key: "page-2", label: "Page 2", icon: <FileText className="size-[18px]" /> },
  { key: "page-3", label: "Page 3", icon: <FileText className="size-[18px]" /> },
  {
    key: "menu-1",
    label: "Menu 1",
    icon: <ListTree className="size-[18px]" />,
    children: [
      { key: "page-4", label: "Page 4" },
      {
        key: "submenu-1",
        label: "Submenu 1",
        children: [
          { key: "page-5", label: "Page 5" },
          { key: "tabbed-page", label: "Page with Tabs" },
          { key: "page-6", label: "Page 6" },
        ],
      },
    ],
  },
  {
    key: "menu-2",
    label: "Menu 2",
    icon: <User className="size-[18px]" />,
    children: [
      { key: "page-7", label: "Page 7" },
      {
        key: "submenu-2",
        label: "Submenu 2",
        children: [
          { key: "page-8", label: "Page 8" },
          { key: "page-9", label: "Page 9" },
          { key: "page-10", label: "Page 10" },
        ],
      },
    ],
  },
];

const MENU_1_DESCENDANT_KEYS = new Set(["page-4", "page-5", "tabbed-page", "page-6"]);

const MENU_2_DESCENDANT_KEYS = new Set(["page-7", "page-8", "page-9", "page-10"]);

/** The four concise explanatory blocks shown on the Overview landing page. */
const OVERVIEW_ITEMS: { title: string; description: string; icon: React.ReactNode }[] = [
  {
    title: "Collapsible Navigation",
    description: "Collapse the sidebar to create more workspace.",
    icon: <MenuIcon className="size-4" />,
  },
  {
    title: "Nested Navigation",
    description: "Group related destinations without showing every level.",
    icon: <ListTree className="size-4" />,
  },
  {
    title: "Deeper Navigation",
    description: "Use local tabs for related views within a page.",
    icon: <Layers className="size-4" />,
  },
  {
    title: "Persistent Context",
    description: "Keep the application shell visible as users move.",
    icon: <Pin className="size-4" />,
  },
];

/**
 * The collapsed rail's hover/click/close rules, exactly as implemented —
 * an interaction-specification artifact shown below the Overview's
 * pattern cards, not another feature-card grid. Copy is fixed; do not
 * reword when editing this list.
 */
const INTERACTION_SPEC_ITEMS: { title: string; description: string }[] = [
  {
    title: "Opening a menu",
    description: "Hovering or clicking a menu icon opens its flyout. Clicking an already-open menu icon does not close it.",
  },
  {
    title: "Keeping the menu open",
    description: "The flyout stays open while the pointer is anywhere over the menu icon or its flyout. Moving between the two does not dismiss it.",
  },
  {
    title: "Closing a menu",
    description: "The flyout closes when the pointer leaves both the icon and flyout, or when the user selects a destination.",
  },
  {
    title: "Distinguishing menus from direct destinations",
    description: "Menu icons include a small chevron to indicate another navigation level. Direct-page icons have no chevron and navigate immediately; on hover or focus, they show only the destination label.",
  },
  {
    title: "Nested navigation",
    description: "Items containing another level display a chevron. Opening a nested flyout preserves the parent flyout so users can move through the hierarchy without losing their navigation path.",
  },
];

/**
 * "Things to try" is a passive, automatic checklist — completion is
 * derived from real navigation state (collapsing the sidebar, hovering a
 * rail icon, toggling Menu 1, opening Page with Tabs and changing its
 * tab), never a user-clickable control. No component of this list is
 * itself interactive.
 */
interface ChecklistItem {
  key: string;
  label: string;
  description: string;
  complete: boolean;
}

/**
 * The single shared visual treatment for every selectable row inside a
 * collapsed-rail flyout — used identically for a direct page's own
 * one-item flyout (e.g. Page 2) and for a menu's flyout destinations
 * (e.g. Page 4, and nested Submenu grandchildren), so a direct
 * destination never reads as a separate card/button style from a menu
 * destination.
 */
function railFlyoutItemClassName(isSelected: boolean) {
  return cn(
    "rail-flyout-item rounded-md px-0 py-2.5 text-[15px]",
    isSelected ? "bg-teal-50 font-semibold text-teal-800" : "text-slate-900",
  );
}

/**
 * The same base popup styling `DropdownMenuContent` (components/ui/dropdown-menu.tsx)
 * applies internally before merging in a caller's own className — duplicated
 * here only because a leaf item's one-row label flyout is anchored directly
 * to its plain `<button>` via Base UI's `Positioner` `anchor` prop (so the
 * button's own click behavior stays completely untouched, with no
 * DropdownMenuTrigger involved), and that wrapper doesn't expose an anchor
 * override. Kept byte-for-byte identical so the result matches Menu 1 /
 * Menu 2's flyout container exactly, same as it would via the wrapper.
 */
const RAIL_LABEL_POPUP_BASE_CLASSNAME =
  "z-50 max-h-(--available-height) w-(--anchor-width) min-w-32 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:overflow-hidden data-closed:fade-out-0 data-closed:zoom-out-95";

/**
 * One icon in the collapsed rail. Items with children open a DropdownMenu
 * flyout — but "open" is a single piece of state the rail container owns
 * (`openKey`), not Base UI's own `openOnHover`. Each `<DropdownMenu>` here
 * is a purely controlled popup: hover, click, and keyboard focus all just
 * ask the rail container to open/close a key, via the `onRequest*`
 * callbacks below, rather than each icon running its own independent
 * Base UI hover engine that has to be reconciled with its five siblings'.
 * See the rail container's own comments for why. A nested group still
 * renders a further DropdownMenuSub (Base UI's own `openOnHover`,
 * untouched) — that one level shares a single floating tree inside an
 * already-open parent popup, a much smaller surface that hasn't shown the
 * same failure modes. Leaf items (no children) are plain buttons.
 */
function RailIcon({
  item,
  active,
  selectedKey,
  onSelect,
  onHover,
  openKey,
  onRequestOpenHover,
  onRequestCloseHover,
  onRequestOpenNow,
  onRequestCloseNow,
}: {
  item: RailItem;
  active: boolean;
  selectedKey: string;
  onSelect: (key: string) => void;
  onHover?: () => void;
  /** Which rail item's flyout is currently open, or null. Owned by the rail container. */
  openKey: string | null;
  /** Pointer entered this trigger or its own flyout content — open after the shared hover delay, debounced. */
  onRequestOpenHover: (key: string) => void;
  /** Pointer left this trigger or its own flyout content — close after the shared close delay, unless re-entered first. */
  onRequestCloseHover: (key: string) => void;
  /** A click or keyboard interaction asked to open — no delay, no hover involved. */
  onRequestOpenNow: (key: string) => void;
  /** Escape, outside-press, item-press, or a collapse toggle asked to close — no delay. */
  onRequestCloseNow: () => void;
}) {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const open = openKey === item.key;

  // Base UI's Menu.Popup would normally return real DOM focus to this
  // trigger whenever its flyout closes (floating-ui's FloatingFocusManager,
  // `returnFocus: true` for a top-level menu — confirmed by reading Base
  // UI's own MenuPopup source), regardless of *why* it closed. That's
  // disabled below via `finalFocus={false}`, so Escape needs its own
  // explicit refocus for keyboard accessibility — the one case where
  // leaving focus to fall through to <body> would be a real regression.
  // This flag distinguishes that one self-authored `.focus()` call from a
  // genuine Tab press, so the resulting onFocus doesn't treat our own
  // refocus as a request to reopen.
  const suppressNextFocusOpenRef = useRef(false);

  const handleSelect = (key: string) => {
    onRequestCloseNow();
    onSelect(key);
  };

  const iconButtonClassName = cn(
    // relative only so the group-item chevron below has something to
    // anchor to via absolute positioning — a no-op for leaf items, which
    // never render that chevron, and doesn't affect how the primary icon
    // itself is centered.
    "rail-icon-btn relative flex size-10 items-center justify-center rounded-md",
    active ? "bg-teal-50 text-teal-800" : "text-slate-600",
  );

  // Leaf items are direct destinations, not menus — no submenu, so no
  // click-to-toggle affordance and no chevron. The button itself is
  // untouched from the plain-button leaf fix (still navigates immediately
  // on click, still just one element for that interaction) — it just also
  // now shows a one-row label flyout on hover/focus, anchored to itself
  // directly via Base UI's Positioner `anchor` prop rather than being
  // wrapped in a DropdownMenuTrigger, specifically so Base UI's built-in
  // click-to-toggle (always on for a real Trigger, with no prop to turn
  // it off) can never intercept this button's click and turn it into
  // "open the label" instead of "navigate." The label reuses the exact
  // same flyout container styling and the exact same DropdownMenuItem row
  // used for every other flyout destination (Page 4, Page 5, Page 6, …).
  if (!item.children?.length) {
    const labelOpen = openKey === item.key;
    return (
      <>
        <button
          ref={triggerRef}
          type="button"
          aria-label={item.label}
          onClick={() => handleSelect(item.key)}
          onMouseEnter={() => {
            onHover?.();
            onRequestOpenHover(item.key);
          }}
          onMouseLeave={() => onRequestCloseHover(item.key)}
          onFocus={() => {
            onHover?.();
            onRequestOpenNow(item.key);
          }}
          onBlur={() => {
            // Only this icon's own open label — see the group branch's
            // identical guard below for why.
            if (labelOpen) onRequestCloseNow();
          }}
          className={iconButtonClassName}
        >
          {item.icon}
        </button>
        <MenuPrimitive.Root
          open={labelOpen}
          modal={false}
          onOpenChange={(next) => {
            if (!next) onRequestCloseNow();
          }}
        >
          <MenuPrimitive.Portal>
            <MenuPrimitive.Positioner
              anchor={triggerRef}
              side="right"
              align="start"
              sideOffset={-2}
              className="isolate z-50 outline-none"
            >
              <MenuPrimitive.Popup
                aria-hidden="true"
                finalFocus={false}
                data-slot="dropdown-menu-content"
                // A direct destination only ever shows one short label, so
                // this sizes to that content instead of reusing Menu 1 /
                // Menu 2's fixed 220px flyout width — no hierarchy to make
                // room for here. `w-fit`/`min-w-0` override the shared
                // popup base's own `w-(--anchor-width)`/`min-w-32`.
                className={cn(
                  RAIL_LABEL_POPUP_BASE_CLASSNAME,
                  "rail-flyout w-fit min-w-0 border border-slate-200 bg-white text-slate-900 shadow-md",
                )}
              >
                <DropdownMenuItem
                  onClick={() => handleSelect(item.key)}
                  className={cn(railFlyoutItemClassName(selectedKey === item.key), "px-2.5 py-1.5 whitespace-nowrap")}
                >
                  {item.label}
                </DropdownMenuItem>
              </MenuPrimitive.Popup>
            </MenuPrimitive.Positioner>
          </MenuPrimitive.Portal>
        </MenuPrimitive.Root>
      </>
    );
  }

  return (
    <DropdownMenu
      open={open}
      // Base UI treats a menu as modal by default (locking page scroll via
      // useAnchoredPopupScrollLock) unless it was opened by its own
      // openOnHover engine — "menus opened by hover are never modal" per
      // Menu.Root's own doc comment, keyed off it internally tagging the
      // open reason "trigger-hover". A real click on the trigger is tagged
      // "trigger-press" instead (never exempted, by design) and DOES
      // engage a real page scroll lock — confirmed directly: opening via
      // .click() mutates <html>/<body> inline styles
      // (scrollbar-gutter/overflow) via MenuStore.js/useScrollLock.js.
      // (Opening via this component's own hover state, bypassing Base
      // UI's click/hover interactions entirely, was checked the same way
      // and does NOT trigger it — so this specifically guards the click
      // path.) These are lightweight rail-preview flyouts, not dialogs;
      // opting out of modal behavior is correct regardless.
      modal={false}
      onOpenChange={(next, eventDetails) => {
        if (next) {
          // Base UI can no longer emit this with reason "trigger-hover"
          // for this trigger (openOnHover is gone from it below), so this
          // is always a real click or a keyboard Enter/Space activation.
          onRequestOpenNow(item.key);
          return;
        }
        // The trigger is an entry point into the flyout, not a toggle: a
        // click while it's already open (Base UI's own click-to-toggle,
        // reporting reason "trigger-press" here because it already
        // considers this trigger open, whether that open came from hover
        // or an earlier click) must never close it. Only leaving both the
        // trigger and the flyout — handled entirely by the hover-close
        // path above, not this callback — closes it.
        if (eventDetails?.reason === "trigger-press") {
          return;
        }
        if (eventDetails?.reason === "escape-key") {
          suppressNextFocusOpenRef.current = true;
          triggerRef.current?.focus();
        }
        onRequestCloseNow();
      }}
    >
      <DropdownMenuTrigger
        ref={triggerRef}
        aria-label={item.label}
        onMouseEnter={() => {
          onHover?.();
          onRequestOpenHover(item.key);
        }}
        onMouseLeave={() => onRequestCloseHover(item.key)}
        onFocus={() => {
          onHover?.();
          if (suppressNextFocusOpenRef.current) {
            suppressNextFocusOpenRef.current = false;
            return;
          }
          onRequestOpenNow(item.key);
        }}
        onBlur={() => {
          // Only this icon's own open flyout — a blur firing here must
          // never close a *different* icon's flyout that happens to be
          // open (e.g. Tab moving from this trigger onto an already
          // hover-open sibling).
          if (open) onRequestCloseNow();
        }}
        className={iconButtonClassName}
      >
        {item.icon}
        {/* Static "this contains another level" affordance — not an
            open/closed indicator, so it never rotates or animates with
            `open`. Purely decorative: aria-hidden, no pointer-events of
            its own, just an extra glyph inside the existing trigger
            button rather than a separate element, so it can't become a
            second clickable target or shift the button's own size. */}
        <ChevronRight
          aria-hidden="true"
          strokeWidth={2.5}
          className="pointer-events-none absolute top-1/2 right-[-3px] size-3 -translate-y-1/2 text-slate-500"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="right"
        align="start"
        sideOffset={-2}
        finalFocus={false}
        onMouseEnter={() => onRequestOpenHover(item.key)}
        onMouseLeave={() => onRequestCloseHover(item.key)}
        // Sized to its own content (group label, destinations, nested-menu
        // chevrons) rather than a fixed 220px — `w-max`/`min-w-0` override
        // the shared popup base's own `w-(--anchor-width)`/`min-w-32`, so
        // the flyout is exactly as wide as its widest row plus this
        // uniform 16px (`p-4`) padding on every edge — no per-row
        // horizontal padding left to add on top of it.
        className="rail-flyout w-max min-w-0 border border-slate-200 bg-white p-4 text-slate-900 shadow-md"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="mb-2 px-0 py-0 font-semibold tracking-wide text-slate-600 uppercase">
            {item.label}
          </DropdownMenuLabel>
          {item.children.map((child) =>
            isRailGroup(child) ? (
              <DropdownMenuSub key={child.key}>
                <DropdownMenuSubTrigger
                  openOnHover
                  // The shared component (components/ui/dropdown-menu.tsx,
                  // not edited here — it's used elsewhere too) hardcodes
                  // its chevron with `ml-auto`, which pushes it to this
                  // row's far edge whenever the flyout is wider than this
                  // label alone needs (e.g. driven by a longer sibling
                  // row). `[&>svg]:ml-0` cancels that auto margin via a
                  // higher-specificity selector (class+type beats the
                  // chevron's own single class), so the row's own
                  // `gap-3.5` (overriding the shared default `gap-1.5`) is
                  // the only thing spacing label from chevron — a fixed
                  // 14px regardless of the flyout's overall width.
                  className="rail-flyout-item rounded-md px-0 py-2.5 text-[15px] text-slate-900 gap-3.5 [&>svg]:ml-0"
                >
                  {child.label}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent
                  // Base UI anchors this to the trigger ROW, not to Menu
                  // 1/2's own popup edge — and the row sits inset from
                  // that edge by the popup's own right padding + border
                  // (16px + 1px). Default sideOffset is 0
                  // (components/ui/dropdown-menu.tsx), which at that inset
                  // reads as this flyout's border overlapping Menu 1/2's
                  // own. 23 = 17 (that inset) + 6, landing the actual
                  // border-to-border gap at ~6px without widening it
                  // enough to make crossing from the trigger into this
                  // flyout awkward.
                  sideOffset={23}
                  className="rail-flyout w-max min-w-0 border border-slate-200 bg-white p-4 text-slate-900 shadow-md"
                >
                  {child.children.map((grandchild) => (
                    <DropdownMenuItem
                      key={grandchild.key}
                      onClick={() => handleSelect(grandchild.key)}
                      className={railFlyoutItemClassName(selectedKey === grandchild.key)}
                    >
                      {grandchild.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            ) : (
              <DropdownMenuItem
                key={child.key}
                onClick={() => handleSelect(child.key)}
                className={railFlyoutItemClassName(selectedKey === child.key)}
              >
                {child.label}
              </DropdownMenuItem>
            ),
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * A deliberately generic demonstration of navigation patterns — global
 * application nav (top bar), three direct top-level pages, and two
 * expandable groups ("Menu 1", "Menu 2"), each containing a direct page
 * and a further nested submenu (demonstrating a third level of sidebar
 * hierarchy). "Page with Tabs," the destination with its own local
 * tab-level navigation, lives exclusively inside Menu 1's "Submenu 1" —
 * rather than a simulation of a real application. Labels are intentionally generic
 * ("Page 1", "Menu 1", etc.) so the navigation behavior itself — not any
 * domain content — is what reviewers evaluate. "Monster Works" is
 * fictional branding for this demonstration, not a claim about Monster's
 * real production application or interface.
 *
 * The whole thing is contained in a single bordered app frame (border +
 * radius supplied by the shared `Frame` wrapper at the call site) so it
 * reads as one embedded application rather than page content. The
 * hamburger toggles between the full sidebar (icons + labels + nested
 * tree, built from antd Menu — the same primitive AfterSidebar/LdsSidebar
 * already use elsewhere in this project) and a collapsed icon rail; on
 * the rail, hovering a primary icon opens a DropdownMenu flyout so every
 * destination, nested ones included, stays reachable without expanding
 * the sidebar.
 *
 * Every leaf destination is genuinely clickable and swaps only the main
 * content area for a deliberately blank page — just its own name as a
 * heading, nothing else — while the shell (top bar, sidebar/rail) never
 * unmounts. "Menu 1", "Menu 2", "Submenu 1", and "Submenu 2" stay pure
 * expand/collapse groups in both sidebar states (antd only fires onClick
 * for leaf items, not submenu titles; the rail's flyout mirrors that by
 * making them submenu openers, not click targets) — each submenu nests
 * one level inside its parent menu so Overview has two real examples of a
 * third level of sidebar hierarchy, distinct from Page with Tabs' local
 * tab-level navigation.
 *
 * The app frame itself is fixed-height (matches other LDS demo panels'
 * "contained enterprise window" framing) so switching destinations never
 * grows the accordion; the middle row (sidebar + main content) is the
 * flex child that absorbs the remaining height, and the main content pane
 * scrolls internally if a destination's content is taller than that.
 */

/**
 * A short interaction-specification artifact shown below the Overview's
 * "Navigation patterns | Things to try" columns — documentation of the
 * hover/click/close rules the rail above already demonstrates, framed as
 * an engineering handoff spec rather than another set of feature cards:
 * a single numbered list with thin row separators, small muted numerals
 * (not a decorative display size), no icons, no checklist affordance, and
 * no interaction of its own.
 */
function InteractionSpecSection() {
  return (
    <div style={{ marginTop: 40 }}>
      <div style={{ color: "#0F172A", fontWeight: 700, fontSize: 18 }}>Defining the interaction behavior</div>
      <p style={{ marginTop: 8, maxWidth: 640, fontSize: 15, lineHeight: 1.6, color: "#475569" }}>
        The collapsible navigation introduced interaction details that needed to be defined clearly for
        implementation, including when menus open, when they close, and how users move between levels.
      </p>
      <div style={{ marginTop: 20 }}>
        {INTERACTION_SPEC_ITEMS.map((rule, index) => (
          <div
            key={rule.title}
            style={{
              display: "flex",
              gap: 16,
              paddingBlock: 16,
              borderTop: index === 0 ? "none" : "1px solid #E2E8F0",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                flexShrink: 0,
                width: 22,
                fontSize: 13,
                fontWeight: 600,
                color: "#94A3B8",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#0F172A" }}>{rule.title}</div>
              <p style={{ marginTop: 4, maxWidth: 600, fontSize: 14, lineHeight: 1.6, color: "#475569" }}>
                {rule.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function NavigationPanel() {
  const notify = useSandboxNotify();
  const [selectedKey, setSelectedKey] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [tabbedPageTab, setTabbedPageTab] = useState<string>("overview");
  const [menuOpenKeys, setMenuOpenKeys] = useState<string[]>(["menu-1"]);

  // "Things to try" completion flags — each is set once by a real
  // navigation interaction and never reset for the rest of the session.
  const [hasCollapsedSidebar, setHasCollapsedSidebar] = useState(false);
  const [hasHoveredRailIcon, setHasHoveredRailIcon] = useState(false);
  const [hasExpandedSubmenu1, setHasExpandedSubmenu1] = useState(false);
  const [hasOpenedTabbedPage, setHasOpenedTabbedPage] = useState(false);
  const [hasChangedTabbedPageTab, setHasChangedTabbedPageTab] = useState(false);

  // Which collapsed-rail item's flyout is open, if any — the single
  // source of truth for the whole rail. Each RailIcon's <DropdownMenu> is
  // a purely controlled popup (`open={openKey === item.key}`); none of
  // them run Base UI's own `openOnHover` anymore, so there is exactly one
  // decision-maker instead of six independent hover engines that each had
  // to be reconciled with its siblings after the fact.
  const [openKey, setOpenKey] = useState<string | null>(null);
  const openTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  // Collapsing swaps the full inline menu (which shows Menu 1's children as
  // extra rows) for the compact icon rail (six top-level icons only) — the
  // two layouts don't share row positions, so a cursor that stays put
  // through the toggle can end up over a completely different icon than
  // the one it was on, and the browser fires a real hover for whatever now
  // sits there. An epoch-ms deadline rather than a boolean: it's read once,
  // inside the one function that decides hover-opens below, so there's no
  // second engine left to race against re-arming it.
  const hoverSuppressedUntilRef = useRef(0);

  const OPEN_DELAY_MS = 60;
  const CLOSE_DELAY_MS = 150;
  const TOGGLE_SUPPRESS_MS = 220;

  const clearRailTimers = () => {
    if (openTimerRef.current !== null) window.clearTimeout(openTimerRef.current);
    if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
    openTimerRef.current = null;
    closeTimerRef.current = null;
  };

  useEffect(() => clearRailTimers, []);

  /** Pointer entered a trigger or its own flyout content. */
  const requestOpenHover = (key: string) => {
    if (Date.now() < hoverSuppressedUntilRef.current) return;
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (openKey === key) return;
    if (openTimerRef.current !== null) window.clearTimeout(openTimerRef.current);
    openTimerRef.current = window.setTimeout(() => setOpenKey(key), OPEN_DELAY_MS);
  };

  /** Pointer left a trigger or its own flyout content. */
  const requestCloseHover = (key: string) => {
    if (openTimerRef.current !== null) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      setOpenKey((current) => (current === key ? null : current));
    }, CLOSE_DELAY_MS);
  };

  /** A click or keyboard interaction asked to open — immediate, no hover involved. */
  const requestOpenNow = (key: string) => {
    clearRailTimers();
    setOpenKey(key);
  };

  /** Escape, outside-press, item-press, or a collapse toggle asked to close — immediate. */
  const requestCloseNow = () => {
    clearRailTimers();
    setOpenKey(null);
  };

  const isOverview = selectedKey === "overview";
  const isTabbedPage = selectedKey === "tabbed-page";

  const isRailItemActive = (item: RailItem) => {
    if (item.key === "menu-1") return MENU_1_DESCENDANT_KEYS.has(selectedKey);
    if (item.key === "menu-2") return MENU_2_DESCENDANT_KEYS.has(selectedKey);
    return selectedKey === item.key;
  };

  const handleSelect = (key: string) => {
    setSelectedKey(key);
    if (key === "tabbed-page") setHasOpenedTabbedPage(true);
  };

  const handleToggleCollapsed = () => {
    if (!collapsed) setHasCollapsedSidebar(true);
    requestCloseNow();
    hoverSuppressedUntilRef.current = Date.now() + TOGGLE_SUPPRESS_MS;
    setCollapsed((c) => !c);
  };

  const handleMenuOpenChange = (keys: string[]) => {
    if (keys.includes("submenu-1") && !menuOpenKeys.includes("submenu-1")) {
      setHasExpandedSubmenu1(true);
    }
    setMenuOpenKeys(keys);
  };

  const CHECKLIST: ChecklistItem[] = [
    {
      key: "collapse",
      label: "Collapse the navigation",
      description: "Click the hamburger menu to collapse the sidebar.",
      complete: hasCollapsedSidebar,
    },
    {
      key: "explore-icons",
      label: "Explore the icon menu",
      description: "With the navigation collapsed, hover over an icon to explore its navigation flyout.",
      complete: hasHoveredRailIcon,
    },
    {
      key: "nested",
      label: "Explore nested navigation",
      description: "Open Menu 1, then expand Submenu 1 to reveal another level of navigation.",
      complete: hasExpandedSubmenu1,
    },
    {
      key: "tabbed",
      label: "Explore tabbed navigation",
      description: "Open “Page with Tabs,” then switch between its tabs.",
      complete: hasOpenedTabbedPage && hasChangedTabbedPageTab,
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: 650,
        overflow: "hidden",
        borderRadius: 8,
        fontFamily: 'system-ui, -apple-system, "Inter", sans-serif',
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          height: 52,
          paddingInline: 16,
          borderBottom: "1px solid #E2E8F0",
          background: "#FFFFFF",
          borderRadius: "8px 8px 0 0",
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
          aria-pressed={collapsed}
          onClick={handleToggleCollapsed}
          className="hamburger-btn flex size-8 shrink-0 items-center justify-center rounded-md text-slate-600"
        >
          <MenuIcon className="size-4" />
        </button>
        <Text strong style={{ color: "#0F172A", fontSize: 14, whiteSpace: "nowrap" }}>
          Monster Works
        </Text>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16, color: "#475569" }}>
          <Bell className="size-4" />
          <Settings className="size-4" />
          <UserCircle className="size-[18px]" />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "stretch", flex: 1, minHeight: 0 }}>
        <div
          className="nav-sidebar-panel"
          style={{
            width: collapsed ? 64 : 220,
            flexShrink: 0,
            background: "#FFFFFF",
            borderRight: "1px solid #E2E8F0",
            overflowX: "hidden",
            transition: "width 200ms ease-out",
          }}
        >
          {collapsed ? (
            <div
              style={{
                width: 64,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                paddingBlock: 12,
              }}
            >
              {RAIL_ITEMS.map((item) => (
                <RailIcon
                  key={item.key}
                  item={item}
                  active={isRailItemActive(item)}
                  selectedKey={selectedKey}
                  onSelect={handleSelect}
                  onHover={() => setHasHoveredRailIcon(true)}
                  openKey={openKey}
                  onRequestOpenHover={requestOpenHover}
                  onRequestCloseHover={requestCloseHover}
                  onRequestOpenNow={requestOpenNow}
                  onRequestCloseNow={requestCloseNow}
                />
              ))}
            </div>
          ) : (
            <div className="living-system-nav-menu" style={{ width: 220, height: "100%" }}>
              <Menu
                mode="inline"
                items={NAV_MENU_ITEMS}
                selectedKeys={[selectedKey]}
                openKeys={menuOpenKeys}
                onOpenChange={handleMenuOpenChange}
                onClick={({ key }) => handleSelect(key)}
                style={{ border: "none", background: "transparent" }}
              />
            </div>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0, padding: 24, overflowY: "auto", background: "#F8FAFC" }}>
          {isOverview ? (
            <div>
              <div style={{ color: "#0F172A", fontWeight: 700, fontSize: 20 }}>Navigation System Overview</div>
              <Text type="secondary" style={{ display: "block", marginTop: 4, fontSize: 16, maxWidth: 520, lineHeight: 1.5, color: "#334155" }}>
                Explore how the application handles global navigation, nested destinations, and a compact icon rail
                for high-density interfaces.
              </Text>

              <PatternsSection heading="Navigation patterns" items={OVERVIEW_ITEMS} checklist={CHECKLIST} />

              <InteractionSpecSection />
            </div>
          ) : isTabbedPage ? (
            <div>
              <div style={{ color: "#0F172A", fontWeight: 700, fontSize: 20, marginBottom: 6 }}>{NAV_LABELS[selectedKey]}</div>
              <p style={{ fontSize: 16, lineHeight: "24px", color: "#334155", marginBottom: 20 }}>
                {PAGE_DESCRIPTIONS[selectedKey]}
              </p>

              <Tabs
                value={tabbedPageTab}
                onValueChange={(value) => {
                  setTabbedPageTab(value as string);
                  if (!hasChangedTabbedPageTab) {
                    setHasChangedTabbedPageTab(true);
                    notify("success", "Tabbed navigation explored");
                  }
                }}
              >
                <TabsList
                  variant="line"
                  className="h-auto w-full justify-start gap-6 rounded-none border-b border-slate-200 bg-transparent p-0"
                >
                  {TABBED_PAGE_TAB_KEYS.map((key) => (
                    <TabsTrigger
                      key={key}
                      value={key}
                      className="billing-tab-trigger h-auto flex-none cursor-pointer rounded-none border-0 px-0.5 pb-3 text-[15px] font-medium text-slate-600 shadow-none hover:text-slate-900 data-active:bg-transparent data-active:font-semibold data-active:text-slate-900 data-active:shadow-none after:h-[2px] after:bg-teal-700"
                    >
                      {TABBED_PAGE_TAB_LABELS[key]}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {TABBED_PAGE_TAB_KEYS.map((key) => (
                  <TabsContent key={key} value={key} style={{ marginTop: 16 }}>
                    <div style={{ color: "#0F172A", fontWeight: 600, fontSize: 16, marginBottom: 4 }}>
                      {TABBED_PAGE_TAB_CONTENT[key].heading}
                    </div>
                    <p style={{ fontSize: 16, lineHeight: "24px", color: "#334155", maxWidth: 560 }}>
                      {TABBED_PAGE_TAB_CONTENT[key].copy}
                    </p>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          ) : (
            <div>
              <div style={{ color: "#0F172A", fontWeight: 700, fontSize: 20, marginBottom: 6 }}>{NAV_LABELS[selectedKey] ?? selectedKey}</div>
              {PAGE_DESCRIPTIONS[selectedKey] && (
                <p style={{ fontSize: 16, lineHeight: "24px", color: "#334155" }}>{PAGE_DESCRIPTIONS[selectedKey]}</p>
              )}
            </div>
          )}
        </div>
      </div>
      <style jsx global>{`
        /* Reserves the page's vertical scrollbar gutter permanently while
           this demo is mounted, so nothing -- a rail flyout opening, any
           other transient reflow -- can shift page width by toggling
           whether the scrollbar itself is present. Directly defends
           against a scrollbar-driven layout shift regardless of its exact
           cause, on top of (not instead of) the modal=false fix on the
           rail's own DropdownMenu above, which addresses one confirmed
           specific cause (Base UI's click-open scroll lock). */
        html {
          scrollbar-gutter: stable;
        }
        .billing-tab-trigger:hover {
          color: #0f172a !important;
        }
        .billing-tab-trigger:focus-visible {
          outline: 2px solid #0d9488 !important;
          outline-offset: 2px;
          border-radius: 2px;
        }
        .billing-tab-trigger {
          transition: none !important;
        }
        .billing-tab-trigger::after {
          transition: none !important;
        }
        .billing-tab-trigger[data-active] {
          color: #0f172a !important;
          font-weight: 600 !important;
        }
        .billing-tab-trigger[data-active]::after {
          opacity: 1 !important;
          background-color: #0f766e !important;
        }
        .living-system-nav-menu .ant-menu-item,
        .living-system-nav-menu .ant-menu-submenu-title {
          height: 34px !important;
          line-height: 34px !important;
          margin-top: 2px !important;
          margin-bottom: 2px !important;
        }
        .hamburger-btn {
          cursor: pointer;
          transition: background-color 0.15s ease;
        }
        .hamburger-btn:hover {
          background-color: #f1f5f9 !important;
          color: #0f172a !important;
        }
        .rail-icon-btn {
          cursor: pointer;
          transition: background-color 0.15s ease;
        }
        .rail-icon-btn:hover {
          background-color: #f1f5f9 !important;
          color: #0f172a !important;
        }
        .rail-flyout-item {
          cursor: pointer;
        }
        .rail-flyout-item[data-highlighted] {
          background-color: #f1f5f9 !important;
          color: #0f172a !important;
        }
        .rail-flyout {
          animation: none !important;
          opacity: 1;
          transition: opacity 100ms ease !important;
        }
        .rail-flyout[data-ending-style] {
          opacity: 0 !important;
        }
        .hamburger-btn:focus-visible,
        .rail-icon-btn:focus-visible {
          outline: none !important;
          box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #0d9488 !important;
        }
        .rail-flyout-item:focus-visible {
          outline: none !important;
          box-shadow: inset 0 0 0 2px #0d9488 !important;
        }
        .living-system-nav-menu .ant-menu-item:focus-visible,
        .living-system-nav-menu .ant-menu-submenu-title:focus-visible {
          box-shadow: inset 0 0 0 2px #0d9488 !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .nav-sidebar-panel,
          .rail-flyout,
          .hamburger-btn,
          .rail-icon-btn {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
