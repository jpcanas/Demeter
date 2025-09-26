import axios from "axios";
import { useState } from "react";

export type UploadStatus = "idle" | "uploading" | "success" | "error";

export function useFileUploadHandler() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<UploadStatus>("idle");

  async function handleFileUpload(
    file: File | null,
    apiUploadUrl: string
  ): Promise<void> {
    if (!file) return;

    setStatus("uploading");
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(apiUploadUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(progress);
        },
      });

      setStatus("success");
      setUploadProgress(100);
    } catch {
      setStatus("error");
      setUploadProgress(0);
    }
  }

  return { handleFileUpload, status, uploadProgress };
}
