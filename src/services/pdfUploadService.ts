import { supabase } from "../supabase";
import { apiClient } from "../utils/apiClient";
import { generateFileHash } from "../utils/generateFileHash";

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

  // Generate SHA-256 hash of PDF file to prevent duplicate PDF uploads by the same user
  const fileHash = await generateFileHash(file);

  const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const storageFilePath = `${userId}/${fileHash}-${sanitizedFilename}`;

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
        .createSignedUrl(storageFilePath, 300); // 5 minutes

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
      fileHash
    });

    return {
      journeys: result.dayGroups, // Backend returns dayGroups, map to journeys for backward compatibility
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
