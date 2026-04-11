import type { Metadata } from "next";
import type { ReactNode } from "react";

import { LayoutShell } from "@/components/layout-shell";
import { Providers } from "@/components/providers";

import "@/app/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? "http://localhost:3000"),
  title: {
    default: "UDGAM | University Sports Festival",
    template: "%s | UDGAM",
  },
  description:
    "UDGAM is a live university sports festival platform for fixtures, finals, live scores, and gallery updates.",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <Providers>
          <LayoutShell>{children}</LayoutShell>
        </Providers>
      </body>
    </html>
  );
}
