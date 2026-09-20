"use client";

import { useRef, useState, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/components/ui/cn";

const PEEK_HEIGHT = 64;
const DRAG_THRESHOLD = 56;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
};

export function MobileSheet({ open, onOpenChange, children }: Props) {
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<number | null>(null);
  const moved = useRef(false);

  const onPointerDown = (e: PointerEvent) => {
    dragStart.current = e.clientY;
    moved.current = false;
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent) => {
    if (dragStart.current === null) return;
    const delta = e.clientY - dragStart.current;
    if (Math.abs(delta) > 4) moved.current = true;
    // Only allow dragging in the direction that makes sense for the current state.
    setDragOffset(open ? Math.max(0, delta) : Math.min(0, delta));
  };

  const onPointerUp = () => {
    if (dragStart.current === null) return;
    const delta = dragOffset;
    dragStart.current = null;
    setDragging(false);
    setDragOffset(0);
    if (!moved.current) {
      onOpenChange(!open);
      return;
    }
    if (open && delta > DRAG_THRESHOLD) onOpenChange(false);
    else if (!open && delta < -DRAG_THRESHOLD) onOpenChange(true);
  };

  return (
    <>
      <div
        aria-hidden
        onClick={() => onOpenChange(false)}
        className={cn(
          "absolute inset-0 z-20 bg-black/50 transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <section
        aria-label="Template settings"
        className={cn(
          "absolute inset-x-0 bottom-0 z-30 flex h-[80%] flex-col rounded-t-2xl border-t border-studio-600 bg-studio-800 shadow-[0_-20px_60px_-10px_rgba(0,0,0,0.6)]",
          !dragging && "transition-transform duration-300 ease-out",
        )}
        style={{
          transform: open
            ? `translateY(${dragOffset}px)`
            : `translateY(calc(100% - ${PEEK_HEIGHT}px + ${dragOffset}px))`,
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? "Collapse settings" : "Expand settings"}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="flex shrink-0 touch-none flex-col items-center gap-2 px-4 pt-2.5 pb-3 select-none focus-visible:outline-none"
          style={{ minHeight: PEEK_HEIGHT }}
        >
          <span className="h-1 w-10 rounded-full bg-studio-500" />
          <span className="flex items-center gap-2 text-sm font-medium text-studio-100">
            <span
              className={cn(
                "size-1.5 rounded-full bg-accent transition-opacity",
                open ? "opacity-0" : "opacity-100",
              )}
            />
            {open ? "Drag down to preview" : "Customize template"}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              className={cn("text-studio-300 transition-transform", open && "rotate-180")}
            >
              <path d="m6 15 6-6 6 6" />
            </svg>
          </span>
        </button>
        <div className={cn("min-h-0 flex-1", !open && "invisible")}>{children}</div>
      </section>
    </>
  );
}
