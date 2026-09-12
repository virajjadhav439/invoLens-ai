import { useEffect, useMemo, useState } from "react";
import {
  Search,
  FileText,
  SlidersHorizontal,
  ArrowUpRight,
  Inbox,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

type InvoiceStatus =
  | "VALID"
  | "WARNING"
  | "DUPLICATE"
  | "ANOMALY";

interface Invoice {
  _id: string;
  invoiceNumber: string;
  invoiceDate: string;
  supplier?: {
    name?: string;
  };
  financials?: {
    grandTotal?: number;
  };
  validationStatus: InvoiceStatus;
  confidence?: number;
  poNumber?: string;
}

const statusStyles: Record<
  InvoiceStatus,
  string
> = {
  VALID:
    "bg-emerald-50 text-emerald-700 border-emerald-100",
  WARNING:
    "bg-amber-50 text-amber-700 border-amber-100",
  DUPLICATE:
    "bg-rose-50 text-rose-700 border-rose-100",
  ANOMALY:
    "bg-violet-50 text-violet-700 border-violet-100",
};

const statusDot: Record<
  InvoiceStatus,
  string
> = {
  VALID: "bg-emerald-500",
  WARNING: "bg-amber-500",
  DUPLICATE: "bg-rose-500",
  ANOMALY: "bg-violet-500",
};

const InvoiceHistory = () => {
  const navigate = useNavigate();

  const [invoices, setInvoices] =
    useState<Invoice[]>([]);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState<"ALL" | InvoiceStatus>("ALL");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        setLoading(true);

        const response = await api.get("/invoices");

console.log("INVOICE API RESPONSE:", response.data);

const responseData = response.data;

const invoiceData =
  responseData?.data?.invoices ||
  responseData?.data ||
  responseData?.invoices ||
  responseData ||
  [];

setInvoices(
  Array.isArray(invoiceData)
    ? invoiceData
    : []
);
      } catch (err) {
        console.error(err);
        setError(
          "Failed to load invoice history."
        );
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, []);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const query =
        search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        invoice.invoiceNumber
          ?.toLowerCase()
          .includes(query) ||
        invoice.supplier?.name
          ?.toLowerCase()
          .includes(query);

      const matchesStatus =
        status === "ALL" ||
        invoice.validationStatus === status;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [invoices, search, status]);

  const formatCurrency = (
    value = 0
  ) =>
    `₹${value.toLocaleString("en-IN")}`;

  const formatDate = (
    value: string
  ) =>
    new Date(value).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  return (
    <div className="mx-auto w-full max-w-350 px-4 py-6 sm:px-6 lg:px-8">

      {/* Header */}

      <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
            <FileText size={14} />
            Database
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            Invoice History
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Search and review every processed invoice.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 shadow-sm">
          <FileText size={14} />
          {filteredInvoices.length} invoices
        </div>

      </div>

      {/* Table Card */}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        {/* Filters */}

        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:p-5 lg:flex-row">

          <div className="relative flex-1">

            <Search
              size={17}
              className="
                pointer-events-none
                absolute
                left-3.5
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search invoice or supplier..."
              className="
                h-11
                w-full
                rounded-xl
                border
                border-slate-200
                bg-slate-50/50
                pl-10
                pr-4
                text-sm
                text-slate-800
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-indigo-300
                focus:bg-white
                focus:ring-4
                focus:ring-indigo-50
              "
            />

          </div>

          <div className="relative">

            <SlidersHorizontal
              size={15}
              className="
                pointer-events-none
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value as
                    | "ALL"
                    | InvoiceStatus
                )
              }
              className="
                h-11
                w-full
                appearance-none
                rounded-xl
                border
                border-slate-200
                bg-slate-50/50
                pl-9
                pr-9
                text-sm
                font-medium
                text-slate-600
                outline-none
                focus:border-indigo-300
                focus:ring-4
                focus:ring-indigo-50
                sm:w-48
              "
            >
              <option value="ALL">
                All Status
              </option>
              <option value="VALID">
                Valid
              </option>
              <option value="WARNING">
                Warning
              </option>
              <option value="DUPLICATE">
                Duplicate
              </option>
              <option value="ANOMALY">
                Anomaly
              </option>
            </select>

          </div>

        </div>

        {/* Error */}

        {error && (
          <div className="m-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Responsive table */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-212.5">

            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">

                <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Invoice
                </th>

                <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Supplier
                </th>

                <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Date
                </th>

                <th className="px-5 py-3.5 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Total
                </th>

                <th className="px-5 py-3.5 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Status
                </th>

                <th className="px-5 py-3.5 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  AI
                </th>

                <th className="px-5 py-3.5 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Action
                </th>

              </tr>
            </thead>

            <tbody>

              {loading ? (
                Array.from({ length: 6 }).map(
                  (_, index) => (
                    <tr
                      key={index}
                      className="border-b border-slate-100"
                    >
                      {Array.from({
                        length: 7,
                      }).map(
                        (_, cell) => (
                          <td
                            key={cell}
                            className="px-5 py-5"
                          >
                            <div className="h-4 animate-pulse rounded-lg bg-slate-100" />
                          </td>
                        )
                      )}
                    </tr>
                  )
                )
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-20 text-center"
                  >
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-300">
                      <Inbox size={22} />
                    </div>

                    <p className="mt-4 text-sm font-semibold text-slate-700">
                      No invoices found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Try changing your search or filter.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map(
                  (invoice) => (
                    <tr
                      key={invoice._id}
                      className="
                        group
                        border-b
                        border-slate-100
                        transition-colors
                        hover:bg-indigo-50/30
                      "
                    >

                      {/* Invoice */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-transform duration-200 group-hover:scale-105">
                            <FileText size={16} />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {invoice.invoiceNumber}
                            </p>

                            <p className="mt-0.5 text-[11px] text-slate-400">
                              {invoice.poNumber || "No PO"}
                            </p>
                          </div>

                        </div>

                      </td>

                      {/* Supplier */}

                      <td className="px-5 py-4">

                        <p className="text-sm font-medium text-slate-700">
                          {invoice.supplier?.name ||
                            "Unknown supplier"}
                        </p>

                      </td>

                      {/* Date */}

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {formatDate(
                          invoice.invoiceDate
                        )}
                      </td>

                      {/* Total */}

                      <td className="px-5 py-4 text-right text-sm font-semibold text-slate-800">
                        {formatCurrency(
                          invoice.financials
                            ?.grandTotal || 0
                        )}
                      </td>

                      {/* Status */}

                      <td className="px-5 py-4 text-center">

                        <span
                          className={`
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-full
                            border
                            px-2.5
                            py-1
                            text-[10px]
                            font-bold
                            ${statusStyles[
                              invoice.validationStatus
                            ]}
                          `}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${statusDot[
                              invoice.validationStatus
                            ]}`}
                          />

                          {invoice.validationStatus}
                        </span>

                      </td>

                      {/* Confidence */}

                      <td className="px-5 py-4 text-center">

                        <span className="text-sm font-semibold text-slate-600">
                          {Math.round(
                            (invoice.confidence || 0) *
                              100
                          )}
                          %
                        </span>

                      </td>

                      {/* View */}

                      <td className="px-5 py-4 text-right">

                        <button
                          onClick={() =>
                            navigate(
                              `/invoices/${invoice._id}`
                            )
                          }
                          className="
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            px-3
                            py-2
                            text-xs
                            font-semibold
                            text-slate-600
                            shadow-sm
                            transition-all
                            duration-200
                            hover:-translate-y-0.5
                            hover:border-indigo-200
                            hover:text-indigo-600
                            hover:shadow-md
                            active:scale-[0.98]
                          "
                        >
                          View
                          <ArrowUpRight size={14} />
                        </button>

                      </td>

                    </tr>
                  )
                )
              )}

            </tbody>

          </table>

        </div>

        {/* Footer */}

        {!loading &&
          filteredInvoices.length > 0 && (
            <div className="flex flex-col justify-between gap-2 border-t border-slate-100 bg-slate-50/30 px-5 py-3 text-xs text-slate-400 sm:flex-row sm:items-center">
              <span>
                Showing{" "}
                <strong className="text-slate-600">
                  {filteredInvoices.length}
                </strong>{" "}
                of{" "}
                <strong className="text-slate-600">
                  {invoices.length}
                </strong>{" "}
                invoices
              </span>

              <span>
                Data synchronized with InvoLens database
              </span>
            </div>
          )}

      </div>

    </div>
  );
};

export default InvoiceHistory;