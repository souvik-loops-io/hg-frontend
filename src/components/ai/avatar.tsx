import { RobotIcon } from "@/components/icons";
import { teacher } from "@/lib/data/fixtures";
import { cn } from "@/lib/cn";

/** The assistant's mark — leaf green, so it never reads as a teacher action. */
export function AssistantAvatar({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full",
        "bg-leaf-100 text-leaf-600",
        className,
      )}
    >
      <RobotIcon className="size-[1.125rem]" />
    </span>
  );
}

/** The teacher's mark — initials, no photo dependency. */
export function EducatorAvatar({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full",
        "bg-sky-200 text-[0.625rem] font-bold text-brand-700",
        className,
      )}
    >
      {teacher.initials}
    </span>
  );
}
