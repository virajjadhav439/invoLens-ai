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
  dueDate: string;
  poNumber: string;

  supplier: Supplier;
  customer: Customer;

  items: InvoiceItem[];

  financials: Financials;

  confidence: number;
  extractionMethod: string;

  validationStatus: "VALID" | "WARNING" | "DUPLICATE" | "ANOMALY";
  validationIssues: ValidationIssue[];

  sourceFileName?: string;

  createdAt: Date;
}

const invoiceItemSchema = new Schema<InvoiceItem>(
  {
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true }
  },
  { _id: false }
);

const supplierSchema = new Schema<Supplier>(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    gstin: { type: String }
  },
  { _id: false }
);

const customerSchema = new Schema<Customer>(
  {
    name: { type: String, required: true },
    gstin: { type: String }
  },
  { _id: false }
);

const financialSchema = new Schema<Financials>(
  {
    subtotal: { type: Number, required: true },
    cgst: { type: Number, required: true },
    sgst: { type: Number, required: true },
    igst: { type: Number, required: true },
    totalTax: { type: Number, required: true },
    grandTotal: { type: Number, required: true },
    currency: { type: String, default: "INR" }
  },
  { _id: false }
);

const validationIssueSchema = new Schema<ValidationIssue>(
  {
    type: { type: String, required: true },
    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      required: true
    },
    message: { type: String, required: true }
  },
  { _id: false }
);

const invoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: {
      type: String,
      required: true,
      index: true
    },

    invoiceDate: {
      type: String,
      required: true
    },

    dueDate: {
      type: String,
      required: true
    },

    poNumber: {
      type: String,
      default: ""
    },

    supplier: {
      type: supplierSchema,
      required: true
    },

    customer: {
      type: customerSchema,
      required: true
    },

    items: {
      type: [invoiceItemSchema],
      required: true
    },

    financials: {
      type: financialSchema,
      required: true
    },

    confidence: {
      type: Number,
      required: true
    },

    extractionMethod: {
      type: String,
      default: "dummy"
    },

    validationStatus: {
      type: String,
      enum: ["VALID", "WARNING", "DUPLICATE", "ANOMALY"],
      default: "VALID"
    },

    validationIssues: {
      type: [validationIssueSchema],
      default: []
    },

    sourceFileName: {
      type: String
    }
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false
    }
  }
);

export const Invoice = mongoose.model<IInvoice>("Invoice", invoiceSchema);