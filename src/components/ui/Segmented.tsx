"use client";

import { cn } from "./cn";

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  value: T;
  onChange: (v: T) => void;
  options: Option<T>[];
  ariaLabel: string;
  size?: "sm" | "md";
};

export function Segmented<T extends string>({ value, onChange, options, ariaLabel, size = "md" }: Props<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex w-full rounded-lg border border-studio-700 bg-studio-900 p-1"
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "flex-1 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft",
              size === "sm" ? "h-7 text-xs" : "h-8 text-sm",
              active ? "bg-studio-700 text-studio-100" : "text-studio-300 hover:text-studio-100",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
