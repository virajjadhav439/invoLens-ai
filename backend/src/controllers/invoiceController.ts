import { Request, Response, NextFunction } from "express";
import fs from "fs/promises";
import path from "path";

import {
  Invoice
} from "../models/Invoice";


import {
  validateInvoice
} from "../services/validationService";

import {
  createInvoice,
  getInvoices,
  getInvoiceById,
  getAnalytics
} from "../services/invoiceService";

import {
  invoicesToCsv
} from "../utils/csv";

const createCVJob = async (
  buffer: Buffer,
  originalName: string
) => {

  const backendRoot = path.resolve(
    process.cwd()
  );

  const incomingDir = path.join(
    backendRoot,
    "cv_jobs",
    "incoming"
  );

  const resultsDir = path.join(
    backendRoot,
    "cv_jobs",
    "results"
  );

  await fs.mkdir(
    incomingDir,
    { recursive: true }
  );

  await fs.mkdir(
    resultsDir,
    { recursive: true }
  );

  const extension =
    path.extname(originalName).toLowerCase();

  const baseName =
    path.basename(
      originalName,
      extension
    )
    .replace(/[^a-zA-Z0-9_-]/g, "_");

  const jobId =
    `${baseName}_${Date.now()}`;

  const inputName =
    `${jobId}${extension}`;

  const inputPath =
    path.join(
      incomingDir,
      inputName
    );

  const resultPath =
    path.join(
      resultsDir,
      `${jobId}.json`
    );

  await fs.writeFile(
    inputPath,
    buffer
  );

  return {
    jobId,
    inputName,
    inputPath,
    resultPath
  };
};

