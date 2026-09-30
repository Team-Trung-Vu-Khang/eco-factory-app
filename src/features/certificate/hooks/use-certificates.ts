import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useIsFactoryAdmin } from "@/features/viewer";
import { certificateApi, certificateKeys } from "../api/certificate.api";
import type { CertificateFormValues } from "../schemas/certificate-schema";
import type { CertificateListParams } from "../types";

// Admin → /api/admin/factory/certificates (system-wide) · member → /api/factory/certificates (own workspace)

export function useCertificates(params: CertificateListParams) {
  const isAdmin = useIsFactoryAdmin();
  return useQuery({
    queryKey: isAdmin
      ? certificateKeys.adminList(params)
      : certificateKeys.list(params),
    queryFn: () =>
      isAdmin ? certificateApi.adminList(params) : certificateApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useCertificate(id: string | number | undefined) {
  const isAdmin = useIsFactoryAdmin();
  return useQuery({
    queryKey: isAdmin
      ? certificateKeys.adminDetail(id ?? "")
      : certificateKeys.detail(id ?? ""),
    queryFn: () =>
      isAdmin ? certificateApi.adminGet(id!) : certificateApi.get(id!),
    enabled: id !== undefined && id !== "",
  });
}

export function useCertificateSummary(profileId?: number | string) {
  const isAdmin = useIsFactoryAdmin();
  return useQuery({
    queryKey: isAdmin
      ? certificateKeys.adminSummary(profileId)
      : certificateKeys.summary(),
    queryFn: () =>
      isAdmin
        ? certificateApi.adminSummary(profileId)
        : certificateApi.summary(),
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
  const isAdmin = useIsFactoryAdmin();
  return useMutation({
    mutationFn: (id: string | number) =>
      isAdmin ? certificateApi.adminRemove(id) : certificateApi.remove(id),
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
    queryKey: certificateKeys.adminSummary(profileId),
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
