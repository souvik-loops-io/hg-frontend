import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/** Shared geometry: 24px grid, 1.75 stroke, round caps — one friendly voice. */
function Svg({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

/* -------------------------------------------------------------------------
   Navigation
   ------------------------------------------------------------------------- */

export function FlowIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="6.5" cy="8" r="2.5" />
      <circle cx="17" cy="5.5" r="1.75" />
      <circle cx="17" cy="12" r="1.75" />
      <path d="M9 7l6.2-1.2M9 8.8l6.2 2.6M6.5 10.5v6a2 2 0 0 0 2 2h7" />
    </Svg>
  );
}

export function TargetIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function DashboardIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3.5" y="6.5" width="17" height="13" rx="3" />
      <path d="M12 6.5V3.5M9.5 3h5" />
      <circle cx="9" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <path d="M9.5 15.8h5" />
    </Svg>
  );
}

export function AgentIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="4.5" y="4" width="15" height="16" rx="2.5" />
      <path d="M9 3.2h6v2.6H9z" />
      <path d="M8.5 11h7M8.5 15h4.5" />
    </Svg>
  );
}

export function ResourcesIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
      <path d="M3.5 9.5h17M8.5 9.5v10" />
    </Svg>
  );
}

export function AnalyticsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3.5" y="4" width="17" height="16" rx="2.5" />
      <path d="M8.5 15.5v-2.5M12 15.5v-6M15.5 15.5v-4" />
    </Svg>
  );
}

export const navIcons = {
  flow: FlowIcon,
  target: TargetIcon,
  dashboard: DashboardIcon,
  agent: AgentIcon,
  resources: ResourcesIcon,
  analytics: AnalyticsIcon,
} as const;

/* -------------------------------------------------------------------------
   Controls
   ------------------------------------------------------------------------- */

export function PlusIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  );
}

export function PlusCircleIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 8.5v7M8.5 12h7" />
    </Svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m6 9.5 6 5 6-5" />
    </Svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4.5 12h15M13 5.5l6.5 6.5-6.5 6.5" />
    </Svg>
  );
}

export function ArrowUpIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 19.5v-15M5.5 11 12 4.5l6.5 6.5" />
    </Svg>
  );
}

export function UndoIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H9" />
      <path d="m8 4.5-4 4.5 4 4.5" />
    </Svg>
  );
}

export function RedoIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H15" />
      <path d="m16 4.5 4 4.5-4 4.5" />
    </Svg>
  );
}

export function DragHandleIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      {[8, 12, 16].map((y) =>
        [9.5, 14.5].map((x) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.35" fill="currentColor" />
        )),
      )}
    </svg>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4.5 6.5h15M9.5 6.5V4.8a1.3 1.3 0 0 1 1.3-1.3h2.4a1.3 1.3 0 0 1 1.3 1.3v1.7" />
      <path d="M6.5 6.5 7.4 19a1.5 1.5 0 0 0 1.5 1.4h6.2a1.5 1.5 0 0 0 1.5-1.4l.9-12.5" />
      <path d="M10.5 10v6.5M13.5 10v6.5" />
    </Svg>
  );
}

export function PencilIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 20h4L20.5 7.5a2.1 2.1 0 0 0-3-3L5 17z" />
      <path d="M15 6l3 3" />
    </Svg>
  );
}

/* -------------------------------------------------------------------------
   Screen furniture
   ------------------------------------------------------------------------- */

export function ShapesIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8 3.5 12 10H4z" />
      <circle cx="17" cy="6.5" r="3" />
      <rect x="4" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </Svg>
  );
}

export function UploadFileIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M13.5 3.5H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9z" />
      <path d="M13.5 3.5V9H19" />
      <path d="M12 17v-5M9.75 14.25 12 12l2.25 2.25" />
    </Svg>
  );
}

export function LightbulbIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M9.5 17.5a6 6 0 1 1 5 0" />
      <path d="M9.75 20.5h4.5M10.5 17.5v3" />
    </Svg>
  );
}

