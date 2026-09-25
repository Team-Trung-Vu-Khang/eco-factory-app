import { EMPTY_WAREHOUSE, type WarehouseFormValues } from "../schemas/warehouse-schema";
import type { Warehouse } from "../types";

export const toWarehouseFormValues = (w?: Warehouse): WarehouseFormValues =>
  !w
    ? EMPTY_WAREHOUSE
    : {
        name: w.name,
        code: w.code ?? "",
        type: w.type,
        status: w.status,
        capacity: w.capacity,
        usedCapacity: w.usedCapacity,
        capacityUnit: w.capacityUnit,
        temperatureMin: w.temperatureMin,
        temperatureMax: w.temperatureMax,
        humidityMin: w.humidityMin,
        humidityMax: w.humidityMax,
        productGroupIds: w.productGroupIds,
        acceptsExternalStorage: w.acceptsExternalStorage,
        address: w.address,
        latitude: w.latitude,
        longitude: w.longitude,
        managerId: w.managerId ?? "",
        managerName: w.managerName ?? "",
        managerPhone: w.managerPhone ?? "",
        note: w.note ?? "",
      };
