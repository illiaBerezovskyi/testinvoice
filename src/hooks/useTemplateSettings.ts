"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { DEFAULT_SETTINGS, STORAGE_KEY, type TemplateSettings } from "@/lib/types";

function readStored(): TemplateSettings {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<TemplateSettings>;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function writeStored(s: TemplateSettings) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
  }
}

export function useTemplateSettings() {
  const [saved, setSaved] = useState<TemplateSettings>(readStored);
  const [draft, setDraft] = useState<TemplateSettings>(saved);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2200);
  }, []);

  const update = useCallback((patch: Partial<TemplateSettings>) => {
    setDraft((d) => ({ ...d, ...patch }));
  }, []);

  const isDirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(saved),
    [draft, saved],
  );

  const save = useCallback(() => {
    setSaved(draft);
    writeStored(draft);
    notify("Template saved");
  }, [draft, notify]);

  const cancel = useCallback(() => {
    setDraft(saved);
    notify("Changes discarded");
  }, [saved, notify]);

  const reset = useCallback(() => {
    setDraft(DEFAULT_SETTINGS);
    notify("Reset to defaults");
  }, [notify]);

  return { settings: draft, update, save, cancel, reset, isDirty, toast };
}
