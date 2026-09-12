import {Invoice} from "../models/Invoice";

export interface ExtractedInvoice {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  poNumber: string;

  supplier: {
    name: string;
    address: string;
    gstin?: string;
  };

  customer: {
    name: string;
    gstin?: string;
  };

  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    tax: number;
    total: number;
  }[];

  financials: {
    subtotal: number;
    cgst: number;
    sgst: number;
    igst: number;
    totalTax: number;
    grandTotal: number;
    currency: string;
  };

  confidence: number;
  extractionMethod: string;
}

export interface ValidationIssue {
  type: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  message: string;
}

export const validateDuplicateInvoice = async (
  invoiceNumber: string
): Promise<ValidationIssue[]> => {
  if (!invoiceNumber) return [];

  const count = await Invoice.countDocuments({ invoiceNumber });

  if (count > 0) {
    return [
      {
        type: "DUPLICATE_INVOICE",
        severity: "HIGH",
        message: "Invoice number already exists."
      }
    ];
  }

  return [];
};

export const validateRequiredFields = (
  invoice: ExtractedInvoice
): ValidationIssue[] => {
  const issues: ValidationIssue[] = [];

  if (!invoice.invoiceNumber) {
    issues.push({
      type: "MISSING_INVOICE_NUMBER",
      severity: "HIGH",
      message: "Invoice number is missing."
    });
  }

  if (!invoice.supplier?.name) {
    issues.push({
      type: "MISSING_SUPPLIER",
      severity: "HIGH",
      message: "Supplier information is missing."
    });
  }

  if (!invoice.supplier?.gstin) {
    issues.push({
      type: "MISSING_GSTIN",
      severity: "MEDIUM",
      message: "Supplier GSTIN is missing."
    });
  }

  if (!invoice.invoiceDate || Number.isNaN(Date.parse(invoice.invoiceDate))) {
    issues.push({
      type: "INVALID_INVOICE_DATE",
      severity: "HIGH",
      message: "Invoice date is missing or invalid."
    });
  }

  if (!invoice.dueDate || Number.isNaN(Date.parse(invoice.dueDate))) {
    issues.push({
      type: "INVALID_DUE_DATE",
      severity: "MEDIUM",
      message: "Due date is missing or invalid."
    });
  }

  return issues;
};

export const validateTaxCalculation = (
  invoice: ExtractedInvoice
): ValidationIssue[] => {
  const { subtotal, totalTax } = invoice.financials;

  const expectedTax = subtotal * 0.18;

  const difference = Math.abs(expectedTax - totalTax);

  if (difference > 1) {
    return [
      {
        type: "TAX_MISMATCH",
        severity: "HIGH",
        message: `Expected approximately ₹${expectedTax.toFixed(
          2
        )} tax but found ₹${totalTax.toFixed(2)}.`
      }
    ];
  }

  return [];
};

export const validateGrandTotal = (
  invoice: ExtractedInvoice
): ValidationIssue[] => {
  const { subtotal, totalTax, grandTotal } = invoice.financials;

  const expectedTotal = subtotal + totalTax;

  if (Math.abs(expectedTotal - grandTotal) > 1) {
    return [
      {
        type: "GRAND_TOTAL_MISMATCH",
        severity: "HIGH",
        message: "Grand total does not match subtotal plus tax."
      }
    ];
  }

  return [];
};

export const detectAmountAnomaly = async (
  invoice: ExtractedInvoice
): Promise<ValidationIssue[]> => {
  const invoices = await Invoice.find(
    {},
    { "financials.grandTotal": 1 }
  ).lean();

  if (invoices.length < 3) {
    return [];
  }

  const totals = invoices.map(
    (item) => item.financials.grandTotal
  );

  const average =
    totals.reduce((sum, value) => sum + value, 0) / totals.length;

  if (invoice.financials.grandTotal > average * 2.5) {
    return [
      {
        type: "HIGH_AMOUNT_ANOMALY",
        severity: "MEDIUM",
        message:
          "Invoice amount is unusually high compared with historical invoices."
      }
    ];
  }

  return [];
};

export const validateInvoice = async (
  invoice: ExtractedInvoice
) => {
  const issues: ValidationIssue[] = [];

  issues.push(...validateRequiredFields(invoice));
  issues.push(...validateTaxCalculation(invoice));
  issues.push(...validateGrandTotal(invoice));

  const duplicateIssues = await validateDuplicateInvoice(
    invoice.invoiceNumber
  );

  issues.push(...duplicateIssues);

  const anomalyIssues = await detectAmountAnomaly(invoice);

  issues.push(...anomalyIssues);

  let status:
    | "VALID"
    | "WARNING"
    | "DUPLICATE"
    | "ANOMALY" = "VALID";

  if (issues.some((issue) => issue.type === "DUPLICATE_INVOICE")) {
    status = "DUPLICATE";
  } else if (
    issues.some((issue) => issue.type === "HIGH_AMOUNT_ANOMALY")
  ) {
    status = "ANOMALY";
  } else if (issues.length > 0) {
    status = "WARNING";
  }

  return {
    status,
    issues
  };
};