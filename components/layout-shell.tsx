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

  return (
    <>
      {!isAdminRoute ? <Preloader /> : null}
      {!isAdminRoute ? <Navigation /> : null}
      <main className={isAdminRoute ? "siteMain siteMainAdmin" : "siteMain"}>{children}</main>
      {!isAdminRoute ? <Footer /> : null}
    </>
  );
}
