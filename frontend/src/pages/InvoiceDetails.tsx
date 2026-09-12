import {
  useEffect,
  useState
} from "react";

import {
  useParams
} from "react-router-dom";

import api from "../services/api";

import type { Invoice } from "../types/invoice";

import StatusBadge from "../components/StatusBadge";
import Loading from "../components/Loading";

const InvoiceDetails = () => {
  const { id } = useParams();

  const [invoice, setInvoice] =
    useState<Invoice | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response =
          await api.get(
            `/invoices/${id}`
          );

        setInvoice(
          response.data.data
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
      <div className="error-box">
        Invoice not found.
      </div>
    );
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            INVOICE DETAILS
          </span>

          <h2>
            {invoice.invoiceNumber}
          </h2>

          <p>
            {invoice.sourceFileName ||
              "Uploaded invoice"}
          </p>
        </div>

        <div className="details-status">
          <StatusBadge
            status={
              invoice.validationStatus
            }
          />

          <div className="confidence">
            AI Confidence:{" "}
            <strong>
              {Math.round(
                invoice.confidence * 100
              )}
              %
            </strong>
          </div>
        </div>
      </div>

      <div className="detail-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Invoice Metadata</h3>
            </div>
          </div>

          <div className="metadata-grid">
            <div>
              <span>Invoice Number</span>
              <strong>
                {invoice.invoiceNumber}
              </strong>
            </div>

            <div>
              <span>Invoice Date</span>
              <strong>
                {invoice.invoiceDate}
              </strong>
            </div>

            <div>
              <span>Due Date</span>
              <strong>
                {invoice.dueDate}
              </strong>
            </div>

            <div>
              <span>PO Number</span>
              <strong>
                {invoice.poNumber ||
                  "Not available"}
              </strong>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3>Supplier</h3>
          </div>

          <div className="party-card">
            <strong>
              {invoice.supplier.name}
            </strong>

            <span>
              {invoice.supplier.address}
            </span>

            <span>
              GSTIN:{" "}
              {invoice.supplier.gstin ||
                "Missing"}
            </span>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3>Customer</h3>
          </div>

          <div className="party-card">
            <strong>
              {invoice.customer.name}
            </strong>

            <span>
              GSTIN:{" "}
              {invoice.customer.gstin ||
                "Missing"}
            </span>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h3>Line Items</h3>
            <span>
              Extracted invoice items
            </span>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Tax</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {invoice.items.map(
                (item, index) => (
                  <tr key={index}>
                    <td>
                      {item.description}
                    </td>

                    <td>
                      {item.quantity}
                    </td>

                    <td>
                      ₹
                      {item.unitPrice.toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td>
                      ₹
                      {item.tax.toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td>
                      <strong>
                        ₹
                        {item.total.toLocaleString(
                          "en-IN"
                        )}
                      </strong>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bottom-grid">
        <div className="panel">
          <div className="panel-header">
            <h3>Validation</h3>
          </div>

          {invoice.validationIssues.length ===
          0 ? (
            <div className="success-box">
              ✓ No validation issues detected.
            </div>
          ) : (
            <div className="issues">
              {invoice.validationIssues.map(
                (issue, index) => (
                  <div
                    className="issue-row"
                    key={index}
                  >
                    <strong>
                      {issue.type}
                    </strong>

                    <span>
                      {issue.message}
                    </span>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        <div className="panel financial-panel">
          <div className="panel-header">
            <h3>Financial Summary</h3>
          </div>

          <div className="financial-row">
            <span>Subtotal</span>
            <strong>
              ₹
              {invoice.financials.subtotal.toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>

          <div className="financial-row">
            <span>CGST</span>
            <strong>
              ₹
              {invoice.financials.cgst.toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>

          <div className="financial-row">
            <span>SGST</span>
            <strong>
              ₹
              {invoice.financials.sgst.toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>

          <div className="financial-row">
            <span>IGST</span>
            <strong>
              ₹
              {invoice.financials.igst.toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>

          <div className="financial-total">
            <span>Grand Total</span>

            <strong>
              ₹
              {invoice.financials.grandTotal.toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceDetails;