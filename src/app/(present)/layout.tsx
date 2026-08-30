import { Caveat, JetBrains_Mono } from "next/font/google";

/**
 * The deck surface. No planner chrome at all — this is what a class sees on a
 * projector, so the only thing on screen is the lesson.
 *
 * The deck's two extra faces load here rather than in the root layout, so the
 * planner never pays for fonts it does not use.
 */

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

export default function PresentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      id="main"
      className={`${jetbrainsMono.variable} ${caveat.variable} min-h-dvh bg-deck-paper`}
    >
      {children}
    </div>
  );
}
