import {
  useNavigate
} from "react-router-dom";

import {
  ArrowUpRight,
  FileText
} from "lucide-react";

import type {
  Invoice
} from "../types/invoice";

import StatusBadge from "./StatusBadge";

interface Props {
  invoices: Invoice[];
}

const InvoiceTable = ({
  invoices
}: Props) => {

  const navigate =
    useNavigate();

  return (
    <div className="overflow-x-auto">

      <table className="
        w-full
        min-w-190
        border-collapse
      ">

        <thead>

          <tr className="
            border-b
            border-slate-100
            bg-slate-50/70
          ">

            <th className="
              px-5
              py-3
              text-left
              text-[10px]
              font-bold
              uppercase
              tracking-wider
              text-slate-400
            ">
              Invoice
            </th>

            <th className="
              px-5
              py-3
              text-left
              text-[10px]
              font-bold
              uppercase
              tracking-wider
              text-slate-400
            ">
              Supplier
            </th>

            <th className="
              px-5
              py-3
              text-left
              text-[10px]
              font-bold
              uppercase
              tracking-wider
              text-slate-400
            ">
              Date
            </th>

            <th className="
              px-5
              py-3
              text-right
              text-[10px]
              font-bold
              uppercase
              tracking-wider
              text-slate-400
            ">
              Total
            </th>

            <th className="
              px-5
              py-3
              text-left
              text-[10px]
              font-bold
              uppercase
              tracking-wider
              text-slate-400
            ">
              Status
            </th>

            <th className="
              px-5
              py-3
              text-left
              text-[10px]
              font-bold
              uppercase
              tracking-wider
              text-slate-400
            ">
              AI
            </th>

            <th />

          </tr>

        </thead>

        <tbody>

          {invoices.map(
            (invoice) => (

              <tr
                key={invoice._id}
                className="
                  group
                  border-b
                  border-slate-100
                  transition
                  last:border-0
                  hover:bg-slate-50/70
                "
              >

                <td className="px-5 py-4">

                  <div className="
                    flex
                    items-center
                    gap-3
                  ">

                    <div className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-lg
                      bg-indigo-50
                      text-indigo-600
                    ">
                      <FileText size={15} />
                    </div>

                    <div>

                      <p className="
                        text-xs
                        font-bold
                        text-slate-800
                      ">
                        {invoice.invoiceNumber}
                      </p>

                      <p className="
                        mt-0.5
                        text-[10px]
                        text-slate-400
                      ">
                        {invoice.poNumber ||
                          "No PO"}
                      </p>

                    </div>

                  </div>

                </td>

                <td className="
                  px-5
                  py-4
                  text-xs
                  font-medium
                  text-slate-600
                ">
                  {invoice.supplier.name}
                </td>

                <td className="
                  px-5
                  py-4
                  text-xs
                  text-slate-500
                ">
                  {invoice.invoiceDate}
                </td>

                <td className="
                  px-5
                  py-4
                  text-right
                  text-xs
                  font-bold
                  text-slate-800
                ">
                  ₹
                  {invoice.financials.grandTotal.toLocaleString(
                    "en-IN"
                  )}
                </td>

                <td className="px-5 py-4">

                  <StatusBadge
                    status={
                      invoice.validationStatus
                    }
                  />

                </td>

                <td className="
                  px-5
                  py-4
                  text-xs
                  font-semibold
                  text-slate-600
                ">

                  {Math.round(
                    invoice.confidence *
                      100
                  )}
                  %

                </td>

                <td className="px-5 py-4">

                  <button
                    onClick={() =>
                      navigate(
                        `/invoices/${invoice._id}`
                      )
                    }
                    className="
                      inline-flex
                      items-center
                      gap-1
                      rounded-lg
                      border
                      border-slate-200
                      bg-white
                      px-2.5
                      py-1.5
                      text-[10px]
                      font-semibold
                      text-slate-600
                      shadow-sm
                      transition
                      hover:border-indigo-200
                      hover:text-indigo-600
                    "
                  >
                    View
                    <ArrowUpRight size={12} />
                  </button>

                </td>

              </tr>

            )
          )}

        </tbody>

      </table>

      {invoices.length === 0 && (

        <div className="
          flex
          flex-col
          items-center
          justify-center
          py-16
        ">

          <FileText
            size={28}
            className="text-slate-300"
          />

          <p className="
            mt-3
            text-sm
            font-medium
            text-slate-500
          ">
            No invoices found
          </p>

        </div>

      )}

    </div>
  );
};

export default InvoiceTable;