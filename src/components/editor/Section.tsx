import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function Section({ title, description, children }: Props) {
  return (
    <section className="flex flex-col gap-4">
      <header className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold tracking-tight text-studio-100">{title}</h3>
        {description && <p className="text-xs leading-relaxed text-studio-300">{description}</p>}
      </header>
      {children}
    </section>
  );
}
