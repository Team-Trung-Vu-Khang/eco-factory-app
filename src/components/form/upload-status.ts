import { createContext, useCallback, useContext, useMemo, useState } from "react";

export interface UploadStatus {
  isUploading: boolean;
  /** Pass to `onUploadingChange` of upload fields */
  track: (uploading: boolean) => void;
}

export const UploadStatusContext = createContext<UploadStatus>({ isUploading: false, track: () => {} });

/** Counts in-flight uploads inside a form so submit can wait for them */
export function useUploadStatusState(): UploadStatus {
  const [count, setCount] = useState(0);
  const track = useCallback((uploading: boolean) => setCount((c) => Math.max(0, c + (uploading ? 1 : -1))), []);
  return useMemo(() => ({ isUploading: count > 0, track }), [count, track]);
}

export const useUploadStatus = () => useContext(UploadStatusContext);
