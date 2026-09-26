// TODO: load from master-data API (shared with MEVI Farms)

export interface CropGroup {
  id: string;
  name: string;
}

export interface Crop {
  id: string;
  name: string;
  groupId: string;
}

export const CROP_GROUPS: CropGroup[] = [
  { id: "TEA_PLANT", name: "Cây chè" },
  { id: "VEGETABLE_PLANT", name: "Rau màu" },
  { id: "FRUIT_TREE", name: "Cây ăn quả" },
  { id: "MEDICINAL_PLANT", name: "Cây dược liệu" },
  { id: "FOOD_CROP", name: "Cây lương thực" },
  { id: "INDUSTRIAL_CROP", name: "Cây công nghiệp" },
  { id: "SPICE_PLANT", name: "Cây gia vị" },
];

export const CROPS: Crop[] = [
  { id: "SHAN_TEA", name: "Chè Shan tuyết", groupId: "TEA_PLANT" },
  { id: "GREEN_TEA", name: "Chè xanh", groupId: "TEA_PLANT" },
  { id: "CABBAGE", name: "Bắp cải", groupId: "VEGETABLE_PLANT" },
  { id: "TOMATO", name: "Cà chua", groupId: "VEGETABLE_PLANT" },
  { id: "SWEET_POTATO", name: "Khoai lang", groupId: "VEGETABLE_PLANT" },
  { id: "PINEAPPLE", name: "Dứa", groupId: "FRUIT_TREE" },
  { id: "ORANGE", name: "Cam", groupId: "FRUIT_TREE" },
  { id: "PLUM", name: "Mận", groupId: "FRUIT_TREE" },
  { id: "LONGAN", name: "Nhãn", groupId: "FRUIT_TREE" },
  { id: "MANGO", name: "Xoài", groupId: "FRUIT_TREE" },
  { id: "DURIAN", name: "Sầu riêng", groupId: "FRUIT_TREE" },
  { id: "GINSENG", name: "Sâm", groupId: "MEDICINAL_PLANT" },
  { id: "ARTICHOKE", name: "Atiso", groupId: "MEDICINAL_PLANT" },
  { id: "RICE", name: "Lúa", groupId: "FOOD_CROP" },
  { id: "CORN", name: "Ngô", groupId: "FOOD_CROP" },
  { id: "COFFEE", name: "Cà phê", groupId: "INDUSTRIAL_CROP" },
  { id: "CINNAMON", name: "Quế", groupId: "SPICE_PLANT" },
  { id: "CARDAMOM", name: "Thảo quả", groupId: "SPICE_PLANT" },
];

export const cropGroupName = (id: string) => CROP_GROUPS.find((g) => g.id === id)?.name ?? id;
export const getCropName = (id: string) => CROPS.find((c) => c.id === id)?.name ?? id;

export const CROP_GROUP_OPTIONS = CROP_GROUPS.map((g) => ({ value: g.id, label: g.name }));

export const cropOptionsInGroup = (groupId: string) => CROPS.filter((c) => c.groupId === groupId).map((c) => ({ value: c.id, label: c.name }));

export const CROP_OPTIONS = CROPS.map((c) => ({ value: c.id, label: `${c.name} (${cropGroupName(c.groupId)})` }));
