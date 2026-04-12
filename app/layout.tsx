import type { Metadata } from "next";
import { Zen_Kaku_Gothic_New, Zen_Old_Mincho } from "next/font/google";
import type { ReactNode } from "react";

import { LayoutShell } from "@/components/layout-shell";
import { Providers } from "@/components/providers";

import "@/app/globals.css";

const bodyFont = Zen_Kaku_Gothic_New({
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body-loaded",
  fallback: ["Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", "sans-serif"],
});

const displayFont = Zen_Old_Mincho({
  weight: ["500", "700", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display-loaded",
  fallback: ["Hiragino Mincho ProN", "Yu Mincho", "MS PMincho", "serif"],
});

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
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${bodyFont.variable} ${displayFont.variable}`}
    >
      <body>
        <Providers>
          <LayoutShell>{children}</LayoutShell>
        </Providers>
      </body>
    </html>
  );
}
