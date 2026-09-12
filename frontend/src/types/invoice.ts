export type ValidationStatus =
  | "VALID"
  | "WARNING"
  | "DUPLICATE"
  | "ANOMALY";

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  total: number;
}

export interface Supplier {
  name: string;
  address: string;
  gstin?: string;
}

export interface Customer {
  name: string;
  gstin?: string;
}

export interface Financials {
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  grandTotal: number;
  currency: string;
}

export interface ValidationIssue {
  type: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  message: string;
}

export interface Invoice {
  _id: string;

  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  poNumber: string;

  supplier: Supplier;
  customer: Customer;

  items: InvoiceItem[];

  financials: Financials;

  confidence: number;
  extractionMethod: string;

  validationStatus: ValidationStatus;
  validationIssues: ValidationIssue[];

  sourceFileName?: string;

  createdAt: string;
}

export interface Analytics {
  totalInvoices: number;
  totalSpending: number;
  totalTax: number;
  vendorCount: number;
  flaggedInvoices: number;

  topVendors: {
    name: string;
    amount: number;
  }[];

  monthlySpending: {
    month: string;
    amount: number;
  }[];
}