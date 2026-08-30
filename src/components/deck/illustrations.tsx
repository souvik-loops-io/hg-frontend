import type { IllustrationKey } from "@/lib/deck-types";

/**
 * Deck illustrations.
 *
 * Line art in the deck's two colours — crimson for the thing that matters,
 * ink for everything else — drawn inline so there are no image requests and
 * they scale to any card. Placeholders for commissioned artwork: same subject,
 * same weight, deliberately simpler.
 */

type Props = { className?: string };

function Frame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

const ink = "var(--color-deck-ink)";
const accent = "var(--color-deck-accent)";
const glass = "var(--color-deck-shell)";

/** Thermometer resting in a beaker of warm water. */
export function ThermometerIllustration({ className }: Props) {
  return (
    <Frame className={className}>
      {/* Beaker */}
      <path d="M52 66h70v78a14 14 0 0 1-14 14H66a14 14 0 0 1-14-14z" fill={glass} />
      <path d="M52 108h70v36a14 14 0 0 1-14 14H66a14 14 0 0 1-14-14z" fill="#dce7ee" />
      <path
        d="M52 66h70v78a14 14 0 0 1-14 14H66a14 14 0 0 1-14-14z"
        stroke={ink}
        strokeWidth="3"
      />
      <path d="M46 66h82" stroke={ink} strokeWidth="3" />
      {/* Thermometer in the beaker */}
      <path d="M96 44v86" stroke={ink} strokeWidth="3" />
      <path d="M104 44v86" stroke={ink} strokeWidth="3" />
      <path d="M96 44a4 4 0 0 1 8 0" stroke={ink} strokeWidth="3" />
      <path d="M100 62v66" stroke={accent} strokeWidth="4" />
      <circle cx="100" cy="136" r="10" fill={accent} stroke={ink} strokeWidth="3" />
      {/* Steam */}
      <path d="M74 52c4-6-4-12 0-18M88 46c4-6-4-12 0-18" stroke={ink} strokeWidth="2.5" opacity="0.4" />
      {/* Second thermometer, laid down */}
      <path d="M60 178l72-22" stroke={ink} strokeWidth="3" />
      <path d="M64 188l72-22" stroke={ink} strokeWidth="3" />
      <path d="m132 156 6 8-6 2z" fill={accent} stroke={ink} strokeWidth="2.5" />
      <circle cx="62" cy="183" r="9" fill={accent} stroke={ink} strokeWidth="3" />
    </Frame>
  );
}

/** A tied bundle of ten sticks in a jar, with loose string. */
export function BundleIllustration({ className }: Props) {
  return (
    <Frame className={className}>
      <path d="M64 88h72v82a10 10 0 0 1-10 10H74a10 10 0 0 1-10-10z" fill={glass} stroke={ink} strokeWidth="3" />
      <path d="M60 82h80v8H60z" fill="#fff" stroke={ink} strokeWidth="3" />
      {Array.from({ length: 9 }, (_, index) => {
        const x = 72 + index * 7;
        const lean = (index - 4) * 3;
        return (
          <path
            key={x}
            d={`M${x} 150 L${x + lean} 26`}
            stroke={accent}
            strokeWidth="4"
          />
        );
      })}
      <path d="M66 106h68" stroke="#fff" strokeWidth="9" />
      <path d="M66 106h68" stroke={ink} strokeWidth="3" />
      {/* Loose string */}
      <path
        d="M140 172c14 4 22-6 16-13-5-6-16-1-13 7 3 9 18 10 25 2"
        stroke="#c9a227"
        strokeWidth="3"
      />
    </Frame>
  );
}

/** Tomato plant with roots showing. */
export function PlantIllustration({ className }: Props) {
  return (
    <Frame className={className}>
      <path d="M100 24v112" stroke={ink} strokeWidth="3" />
      {/* Leaves */}
      <path d="M100 60c-30-14-46 2-42 16 4 13 30 12 42-16z" fill="#e6e2da" stroke={ink} strokeWidth="3" />
      <path d="M100 96c-32-12-48 6-42 20 6 13 30 8 42-20z" fill="#e6e2da" stroke={ink} strokeWidth="3" />
      <path d="M100 44c26-12 40 2 36 14-4 12-26 10-36-14z" fill="#e6e2da" stroke={ink} strokeWidth="3" />
      {/* Tomatoes */}
      <circle cx="134" cy="70" r="15" fill={accent} stroke={ink} strokeWidth="3" />
      <circle cx="164" cy="76" r="13" fill={accent} stroke={ink} strokeWidth="3" />
      <path d="M100 52c14 4 24 10 30 16" stroke={ink} strokeWidth="2.5" />
      {/* Roots */}
      <path
        d="M100 136c-8 14-24 20-32 34M100 136c8 14 24 20 30 32M100 136v40M100 158c-10 6-16 14-18 22M100 158c10 6 16 14 18 22"
        stroke={ink}
        strokeWidth="2.5"
      />
    </Frame>
  );
}

