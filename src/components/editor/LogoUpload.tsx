"use client";

import { useCallback, useRef, useState, type DragEvent } from "react";
import { cn } from "@/components/ui/cn";
import { Button } from "@/components/ui/Button";

type Props = {
  value: string | null;
  onChange: (dataUrl: string | null) => void;
  disabled?: boolean;
};

const MAX_BYTES = 1.5 * 1024 * 1024;

export function LogoUpload({ value, onChange, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        setError("Please choose an image file (PNG, JPG, SVG).");
        return;
      }
      if (file.size > MAX_BYTES) {
        setError("Image is too large. Keep it under 1.5 MB.");
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onload = () => onChange(String(reader.result));
      reader.readAsDataURL(file);
    },
    [onChange],
  );

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div className={cn("flex flex-col gap-2", disabled && "pointer-events-none opacity-50")}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        aria-label="Upload logo"
        className={cn(
          "relative flex h-32 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft",
          dragging
            ? "border-accent bg-accent-soft"
            : "border-studio-600 bg-studio-900 hover:border-studio-500",
        )}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Logo preview" className="max-h-24 max-w-[80%] object-contain" />
        ) : (
          <div className="flex flex-col items-center gap-1 px-4 text-center">
            <UploadIcon />
            <span className="text-sm text-studio-200">Drop an image or click to browse</span>
            <span className="text-xs text-studio-300">PNG, JPG or SVG, up to 1.5 MB</span>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>
      <div className="flex min-h-8 items-center justify-between gap-2">
        <p className="text-xs text-red-400">{error ?? ""}</p>
        {value && (
          <Button variant="ghost" size="sm" onClick={() => onChange(null)}>
            Remove logo
          </Button>
        )}
      </div>
    </div>
  );
}

function UploadIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-studio-300"
      aria-hidden
    >
      <path d="M12 16V4m0 0-4 4m4-4 4 4" />
      <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </svg>
  );
}
