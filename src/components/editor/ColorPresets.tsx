"use client";

import { COLOR_PRESETS } from "@/lib/types";
import { cn } from "@/components/ui/cn";

type Props = {
  primary: string;
  secondary: string;
  onPick: (primary: string, secondary: string) => void;
};

export function ColorPresets({ primary, secondary, onPick }: Props) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Color presets">
      {COLOR_PRESETS.map((p) => {
        const active = p.primary === primary && p.secondary === secondary;
        return (
          <button
            key={p.id}
            type="button"
            title={p.label}
            aria-label={`${p.label} preset`}
            aria-pressed={active}
            onClick={() => onPick(p.primary, p.secondary)}
            className={cn(
              "group relative flex h-9 items-center gap-1.5 rounded-full border px-1.5 pr-3 transition-colors",
              active
                ? "border-studio-300 bg-studio-700"
                : "border-studio-700 bg-studio-800/60 hover:border-studio-500",
            )}
          >
            <span className="relative size-6">
              <span
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: p.primary }}
              />
              <span
                className="absolute right-0 bottom-0 size-3 rounded-full ring-2 ring-studio-800"
                style={{ backgroundColor: p.secondary }}
              />
            </span>
            <span className="text-xs text-studio-200">{p.label}</span>
          </button>
        );
      })}
    </div>
  );
}
