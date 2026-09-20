"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { TemplateSettings } from "@/lib/types";
import { cn } from "@/components/ui/cn";
import { InvoicePaper, PAPER_WIDTH } from "./InvoicePaper";

type Zoom = "fit" | 0.5 | 0.75 | 1;

const ZOOMS: { value: Zoom; label: string }[] = [
  { value: "fit", label: "Fit" },
  { value: 0.5, label: "50%" },
  { value: 0.75, label: "75%" },
  { value: 1, label: "100%" },
];

const CANVAS_PADDING = 24;

type Props = {
  settings: TemplateSettings;
  className?: string;
  /** Hide zoom controls (mobile sheet layout) */
  compact?: boolean;
};


export function PreviewCanvas({ settings, className, compact }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<Zoom>("fit");
  const [containerWidth, setContainerWidth] = useState(0);
  const [paperHeight, setPaperHeight] = useState(0);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width));
    ro.observe(el);
    setContainerWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = paperRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setPaperHeight(entry.contentRect.height));
    ro.observe(el);
    setPaperHeight(el.offsetHeight);
    return () => ro.disconnect();
  }, []);

  const available = Math.max(0, containerWidth - CANVAS_PADDING * 2);
  const fitScale = available > 0 ? Math.min(1, available / PAPER_WIDTH) : 1;
  const scale = zoom === "fit" ? fitScale : zoom;
  const scaledWidth = PAPER_WIDTH * scale;
  const scaledHeight = paperHeight * scale;

  return (
    <div className={cn("relative flex min-h-0 flex-col", className)}>
      {!compact && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full border border-studio-700 bg-studio-900/90 p-1 shadow-lg backdrop-blur">
          {ZOOMS.map((z) => (
            <button
              key={String(z.value)}
              type="button"
              onClick={() => setZoom(z.value)}
              aria-pressed={zoom === z.value}
              className={cn(
                "pointer-events-auto h-7 rounded-full px-2.5 text-xs font-medium transition-colors",
                zoom === z.value
                  ? "bg-studio-700 text-studio-100"
                  : "text-studio-300 hover:text-studio-100",
              )}
            >
              {z.label}
            </button>
          ))}
        </div>
      )}

      <div
        ref={containerRef}
        className="canvas-grid scrollbar-thin min-h-0 flex-1 overflow-auto"
        style={{
          padding: CANVAS_PADDING,
          // leave room for the collapsed bottom sheet
          paddingBottom: compact ? CANVAS_PADDING + 72 : CANVAS_PADDING,
        }}
      >
        <div
          className="mx-auto transition-[width,height] duration-200"
          style={{ width: scaledWidth, height: scaledHeight || undefined, minWidth: scaledWidth }}
        >
          <div
            className="origin-top-left transition-transform duration-200"
            style={{ transform: `scale(${scale})`, width: PAPER_WIDTH }}
          >
            <InvoicePaper ref={paperRef} settings={settings} />
          </div>
        </div>
      </div>
    </div>
  );
}
