import mongoose, { Document, Schema } from "mongoose";

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

export interface IInvoice extends Document {
  invoiceNumber: string;
  invoiceDate: string;

  // Optional because some invoices don't contain a due date
  dueDate: string;

  // Optional because some invoices don't contain a PO number
  poNumber: string;

  supplier: Supplier;
  customer: Customer;

  items: InvoiceItem[];

  financials: Financials;

  confidence: number;
  extractionMethod: string;

  validationStatus:
    | "VALID"
    | "WARNING"
    | "DUPLICATE"
    | "ANOMALY";

  validationIssues: ValidationIssue[];

  sourceFileName?: string;

  createdAt: Date;
}

/* ============================================
   INVOICE ITEM
============================================ */

const invoiceItemSchema = new Schema<InvoiceItem>(
  {
    description: {
      type: String,
      required: true,
      default: "",
    },

    quantity: {
      type: Number,
      required: true,
      default: 0,
    },

    unitPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    tax: {
      type: Number,
      required: true,
      default: 0,
    },

    total: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    _id: false,
  }
);

/* ============================================
   SUPPLIER
============================================ */

const supplierSchema = new Schema<Supplier>(
  {
    name: {
      type: String,
      required: true,
      default: "",
    },

    address: {
      type: String,
      required: true,
      default: "",
    },

    gstin: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

/* ============================================
   CUSTOMER
============================================ */

const customerSchema = new Schema<Customer>(
  {
    name: {
      type: String,
      required: true,
      default: "",
    },

    gstin: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

/* ============================================
   FINANCIALS
============================================ */

const financialSchema = new Schema<Financials>(
  {
    subtotal: {
      type: Number,
      required: true,
      default: 0,
    },

    cgst: {
      type: Number,
      required: true,
      default: 0,
    },

    sgst: {
      type: Number,
      required: true,
      default: 0,
    },

    igst: {
      type: Number,
      required: true,
      default: 0,
    },

    totalTax: {
      type: Number,
      required: true,
      default: 0,
    },

    grandTotal: {
      type: Number,
      required: true,
      default: 0,
    },

    currency: {
      type: String,
      default: "INR",
    },
  },
  {
    _id: false,
  }
);

/* ============================================
   VALIDATION ISSUE
============================================ */

const validationIssueSchema =
  new Schema<ValidationIssue>(
    {
      type: {
        type: String,
        required: true,
      },

      severity: {
        type: String,
        enum: ["LOW", "MEDIUM", "HIGH"],
        required: true,
      },

      message: {
        type: String,
        required: true,
      },
    },
    {
      _id: false,
    }
  );

/* ============================================
   INVOICE
============================================ */

const invoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: {
      type: String,
      required: true,
      index: true,
    },

    invoiceDate: {
      type: String,
      required: true,
    },

    /*
     * Due date is NOT mandatory.
     *
     * Some invoices don't contain a due date.
     */
    dueDate: {
      type: String,
      required: false,
      default: "",
    },

    /*
     * PO number is also optional.
     */
    poNumber: {
      type: String,
      required: false,
      default: "",
    },

    supplier: {
      type: supplierSchema,
      required: true,
    },

    customer: {
      type: customerSchema,
      required: true,
    },

    items: {
      type: [invoiceItemSchema],
      required: true,
      default: [],
    },

    financials: {
      type: financialSchema,
      required: true,
    },

    confidence: {
      type: Number,
      required: true,
      default: 0,
    },

    extractionMethod: {
      type: String,
      default: "gemini",
    },

    validationStatus: {
      type: String,
      enum: [
        "VALID",
        "WARNING",
        "DUPLICATE",
        "ANOMALY",
      ],
      default: "VALID",
    },

    validationIssues: {
      type: [validationIssueSchema],
      default: [],
    },

    sourceFileName: {
      type: String,
      default: "",
    },
  },

  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

export const Invoice =
  mongoose.model<IInvoice>(
    "Invoice",
    invoiceSchema
  );