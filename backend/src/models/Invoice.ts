import mongoose, { Document, Schema } from "mongoose";

/* ============================================
   INVOICE ITEM
============================================ */

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  total: number;
}

/* ============================================
   SUPPLIER
============================================ */

export interface Supplier {
  name: string;
  address: string;
  gstin?: string;
}

/* ============================================
   CUSTOMER
============================================ */

export interface Customer {
  name: string;
  gstin?: string;
}

/* ============================================
   FINANCIALS
============================================ */

export interface Financials {
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  grandTotal: number;
  currency: string;
}

/* ============================================
   VALIDATION ISSUE
============================================ */

export interface ValidationIssue {
  type: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  message: string;
}

/* ============================================
   CV PROCESSING
============================================ */

export interface CVProcessing {
  jobId: string;
  ocrCount: number;
  annotatedImage: string;
  extractionMethod: string;
}

/* ============================================
   INVOICE DOCUMENT
============================================ */

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

  cvProcessing?: CVProcessing;

  sourceFileName?: string;

  createdAt: Date;
}

/* ============================================
   INVOICE ITEM SCHEMA
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
   SUPPLIER SCHEMA
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
   CUSTOMER SCHEMA
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
   FINANCIALS SCHEMA
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
   VALIDATION ISSUE SCHEMA
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
   CV PROCESSING SCHEMA
============================================ */

const cvProcessingSchema =
  new Schema<CVProcessing>(
    {
      jobId: {
        type: String,
        default: "",
      },

      ocrCount: {
        type: Number,
        default: 0,
      },

      annotatedImage: {
        type: String,
        default: "",
      },

      extractionMethod: {
        type: String,
        default: "OpenCV + Tesseract OCR",
      },
    },
    {
      _id: false,
    }
  );

/* ============================================
   INVOICE SCHEMA
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
      default: "OpenCV + Tesseract OCR",
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

    /*
     * Computer Vision processing information.
     *
     * Stores:
     * - Jupyter job ID
     * - Number of OCR regions detected
     * - Bounding-box image filename
     * - Extraction method
     */
    cvProcessing: {
      type: cvProcessingSchema,
      default: undefined,
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

/* ============================================
   EXPORT MODEL
============================================ */

export const Invoice =
  mongoose.model<IInvoice>(
    "Invoice",
    invoiceSchema
  );