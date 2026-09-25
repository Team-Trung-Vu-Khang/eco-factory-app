import type { CapacityUnit, Factory, Machine } from "@/features/factory";
import type { QuantityUnit, SearchScope } from "../constants";
import type { Demand } from "../types";

// TODO: matching belongs to the backend (spec §5); this mirrors it for the mock API

/** Province adjacency for the mock province list (new 2-level boundaries) */
const NEIGHBORS: Record<string, string[]> = {
  HN: ["PT", "NB"],
  TQ: ["LC", "PT"],
  PT: ["HN", "TQ", "LC", "NB"],
  LC: ["TQ", "PT"],
  NB: ["HN", "PT"],
  LD: [],
};

const inScope = (scope: SearchScope, from: string, to: string) => {
  if (scope === "SAME_PROVINCE") return from === to;
  if (scope === "NEIGHBOR_PROVINCES") return from === to || (NEIGHBORS[from] ?? []).includes(to);
  return true;
};

/** Great-circle distance in km, undefined when either side has no GPS */
const distanceKm = (a: { latitude?: number; longitude?: number }, b: { latitude?: number; longitude?: number }) => {
  if (a.latitude == null || a.longitude == null || b.latitude == null || b.longitude == null) return undefined;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.latitude - a.latitude);
  const dLng = rad(b.longitude - a.longitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
};

// Lots / batches have no fixed weight (spec §6 q6) → capacity check is skipped for them
const QUANTITY_KG: Partial<Record<QuantityUnit, number>> = { KG: 1, TON: 1000 };
// Assumes an 8-hour working day
const CAPACITY_KG_PER_DAY: Partial<Record<CapacityUnit, number>> = { KG_PER_HOUR: 8, KG_PER_DAY: 1, TON_PER_DAY: 1000 };

/** Machine free window overlaps the needed window; open-ended bounds count as available */
const overlaps = (m: Machine, from: string, to?: string) =>
  (!m.availableTo || m.availableTo >= from) && (!m.availableFrom || !to || m.availableFrom <= to);

export interface FactoryMatch {
  factory: Factory;
  /** Hard-filter failures; empty = suggested */
  reasons: string[];
  machines: Machine[];
  distanceKm?: number;
  timeFits: boolean;
  /** Days to process the whole quantity with matching machines; undefined when units can't be converted */
  estimatedDays?: number;
}

export function matchFactory(demand: Demand, factory: Factory, today: string): FactoryMatch {
  const reasons: string[] = [];
  const machines = factory.machines.filter(
    (m) =>
      m.status === "ACTIVE" &&
      m.availableCapacity > 0 &&
      m.productGroupIds.includes(demand.productGroupId) &&
      m.functions.some((f) => demand.services.includes(f)),
  );
  const covered = new Set(machines.flatMap((m) => m.functions));
  const validCerts = new Set(factory.certifications.filter((c) => !c.expiryDate || c.expiryDate >= today).map((c) => c.type));

  if (!factory.hasAvailableCapacity) reasons.push("Không có công suất cho bên ngoài");
  else if (machines.length === 0) reasons.push("Không có máy phù hợp nông sản / dịch vụ");
  else {
    const missing = demand.services.filter((s) => !covered.has(s));
    if (missing.length) reasons.push(`Thiếu dịch vụ: ${missing.length}/${demand.services.length}`);
  }
  const missingCerts = demand.requiredCertifications.filter((c) => !validCerts.has(c));
  if (missingCerts.length) reasons.push("Thiếu chứng nhận còn hạn");
  if (!inScope(demand.searchScope, demand.materialLocation.provinceCode, factory.location.provinceCode)) {
    reasons.push("Ngoài phạm vi tìm kiếm");
  }

  const qtyFactor = QUANTITY_KG[demand.quantityUnit];
  const perDay = machines.reduce<number | undefined>((sum, m) => {
    const f = CAPACITY_KG_PER_DAY[m.capacityUnit];
    return sum === undefined || f === undefined ? undefined : sum + m.availableCapacity * f;
  }, machines.length ? 0 : undefined);

  return {
    factory,
    reasons,
    machines,
    distanceKm: distanceKm(demand.materialLocation, factory.location),
    timeFits: machines.some((m) => overlaps(m, demand.neededFrom, demand.neededTo)),
    estimatedDays: qtyFactor && perDay ? Math.ceil((demand.quantity * qtyFactor) / perDay) : undefined,
  };
}

/** Suggested first (distance → time fit → faster capacity), then excluded ones */
export function rankFactories(demand: Demand, factories: Factory[], today = new Date().toISOString().slice(0, 10)) {
  const all = factories.map((f) => matchFactory(demand, f, today));
  const byRank = (a: FactoryMatch, b: FactoryMatch) =>
    (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity) ||
    Number(b.timeFits) - Number(a.timeFits) ||
    (a.estimatedDays ?? Infinity) - (b.estimatedDays ?? Infinity);
  return {
    suggested: all.filter((m) => m.reasons.length === 0).sort(byRank),
    excluded: all.filter((m) => m.reasons.length > 0),
  };
}
