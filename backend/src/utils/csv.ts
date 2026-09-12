import { IInvoice } from "../models/Invoice";

const escapeCsv = (
  value: unknown
): string => {
  const text = String(value ?? "");

  if (
    text.includes(",") ||
    text.includes('"') ||
    text.includes("\n")
  ) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
};

export const invoicesToCsv = (
  invoices: IInvoice[]
): string => {
  const headers = [
    "Invoice Number",
    "Supplier",
    "Invoice Date",
    "Due Date",
    "Subtotal",
    "Tax",
    "Grand Total",
    "Currency",
    "Status",
    "Confidence"
  ];

  const rows = invoices.map(
    (invoice) => [
      invoice.invoiceNumber,
      invoice.supplier.name,
      invoice.invoiceDate,
      invoice.dueDate,
      invoice.financials.subtotal,
      invoice.financials.totalTax,
      invoice.financials.grandTotal,
      invoice.financials.currency,
      invoice.validationStatus,
      invoice.confidence
    ]
  );

  return [
    headers.join(","),
    ...rows.map((row) =>
      row.map(escapeCsv).join(",")
    )
  ].join("\n");
};