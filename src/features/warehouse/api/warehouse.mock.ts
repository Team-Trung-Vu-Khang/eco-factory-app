import type { WarehouseFormValues } from "../schemas/warehouse-schema";

const base = { code: "", humidityMin: undefined, humidityMax: undefined, note: "", managerId: "", managerPhone: "" };

export const SEED_WAREHOUSES: WarehouseFormValues[] = [
  { ...base, name: "Kho lạnh số 1", code: "KL-01", type: "COLD", status: "ACTIVE", capacity: 50, usedCapacity: 32, capacityUnit: "TON", temperatureMin: 2, temperatureMax: 8, humidityMin: 85, humidityMax: 95, productGroupIds: ["FRUIT", "VEGETABLE"], acceptsExternalStorage: true, address: "Khu B, KCN Đoan Hùng, Phú Thọ", latitude: 21.6283, longitude: 105.1845, managerId: "p1", managerName: "Nguyễn Văn An", managerPhone: "0912000111" },
  { ...base, name: "Kho thành phẩm", code: "KT-01", type: "DRY", status: "ACTIVE", capacity: 120, usedCapacity: 95, capacityUnit: "TON", temperatureMin: undefined, temperatureMax: undefined, productGroupIds: ["TEA", "HERB"], acceptsExternalStorage: false, address: "Khu A, KCN Đoan Hùng, Phú Thọ", latitude: 21.6291, longitude: 105.1851, managerId: "p2", managerName: "Lê Thị Bình", managerPhone: "0987222333" },
  { ...base, name: "Kho đông -18°C", code: "KD-01", type: "FROZEN", status: "MAINTENANCE", capacity: 400, usedCapacity: 0, capacityUnit: "PALLET", temperatureMin: -22, temperatureMax: -18, productGroupIds: ["FRUIT"], acceptsExternalStorage: true, address: "Khu C, KCN Đoan Hùng, Phú Thọ", latitude: undefined, longitude: undefined, managerName: "" },
  { ...base, name: "Silo ngũ cốc", code: "SL-01", type: "SILO", status: "ACTIVE", capacity: 300, usedCapacity: 120, capacityUnit: "TON", temperatureMin: undefined, temperatureMax: undefined, productGroupIds: ["GRAIN"], acceptsExternalStorage: true, address: "Xã Đoan Hùng, Phú Thọ", latitude: undefined, longitude: undefined, managerId: "p3", managerName: "Trần Văn Cường" },
];
