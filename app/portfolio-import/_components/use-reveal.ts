"use client";

import { useEffect, useRef } from "react";

/**
 * portfolio-import — shared scroll-reveal hook.
 * One implementation of the reveal-on-scroll IntersectionObserver behavior
 * that previously existed as near-identical copy-pasted useEffect blocks in
 * landing-content.tsx, capital-one-content.tsx, and marriott-content.tsx
 * (all three ported from the source site's assets/js/animations.js /
 * index.html's own inline variant). Only pages that actually had the
 * script in the source use this — monster and monster-talent never had it,
 * so their sections render fully visible with no hook, matching source.
 *
 * Attach the returned ref to the page's root wrapper. Scopes
 * querySelectorAll to that ref (never `document`), adds a "js" class while
 * mounted (drives the `.js .reveal` / `.js .metric` / etc. rules), and
 * respects prefers-reduced-motion exactly as the source did.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    root.classList.add("js");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    root.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    root.querySelectorAll<HTMLElement>(".metric").forEach((el, i) => {
      el.style.transitionDelay = `${i * 100}ms`;
      observer.observe(el);
    });

    root.querySelectorAll<HTMLElement>(".reveal-h3").forEach((el, i) => {
      el.style.transitionDelay = `${i * 60}ms`;
      observer.observe(el);
    });

    root.querySelectorAll(".reveal-img").forEach((el) => observer.observe(el));
    root.querySelectorAll(".reveal-badge").forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      root.classList.remove("js");
    };
  }, []);

  return ref;
}
