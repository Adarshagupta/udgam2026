"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { Preloader } from "@/components/preloader";

interface LayoutShellProps {
  children: ReactNode;
}

export function LayoutShell({ children }: LayoutShellProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin") ?? false;

  useEffect(() => {
    document.body.classList.toggle("adminMode", isAdminRoute);

    return () => {
      document.body.classList.remove("adminMode");
    };
  }, [isAdminRoute]);

  useEffect(() => {
    const main = document.querySelector("main");

    if (!(main instanceof HTMLElement)) {
      return;
    }

    const revealTargets = Array.from(
      main.querySelectorAll<HTMLElement>("section, article"),
    );

    if (revealTargets.length === 0) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      for (const target of revealTargets) {
        target.classList.add("scrollRevealVisible");
      }
      return;
    }

    for (const target of revealTargets) {
      target.classList.add("scrollReveal");
    }

    // Safety net: if intersection callbacks are delayed, do not leave content hidden.
    const forceRevealTimer = window.setTimeout(() => {
      for (const target of revealTargets) {
        target.classList.add("scrollRevealVisible");
      }
    }, 900);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("scrollRevealVisible");
            observer.unobserve(entry.target);
          }
        }
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -12% 0px",
      },
    );

    for (const target of revealTargets) {
      observer.observe(target);
    }

    return () => {
      window.clearTimeout(forceRevealTimer);
      observer.disconnect();
    };
  }, [pathname]);

  return (
    <>
      {!isAdminRoute ? <Preloader /> : null}
      {!isAdminRoute ? <Navigation /> : null}
      <main className={isAdminRoute ? "siteMain siteMainAdmin" : "siteMain"}>{children}</main>
      {!isAdminRoute ? <Footer /> : null}
    </>
  );
}
