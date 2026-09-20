import type { ReactNode } from "react";

type Props = {
  label: string;
  htmlFor?: string;
  hint?: string;
  required?: boolean;
  trailing?: ReactNode;
  children: ReactNode;
};

export function Field({ label, htmlFor, hint, required, trailing, children }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={htmlFor} className="text-[13px] font-medium text-studio-200">
          {label}
          {required && <span className="ml-1 text-accent">*</span>}
        </label>
        {trailing}
      </div>
      {children}
      {hint && <p className="text-xs leading-relaxed text-studio-300">{hint}</p>}
    </div>
  );
}
