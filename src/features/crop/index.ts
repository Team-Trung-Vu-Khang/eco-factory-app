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
  { id: "GINSENG", name: "Sâm", groupId: "MEDICINAL_PLANT" },
  { id: "ARTICHOKE", name: "Atiso", groupId: "MEDICINAL_PLANT" },
  { id: "RICE", name: "Lúa", groupId: "FOOD_CROP" },
  { id: "CORN", name: "Ngô", groupId: "FOOD_CROP" },
  { id: "COFFEE", name: "Cà phê", groupId: "INDUSTRIAL_CROP" },
  { id: "CINNAMON", name: "Quế", groupId: "SPICE_PLANT" },
  { id: "CARDAMOM", name: "Thảo quả", groupId: "SPICE_PLANT" },
];

/** A product group links to crop groups and/or single crops: "group:<id>" | "crop:<id>" */
export type CropRef = `group:${string}` | `crop:${string}`;

export const groupRef = (id: string) => `group:${id}` as CropRef;
export const cropRef = (id: string) => `crop:${id}` as CropRef;

const cropGroupName = (id: string) => CROP_GROUPS.find((g) => g.id === id)?.name ?? id;
export const getCropName = (id: string) => CROPS.find((c) => c.id === id)?.name ?? id;

export const getCropRefLabel = (ref: string) => {
  const [kind, id] = ref.split(":");
  return kind === "group" ? `Nhóm: ${cropGroupName(id)}` : getCropName(id);
};

/** Crop groups first, then crops labelled with their group */
export const CROP_REF_OPTIONS = [
  ...CROP_GROUPS.map((g) => ({ value: groupRef(g.id), label: `Nhóm: ${g.name}` })),
  ...CROPS.map((c) => ({ value: cropRef(c.id), label: `${c.name} (${cropGroupName(c.groupId)})` })),
];

export const CROP_OPTIONS = CROPS.map((c) => ({ value: c.id, label: `${c.name} (${cropGroupName(c.groupId)})` }));

/** Does a set of refs cover this crop, directly or through its group? */
export const refsCoverCrop = (refs: string[], cropId: string) => {
  const crop = CROPS.find((c) => c.id === cropId);
  return refs.includes(cropRef(cropId)) || (!!crop && refs.includes(groupRef(crop.groupId)));
};
