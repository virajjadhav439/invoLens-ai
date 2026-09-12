import dotenv from "dotenv";

dotenv.config();

import { connectDatabase } from "../config/db";
import { Invoice } from "../models/Invoice";
import { dummyInvoices } from "./dummyInvoices";

const seed = async () => {
  await connectDatabase();

  await Invoice.deleteMany({});

  await Invoice.insertMany(dummyInvoices);

  console.log(
    `Inserted ${dummyInvoices.length} invoices`
  );

  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});