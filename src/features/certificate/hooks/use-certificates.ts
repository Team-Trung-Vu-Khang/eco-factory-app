import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { certificateApi, certificateKeys } from "../api/certificate.api";
import type { CertificateFormValues } from "../schemas/certificate-schema";
import type { CertificateListParams } from "../types";

export function useCertificates(params: CertificateListParams) {
  return useQuery({
    queryKey: certificateKeys.list(params),
    queryFn: () => certificateApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useCertificate(id: string | number | undefined) {
  return useQuery({
    queryKey: certificateKeys.detail(id ?? ""),
    queryFn: () => certificateApi.get(id!),
    enabled: id !== undefined && id !== "",
  });
}

export function useCertificateSummary() {
  return useQuery({
    queryKey: certificateKeys.summary(),
    queryFn: certificateApi.summary,
  });
}

function useInvalidate() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: certificateKeys.all });
}

export function useCreateCertificate() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (v: CertificateFormValues) => certificateApi.create(v),
    onSuccess: invalidate,
  });
}

export function useUpdateCertificate() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string | number;
      values: CertificateFormValues;
    }) => certificateApi.update(id, values),
    onSuccess: invalidate,
  });
}

export function useDeleteCertificate() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (id: string | number) => certificateApi.remove(id),
    onSuccess: invalidate,
  });
}

// ─── ADMIN HOOKS ──────────────────────────────────────────────────
export function useAdminCertificates(params: CertificateListParams) {
  return useQuery({
    queryKey: certificateKeys.adminList(params),
    queryFn: () => certificateApi.adminList(params),
    placeholderData: keepPreviousData,
  });
}

export function useAdminCertificateSummary(profileId?: number | string) {
  return useQuery({
    queryKey: certificateKeys.summary(profileId),
    queryFn: () => certificateApi.adminSummary(profileId),
  });
}

export function useAdminDeleteCertificate() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (id: string | number) => certificateApi.adminRemove(id),
    onSuccess: invalidate,
  });
}
