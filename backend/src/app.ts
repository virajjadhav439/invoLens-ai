import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import invoiceRoutes from "./routes/invoiceRoutes";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieParser(
    process.env.COOKIE_SECRET
  )
);

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "InvoLens AI backend is running"
  });
});

app.use(
  "/api/invoices",
  invoiceRoutes
);

export default app;