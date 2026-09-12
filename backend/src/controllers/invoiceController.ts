import { Request, Response, NextFunction } from "express";

import {
  Invoice
} from "../models/Invoice";

import {
  processInvoice
} from "../services/aiService";

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

export const processInvoiceController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Invoice file is required."
      });
    }

    const extracted = await processInvoice(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    const validation = await validateInvoice(
      extracted
    );

    const savedInvoice = await createInvoice({
      ...extracted,
      validationStatus: validation.status,
      validationIssues: validation.issues,
      sourceFileName: req.file.originalname
    });

    return res.status(201).json({
      success: true,
      message: "Invoice processed successfully.",
      data: savedInvoice
    });

  } catch (error) {
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