import type { ReactNode } from "react";
import { UploadStatusContext, type UploadStatus } from "./upload-status";

export function UploadStatusProvider({ value, children }: { value: UploadStatus; children: ReactNode }) {
  return <UploadStatusContext.Provider value={value}>{children}</UploadStatusContext.Provider>;
}
