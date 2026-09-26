import dayjs from "dayjs";
import type { CertificateFormValues } from "../schemas/certificate-schema";

const d = (offsetDays: number) => dayjs().add(offsetDays, "day").format("YYYY-MM-DD");
const SAMPLE_IMG = "https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=400";

export const SEED_CERTIFICATES: CertificateFormValues[] = [
  { type: "HACCP", standardName: "HACCP CODEX 2020", number: "HACCP-VN-2024-0156", issuer: "BV", issuedDate: d(-400), expiryDate: d(700), factoryId: "f-1", scopeDescription: "Sơ chế, sấy và đóng gói chè khô", files: [SAMPLE_IMG], note: "" },
  { type: "FOOD_SAFETY", standardName: "Giấy chứng nhận cơ sở đủ điều kiện ATTP", number: "125/2023/ATTP-CNĐK", issuer: "DARD", issuedDate: d(-1050), expiryDate: d(45), factoryId: "f-1", scopeDescription: "", files: [SAMPLE_IMG], note: "Chuẩn bị hồ sơ gia hạn" },
  { type: "ISO", standardName: "ISO 22000:2018", number: "QC-22000-0981", issuer: "QUACERT", issuedDate: d(-1200), expiryDate: d(-20), factoryId: "f-5", scopeDescription: "Kho lạnh bảo quản trái cây", files: [SAMPLE_IMG], note: "" },
  { type: "GMP", standardName: "GMP-WHO", number: "GMP-2025-011", issuer: "VFA", issuedDate: d(-90), expiryDate: "", factoryId: "f-3", scopeDescription: "Chế biến dược liệu khô", files: [SAMPLE_IMG], note: "" },
];