export function MonitorIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="2.5" y="4.5" width="19" height="13" rx="2" />
      <path d="M8.5 20.5h7M12 17.5v3" />
    </Svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <path d="M10.75 5.5h2.5" />
    </Svg>
  );
}

export function PanelIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
      <path d="M3.5 10h17" />
    </Svg>
  );
}

export function HandIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M9 11V5.6a1.6 1.6 0 1 1 3.2 0V11" />
      <path d="M12.2 11V4.9a1.6 1.6 0 1 1 3.2 0V11" />
      <path d="M15.4 11.5V7.6a1.55 1.55 0 1 1 3.1 0v6.2a6.4 6.4 0 0 1-6.4 6.4h-.6a5.6 5.6 0 0 1-4.2-1.9l-2.6-3a1.6 1.6 0 0 1 2.3-2.2L9 14.4V11" />
    </Svg>
  );
}

export function RulerIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="2.5" y="8" width="19" height="8" rx="2" />
      <path d="M7 8v3M11 8v4.5M15 8v3M19 8v4.5" />
    </Svg>
  );
}

export function SparkleIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M11 3.5 12.7 8l4.5 1.7-4.5 1.7L11 15.9 9.3 11.4 4.8 9.7 9.3 8z" />
      <path d="M18 14.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" />
    </Svg>
  );
}

export function RobotIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="4" y="7.5" width="16" height="12" rx="3" />
      <path d="M12 7.5V4.5M9.5 3.5h5" />
      <circle cx="9.3" cy="13" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="14.7" cy="13" r="1.1" fill="currentColor" stroke="none" />
      <path d="M1.8 12.5v3M22.2 12.5v3" />
    </Svg>
  );
}

/* -------------------------------------------------------------------------
   Artifact marks
   ------------------------------------------------------------------------- */

export function CalculatorIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="4.5" y="3" width="15" height="18" rx="2.5" />
      <rect x="7.5" y="6" width="9" height="3.5" rx="1" />
      <path d="M8.5 13h1M8.5 17h1M14.5 13h1M14.5 17h1M11.5 13h1M11.5 17h1" />
    </Svg>
  );
}

export function LeafIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M20 4c0 8.5-4.6 13-11 13a5 5 0 0 1 0-10c4.5 0 6.5-1 11-3z" />
      <path d="M4 20c2.5-4.5 5.5-7.5 9.5-9.5" />
    </Svg>
  );
}

export function SigmaIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M17 4.5H7l6 7.5-6 7.5h10" />
    </Svg>
  );
}

export function BookIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 5.5A2 2 0 0 1 6 3.5h5.5v17H6a2 2 0 0 1-2-2z" />
      <path d="M20 5.5a2 2 0 0 0-2-2h-5.5v17H18a2 2 0 0 0 2-2z" />
    </Svg>
  );
}

export function PizzaIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3.5 20.5 19a1 1 0 0 1-1.1 1.4 25 25 0 0 0-14.8 0A1 1 0 0 1 3.5 19z" />
      <circle cx="10.5" cy="12" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="14" cy="15.5" r="1.1" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export const artifactIcons = {
  calculator: CalculatorIcon,
  leaf: LeafIcon,
  sigma: SigmaIcon,
  book: BookIcon,
} as const;

export function AlertIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M10.3 3.9 2.5 17.4A2 2 0 0 0 4.2 20.5h15.6a2 2 0 0 0 1.7-3.1L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4.5" />
      <circle cx="12" cy="17" r="0.9" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.3 2.7 2.7L16 9.7" />
    </Svg>
  );
}

export function InfoIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5" />
      <circle cx="12" cy="7.8" r="0.9" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.3l3.3 2" />
    </Svg>
  );
}

export function GaugeIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 17a8 8 0 1 1 16 0" />
      <path d="m12 13 4-3.5" />
      <circle cx="12" cy="13.5" r="1.4" fill="currentColor" stroke="none" />
    </Svg>
  );
}
