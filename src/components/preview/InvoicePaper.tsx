import { forwardRef } from "react";
import type { TemplateSettings } from "@/lib/types";
import { INVOICE, computeTotals, money } from "@/lib/invoice-data";
import { contrastText, rgba } from "@/lib/color";
import { cn } from "@/components/ui/cn";

export const PAPER_WIDTH = 680;

type Props = { settings: TemplateSettings };

export const InvoicePaper = forwardRef<HTMLDivElement, Props>(function InvoicePaper(
  { settings },
  ref,
) {
  const { primaryColor: primary, secondaryColor: secondary } = settings;
  const totals = computeTotals();
  const onPrimary = contrastText(primary);
  const initials = INVOICE.from.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const logo = settings.showLogo ? (
    <div className="flex h-16 w-40 shrink-0 items-center justify-end">
      {settings.logoDataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={settings.logoDataUrl}
          alt="Company logo"
          className="max-h-16 max-w-40 object-contain"
          style={{ objectPosition: settings.logoPosition === "left" ? "left" : "right" }}
        />
      ) : (
        <div
          className="flex size-16 items-center justify-center rounded-2xl text-2xl font-bold tracking-tight"
          style={{ backgroundColor: primary, color: onPrimary }}
          aria-label="Company monogram"
        >
          {initials}
        </div>
      )}
    </div>
  ) : null;

  return (
    <div
      ref={ref}
      className="relative bg-white text-[#1a1a1a] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.06)]"
      style={{ width: PAPER_WIDTH, fontSize: 12.5, lineHeight: 1.45 }}
      aria-label="Invoice preview"
    >
      {/* brand band */}
      <div className="flex h-2">
        <div className="flex-[3]" style={{ backgroundColor: primary }} />
        <div className="flex-1" style={{ backgroundColor: secondary }} />
      </div>

      <div className="px-12 pt-10 pb-12">
        {/* header */}
        <header
          className={cn(
            "flex items-start justify-between gap-8",
            settings.logoPosition === "left" && "flex-row-reverse",
          )}
        >
          <div className={cn("flex flex-col gap-4", settings.logoPosition === "left" && "items-end text-right")}>
            <h1
              className="text-[40px] leading-none font-semibold tracking-tight"
              style={{ color: primary }}
            >
              {settings.headingLabel.trim() || "Invoice"}
            </h1>
            <dl className="grid grid-cols-[auto_auto] gap-x-6 gap-y-1">
              <Meta label="Number" value={INVOICE.number} color={secondary} mono />
              <Meta label="Issued" value={INVOICE.issueDate} color={secondary} />
              <Meta label="Due" value={INVOICE.dueDate} color={secondary} />
            </dl>
          </div>
          {logo}
        </header>

        <hr className="my-8 border-0" style={{ height: 1, backgroundColor: rgba(primary, 0.25) }} />

        {/* parties */}
        <div className="grid grid-cols-2 gap-8">
          <Party label="From" name={INVOICE.from.name} lines={INVOICE.from.lines} color={secondary} />
          <Party label="Bill to" name={INVOICE.to.name} lines={INVOICE.to.lines} color={secondary} />
        </div>

        {/* items */}
        <table className="mt-10 w-full border-collapse">
          <thead>
            <tr
              className="text-left text-[10px] font-semibold tracking-[0.12em] uppercase"
              style={{ color: secondary }}
            >
              <th className="pb-2 font-semibold">Item</th>
              <th className="pb-2 text-right font-semibold">Qty</th>
              <th className="pb-2 text-right font-semibold">Rate</th>
              <th className="pb-2 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {INVOICE.items.map((it) => (
              <tr key={it.id} className="align-top" style={{ borderTop: `1.5px solid ${primary}` }}>
                <td className="py-3 pr-4">
                  <div className="font-medium">{it.item}</div>
                  {settings.showDescription && (
                    <div className="mt-0.5 text-[11.5px] text-[#6b6b6b]">{it.description}</div>
                  )}
                </td>
                <td className="py-3 text-right tabular-nums">{it.qty}</td>
                <td className="py-3 text-right tabular-nums">{money(it.rate)}</td>
                <td className="py-3 text-right font-medium tabular-nums">{money(it.qty * it.rate)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* totals */}
        <div className="mt-2 flex justify-end">
          <div className="w-[260px]">
            <div className="border-t border-[#e6e6e6]" />
            <TotalRow label="Subtotal" value={money(totals.subtotal)} />
            <TotalRow label="Discount" value={money(INVOICE.discount)} />
            {totals.taxes.map((t) => (
              <TotalRow key={t.label} label={t.label} value={money(t.amount)} />
            ))}
            <TotalRow label="Total" value={money(totals.total)} strong />
            <TotalRow label="Payment made" value={`-${money(INVOICE.paymentMade)}`} />
            <div
              className="mt-2 flex items-center justify-between rounded-lg px-3 py-2.5"
              style={{ backgroundColor: primary, color: onPrimary }}
            >
              <span className="text-[11px] font-semibold tracking-[0.12em] uppercase">Balance due</span>
              <span className="text-base font-semibold tabular-nums">{money(totals.balance)}</span>
            </div>
          </div>
        </div>

        {/* footer */}
        {(settings.showTerms || settings.showStatement) && (
          <footer className="mt-12 grid grid-cols-2 gap-8 border-t border-[#e6e6e6] pt-6">
            {settings.showTerms && (
              <Note label="Terms & conditions" text={settings.terms} color={secondary} />
            )}
            {settings.showStatement && (
              <Note label="Statement" text={settings.statement} color={secondary} />
            )}
          </footer>
        )}
      </div>
    </div>
  );
});

function Meta({
  label,
  value,
  color,
  mono,
}: {
  label: string;
  value: string;
  color: string;
  mono?: boolean;
}) {
  return (
    <>
      <dt className="text-[10px] font-semibold tracking-[0.12em] uppercase" style={{ color }}>
        {label}
      </dt>
      <dd className={cn("text-[12px]", mono && "font-mono tabular-nums")}>{value}</dd>
    </>
  );
}

function Party({
  label,
  name,
  lines,
  color,
}: {
  label: string;
  name: string;
  lines: string[];
  color: string;
}) {
  return (
    <div>
      <div className="mb-1.5 text-[10px] font-semibold tracking-[0.12em] uppercase" style={{ color }}>
        {label}
      </div>
      <div className="font-semibold">{name}</div>
      {lines.map((l) => (
        <div key={l} className="text-[#4a4a4a]">
          {l}
        </div>
      ))}
    </div>
  );
}

function TotalRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between py-1.5",
        strong ? "border-t border-[#1a1a1a] font-semibold" : "text-[#4a4a4a]",
      )}
    >
      <span>{label}</span>
      <span className={cn("tabular-nums", strong && "text-[#1a1a1a]")}>{value}</span>
    </div>
  );
}

function Note({ label, text, color }: { label: string; text: string; color: string }) {
  return (
    <div className="min-w-0">
      <div className="mb-1.5 text-[10px] font-semibold tracking-[0.12em] uppercase" style={{ color }}>
        {label}
      </div>
      <p className="text-[11.5px] break-words whitespace-pre-line text-[#4a4a4a]">
        {text.trim() || <span className="italic opacity-50">Nothing here yet</span>}
      </p>
    </div>
  );
}
