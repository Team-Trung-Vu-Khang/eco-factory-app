import type { PageResponse } from "@/features/factory";
import type { CertificateFormValues } from "../schemas/certificate-schema";
import type { Certificate, CertificateListParams, CertificateSummary } from "../types";
import { getCertificateValidity } from "../utils/certificate-validity";
import { SEED_CERTIFICATES } from "./certificate.mock";

export const certificateKeys = {
  all: ["certificates"] as const,
  lists: () => [...certificateKeys.all, "list"] as const,
  list: (params: CertificateListParams) => [...certificateKeys.lists(), params] as const,
  summary: () => [...certificateKeys.all, "summary"] as const,
  detail: (id: string) => [...certificateKeys.all, "detail", id] as const,
};

// ─── In-memory mock ─────────────────────────────────────────────────────────
// TODO: replace with apiClient calls, e.g. apiClient.get("/api/factory/certificates", { params })

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

function toCertificate(values: CertificateFormValues, id: string = crypto.randomUUID()): Certificate {
  return {
    ...(values as unknown as Certificate),
    id,
    ...getCertificateValidity(values.expiryDate),
    updatedAt: new Date().toISOString(),
  };
}

// Stable seed ids so machines can reference them
let db: Certificate[] = SEED_CERTIFICATES.map((c, i) => toCertificate(c, `cert-${i + 1}`));

// Validity depends on "today" → recompute on read
const fresh = (c: Certificate): Certificate => ({ ...c, ...getCertificateValidity(c.expiryDate) });

export const certificateApi = {
  async list(params: CertificateListParams): Promise<PageResponse<Certificate>> {
    await delay();
    const keyword = params.keyword?.trim().toLowerCase();
    const filtered = db
      .map(fresh)
      .filter(
        (c) =>
          (!keyword || [c.number, c.standardName ?? ""].some((v) => v.toLowerCase().includes(keyword))) &&
          (!params.type || c.type === params.type) &&
          (!params.validity || c.validity === params.validity) &&
          (!params.factoryId || c.factoryId === params.factoryId),
      );
    const start = params.page * params.size;
    return {
      content: filtered.slice(start, start + params.size),
      totalElements: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / params.size)),
      page: params.page,
      size: params.size,
    };
  },

  async get(id: string): Promise<Certificate> {
    await delay();
    const found = db.find((c) => c.id === id);
    if (!found) throw new Error("Không tìm thấy chứng nhận.");
    return fresh(found);
  },

  async summary(): Promise<CertificateSummary> {
    await delay(200);
    const all = db.map(fresh);
    return {
      total: all.length,
      valid: all.filter((c) => c.validity === "VALID").length,
      expiringSoon: all.filter((c) => c.validity === "EXPIRING_SOON").length,
      expired: all.filter((c) => c.validity === "EXPIRED").length,
    };
  },

  async create(values: CertificateFormValues): Promise<Certificate> {
    await delay();
    const created = toCertificate(values);
    db = [created, ...db];
    return created;
  },

  async update(id: string, values: CertificateFormValues): Promise<Certificate> {
    await delay();
    if (!db.some((c) => c.id === id)) throw new Error("Không tìm thấy chứng nhận.");
    const updated = toCertificate(values, id);
    db = db.map((c) => (c.id === id ? updated : c));
    return updated;
  },

  async remove(id: string): Promise<void> {
    await delay();
    db = db.filter((c) => c.id !== id);
  },
};
