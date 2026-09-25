import { useMutation } from "@tanstack/react-query";
import { uploadFile } from "../api/storage.api";

export function useUploadFile(folder?: string) {
  return useMutation({
    mutationFn: (file: File) => uploadFile(file, folder),
  });
}
