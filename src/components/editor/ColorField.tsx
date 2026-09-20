"use client";

import { useId, useState } from "react";
import { normalizeHex } from "@/lib/color";
import { Field } from "@/components/ui/Field";

type Props = {
  label: string;
  value: string;
  onChange: (hex: string) => void;
};

export function ColorField({ label, value, onChange }: Props) {
  const id = useId();
  const [text, setText] = useState(value);
  const [invalid, setInvalid] = useState(false);
  const [prevValue, setPrevValue] = useState(value);

  if (prevValue !== value) {
    setPrevValue(value);
    setText(value);
    setInvalid(false);
  }

  const commit = (raw: string) => {
    const hex = normalizeHex(raw);
    if (hex) {
      setInvalid(false);
      if (hex !== value) onChange(hex);
      setText(hex);
    } else {
      setInvalid(true);
    }
  };

  return (
    <Field label={label} htmlFor={id}>
      <div className="flex items-center gap-2">
        <span
          className="relative size-10 shrink-0 overflow-hidden rounded-lg border border-white/10 shadow-inner"
          style={{ backgroundColor: value }}
          title="Open color picker"
        >
          <input
            type="color"
            aria-label={`${label} picker`}
            className="swatch-input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </span>
        <div className="relative flex-1">
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 font-mono text-sm text-studio-300">
            #
          </span>
          <input
            id={id}
            value={text.replace(/^#/, "")}
            onChange={(e) => {
              setText(e.target.value);
              setInvalid(false);
            }}
            onBlur={(e) => commit(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter")
                commit((e.target as HTMLInputElement).value);
            }}
            spellCheck={false}
            maxLength={7}
            aria-invalid={invalid}
            className={`h-10 w-full rounded-lg border bg-studio-900 pr-3 pl-7 font-mono text-sm uppercase text-studio-100 outline-none transition-[border-color,box-shadow] focus:ring-2 ${
              invalid
                ? "border-red-500/70 focus:border-red-500 focus:ring-red-500/20"
                : "border-studio-600 focus:border-accent focus:ring-accent-soft"
            }`}
          />
        </div>
      </div>
      {invalid && (
        <p className="text-xs text-red-400">Enter a valid 3- or 6-digit hex.</p>
      )}
    </Field>
  );
}
