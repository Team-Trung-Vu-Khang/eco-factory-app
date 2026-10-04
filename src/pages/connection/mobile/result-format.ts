import type { MarketplaceScheduleItem } from "@/features/connection";
import { CAPACITY_UNIT_LABELS } from "@/features/machine";

const fmt = new Intl.NumberFormat("vi-VN");

export const capacityText = (s: MarketplaceScheduleItem) =>
  `${fmt.format(s.maxCapacity)} ${CAPACITY_UNIT_LABELS[s.capacityUnit] ?? s.capacityUnit}`;
