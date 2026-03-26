import { apiClient } from "../utils/apiClient";

/**
 * Upload and process a PDF as a guest user.
 * The file is sent directly to the backend — no Supabase Storage or DB involvement.
 */
export async function uploadAndProcessPdfAsGuest(file: File) {
  if (!file) {
    throw new Error("No file provided for upload");
  }

  const formData = new FormData();
  formData.append("file", file);

  const result = await apiClient.post("/statements/process-guest", formData);

  return {
    journeys: result.dayGroups,
    fares: result.fares,
  };
}

export async function uploadAndProcessPdf(file: File) {
  if (!file) {
    throw new Error("No file provided for upload");
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    // Backend does everything: upload → parse → calculate → insert
    const result = await apiClient.post("/statements/process", formData);

    return {
      journeys: result.dayGroups,
      fares: result.fares,
    };
  } catch (error) {
    console.error("Error in uploadAndProcessPdf:", error);

    throw error;
  }
}
