"use client";

import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "./cn";

const base =
  "w-full rounded-lg border border-studio-600 bg-studio-900 px-3 text-sm text-studio-100 placeholder:text-studio-500 outline-none transition-[border-color,box-shadow] focus:border-accent focus:ring-2 focus:ring-accent-soft";

export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function TextInput({ className, ...props }, ref) {
    return <input ref={ref} className={cn(base, "h-10", className)} {...props} />;
  },
);

export const TextArea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function TextArea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(base, "min-h-[96px] resize-y py-2.5 leading-relaxed", className)}
      {...props}
    />
  );
});
