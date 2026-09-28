import dayjs from "dayjs";
import type { CertificateFormValues } from "../schemas/certificate-schema";

const d = (offsetDays: number) => dayjs().add(offsetDays, "day").format("YYYY-MM-DD");
const SAMPLE_IMG = "https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=400";

// factoryId matches SEED_FACTORIES (f-1…f-20); numbers mirror each factory's
// own `certifications`. Certificate numbers are sample data.
export const SEED_CERTIFICATES: CertificateFormValues[] = [
  { type: "FOOD_SAFETY", standardName: "Giấy chứng nhận cơ sở đủ điều kiện ATTP", number: "58/2024/NNPTNT-HG", issuer: "DARD", issuedDate: d(-575), expiryDate: d(520), factoryId: "f-1", scopeDescription: "Sơ chế, sấy, sao và đóng gói chè Shan tuyết", files: [SAMPLE_IMG], note: "" },
  { type: "OTHER", standardName: "OCOP 4 sao – Hồng trà Shan tuyết", number: "OCOP-HG-2023-112", issuer: "DARD", issuedDate: d(-1050), expiryDate: d(48), factoryId: "f-1", scopeDescription: "Sản phẩm hồng trà Shan tuyết cổ thụ", files: [SAMPLE_IMG], note: "Chuẩn bị hồ sơ đánh giá lại" },
  { type: "HACCP", standardName: "HACCP CODEX 2020", number: "HACCP-TQ-2023-0412", issuer: "QUACERT", issuedDate: d(-770), expiryDate: d(-39), factoryId: "f-2", scopeDescription: "Chế biến chè đen OTD, chè xanh", files: [SAMPLE_IMG], note: "Đã hết hạn — đang tái đánh giá" },
  { type: "ISO", standardName: "ISO 22000:2018", number: "ISO22000-PT-0877", issuer: "BV", issuedDate: d(-627), expiryDate: d(468), factoryId: "f-4", scopeDescription: "Chế biến và bảo quản chè đen CTC", files: [SAMPLE_IMG], note: "" },
  { type: "HACCP", standardName: "HACCP CODEX 2020", number: "HACCP-PT-2024-0021", issuer: "BV", issuedDate: d(-627), expiryDate: d(468), factoryId: "f-4", scopeDescription: "Chế biến chè đen CTC", files: [SAMPLE_IMG], note: "" },
  { type: "GMP", standardName: "GACP-WHO", number: "GACP-WHO-LC-019", issuer: "VFA", issuedDate: d(-850), expiryDate: d(64), factoryId: "f-5", scopeDescription: "Trồng, thu hái và sơ chế dược liệu", files: [SAMPLE_IMG], note: "" },
  { type: "ISO", standardName: "ISO 22000:2018", number: "ISO22000-YB-2211", issuer: "SGS", issuedDate: d(-534), expiryDate: d(561), factoryId: "f-6", scopeDescription: "Chế biến quế, hồi và tinh dầu", files: [SAMPLE_IMG], note: "" },
  { type: "OTHER", standardName: "USDA Organic", number: "USDA-ORG-VN-0931", issuer: "CU", issuedDate: d(-392), expiryDate: d(-27), factoryId: "f-6", scopeDescription: "Quế hữu cơ Văn Yên", files: [SAMPLE_IMG], note: "Hết hạn" },
  { type: "HACCP", standardName: "HACCP CODEX 2020", number: "HACCP-SL-2024-0056", issuer: "VINACERT", issuedDate: d(-591), expiryDate: d(505), factoryId: "f-7", scopeDescription: "Chế biến chè ô long, chè xanh", files: [SAMPLE_IMG], note: "" },
  { type: "OTHER", standardName: "Rainforest Alliance", number: "RA-VN-SL-2023-14", issuer: "OTHER", issuedDate: d(-881), expiryDate: d(63), factoryId: "f-7", scopeDescription: "Vùng nguyên liệu chè Mộc Châu", files: [SAMPLE_IMG], note: "" },
  { type: "FOOD_SAFETY", standardName: "Giấy chứng nhận cơ sở đủ điều kiện ATTP", number: "12/2023/ATTP-SL", issuer: "DARD", issuedDate: d(-1362), expiryDate: d(-266), factoryId: "f-8", scopeDescription: "Chế biến chè xanh", files: [SAMPLE_IMG], note: "Hết hạn" },
  { type: "HACCP", standardName: "HACCP CODEX 2020", number: "HACCP-NB-2024-0156", issuer: "QUACERT", issuedDate: d(-506), expiryDate: d(589), factoryId: "f-9", scopeDescription: "Chế biến dứa, nước ép cô đặc, rau quả đông lạnh", files: [SAMPLE_IMG], note: "" },
  { type: "ISO", standardName: "FSSC 22000 v6", number: "FSSC22000-NB-0342", issuer: "SGS", issuedDate: d(-1093), expiryDate: d(3), factoryId: "f-9", scopeDescription: "Rau quả đóng hộp và đông lạnh", files: [SAMPLE_IMG], note: "Sắp hết hạn" },
  { type: "ISO", standardName: "BRCGS Food Safety", number: "BRC-NA-2024-1182", issuer: "BV", issuedDate: d(-819), expiryDate: d(-454), factoryId: "f-10", scopeDescription: "Puree và nước cốt chanh leo", files: [SAMPLE_IMG], note: "Hết hạn" },
  { type: "HACCP", standardName: "HACCP CODEX 2020", number: "HACCP-NA-2024-0301", issuer: "BV", issuedDate: d(-819), expiryDate: d(276), factoryId: "f-10", scopeDescription: "Chế biến chanh leo, dứa, nhãn", files: [SAMPLE_IMG], note: "" },
  { type: "OTHER", standardName: "4C Coffee", number: "4C-VN-DL-0098", issuer: "CU", issuedDate: d(-941), expiryDate: d(154), factoryId: "f-11", scopeDescription: "Cà phê nhân Robusta bền vững", files: [SAMPLE_IMG], note: "" },
  { type: "HACCP", standardName: "HACCP CODEX 2020", number: "HACCP-DL-2022-0077", issuer: "VINACERT", issuedDate: d(-1580), expiryDate: d(-484), factoryId: "f-11", scopeDescription: "Rang xay cà phê", files: [SAMPLE_IMG], note: "Hết hạn" },
  { type: "ISO", standardName: "ISO 9001:2015", number: "ISO9001-DL-5521", issuer: "TUV", issuedDate: d(-970), expiryDate: d(126), factoryId: "f-12", scopeDescription: "Chế biến cà phê nhân xuất khẩu", files: [SAMPLE_IMG], note: "" },
  { type: "FOOD_SAFETY", standardName: "Giấy chứng nhận cơ sở đủ điều kiện ATTP", number: "31/2024/ATTP-LĐ", issuer: "DARD", issuedDate: d(-515), expiryDate: d(580), factoryId: "f-13", scopeDescription: "Chế biến chè xanh, ô long", files: [SAMPLE_IMG], note: "" },
  { type: "ISO", standardName: "ISO 22000:2018", number: "ISO22000-LD-1043", issuer: "QUACERT", issuedDate: d(-1123), expiryDate: d(-27), factoryId: "f-14", scopeDescription: "Trà túi lọc, cà phê rang xay", files: [SAMPLE_IMG], note: "Hết hạn" },
  { type: "ISO", standardName: "ISO 22000:2018", number: "ISO22000-LD-0715", issuer: "QUACERT", issuedDate: d(-362), expiryDate: d(734), factoryId: "f-15", scopeDescription: "Rượu vang, nước ép trái cây", files: [SAMPLE_IMG], note: "" },
  { type: "OTHER", standardName: "GLOBALG.A.P", number: "GGN-4063061234567", issuer: "CU", issuedDate: d(-301), expiryDate: d(-301 + 365), factoryId: "f-16", scopeDescription: "Rau ăn lá, dâu tây", files: [SAMPLE_IMG], note: "" },
  { type: "FOOD_SAFETY", standardName: "Giấy chứng nhận cơ sở đủ điều kiện ATTP", number: "44/2024/ATTP-LĐ", issuer: "DARD", issuedDate: d(-586), expiryDate: d(510), factoryId: "f-16", scopeDescription: "Sơ chế rau, củ, quả", files: [SAMPLE_IMG], note: "" },
  { type: "HACCP", standardName: "HACCP CODEX 2020", number: "HACCP-AG-2024-0098", issuer: "NAFIQAD", issuedDate: d(-563), expiryDate: d(533), factoryId: "f-18", scopeDescription: "Rau quả đông lạnh IQF", files: [SAMPLE_IMG], note: "" },
  { type: "ISO", standardName: "BRCGS Food Safety", number: "BRC-AG-2024-0442", issuer: "SGS", issuedDate: d(-563), expiryDate: d(-198), factoryId: "f-18", scopeDescription: "Rau quả đông lạnh IQF", files: [SAMPLE_IMG], note: "Hết hạn" },
  { type: "ISO", standardName: "ISO 9001:2015", number: "ISO9001-AG-0019", issuer: "TUV", issuedDate: d(-1001), expiryDate: d(95), factoryId: "f-19", scopeDescription: "Sấy, xay xát và lau bóng gạo", files: [SAMPLE_IMG], note: "" },
  { type: "HACCP", standardName: "HACCP CODEX 2020", number: "HACCP-AG-2023-0310", issuer: "QUACERT", issuedDate: d(-911), expiryDate: d(-180), factoryId: "f-19", scopeDescription: "Chế biến gạo", files: [SAMPLE_IMG], note: "Hết hạn" },
  { type: "OTHER", standardName: "EU Organic", number: "EU-ORG-VN-CT-0021", issuer: "CU", issuedDate: d(-484), expiryDate: d(94), factoryId: "f-20", scopeDescription: "Gạo hữu cơ ST25", files: [SAMPLE_IMG], note: "" },
];
