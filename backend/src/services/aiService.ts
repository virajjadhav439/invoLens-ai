import axios from "axios";
import FormData from "form-data";

import { ExtractedInvoice } from "./validationService";
import { getDummyInvoice } from "../utils/dummyGenerator";

const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL ||
  "http://localhost:8000";

export const processInvoice = async (
  fileBuffer: Buffer,
  fileName: string
): Promise<ExtractedInvoice> => {
  const useRealAI =
    process.env.USE_REAL_AI === "true";

  // ============================================
  // CURRENT MVP
  // ============================================

  if (!useRealAI) {
    return getDummyInvoice(fileName);
  }

  // ============================================
  // FUTURE FASTAPI AI SERVICE
  // ============================================

  const formData = new FormData();

  formData.append(
    "file",
    fileBuffer,
    {
      filename: fileName
    }
  );

  const response =
    await axios.post<ExtractedInvoice>(
      `${AI_SERVICE_URL}/extract`,
      formData,
      {
        headers: {
          ...formData.getHeaders()
        },

        timeout: 60000
      }
    );

  return response.data;
};