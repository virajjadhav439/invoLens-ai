"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  FileText,
  Hash,
  MapPin,
  Package,
  Receipt,
  ShieldCheck,
  UserRound,
  AlertTriangle,
} from "lucide-react";

import api from "../services/api";

import type { Invoice } from "../types/invoice";

import StatusBadge from "../components/StatusBadge";
import Loading from "../components/Loading";

const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] =
    useState<Invoice | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response =
          await api.get(`/invoices/${id}`);

        setInvoice(
          response.data.data
        );
      } catch (error) {
        console.error(
          "Failed to load invoice:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (!invoice) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-2xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm">
          <FileText
            className="mx-auto mb-4 text-slate-400"
            size={40}
          />

          <h2 className="text-lg font-semibold text-slate-800">
            Invoice not found
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            The requested invoice could not be loaded.
          </p>

          <button
            onClick={() =>
              navigate("/history")
            }
            className="
              mt-5
              rounded-lg
              bg-slate-900
              px-4
              py-2
              text-sm
              font-medium
              text-white
              transition
              hover:bg-slate-800
            "
          >
            Back to History
          </button>
        </div>
      </div>
    );
  }

  const formatCurrency = (
    value: number
  ) =>
    `₹${value.toLocaleString("en-IN")}`;

  const confidence = Math.round(
    invoice.confidence * 100
  );

  return (
    <div className="min-h-screen bg-[#f4f6f8] px-4 py-8 sm:px-6 lg:px-10">

      {/* ─────────────────────────────────────
          Top Controls
      ───────────────────────────────────── */}

      <div
        className="
          mx-auto
          mb-6
          flex
          max-w-[794px]
          items-center
          justify-between
        "
      >
        <button
          onClick={() =>
            navigate("/history")
          }
          className="
            inline-flex
            items-center
            gap-2
            rounded-lg
            border
            border-slate-200
            bg-white
            px-3
            py-2
            text-sm
            font-medium
            text-slate-600
            shadow-sm
            transition
            hover:border-slate-300
            hover:bg-slate-50
            hover:text-slate-900
          "
        >
          <ArrowLeft size={16} />

          Back to History
        </button>

        <div className="hidden items-center gap-2 sm:flex">
          <span className="text-xs text-slate-400">
            Document
          </span>

          <span className="text-xs font-medium text-slate-600">
            {invoice.invoiceNumber}
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────
          A4 PAPER
      ───────────────────────────────────── */}

      <div
        className="A
          mx-auto
          w-full
          max-w-[794px]
          min-h-[1123px]
          overflow-hidden
          rounded-sm
          bg-white
          shadow-[0_12px_45px_rgba(15,23,42,0.12)]
          ring-1
          ring-slate-200/70
        "
      >

        {/* ───────────────────────────────────
            Invoice Header
        ─────────────────────────────────── */}

        <div className="px-8 pb-7 pt-9 sm:px-12 sm:pt-11">

          <div className="flex flex-col justify-between gap-6 sm:flex-row">

            {/* Company */}

            <div>
              <div className="flex items-center gap-3">

                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-indigo-600
                    text-lg
                    font-bold
                    text-white
                    shadow-sm
                  "
                >
                  I
                </div>

                <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900">
                    InvoLens
                  </h1>

                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-500">
                    Invoice Intelligence
                  </p>
                </div>

              </div>
            </div>

            {/* Invoice Title */}

            <div className="text-left sm:text-right">

              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Invoice
              </p>

              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                {invoice.invoiceNumber}
              </h2>

              <div className="mt-3 flex items-center gap-2 sm:justify-end">
                <StatusBadge
                  status={
                    invoice.validationStatus
                  }
                />
              </div>

            </div>
          </div>

          {/* Divider */}

          <div className="mt-8 h-px bg-slate-200" />

          {/* ─────────────────────────────────
              Invoice Information
          ───────────────────────────────── */}

          <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-4">

            <InfoBlock
              icon={<Hash size={14} />}
              label="Invoice Number"
              value={
                invoice.invoiceNumber
              }
            />

            <InfoBlock
              icon={
                <CalendarDays size={14} />
              }
              label="Invoice Date"
              value={
                invoice.invoiceDate
              }
            />

            <InfoBlock
              icon={
                <CalendarDays size={14} />
              }
              label="Due Date"
              value={
                invoice.dueDate
              }
            />

            <InfoBlock
              icon={<Receipt size={14} />}
              label="PO Number"
              value={
                invoice.poNumber ||
                "Not available"
              }
            />

          </div>

        </div>

        {/* ───────────────────────────────────
            Supplier / Customer
        ─────────────────────────────────── */}

        <div className="border-y border-slate-100 bg-slate-50/60 px-8 py-7 sm:px-12">

          <div className="grid gap-8 sm:grid-cols-2">

            {/* Supplier */}

            <PartySection
              title="Supplier"
              icon={
                <Package size={15} />
              }
              name={
                invoice.supplier.name
              }
              address={
                invoice.supplier.address
              }
              gstin={
                invoice.supplier.gstin
              }
            />

            {/* Customer */}

            <PartySection
              title="Bill To"
              icon={
                <UserRound size={15} />
              }
              name={
                invoice.customer.name
              }
              gstin={
                invoice.customer.gstin
              }
            />

          </div>

        </div>

        {/* ───────────────────────────────────
            Line Items
        ─────────────────────────────────── */}

        <div className="px-8 py-8 sm:px-12">

          <SectionHeading
            icon={
              <Package size={16} />
            }
            title="Line Items"
            subtitle="Extracted invoice items"
          />

          <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">

            <table className="w-full text-sm">

              <thead>
                <tr className="bg-slate-50">

                  <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Description
                  </th>

                  <th className="px-3 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Qty
                  </th>

                  <th className="px-3 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Unit Price
                  </th>

                  <th className="px-3 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Tax
                  </th>

                  <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Total
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {invoice.items.map(
                  (item, index) => (
                    <tr
                      key={index}
                      className="bg-white"
                    >

                      <td className="px-4 py-4 font-medium text-slate-800">
                        {item.description}
                      </td>

                      <td className="px-3 py-4 text-center text-slate-600">
                        {item.quantity}
                      </td>

                      <td className="px-3 py-4 text-right text-slate-600">
                        {formatCurrency(
                          item.unitPrice
                        )}
                      </td>

                      <td className="px-3 py-4 text-right text-slate-600">
                        {formatCurrency(
                          item.tax
                        )}
                      </td>

                      <td className="px-4 py-4 text-right font-semibold text-slate-900">
                        {formatCurrency(
                          item.total
                        )}
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* ───────────────────────────────────
            Validation + Financial Summary
        ─────────────────────────────────── */}

        <div className="px-8 pb-8 sm:px-12">

          <div className="grid gap-6 sm:grid-cols-[1fr_280px]">

            {/* Validation */}

            <div>

              <SectionHeading
                icon={
                  <ShieldCheck size={16} />
                }
                title="Validation"
                subtitle="Business rule verification"
              />

              <div className="mt-5">

                {invoice.validationIssues
                  .length === 0 ? (
                  <div
                    className="
                      flex
                      items-start
                      gap-3
                      rounded-xl
                      border
                      border-emerald-200
                      bg-emerald-50
                      px-4
                      py-4
                    "
                  >
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-emerald-600"
                    />

                    <div>
                      <p className="text-sm font-semibold text-emerald-800">
                        No validation issues
                      </p>

                      <p className="mt-0.5 text-xs text-emerald-700">
                        Invoice passed all available validation checks.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">

                    {invoice.validationIssues.map(
                      (issue, index) => (
                        <div
                          key={index}
                          className="
                            flex
                            items-start
                            gap-3
                            rounded-xl
                            border
                            border-amber-200
                            bg-amber-50
                            px-4
                            py-3
                          "
                        >
                          <AlertTriangle
                            size={17}
                            className="mt-0.5 shrink-0 text-amber-600"
                          />

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
                              {issue.type}
                            </p>

                            <p className="mt-1 text-xs leading-5 text-amber-700">
                              {issue.message}
                            </p>
                          </div>
                        </div>
                      )
                    )}

                  </div>
                )}

              </div>

            </div>

            {/* Financial Summary */}

            <div>

              <SectionHeading
                icon={
                  <Receipt size={16} />
                }
                title="Summary"
                subtitle="Invoice amount"
              />

              <div className="mt-5 rounded-xl border border-slate-200 bg-white">

                <div className="space-y-3 px-4 py-4">

                  <FinancialRow
                    label="Subtotal"
                    value={formatCurrency(
                      invoice.financials.subtotal
                    )}
                  />

                  <FinancialRow
                    label="CGST"
                    value={formatCurrency(
                      invoice.financials.cgst
                    )}
                  />

                  <FinancialRow
                    label="SGST"
                    value={formatCurrency(
                      invoice.financials.sgst
                    )}
                  />

                  <FinancialRow
                    label="IGST"
                    value={formatCurrency(
                      invoice.financials.igst
                    )}
                  />

                </div>

                <div className="border-t border-slate-200 bg-slate-50 px-4 py-4">

                  <div className="flex items-end justify-between gap-3">

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        Grand Total
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        {invoice.financials.currency ||
                          "INR"}
                      </p>
                    </div>

                    <p className="text-xl font-bold tracking-tight text-slate-900">
                      {formatCurrency(
                        invoice.financials.grandTotal
                      )}
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ───────────────────────────────────
            AI Extraction Information
        ─────────────────────────────────── */}

        <div className="mx-8 mb-8 rounded-xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 sm:mx-12">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-100">
                <ShieldCheck size={17} />
              </div>

              <div>
                <p className="text-xs font-semibold text-indigo-900">
                  AI Extraction
                </p>

              </div>

            </div>

            <div className="sm:text-right">

              <p className="text-[10px] font-medium uppercase tracking-wider text-indigo-500">
                Confidence
              </p>

              <p className="mt-0.5 text-lg font-bold text-indigo-900">
                {confidence}%
              </p>

            </div>

          </div>

          {/* Confidence bar */}

          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-indigo-100">

            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-700"
              style={{
                width: `${confidence}%`,
              }}
            />

          </div>

        </div>

        {/* ───────────────────────────────────
            Footer
        ─────────────────────────────────── */}

        <div className="border-t border-slate-100 px-8 py-5 sm:px-12">

          <div className="flex flex-col justify-between gap-2 text-[10px] text-slate-400 sm:flex-row">

            <div className="flex items-center gap-2">
              <FileText size={12} />

              <span>
                Source:{" "}
                {invoice.sourceFileName ||
                  "Uploaded invoice"}
              </span>
            </div>

            <span>
              Processed by InvoLens AI
            </span>

          </div>

        </div>

      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   Reusable Components
═══════════════════════════════════════════ */

const InfoBlock = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => {
  return (
    <div className="min-w-0">

      <div className="mb-1.5 flex items-center gap-1.5 text-slate-400">

        {icon}

        <span className="text-[9px] font-semibold uppercase tracking-wider">
          {label}
        </span>

      </div>

      <p className="truncate text-xs font-semibold text-slate-800">
        {value}
      </p>

    </div>
  );
};

const PartySection = ({
  title,
  icon,
  name,
  address,
  gstin,
}: {
  title: string;
  icon: React.ReactNode;
  name: string;
  address?: string;
  gstin?: string;
}) => {
  return (
    <div>

      <div className="mb-3 flex items-center gap-2">

        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-indigo-500 shadow-sm ring-1 ring-slate-200">
          {icon}
        </div>

        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          {title}
        </p>

      </div>

      <div className="pl-0.5">

        <p className="text-sm font-bold text-slate-900">
          {name}
        </p>

        {address && (
          <div className="mt-1.5 flex items-start gap-1.5">

            <MapPin
              size={12}
              className="mt-0.5 shrink-0 text-slate-400"
            />

            <p className="text-xs leading-5 text-slate-500">
              {address}
            </p>

          </div>
        )}

        <p
          className={`mt-1.5 text-[10px] font-medium ${
            gstin
              ? "text-slate-500"
              : "text-rose-500"
          }`}
        >
          GSTIN:{" "}
          {gstin || "Missing"}
        </p>

      </div>

    </div>
  );
};

const SectionHeading = ({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) => {
  return (
    <div className="flex items-center gap-2.5">

      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
        {icon}
      </div>

      <div>

        <h3 className="text-sm font-bold text-slate-900">
          {title}
        </h3>

        <p className="mt-0.5 text-[10px] text-slate-400">
          {subtitle}
        </p>

      </div>

    </div>
  );
};

const FinancialRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  return (
    <div className="flex items-center justify-between gap-3">

      <span className="text-xs text-slate-500">
        {label}
      </span>

      <span className="text-xs font-semibold text-slate-700">
        {value}
      </span>

    </div>
  );
};

export default InvoiceDetails;