export const processInvoiceController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    // ==========================================
    // 1. CHECK UPLOADED FILE
    // ==========================================

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Invoice file is required."
      });
    }

    console.log("\n======================================");
    console.log("📥 INVOICE RECEIVED");
    console.log("======================================");

    console.log(
      "File:",
      req.file.originalname
    );

    // ==========================================
    // 2. CREATE CV JOB
    // ==========================================

    const job = await createCVJob(
      req.file.buffer,
      req.file.originalname
    );

    console.log(
      "🧠 CV Job:",
      job.jobId
    );

    console.log(
      "📂 Sent to Jupyter:"
    );

    console.log(
      job.inputPath
    );

    console.log(
      "⏳ Waiting for OpenCV + OCR..."
    );

    // ==========================================
    // 3. WAIT FOR JUPYTER RESULT
    // ==========================================

    const startTime = Date.now();

    let cvResult: any = null;

    while (
      Date.now() - startTime < 120000
    ) {

      try {

        const resultData =
          await fs.readFile(
            job.resultPath,
            "utf-8"
          );

        cvResult =
          JSON.parse(resultData);

        break;

      } catch {

        await new Promise(
          resolve =>
            setTimeout(resolve, 1000)
        );

      }
    }

    // ==========================================
    // 4. JUPYTER TIMEOUT
    // ==========================================

    if (!cvResult) {

      console.log(
        "❌ Jupyter processing timed out."
      );

      return res.status(504).json({

        success: false,

        message:
          "Computer Vision processing timed out. Please make sure the Jupyter notebook is running."
      });
    }

    console.log(
      "✅ Jupyter processing completed."
    );

    // ==========================================
    // 5. GET CV DATA
    // ==========================================

    const fields =
      cvResult.fields || {};

    console.log(
      "📊 Extracted fields:",
      fields
    );

    // ==========================================
    // 6. CONVERT CV RESULT INTO YOUR
    //    EXISTING ExtractedInvoice STRUCTURE
    // ==========================================

    const subtotal =
      Number(
        String(
          fields.subtotal || "0"
        )
        .replace(/,/g, "")
        .replace(/₹/g, "")
        .trim()
      );

    const tax =
      Number(
        String(
          fields.tax || "0"
        )
        .replace(/,/g, "")
        .replace(/₹/g, "")
        .trim()
      );

    const grandTotal =
      Number(
        String(
          fields.totalAmount || "0"
        )
        .replace(/,/g, "")
        .replace(/₹/g, "")
        .trim()
      );

    const extracted = {

  invoiceNumber:
    fields.invoiceNumber || "",

  invoiceDate:
    fields.invoiceDate || "",

  dueDate:
    fields.dueDate || "",

  poNumber:
    fields.poNumber || "",

  supplier: {
    name:
      fields.supplier || "",

    address:
      fields.supplierAddress || "",

    gstin:
      fields.gstin || ""
  },

  customer: {
    name:
      fields.customer || "",

    gstin:
      fields.customerGstin || ""
  },

  items:
    fields.items || [],

  financials: {

    subtotal,

    cgst:
      Number(fields.cgst || 0),

    sgst:
      Number(fields.sgst || 0),

    igst:
      Number(fields.igst || 0),

    totalTax:
      tax,

    grandTotal,

    currency: "INR"
  },

  confidence:
    Number(cvResult.confidence || 0),

  extractionMethod:
    "OpenCV + Tesseract OCR"
};

    // ==========================================
    // 7. VALIDATE
    // ==========================================

    const validation =
      await validateInvoice(
        extracted
      );

    console.log(
      "🔎 Validation:",
      validation.status
    );

    // ==========================================
    // 8. SAVE TO MONGODB
    // ==========================================

    const savedInvoice =
      await createInvoice({

        ...extracted,

        validationStatus:
          validation.status,

        validationIssues:
          validation.issues,

        sourceFileName:
          req.file.originalname,

        // Store CV information
        cvProcessing: {

          jobId:
            job.jobId,

          ocrCount:
            cvResult.ocrCount || 0,

          annotatedImage:
            cvResult.annotatedImage || "",

          extractionMethod:
            "OpenCV + Tesseract OCR"
        }
      });

    console.log(
      "💾 Invoice saved to MongoDB."
    );

    // ==========================================
    // 9. SEND RESPONSE TO FRONTEND
    // ==========================================

    return res.status(201).json({

      success: true,

      message:
        "Invoice processed successfully using OpenCV + OCR.",

      data:
        savedInvoice,

      cv: {

        jobId:
          job.jobId,

        ocrCount:
          cvResult.ocrCount || 0,

        annotatedImage:
          cvResult.annotatedImage || "",

        extractionMethod:
          "OpenCV + Tesseract OCR"
      }

    });

  } catch (error) {

    console.error(
      "❌ Invoice processing error:",
      error
    );

    next(error);
  }
};

export const createInvoiceController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const invoice = req.body;

    const validation = await validateInvoice(invoice);

    const savedInvoice = await createInvoice({
      ...invoice,
      validationStatus: validation.status,
      validationIssues: validation.issues
    });

    res.status(201).json({
      success: true,
      data: savedInvoice
    });
  } catch (error) {
    next(error);
  }
};

export const getInvoicesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const search =
      typeof req.query.search === "string"
        ? req.query.search
        : undefined;

    const status =
      typeof req.query.status === "string"
        ? req.query.status
        : undefined;

    const invoices = await getInvoices(
      search,
      status
    );

    res.json({
      success: true,
      count: invoices.length,
      data: invoices
    });
  } catch (error) {
    next(error);
  }
};

export const getInvoiceController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const invoice = await getInvoiceById(
       String(req.params.id)
    );

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found."
      });
    }

    res.json({
      success: true,
      data: invoice
    });
  } catch (error) {
    next(error);
  }
};

export const getAnalyticsController = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const analytics = await getAnalytics();

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    next(error);
  }
};

export const exportInvoicesController = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const invoices = await Invoice.find()
      .sort({ createdAt: -1 });

    const csv = invoicesToCsv(invoices);

    res.setHeader(
      "Content-Type",
      "text/csv"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="involens-invoices.csv"'
    );

    res.send(csv);
  } catch (error) {
    next(error);
  }
};