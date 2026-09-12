export const dummyInvoices = [
  {
    invoiceNumber: "INV-10001",
    invoiceDate: "2026-09-01",
    dueDate: "2026-09-15",
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

    confidence: 0.96,
    extractionMethod: "dummy",

    validationStatus: "VALID",
    validationIssues: [],

    sourceFileName: "seed-invoice-1.pdf"
  },

  {
    invoiceNumber: "INV-10002",
    invoiceDate: "2026-09-02",
    dueDate: "2026-09-17",
    poNumber: "PO-10002",

    supplier: {
      name: "TechNova Systems",
      address: "Bengaluru, Karnataka",
      gstin: "29TECHN1234P1Z8"
    },

    customer: {
      name: "XYZ Pvt Ltd",
      gstin: "27XYZDE5678G1Z2"
    },

    items: [
      {
        description: "Monitors",
        quantity: 5,
        unitPrice: 15000,
        tax: 13500,
        total: 88500
      }
    ],

    financials: {
      subtotal: 75000,
      cgst: 6750,
      sgst: 6750,
      igst: 0,
      totalTax: 13500,
      grandTotal: 88500,
      currency: "INR"
    },

    confidence: 0.94,
    extractionMethod: "dummy",

    validationStatus: "VALID",
    validationIssues: [],

    sourceFileName: "seed-invoice-2.pdf"
  },

  {
    invoiceNumber: "INV-10003",
    invoiceDate: "2026-09-03",
    dueDate: "2026-09-18",
    poNumber: "PO-10003",

    supplier: {
      name: "OfficeMart",
      address: "Mumbai, Maharashtra"
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
    extractionMethod: "dummy",

    validationStatus: "WARNING",

    validationIssues: [
      {
        type: "MISSING_GSTIN",
        severity: "MEDIUM",
        message: "Supplier GSTIN is missing."
      }
    ],

    sourceFileName: "seed-invoice-3.pdf"
  },

  {
    invoiceNumber: "INV-10004",
    invoiceDate: "2026-09-04",
    dueDate: "2026-09-19",
    poNumber: "PO-10004",

    supplier: {
      name: "Industrial Hub",
      address: "Nashik, Maharashtra",
      gstin: "27INDUS1234M1Z4"
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
    extractionMethod: "dummy",

    validationStatus: "WARNING",

    validationIssues: [
      {
        type: "TAX_MISMATCH",
        severity: "HIGH",
        message: "Expected approximately ₹18000 tax but found ₹10000."
      }
    ],

    sourceFileName: "seed-invoice-4.pdf"
  },

  {
    invoiceNumber: "INV-10005",
    invoiceDate: "2026-09-05",
    dueDate: "2026-09-20",
    poNumber: "PO-10005",

    supplier: {
      name: "CloudWorks India",
      address: "Hyderabad, Telangana",
      gstin: "36CLOUD1234N1Z7"
    },

    customer: {
      name: "XYZ Pvt Ltd",
      gstin: "27XYZDE5678G1Z2"
    },

    items: [
      {
        description: "Cloud Services",
        quantity: 1,
        unitPrice: 120000,
        tax: 21600,
        total: 141600
      }
    ],

    financials: {
      subtotal: 120000,
      cgst: 10800,
      sgst: 10800,
      igst: 0,
      totalTax: 21600,
      grandTotal: 141600,
      currency: "INR"
    },

    confidence: 0.98,
    extractionMethod: "dummy",

    validationStatus: "VALID",
    validationIssues: [],

    sourceFileName: "seed-invoice-5.pdf"
  },

  {
    invoiceNumber: "INV-10006",
    invoiceDate: "2026-09-06",
    dueDate: "2026-09-21",
    poNumber: "PO-10006",

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
    extractionMethod: "dummy",

    validationStatus: "ANOMALY",

    validationIssues: [
      {
        type: "HIGH_AMOUNT_ANOMALY",
        severity: "MEDIUM",
        message:
          "Invoice amount is unusually high compared with historical invoices."
      }
    ],

    sourceFileName: "seed-invoice-6.pdf"
  },

  {
    invoiceNumber: "INV-10001",
    invoiceDate: "2026-09-07",
    dueDate: "2026-09-22",
    poNumber: "PO-10007",

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
        quantity: 1,
        unitPrice: 40000,
        tax: 7200,
        total: 47200
      }
    ],

    financials: {
      subtotal: 40000,
      cgst: 3600,
      sgst: 3600,
      igst: 0,
      totalTax: 7200,
      grandTotal: 47200,
      currency: "INR"
    },

    confidence: 0.93,
    extractionMethod: "dummy",

    validationStatus: "DUPLICATE",

    validationIssues: [
      {
        type: "DUPLICATE_INVOICE",
        severity: "HIGH",
        message: "Invoice number already exists."
      }
    ],

    sourceFileName: "seed-duplicate.pdf"
  },

  {
    invoiceNumber: "INV-10008",
    invoiceDate: "2026-09-08",
    dueDate: "2026-09-23",
    poNumber: "PO-10008",

    supplier: {
      name: "LogiTrans",
      address: "Delhi, India",
      gstin: "07LOGIT1234Q1Z3"
    },

    customer: {
      name: "XYZ Pvt Ltd",
      gstin: "27XYZDE5678G1Z2"
    },

    items: [
      {
        description: "Logistics Services",
        quantity: 1,
        unitPrice: 60000,
        tax: 10800,
        total: 70800
      }
    ],

    financials: {
      subtotal: 60000,
      cgst: 5400,
      sgst: 5400,
      igst: 0,
      totalTax: 10800,
      grandTotal: 70800,
      currency: "INR"
    },

    confidence: 0.95,
    extractionMethod: "dummy",

    validationStatus: "VALID",
    validationIssues: [],

    sourceFileName: "seed-invoice-8.pdf"
  }
];