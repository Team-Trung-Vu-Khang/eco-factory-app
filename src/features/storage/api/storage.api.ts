import { apiClient } from "@/lib/axios";
import type { StorageFileUploadResponse } from "../types";

/** Same endpoint as eco-farm-app. `X-Workspace-Id` is added by apiClient. */
export async function uploadFile(file: File, folder?: string) {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await apiClient.post<StorageFileUploadResponse>(
    "/api/storage/files",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      params: { folder },
    },
  );
  return data;
}
