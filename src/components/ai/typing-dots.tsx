export function TypingDots({ label = "Assistant is typing" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1" role="status" aria-label={label}>
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className="size-1.5 rounded-full bg-ink-muted animate-typing-dot"
          style={{ animationDelay: `${index * 0.16}s` }}
        />
      ))}
    </span>
  );
}
