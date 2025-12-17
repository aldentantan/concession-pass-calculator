import { supabase } from "../supabase";
import { apiClient } from "../utils/apiClient";

export async function uploadAndProcessPdf(file: File) {
  if (!file) {
    throw new Error("No file provided for upload");
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const statementId = crypto.randomUUID();
  const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const storageFilePath = `${userId}/${statementId}-${sanitizedFilename}`;

  try {
    // Upload PDF to Supabase storage bucket
    const { error: uploadError } = await supabase.storage
      .from("simplygo-pdf")
      .upload(storageFilePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Create signed URL for backend to download the PDF
    const { data: signedUrlData, error: signedUrlError } =
      await supabase.storage
        .from("simplygo-pdf")
        .createSignedUrl(storageFilePath, 3600); // 1 hour

    if (signedUrlError || !signedUrlData) {
      console.log("Signed URL error:", signedUrlError);
      throw new Error("Failed to create signed URL");
    }

    // Backend does everything: download → parse → calculate → insert
    const result = await apiClient.post("/statements/process", {
      userId,
      signedUrl: signedUrlData.signedUrl,
      storageFilePath,
      fileName: file.name,
    });

    return {
      journeys: result.journeys,
      fares: result.fares,
    };
  } catch (error) {
    console.error("Error in uploadAndProcessPdf:", error);

    // Cleanup on error
    await supabase.storage
      .from("simplygo-pdf")
      .remove([storageFilePath])
      .catch(console.error);

    throw error;
  }
}
