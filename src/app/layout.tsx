import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { RouteProgress } from "@/components/shell/route-progress";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CuePilot — Pedagogical Builder",
    template: "%s · CuePilot",
  },
  description:
    "Plan, build and adjust lessons from a library of pedagogical blocks and teaching representations.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#faf9f7",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-field focus:bg-brand-600 focus:px-5 focus:py-3 focus:text-[0.875rem] focus:font-semibold focus:text-paper"
        >
          Skip to content
        </a>
        <RouteProgress />
        {children}
      </body>
    </html>
  );
}
