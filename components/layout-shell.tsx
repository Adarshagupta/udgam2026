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
  const isRegistrationRoute = pathname?.startsWith("/register") ?? false;
  const hideSiteChrome = isAdminRoute || isRegistrationRoute;

  useEffect(() => {
    document.body.classList.toggle("adminMode", isAdminRoute);
    document.body.classList.toggle("registrationMode", isRegistrationRoute);

    return () => {
      document.body.classList.remove("adminMode");
      document.body.classList.remove("registrationMode");
    };
  }, [isAdminRoute, isRegistrationRoute]);

  return (
    <>
      {!hideSiteChrome ? <Preloader /> : null}
      {!hideSiteChrome ? <Navigation /> : null}
      <main
        className={
          isAdminRoute
            ? "siteMain siteMainAdmin"
            : isRegistrationRoute
              ? "siteMain siteMainRegister"
              : "siteMain"
        }
      >
        {children}
      </main>
      {!hideSiteChrome ? <Footer /> : null}
    </>
  );
}
