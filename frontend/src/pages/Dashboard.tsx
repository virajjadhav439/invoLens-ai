import {
  useEffect,
  useState
} from "react";

import {
  ArrowUpRight,
  FileCheck2,
  IndianRupee,
  Receipt,
  Store,
  AlertTriangle,
  Upload,
  Download,
  TrendingUp
} from "lucide-react";

import {
  Link
} from "react-router-dom";

import api from "../services/api";

import type {
  Analytics,
  Invoice
} from "../types/invoice";

import StatCard from "../components/StatCard";
import InvoiceTable from "../components/InvoiceTable";
import SpendingChart from "../components/SpendingChart";

const Dashboard = () => {

  const [analytics, setAnalytics] =
    useState<Analytics | null>(null);

  const [recent, setRecent] =
    useState<Invoice[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadDashboard = async () => {

    try {

      setLoading(true);
      setError("");

      const [
        analyticsResponse,
        invoicesResponse
      ] = await Promise.all([

        api.get(
          "/invoices/analytics"
        ),

        api.get(
          "/invoices"
        )

      ]);

      setAnalytics(
        analyticsResponse.data.data
      );

      setRecent(
        invoicesResponse.data.data.slice(
          0,
          5
        )
      );

    } catch (error) {

      console.error(
        "Dashboard error:",
        error
      );

      setError(
        "Unable to connect to the InvoLens API."
      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const exportData = async () => {

    try {

      const response =
        await api.get(
          "/invoices/export",
          {
            responseType: "blob"
          }
        );

      const url =
        URL.createObjectURL(
          response.data
        );

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        "involens-invoices.csv";

      link.click();

      URL.revokeObjectURL(url);

    } catch (error) {

      console.error(
        "Export failed:",
        error
      );

    }

  };

  if (loading) {

    return (
      <div className="
        flex
        min-h-[60vh]
        items-center
        justify-center
      ">

        <div className="
          flex
          flex-col
          items-center
          gap-4
        ">

          <div className="
            processing-ring
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            bg-indigo-50
            text-indigo-600
          ">
            <TrendingUp size={20} />
          </div>

          <p className="
            text-sm
            font-medium
            text-slate-500
          ">
            Loading intelligence...
          </p>

        </div>

      </div>
    );

  }

  if (error) {

    return (
      <div className="
        flex
        min-h-[60vh]
        items-center
        justify-center
      ">

        <div className="
          max-w-md
          rounded-lg
          border
          border-rose-200
          bg-white
          p-8
          text-center
          shadow-sm
        ">

          <div className="
            mx-auto
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            bg-rose-50
            text-rose-600
          ">
            <AlertTriangle size={21} />
          </div>

          <h3 className="
            mt-4
            font-semibold
            text-slate-900
          ">
            Backend connection failed
          </h3>

          <p className="
            mt-2
            text-sm
            text-slate-500
          ">
            Make sure your Express server and
            MongoDB are running.
          </p>

          <button
            onClick={loadDashboard}
            className="
              mt-5
              rounded-md
              bg-slate-900
              px-4
              py-2
              text-xs
              font-semibold
              text-white
              hover:bg-slate-800
            "
          >
            Retry
          </button>

        </div>

      </div>
    );

  }

  if (!analytics) {
    return null;
  }

  return (
    <div className="fade-up space-y-6">

      {/* HERO */}

      <section className="
        relative
        overflow-hidden
        rounded-sm
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
        sm:p-8
      ">

        <div className="
          absolute
          -right-20
          -top-20
          h-64
          w-64
          rounded-full
          bg-indigo-100/50
          blur-3xl
        " />

        <div className="
          absolute
          bottom-0
          right-1/4
          h-32
          w-32
          rounded-full
          bg-blue-100/40
          blur-3xl
        " />

        <div className="
          relative
          flex
          flex-col
          justify-between
          gap-6
          lg:flex-row
          lg:items-center
        ">

          <div>

            <div className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-indigo-100
              bg-indigo-50
              px-3
              py-1.5
              text-[10px]
              font-bold
              uppercase
              tracking-wider
              text-indigo-600
            ">

              <span className="
                h-1.5
                w-1.5
                rounded-full
                bg-indigo-500"
              />

              Intelligence Overview

            </div>

            <h2 className="
              mt-4
              text-3xl
              font-bold
              tracking-tight
              text-slate-950
              sm:text-4xl
            ">
              Good morning, Viraj.
            </h2>

            <p className="
              mt-2
              max-w-xl
              text-sm
              leading-6
              text-slate-500
            ">
              Here's what's happening across
              your invoice data. InvoLens has
              processed{" "}
              <strong className="text-slate-700">
                {analytics.totalInvoices}
              </strong>{" "}
              invoices so far.
            </p>

          </div>

          <div className="
            flex
            flex-col
            gap-2
            sm:flex-row
          ">

            <Link
  to="/upload"
  className="
    inline-flex
    items-center
    justify-center
    gap-2
    rounded-e-md
    bg-slate-950
    px-4
    py-2.5
    text-xs
    font-semibold
    text-white
    shadow-lg
    shadow-slate-900/10
    transition-all
    duration-200
    hover:-translate-y-0.5
    hover:bg-slate-800
    active:scale-[0.98]
  "
>
              <Upload size={15} />
              Upload Invoice
            </Link>

            <button
              onClick={exportData}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-e-md
                border
                border-slate-200
                bg-white
                px-4
                py-2.5
                text-xs
                font-semibold
                text-slate-700
                shadow-sm
                transition
                hover:bg-slate-50
              "
            >
              <Download size={15} />
              Export
            </button>

          </div>

        </div>

      </section>

      {/* STATS */}

      <section className="
        grid
        grid-cols-1
        gap-4
        sm:grid-cols-2
        xl:grid-cols-4
      ">

        <StatCard
          title="Total Invoices"
          value={
            analytics.totalInvoices.toString()
          }
          subtitle="Documents processed"
          icon={Receipt}
        />

        <StatCard
          title="Total Spending"
          value={`₹${analytics.totalSpending.toLocaleString(
            "en-IN"
          )}`}
          subtitle="Across all invoices"
          icon={IndianRupee}
          iconClass="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="Total Tax"
          value={`₹${analytics.totalTax.toLocaleString(
            "en-IN"
          )}`}
          subtitle="GST identified"
          icon={FileCheck2}
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="Flagged Invoices"
          value={
            analytics.flaggedInvoices.toString()
          }
          subtitle={`${analytics.vendorCount} unique vendors`}
          icon={AlertTriangle}
          iconClass="bg-amber-50 text-amber-600"
        />

      </section>

      {/* ANALYTICS */}

      <section className="
        grid
        grid-cols-1
        gap-5
        xl:grid-cols-[1.5fr_1fr]
      ">

        {/* Spending */}

        <div className="
          rounded-lg
          border
          border-slate-200
          bg-white
          shadow-sm
        ">

          <div className="
            flex
            items-center
            justify-between
            border-b
            border-slate-100
            px-5
            py-4
          ">

            <div>

              <h3 className="
                text-sm
                font-semibold
                text-slate-900
              ">
                Spending Overview
              </h3>

              <p className="
                mt-1
                text-[11px]
                text-slate-400
              ">
                Monthly invoice volume
              </p>

            </div>

            <div className="
              flex
              items-center
              gap-1.5
              rounded-lg
              bg-slate-50
              px-2.5
              py-1.5
              text-[10px]
              font-medium
              text-slate-500
            ">
              <TrendingUp size={12} />
              INR
            </div>

          </div>

          <div className="
            flex
            h-64
            items-end
            gap-3
            px-5
            pb-5
            pt-8
          ">

            <SpendingChart
  data={analytics.monthlySpending}
/>

          </div>

        </div>

        {/* Vendors */}

        <div className="
          rounded-lg
          border
          border-slate-200
          bg-white
          shadow-sm
        ">

          <div className="
            flex
            items-center
            justify-between
            border-b
            border-slate-100
            px-5
            py-4
          ">

            <div>

              <h3 className="
                text-sm
                font-semibold
                text-slate-900
              ">
                Top Vendors
              </h3>

              <p className="
                mt-1
                text-[11px]
                text-slate-400
              ">
                Highest invoice value
              </p>

            </div>

            <Store
              size={18}
              className="text-slate-400"
            />

          </div>

          <div className="p-4">

            {analytics.topVendors.map(
              (vendor, index) => (

                <div
                  key={vendor.name}
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-e-md
                    px-2
                    py-3
                    transition
                    hover:bg-slate-50
                  "
                >

                  <div className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-e-md
                    bg-slate-100
                    text-xs
                    font-bold
                    text-slate-500
                  ">
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="
                      truncate
                      text-xs
                      font-semibold
                      text-slate-800
                    ">
                      {vendor.name}
                    </p>

                    <p className="
                      mt-0.5
                      text-[10px]
                      text-slate-400
                    ">
                      Vendor
                    </p>

                  </div>

                  <p className="
                    text-xs
                    font-bold
                    text-slate-700
                  ">
                    ₹
                    {vendor.amount.toLocaleString(
                      "en-IN"
                    )}
                  </p>

                </div>

              )
            )}

          </div>

        </div>

      </section>

      {/* RECENT */}

      <section className="
        overflow-hidden
        rounded-lg
        border
        border-slate-200
        bg-white
        shadow-sm
      ">

        <div className="
          flex
          flex-col
          gap-3
          border-b
          border-slate-100
          px-5
          py-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        ">

          <div>

            <h3 className="
              text-sm
              font-semibold
              text-slate-900
            ">
              Recent Invoices
            </h3>

            <p className="
              mt-1
              text-[11px]
              text-slate-400
            ">
              Latest documents processed by
              InvoLens
            </p>

          </div>

          <Link
            to="/invoices"
            className="
              inline-flex
              items-center
              gap-1
              text-xs
              font-semibold
              text-indigo-600
              hover:text-indigo-700
            "
          >
            View all
            <ArrowUpRight size={14} />
          </Link>

        </div>

        <InvoiceTable
          invoices={recent}
        />

      </section>

    </div>
  );
};

export default Dashboard;