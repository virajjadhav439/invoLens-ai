import { GoogleGenAI, Type } from "@google/genai";

const invoiceSchema = {
  type: Type.OBJECT,

  properties: {
    invoiceNumber: {
      type: Type.STRING,
    },

    invoiceDate: {
      type: Type.STRING,
    },

    dueDate: {
      type: Type.STRING,
    },

    poNumber: {
      type: Type.STRING,
    },

    supplier: {
      type: Type.OBJECT,
      properties: {
        name: {
          type: Type.STRING,
        },
        address: {
          type: Type.STRING,
        },
        gstin: {
          type: Type.STRING,
        },
      },
      required: ["name", "address", "gstin"],
    },

    customer: {
      type: Type.OBJECT,
      properties: {
        name: {
          type: Type.STRING,
        },
        gstin: {
          type: Type.STRING,
        },
      },
      required: ["name", "gstin"],
    },

    items: {
      type: Type.ARRAY,

      items: {
        type: Type.OBJECT,

        properties: {
          description: {
            type: Type.STRING,
          },

          quantity: {
            type: Type.NUMBER,
          },

          unitPrice: {
            type: Type.NUMBER,
          },

          tax: {
            type: Type.NUMBER,
          },

          total: {
            type: Type.NUMBER,
          },
        },

        required: [
          "description",
          "quantity",
          "unitPrice",
          "tax",
          "total",
        ],
      },
    },

    financials: {
      type: Type.OBJECT,

      properties: {
        subtotal: {
          type: Type.NUMBER,
        },

        cgst: {
          type: Type.NUMBER,
        },

        sgst: {
          type: Type.NUMBER,
        },

        igst: {
          type: Type.NUMBER,
        },

        totalTax: {
          type: Type.NUMBER,
        },

        grandTotal: {
          type: Type.NUMBER,
        },

        currency: {
          type: Type.STRING,
        },
      },

      required: [
        "subtotal",
        "cgst",
        "sgst",
        "igst",
        "totalTax",
        "grandTotal",
        "currency",
      ],
    },

    confidence: {
      type: Type.NUMBER,
    },
  },

  required: [
    "invoiceNumber",
    "invoiceDate",
    "dueDate",
    "poNumber",
    "supplier",
    "customer",
    "items",
    "financials",
    "confidence",
  ],
};

export async function extractInvoiceWithGemini(
  fileBuffer: Buffer,
  mimeType: string
) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const ai = new GoogleGenAI({
    apiKey,
  });

  const base64Data = fileBuffer.toString("base64");

  const prompt = `
You are InvoLens AI, an intelligent invoice understanding system.

Analyze the uploaded invoice carefully and extract structured invoice information.

The invoice may be:
- PDF
- JPG
- JPEG
- PNG
- A scanned document
- A digitally generated invoice
- An invoice with an unusual layout

IMPORTANT RULES:

1. Extract information exactly from the invoice.
2. Never invent information.
3. If a field is not present, return an empty string.
4. Extract every line item.
5. Preserve numerical values accurately.
6. Extract GSTIN exactly as written.
7. Extract invoice number exactly as written.
8. Extract invoice and due dates exactly as shown.
9. Extract supplier and customer information.
10. Extract CGST, SGST and IGST separately.
11. Extract subtotal and grand total.
12. Do not calculate or modify values.
13. Do not assume missing values.
14. Currency should normally be INR for Indian invoices.
15. confidence must be between 0 and 1.
16. Return ONLY the structured JSON matching the provided schema.

Pay special attention to:

- Invoice number
- Invoice date
- Due date
- PO number
- Supplier name
- Supplier address
- Supplier GSTIN
- Customer name
- Customer GSTIN
- Product/service descriptions
- Quantity
- Unit price
- Item tax
- Item total
- Subtotal
- CGST
- SGST
- IGST
- Total tax
- Grand total
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",

    contents: [
      {
        role: "user",

        parts: [
          {
            inlineData: {
              mimeType,
              data: base64Data,
            },
          },

          {
            text: prompt,
          },
        ],
      },
    ],

    config: {
      responseMimeType: "application/json",
      responseSchema: invoiceSchema,
      temperature: 0,
    },
  });

  if (!response.text) {
    throw new Error("Gemini returned an empty response");
  }

  try {
    return JSON.parse(response.text);
  } catch {
    throw new Error("Gemini returned invalid JSON");
  }
}