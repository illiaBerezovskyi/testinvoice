"use client";

import type { TemplateSettings } from "@/lib/types";
import { cn } from "@/components/ui/cn";
import { Button } from "@/components/ui/Button";
import { GeneralTab } from "./GeneralTab";
import { ContentTab } from "./ContentTab";

export type EditorTab = "general" | "content";

const TABS: { id: EditorTab; label: string }[] = [
  { id: "general", label: "General" },
  { id: "content", label: "Content" },
];

type Props = {
  settings: TemplateSettings;
  update: (patch: Partial<TemplateSettings>) => void;
  onReset: () => void;
  tab: EditorTab;
  onTabChange: (tab: EditorTab) => void;
  className?: string;
};

export function EditorPanel({ settings, update, onReset, tab, onTabChange, className }: Props) {
  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      <nav
        role="tablist"
        aria-label="Template settings"
        className="flex shrink-0 gap-1 border-b border-studio-700 px-4 sm:px-5"
      >
        {TABS.map((t) => {
          const active = t.id === tab;
          return (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={active}
              aria-controls={`panel-${t.id}`}
              id={`tab-${t.id}`}
              onClick={() => onTabChange(t.id)}
              className={cn(
                "relative -mb-px h-11 px-3 text-sm font-medium transition-colors focus-visible:outline-none",
                active ? "text-studio-100" : "text-studio-300 hover:text-studio-200",
              )}
            >
              {t.label}
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-1 bottom-0 h-0.5 rounded-full bg-accent transition-opacity",
                  active ? "opacity-100" : "opacity-0",
                )}
              />
            </button>
          );
        })}
      </nav>

      <div
        role="tabpanel"
        id={`panel-${tab}`}
        aria-labelledby={`tab-${tab}`}
        className="scrollbar-thin min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-5"
      >
        {tab === "general" ? (
          <GeneralTab settings={settings} update={update} />
        ) : (
          <ContentTab settings={settings} update={update} />
        )}

        <div className="mt-10 border-t border-studio-700 pt-4">
          <Button variant="ghost" size="sm" onClick={onReset} className="-ml-2 text-studio-300">
            Reset to defaults
          </Button>
        </div>
      </div>
    </div>
  );
}
