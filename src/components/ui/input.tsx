import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type = "text", dir = "auto", ...props }, ref) => {
    return (
      <input
        type={type}
        dir={dir}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
        className={cn(
          "flex h-11 w-full rounded-2xl border border-input bg-background px-4 py-2 text-base font-semibold shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C96745] disabled:cursor-not-allowed disabled:opacity-50 select-text [touch-action:manipulation]",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
