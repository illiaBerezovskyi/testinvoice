"use client";

import { cn } from "./cn";

type Props = {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
  id?: string;
};

export function Toggle({ checked, onChange, label, description, id }: Props) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-studio-700 bg-studio-800/60 px-3 py-2.5 transition-colors hover:border-studio-600"
    >
      <span className="flex flex-col">
        <span className="text-sm text-studio-100">{label}</span>
        {description && <span className="text-xs text-studio-300">{description}</span>}
      </span>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft",
          checked ? "bg-accent" : "bg-studio-600",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform",
            checked && "translate-x-5",
          )}
        />
      </button>
    </label>
  );
}
