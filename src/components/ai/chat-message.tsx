import { AssistantAvatar } from "@/components/ai/avatar";
import { TypingDots } from "@/components/ai/typing-dots";
import { cn } from "@/lib/cn";
import type { ChatMessage } from "@/lib/types";

export function ChatMessageRow({ message }: { message: ChatMessage }) {
  if (message.pending) {
    return (
      <div className="flex items-center gap-2.5">
        <AssistantAvatar />
        <span className="rounded-card bg-surface px-4 py-3.5">
          <TypingDots />
        </span>
      </div>
    );
  }

  const isEducator = message.author === "educator";

  return (
    <div className={cn("flex items-start gap-2.5", isEducator && "justify-end")}>
      {isEducator ? null : <AssistantAvatar />}
      <p
        className={cn(
          "max-w-[85%] rounded-card px-4 py-3 text-[0.9375rem] leading-relaxed",
          isEducator ? "bg-sky-300 text-ink" : "bg-surface text-ink",
        )}
      >
        {message.text}
      </p>
    </div>
  );
}
