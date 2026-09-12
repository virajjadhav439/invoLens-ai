import { useRef, useState } from "react";
import {
  CheckCircle2,
  FileText,
  UploadCloud,
  X,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const UploadInvoice = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const selectFile = (selectedFile: File) => {
    setError("");

    const allowed = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    if (!allowed.includes(selectedFile.type)) {
      setError("Please upload a PDF, JPG or PNG invoice.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB.");
      return;
    }

    setFile(selectedFile);
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selected = event.target.files?.[0];

    if (selected) {
      selectFile(selected);
    }
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    setDragging(false);

    const droppedFile = event.dataTransfer.files?.[0];

    if (droppedFile) {
      selectFile(droppedFile);
    }
  };

  const processInvoice = async () => {
  if (!file) return;

  try {
    setProcessing(true);
    setError("");

    const formData = new FormData();

    formData.append("file", file);

    const response = await api.post(
      "/invoices/process",
      formData
    );

    const invoiceId =
      response.data?.data?._id ||
      response.data?.invoice?._id ||
      response.data?._id;

    if (invoiceId) {
      navigate(`/invoices/${invoiceId}`);
    } else {
      setError(
        "Invoice was processed, but no invoice ID was returned."
      );
    }
  } catch (err: any) {
    console.error("Invoice processing error:", err);

    const backendMessage =
      err?.response?.data?.message;

    setError(
      backendMessage ||
        "Unable to process this invoice. Please try again."
    );
  } finally {
    setProcessing(false);
  }
};

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">

      {/* Header */}

      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
          <Sparkles size={14} />
          AI Extraction
        </div>

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              Upload Invoice
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Upload an invoice and let InvoLens extract,
              validate and organize the information automatically.
            </p>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 shadow-sm sm:flex">
            <ShieldCheck
              size={14}
              className="text-emerald-500"
            />
            Secure processing
          </div>

        </div>
      </div>

      {/* Main */}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">

        {/* Upload Card */}

        <div className="rounded-e-md border border-slate-200 bg-white p-4 shadow-sm sm:p-6">

          <div
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`
              group
              relative
              flex
              min-h-97.5
              cursor-pointer
              flex-col
              items-center
              justify-center
              overflow-hidden
              rounded-sm
              border-2
              border-dashed
              px-6
              py-12
              text-center
              transition-all
              duration-300

              ${
                dragging
                  ? "border-indigo-400 bg-indigo-50/70 scale-[1.01]"
                  : "border-slate-200 bg-slate-50/60 hover:border-indigo-300 hover:bg-indigo-50/30"
              }
            `}
          >

            {/* Decorative glow */}

            <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-indigo-100/50 blur-3xl" />

            <div
              className="
                relative
                mb-5
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                border
                border-indigo-100
                bg-white
                text-indigo-600
                shadow-sm
                transition-all
                duration-300
                group-hover:-translate-y-1
                group-hover:scale-105
                group-hover:shadow-md
              "
            >
              <UploadCloud size={28} strokeWidth={1.7} />
            </div>

            <h2 className="relative text-lg font-semibold text-slate-900">
              {dragging
                ? "Drop your invoice here"
                : "Drop your invoice here"}
            </h2>

            <p className="relative mt-2 text-sm text-slate-500">
              or click anywhere to browse files
            </p>

            <div className="relative mt-5 flex flex-wrap justify-center gap-2">
              {["PDF", "JPG", "PNG"].map((type) => (
                <span
                  key={type}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-500"
                >
                  {type}
                </span>
              ))}

              <span className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-500">
                Max 10MB
              </span>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
            />

          </div>

          {/* Selected file */}

          {file && (
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white text-indigo-600 shadow-sm">
                <FileText size={19} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {file.name}
                </p>

                <p className="mt-0.5 text-xs text-slate-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              <button
                onClick={(event) => {
                  event.stopPropagation();
                  setFile(null);
                }}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-slate-700"
              >
                <X size={17} />
              </button>

            </div>
          )}

          {/* Error */}

          {error && (
            <div className="mt-4 rounded-md border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Process button */}

          <button
            onClick={processInvoice}
            disabled={!file || processing}
            className="
              mt-5
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-md
              bg-slate-950
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              shadow-lg
              shadow-slate-900/10
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:bg-slate-800
              active:scale-[0.98]
              disabled:cursor-not-allowed
              disabled:opacity-40
              disabled:hover:translate-y-0
            "
          >
            {processing ? (
              <>
                <Loader2
                  size={17}
                  className="animate-spin"
                />
                Processing invoice...
              </>
            ) : (
              <>
                Process Invoice
                <ArrowRight size={17} />
              </>
            )}
          </button>

        </div>

        {/* Side information */}

        <div className="space-y-4">

          <div className="rounded-e-md border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-indigo-50 text-indigo-600">
                <Sparkles size={18} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  What happens next?
                </h3>

                <p className="text-xs text-slate-400">
                  Automated invoice intelligence
                </p>
              </div>
            </div>

            <div className="space-y-4">

              {[
                ["01", "Extract", "Invoice data is structured automatically."],
                ["02", "Validate", "GST and financial rules are checked."],
                ["03", "Analyze", "Anomalies and duplicates are detected."],
                ["04", "Store", "Clean data is saved to your database."],
              ].map(([number, title, description]) => (
                <div
                  key={number}
                  className="flex gap-3"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[10px] font-bold text-slate-500">
                    {number}
                  </span>

                  <div>
                    <p className="text-xs font-semibold text-slate-800">
                      {title}
                    </p>

                    <p className="mt-0.5 text-[11px] leading-5 text-slate-400">
                      {description}
                    </p>
                  </div>
                </div>
              ))}

            </div>

          </div>

          

        </div>

      </div>
    </div>
  );
};

export default UploadInvoice;