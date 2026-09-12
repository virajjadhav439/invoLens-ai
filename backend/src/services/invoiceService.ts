import {
  Invoice,
  IInvoice,
  ValidationIssue
} from "../models/Invoice";

import {
  ExtractedInvoice,
  validateInvoice
} from "./validationService";

type InvoiceStatus =
  | "VALID"
  | "WARNING"
  | "DUPLICATE"
  | "ANOMALY";

interface CreateInvoiceData
  extends ExtractedInvoice {
  validationStatus: InvoiceStatus;
  validationIssues: ValidationIssue[];
  sourceFileName?: string;
}

export const createInvoice = async (
  invoiceData: CreateInvoiceData
) => {
  const invoice =
    await Invoice.create(invoiceData);

  return invoice;
};

export const getInvoices = async (
  search?: string,
  status?: string
) => {
  const query: Record<string, unknown> = {};

  if (search) {
    query.$or = [
      {
        invoiceNumber: {
          $regex: search,
          $options: "i"
        }
      },
      {
        "supplier.name": {
          $regex: search,
          $options: "i"
        }
      }
    ];
  }

  if (
    status &&
    status !== "ALL"
  ) {
    query.validationStatus = status;
  }

  return Invoice.find(query)
    .sort({ createdAt: -1 })
    .lean();
};

export const getInvoiceById = async (
  id: string
) => {
  return Invoice.findById(id).lean();
};

export const getAnalytics = async () => {
  const invoices =
    await Invoice.find().lean();

  const totalInvoices =
    invoices.length;

  const totalSpending =
    invoices.reduce(
      (sum, invoice) =>
        sum +
        invoice.financials.grandTotal,
      0
    );

  const totalTax =
    invoices.reduce(
      (sum, invoice) =>
        sum +
        invoice.financials.totalTax,
      0
    );

  const vendors = new Set(
    invoices.map(
      (invoice) =>
        invoice.supplier.name
    )
  );

  const flaggedInvoices =
    invoices.filter(
      (invoice) =>
        invoice.validationStatus !==
        "VALID"
    ).length;

  const vendorMap: Record<
    string,
    number
  > = {};

  for (const invoice of invoices) {
    const vendor =
      invoice.supplier.name;

    vendorMap[vendor] =
      (vendorMap[vendor] || 0) +
      invoice.financials.grandTotal;
  }

  const topVendors =
    Object.entries(vendorMap)
      .map(([name, amount]) => ({
        name,
        amount
      }))
      .sort(
        (a, b) =>
          b.amount - a.amount
      )
      .slice(0, 5);

  const monthlyMap: Record<
    string,
    number
  > = {};

  for (const invoice of invoices) {
    const month =
      invoice.invoiceDate.slice(
        0,
        7
      );

    monthlyMap[month] =
      (monthlyMap[month] || 0) +
      invoice.financials.grandTotal;
  }

  const monthlySpending =
    Object.entries(monthlyMap)
      .sort(([a], [b]) =>
        a.localeCompare(b)
      )
      .map(
        ([month, amount]) => ({
          month,
          amount
        })
      );

  return {
    totalInvoices,
    totalSpending,
    totalTax,
    vendorCount: vendors.size,
    flaggedInvoices,
    topVendors,
    monthlySpending
  };
};