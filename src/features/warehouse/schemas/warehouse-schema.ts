import { z } from "zod";
import { TEMPERATURE_CONTROLLED, type WarehouseType } from "../constants";

const REQUIRED = "Trường này là bắt buộc.";
const PHONE_REGEX = /^(0|\+84)\d{9,10}$/;

export const warehouseSchema = z
  .object({
    name: z.string().trim().min(1, REQUIRED),
    code: z.string().trim().optional(),
    type: z.string().min(1, REQUIRED),
    status: z.string().min(1, REQUIRED),
    capacity: z.number({ error: REQUIRED }).positive("Phải lớn hơn 0."),
    usedCapacity: z.number({ error: REQUIRED }).min(0, "Không được âm."),
    capacityUnit: z.string().min(1, REQUIRED),
    temperatureMin: z.number().optional(),
    temperatureMax: z.number().optional(),
    humidityMin: z.number().min(0).max(100, "Tối đa 100%.").optional(),
    humidityMax: z.number().min(0).max(100, "Tối đa 100%.").optional(),
    productGroupIds: z.array(z.string()),
    acceptsExternalStorage: z.boolean(),
    address: z.string().trim().min(1, REQUIRED),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    managerId: z.string().optional(),
    managerName: z.string().trim().optional(),
    managerPhone: z.union([z.literal(""), z.string().trim().regex(PHONE_REGEX, "Số điện thoại không hợp lệ.")]).optional(),
    note: z.string().optional(),
  })
  .superRefine((w, ctx) => {
    if (w.usedCapacity > w.capacity) {
      ctx.addIssue({ code: "custom", path: ["usedCapacity"], message: "Không được lớn hơn sức chứa." });
    }
    const needsTemp = TEMPERATURE_CONTROLLED.includes(w.type as WarehouseType);
    if (needsTemp && w.temperatureMin === undefined) {
      ctx.addIssue({ code: "custom", path: ["temperatureMin"], message: "Bắt buộc với kho mát / lạnh." });
    }
    if (needsTemp && w.temperatureMax === undefined) {
      ctx.addIssue({ code: "custom", path: ["temperatureMax"], message: "Bắt buộc với kho mát / lạnh." });
    }
    if (w.temperatureMin !== undefined && w.temperatureMax !== undefined && w.temperatureMax < w.temperatureMin) {
      ctx.addIssue({ code: "custom", path: ["temperatureMax"], message: "Phải ≥ nhiệt độ tối thiểu." });
    }
    if (w.humidityMin !== undefined && w.humidityMax !== undefined && w.humidityMax < w.humidityMin) {
      ctx.addIssue({ code: "custom", path: ["humidityMax"], message: "Phải ≥ độ ẩm tối thiểu." });
    }
  });

export type WarehouseFormValues = z.infer<typeof warehouseSchema>;

export const EMPTY_WAREHOUSE: WarehouseFormValues = {
  name: "",
  code: "",
  type: "",
  // New warehouses start active; status is only editable afterwards
  status: "ACTIVE",
  capacity: undefined as unknown as number,
  usedCapacity: undefined as unknown as number,
  capacityUnit: "",
  temperatureMin: undefined,
  temperatureMax: undefined,
  humidityMin: undefined,
  humidityMax: undefined,
  productGroupIds: [],
  acceptsExternalStorage: false,
  address: "",
  latitude: undefined,
  longitude: undefined,
  managerId: "",
  managerName: "",
  managerPhone: "",
  note: "",
};
