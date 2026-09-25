import type { ProductFormValues } from "../schemas/product-schema";

const img = (id: string) => `https://images.unsplash.com/${id}?w=400`;

export const SEED_PRODUCTS: ProductFormValues[] = [
  {
    images: [img("photo-1556679343-c7306c1976bc")], name: "Chè Shan tuyết sấy khô", sku: "CST-100", productGroupId: "TEA", status: "ACTIVE",
    description: "Chè Shan tuyết cổ thụ, sao sấy thủ công.", rawMaterials: "Búp chè Shan tuyết tươi",
    processingServices: ["PRE_PROCESSING", "DRYING", "PACKAGING"],
    packagings: [{ id: "pk1", name: "Túi zip", netWeight: 100, weightUnit: "G", price: 120000 }, { id: "pk2", name: "Hộp giấy", netWeight: 250, weightUnit: "G", price: 280000 }],
    shelfLifeValue: 12, shelfLifeUnit: "MONTH", storageConditions: "Nơi khô ráo, tránh ánh nắng", outputCapacity: 500, outputUnit: "KG_PER_MONTH",
    certificateIds: [], isNewlyDeveloped: false, launchedAt: "",
  },
  {
    images: [img("photo-1615485290382-441e4d049cb5")], name: "Bột gừng sấy lạnh", sku: "BG-050", productGroupId: "SPICE", status: "ACTIVE",
    description: "", rawMaterials: "Gừng tươi Lào Cai",
    processingServices: ["WASHING", "DRYING", "GRINDING", "PACKAGING"],
    packagings: [{ id: "pk3", name: "Hũ thủy tinh", netWeight: 50, weightUnit: "G", price: 65000 }],
    shelfLifeValue: 18, shelfLifeUnit: "MONTH", storageConditions: "", outputCapacity: 200, outputUnit: "KG_PER_MONTH",
    certificateIds: [], isNewlyDeveloped: true, launchedAt: "2026-06-15",
  },
  {
    images: [img("photo-1600271886742-f049cd451bba")], name: "Nước ép dứa nguyên chất", sku: "ND-330", productGroupId: "FRUIT", status: "PAUSED",
    description: "", rawMaterials: "Dứa Queen Ninh Bình",
    processingServices: ["WASHING", "PRESSING", "PACKAGING"],
    packagings: [{ id: "pk4", name: "Chai", netWeight: 330, weightUnit: "ML", price: 25000 }],
    shelfLifeValue: 30, shelfLifeUnit: "DAY", storageConditions: "Bảo quản 2–8°C", outputCapacity: 3000, outputUnit: "UNIT_PER_MONTH",
    certificateIds: [], isNewlyDeveloped: true, launchedAt: "2026-08-01",
  },
];
