"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useTemplateSettings } from "@/hooks/useTemplateSettings";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { chroma, luminance, rgba } from "@/lib/color";
import { Button } from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";
import { EditorPanel, type EditorTab } from "@/components/editor/EditorPanel";
import { PreviewCanvas } from "@/components/preview/PreviewCanvas";
import { MobileSheet } from "./MobileSheet";

const FALLBACK_ACCENT = "#5b6cff";

export function Studio() {
  const { settings, update, save, cancel, reset, isDirty, toast } = useTemplateSettings();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [tab, setTab] = useState<EditorTab>("general");
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const accentStyle = useMemo(() => {
    const candidates = [settings.primaryColor, settings.secondaryColor];
    const accent =
      candidates.find((c) => luminance(c) > 0.09 && chroma(c) > 0.2) ?? FALLBACK_ACCENT;
    return { "--accent": accent, "--accent-soft": rgba(accent, 0.22) } as CSSProperties;
  }, [settings.primaryColor, settings.secondaryColor]);

  useEffect(() => {
    if (!isDirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  const canSave = isDirty && settings.name.trim().length > 0;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (canSave) save();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [canSave, save]);

  return (
    <div
      style={accentStyle}
      className="flex h-dvh flex-col overflow-hidden bg-studio-950"
    >
      <TopBar
        name={settings.name}
        isDirty={isDirty}
        canSave={canSave}
        onSave={save}
        onCancel={cancel}
      />

      {isDesktop ? (
        /* Desktop / tablet-landscape: side-by-side */
        <div className="grid min-h-0 flex-1 grid-cols-[400px_minmax(0,1fr)] xl:grid-cols-[440px_minmax(0,1fr)]">
          <aside className="min-h-0 border-r border-studio-700 bg-studio-800">
            <EditorPanel settings={settings} update={update} onReset={reset} tab={tab} onTabChange={setTab} />
          </aside>
          <PreviewCanvas settings={settings} className="min-h-0" />
        </div>
      ) : (
        /* Mobile / tablet-portrait: preview fills the screen, editor lives in a bottom sheet */
        <div className="relative min-h-0 flex-1">
          <PreviewCanvas settings={settings} compact className="h-full" />
          <MobileSheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <EditorPanel settings={settings} update={update} onReset={reset} tab={tab} onTabChange={setTab} />
          </MobileSheet>
        </div>
      )}

      <Toast message={toast} />
    </div>
  );
}

function TopBar({
  name,
  isDirty,
  canSave,
  onSave,
  onCancel,
}: {
  name: string;
  isDirty: boolean;
  canSave: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-studio-700 bg-studio-900 px-4 sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-white">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M6 3h9l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
            <path d="M14 3v6h6M9 13h6M9 17h6" />
          </svg>
        </span>
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="hidden text-[11px] font-medium tracking-wide text-studio-300 uppercase sm:block">
            Invoice template
          </span>
          <span className="flex items-center gap-2 truncate text-sm font-semibold text-studio-100">
            <span className="truncate">{name.trim() || "Untitled template"}</span>
            <span
              className={cn(
                "size-1.5 shrink-0 rounded-full bg-amber-400 transition-opacity",
                isDirty ? "opacity-100" : "opacity-0",
              )}
              title="Unsaved changes"
              aria-hidden
            />
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={cn(
            "hidden text-xs text-studio-300 transition-opacity sm:block",
            isDirty ? "opacity-100" : "opacity-0",
          )}
          aria-live="polite"
        >
          Unsaved changes
        </span>
        <Button variant="ghost" onClick={onCancel} disabled={!isDirty}>
          Cancel
        </Button>
        <Button
          onClick={onSave}
          disabled={!canSave}
          title={isDirty && !canSave ? "Template name is required" : undefined}
        >
          Save
        </Button>
      </div>
    </header>
  );
}

function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div
      role="status"
      className="toast-in pointer-events-none fixed top-18 left-1/2 z-50 -translate-x-1/2 rounded-full border border-studio-600 bg-studio-800 px-4 py-2 text-sm text-studio-100 shadow-xl"
    >
      {message}
    </div>
  );
}
