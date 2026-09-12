import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import UploadInvoice from "./pages/UploadInvoice";
import InvoiceHistory from "./pages/InvoiceHistory";
import InvoiceDetails from "./pages/InvoiceDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />

          <Route path="/upload" element={<UploadInvoice />} />

          <Route path="/history" element={<InvoiceHistory />} />

          <Route path="/invoices" element={<InvoiceHistory />} />

          <Route path="/invoices/:id" element={<InvoiceDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
