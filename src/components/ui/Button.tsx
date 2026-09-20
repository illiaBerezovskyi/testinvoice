"use client";

import type { ButtonHTMLAttributes } from "react";
import { cn } from "./cn";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline";
  size?: "sm" | "md";
};

export function Button({ variant = "primary", size = "md", className, ...props }: Props) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap transition-[background-color,opacity,transform] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft",
        size === "sm" ? "h-8 px-3 text-xs" : "h-10 px-4 text-sm",
        variant === "primary" && "bg-accent text-white hover:brightness-110",
        variant === "outline" &&
          "border border-studio-600 bg-transparent text-studio-100 hover:bg-studio-800",
        variant === "ghost" && "bg-transparent text-studio-200 hover:bg-studio-800 hover:text-studio-100",
        className,
      )}
      {...props}
    />
  );
}