/* -------------------------------------------------------------------------
   Rule diagrams — the four precautions
   ------------------------------------------------------------------------- */

function Beaker() {
  return (
    <>
      <path d="M56 78h88v86a12 12 0 0 1-12 12H68a12 12 0 0 1-12-12z" fill={glass} />
      <path d="M56 116h88v48a12 12 0 0 1-12 12H68a12 12 0 0 1-12-12z" fill="#dce7ee" />
      <path
        d="M56 78h88v86a12 12 0 0 1-12 12H68a12 12 0 0 1-12-12z"
        stroke={ink}
        strokeWidth="3"
      />
      <path d="M50 78h100" stroke={ink} strokeWidth="3" />
    </>
  );
}

function Stick({ x1, y1, x2, y2, bulbX, bulbY }: {
  x1: number; y1: number; x2: number; y2: number; bulbX: number; bulbY: number;
}) {
  return (
    <>
      <path d={`M${x1} ${y1}L${x2} ${y2}`} stroke={ink} strokeWidth="3" />
      <path d={`M${x1 + 8} ${y1}L${x2 + 8} ${y2}`} stroke={ink} strokeWidth="3" />
      <path
        d={`M${x1 + 4} ${y1 + 26}L${bulbX} ${bulbY - 8}`}
        stroke={accent}
        strokeWidth="4"
      />
      <circle cx={bulbX} cy={bulbY} r="9" fill={accent} stroke={ink} strokeWidth="3" />
    </>
  );
}

/** Rule 1 — bulb fully immersed, clear of the glass. */
export function BeakerCorrectIllustration({ className }: Props) {
  return (
    <Frame className={className}>
      <Beaker />
      <Stick x1={96} y1={38} x2={96} y2={140} bulbX={100} bulbY={148} />
    </Frame>
  );
}

/** Rule 2 — held vertical, not tilted. */
export function BeakerVerticalIllustration({ className }: Props) {
  return (
    <Frame className={className}>
      <Beaker />
      <Stick x1={96} y1={26} x2={96} y2={150} bulbX={100} bulbY={158} />
      <path d="M100 20v-8" stroke={ink} strokeWidth="2.5" opacity="0.4" />
    </Frame>
  );
}

/** Rule 3 — read while still immersed. */
export function BeakerReadIllustration({ className }: Props) {
  return (
    <Frame className={className}>
      <Beaker />
      <Stick x1={92} y1={38} x2={92} y2={140} bulbX={96} bulbY={148} />
      {/* Eye at the liquid line */}
      <path d="M158 128c8-9 22-9 30 0-8 9-22 9-30 0z" fill="#fff" stroke={ink} strokeWidth="3" />
      <circle cx="173" cy="128" r="5" fill="#c9a227" stroke={ink} strokeWidth="2.5" />
      <path d="M144 128h10" stroke={ink} strokeWidth="2.5" strokeDasharray="4 4" />
    </Frame>
  );
}

/** Rule 4 — eye level with the top of the column. */
export function ThermometerEyeIllustration({ className }: Props) {
  return (
    <Frame className={className}>
      <path d="M92 30h20v120a10 10 0 0 1-20 0z" fill="#fff" stroke={ink} strokeWidth="3" />
      <path d="M102 74v76" stroke={accent} strokeWidth="6" />
      <circle cx="102" cy="158" r="16" fill={accent} stroke={ink} strokeWidth="3" />
      <path d="M32 74c8-9 22-9 30 0-8 9-22 9-30 0z" fill="#fff" stroke={ink} strokeWidth="3" />
      <circle cx="47" cy="74" r="5" fill="#c9a227" stroke={ink} strokeWidth="2.5" />
      <path d="M66 74h22" stroke={ink} strokeWidth="2.5" strokeDasharray="4 4" />
    </Frame>
  );
}

const registry: Record<IllustrationKey, (props: Props) => React.JSX.Element> = {
  thermometer: ThermometerIllustration,
  bundle: BundleIllustration,
  plant: PlantIllustration,
  "beaker-correct": BeakerCorrectIllustration,
  "beaker-vertical": BeakerVerticalIllustration,
  "beaker-read": BeakerReadIllustration,
  "thermometer-eye": ThermometerEyeIllustration,
};

export function Illustration({
  name,
  className,
}: {
  name: IllustrationKey;
  className?: string;
}) {
  const Art = registry[name];
  return <Art className={className} />;
}
