import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, dir = "auto", ...props }, ref) => {
    return (
      <textarea
        dir={dir}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
        className={cn(
          "flex min-h-[80px] w-full rounded-2xl border border-input bg-background px-4 py-3 text-base font-semibold shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C96745] disabled:cursor-not-allowed disabled:opacity-50 select-text [touch-action:manipulation]",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
