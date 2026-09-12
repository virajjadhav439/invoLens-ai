import { ExtractedInvoice } from "../services/validationService";

export const getDummyInvoice = (
  fileName: string
): ExtractedInvoice => {
  const lower = fileName.toLowerCase();

  if (lower.includes("duplicate")) {
    return {
      invoiceNumber: "INV-10001",
      invoiceDate: "2026-09-10",
      dueDate: "2026-09-25",
      poNumber: "PO-10001",

      supplier: {
        name: "ABC Enterprises",
        address: "Pune, Maharashtra",
        gstin: "27ABCDE1234F1Z5"
      },

      customer: {
        name: "XYZ Pvt Ltd",
        gstin: "27XYZDE5678G1Z2"
      },

      items: [
        {
          description: "Laptop",
          quantity: 2,
          unitPrice: 40000,
          tax: 7200,
          total: 94400
        }
      ],

      financials: {
        subtotal: 80000,
        cgst: 7200,
        sgst: 7200,
        igst: 0,
        totalTax: 14400,
        grandTotal: 94400,
        currency: "INR"
      },

      confidence: 0.96,
      extractionMethod: "dummy"
    };
  }

  if (lower.includes("high")) {
    return {
      invoiceNumber: "INV-HIGH-9001",
      invoiceDate: "2026-09-11",
      dueDate: "2026-09-30",
      poNumber: "PO-HIGH-01",

      supplier: {
        name: "MegaTech Solutions",
        address: "Mumbai, Maharashtra",
        gstin: "27MEGAT1234K1Z5"
      },

      customer: {
        name: "XYZ Pvt Ltd",
        gstin: "27XYZDE5678G1Z2"
      },

      items: [
        {
          description: "Enterprise Servers",
          quantity: 4,
          unitPrice: 500000,
          tax: 360000,
          total: 2360000
        }
      ],

      financials: {
        subtotal: 2000000,
        cgst: 180000,
        sgst: 180000,
        igst: 0,
        totalTax: 360000,
        grandTotal: 2360000,
        currency: "INR"
      },

      confidence: 0.91,
      extractionMethod: "dummy"
    };
  }

  if (lower.includes("missing-gstin")) {
    return {
      invoiceNumber: "INV-NOGST-7001",
      invoiceDate: "2026-09-08",
      dueDate: "2026-09-22",
      poNumber: "PO-7001",

      supplier: {
        name: "Local Office Supplies",
        address: "Nashik, Maharashtra"
      },

      customer: {
        name: "XYZ Pvt Ltd",
        gstin: "27XYZDE5678G1Z2"
      },

      items: [
        {
          description: "Office Chairs",
          quantity: 10,
          unitPrice: 5000,
          tax: 9000,
          total: 59000
        }
      ],

      financials: {
        subtotal: 50000,
        cgst: 4500,
        sgst: 4500,
        igst: 0,
        totalTax: 9000,
        grandTotal: 59000,
        currency: "INR"
      },

      confidence: 0.89,
      extractionMethod: "dummy"
    };
  }

  if (lower.includes("tax-mismatch")) {
    return {
      invoiceNumber: "INV-TAX-5001",
      invoiceDate: "2026-09-07",
      dueDate: "2026-09-20",
      poNumber: "PO-5001",

      supplier: {
        name: "Incorrect Tax Traders",
        address: "Nagpur, Maharashtra",
        gstin: "27INCTA1234L1Z2"
      },

      customer: {
        name: "XYZ Pvt Ltd",
        gstin: "27XYZDE5678G1Z2"
      },

      items: [
        {
          description: "Industrial Equipment",
          quantity: 1,
          unitPrice: 100000,
          tax: 10000,
          total: 110000
        }
      ],

      financials: {
        subtotal: 100000,
        cgst: 5000,
        sgst: 5000,
        igst: 0,
        totalTax: 10000,
        grandTotal: 110000,
        currency: "INR"
      },

      confidence: 0.87,
      extractionMethod: "dummy"
    };
  }

  return {
    invoiceNumber: "INV-2026-001",
    invoiceDate: "2026-09-10",
    dueDate: "2026-09-25",
    poNumber: "PO-10029",

    supplier: {
      name: "ABC Enterprises",
      address: "Pune, Maharashtra",
      gstin: "27ABCDE1234F1Z5"
    },

    customer: {
      name: "XYZ Pvt Ltd",
      gstin: "27XYZDE5678G1Z2"
    },

    items: [
      {
        description: "Laptop",
        quantity: 2,
        unitPrice: 40000,
        tax: 14400,
        total: 94400
      }
    ],

    financials: {
      subtotal: 80000,
      cgst: 7200,
      sgst: 7200,
      igst: 0,
      totalTax: 14400,
      grandTotal: 94400,
      currency: "INR"
    },

    confidence: 0.94,
    extractionMethod: "dummy"
  };
};