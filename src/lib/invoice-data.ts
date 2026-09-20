export type LineItem = {
  id: string;
  item: string;
  description: string;
  qty: number;
  rate: number;
};

export const INVOICE = {
  number: "346D3D40-0001",
  issueDate: "September 3, 2024",
  dueDate: "September 17, 2024",
  from: {
    name: "Bigcapital, Inc",
    lines: [
      "131 Continental Dr, Suite 305",
      "Newark, Delaware 19131",
      "United States",
      "+1 762-339-5634",
    ],
  },
  to: {
    name: "Bigcapital Technology, Inc.",
    lines: [
      "131 Continental Dr, Suite 305",
      "Newark, Delaware 19713",
      "United States",
      "+1 762-339-5634",
    ],
  },
  items: [
    {
      id: "1",
      item: "Web development",
      description: "Website development with content and SEO optimization",
      qty: 1,
      rate: 630,
    },
  ] as LineItem[],
  discount: 0,
  taxes: [
    { label: "Sample Tax1 (4.70%)", rate: 0.047 },
    { label: "Sample Tax2 (7.00%)", rate: 0.07 },
  ],
  paymentMade: 100,
};

export function computeTotals() {
  const subtotal = INVOICE.items.reduce((s, i) => s + i.qty * i.rate, 0);
  const afterDiscount = subtotal - INVOICE.discount;
  const taxes = INVOICE.taxes.map((t) => ({
    label: t.label,
    amount: afterDiscount * t.rate,
  }));
  const taxTotal = taxes.reduce((s, t) => s + t.amount, 0);
  const total = afterDiscount + taxTotal;
  const balance = total - INVOICE.paymentMade;
  return { subtotal, taxes, total, balance };
}

export function money(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}
