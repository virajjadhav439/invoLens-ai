import dotenv from "dotenv";

dotenv.config();

import app from "./app";
import { connectDatabase } from "./config/db";

const PORT =
  Number(process.env.PORT) || 5000;

const startServer = async () => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(
      `InvoLens API running on http://localhost:${PORT}`
    );
  });
};

startServer();