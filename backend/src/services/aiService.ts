import { ExtractedInvoice } from "./validationService";
import { getDummyInvoice } from "../utils/dummyGenerator";
import { extractInvoiceWithGemini } from "./gemini.service";

export const processInvoice = async (
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<ExtractedInvoice> => {

  const useRealAI =
    process.env.USE_REAL_AI === "true";

  // ============================================
  // DUMMY MODE
  // ============================================

  if (!useRealAI) {
    return getDummyInvoice(fileName);
  }

  // ============================================
  // GEMINI AI
  // ============================================

  const extractedInvoice =
    await extractInvoiceWithGemini(
      fileBuffer,
      mimeType
    );

  return extractedInvoice as ExtractedInvoice;
};