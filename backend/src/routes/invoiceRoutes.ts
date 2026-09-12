import { Router } from "express";

import {
  processInvoiceController,
  createInvoiceController,
  getInvoicesController,
  getInvoiceController,
  getAnalyticsController,
  exportInvoicesController
} from "../controllers/invoiceController";

import { upload } from "../middleware/uploadMiddleware";

const router = Router();

router.get(
  "/analytics",
  getAnalyticsController
);

router.get(
  "/export",
  exportInvoicesController
);

router.get(
  "/",
  getInvoicesController
);

router.get(
  "/:id",
  getInvoiceController
);

router.post(
  "/process",
  upload.single("file"),
  processInvoiceController
);

router.post(
  "/",
  createInvoiceController
);

export default router;