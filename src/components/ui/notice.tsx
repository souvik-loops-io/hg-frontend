import { AlertIcon, CheckCircleIcon, InfoIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

export type NoticeTone = "info" | "error" | "success";

const tones: Record<
  NoticeTone,
  { wrap: string; mark: string; title: string; Icon: typeof InfoIcon }
> = {
  info: {
    wrap: "border-sky-200 bg-sky-50",
    mark: "bg-sky-300 text-brand-700",
    title: "text-brand-600",
    Icon: InfoIcon,
  },
  error: {
    wrap: "border-danger-500 bg-danger-50",
    mark: "bg-danger-500 text-paper",
    title: "text-danger-500",
    Icon: AlertIcon,
  },
  success: {
    wrap: "border-leaf-200 bg-leaf-50",
    mark: "bg-leaf-500 text-paper",
    title: "text-leaf-600",
    Icon: CheckCircleIcon,
  },
};

interface NoticeProps {
  tone: NoticeTone;
  title: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * On-page status panel. Errors announce assertively; everything else is polite,
 * so a running commentary never interrupts what someone is typing.
 */
export function Notice({ tone, title, children, className }: NoticeProps) {
  const { wrap, mark, title: titleClass, Icon } = tones[tone];

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      aria-live={tone === "error" ? "assertive" : "polite"}
      className={cn(
        "flex items-start gap-3 rounded-card border-2 p-4 sm:p-5",
        wrap,
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full",
          mark,
        )}
      >
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className={cn("font-semibold", titleClass)}>{title}</p>
        {children ? (
          <div className="mt-1.5 text-[0.875rem] leading-relaxed text-ink-soft">
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}
