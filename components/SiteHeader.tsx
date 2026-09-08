"use client";

import { Menu } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/**
 * Sticky site navigation. Separate from components/Header.tsx (the large
 * hero name/title) — this is the persistent top nav bar.
 *
 * Only "Experience" and "Contact" are wired up: those are the only nav
 * labels from the brief that currently correspond to a real section id.
 * "Work" and "About" were intentionally left out rather than pointed at a
 * section that isn't really a match — add them once those sections exist.
 *
 * Mobile uses the existing shadcn Sheet (Base UI Dialog) for the nav
 * menu rather than a hand-built dropdown/overlay.
 */

const NAV_LINKS = [
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-30 flex h-[var(--header-height)] items-center border-b bg-background transition-colors duration-[var(--motion-duration)]"
      style={{ borderBottomColor: isScrolled ? "var(--border)" : "transparent" }}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6">
        <p className="portfolio-caption font-semibold text-foreground">Alex Sun</p>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="portfolio-caption text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <Sheet>
          <SheetTrigger
            render={<Button variant="ghost" size="icon-sm" aria-label="Open menu" className="md:hidden" />}
          >
            <Menu aria-hidden="true" />
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col px-4" aria-label="Primary">
              {NAV_LINKS.map((link) => (
                <SheetClose
                  key={link.href}
                  nativeButton={false}
                  render={<a href={link.href} />}
                  className="portfolio-body border-b border-border py-3 text-foreground last:border-b-0"
                >
                  {link.label}
                </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
