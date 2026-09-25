import { env } from "@/config/env";

const GOONG_API_URL = "https://rsapi.goong.io";

export interface GoongCompound {
  province?: string;
  district?: string;
  commune?: string;
}

export interface PlacePrediction {
  place_id: string;
  description: string;
}

export interface ResolvedPlace {
  address: string;
  latitude: number;
  longitude: number;
  compound: GoongCompound;
}

async function goongGet<T>(path: string, params: Record<string, string>, signal?: AbortSignal): Promise<T> {
  const url = new URL(`${GOONG_API_URL}${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  if (env.goongApiKey) url.searchParams.set("api_key", env.goongApiKey);
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Goong ${path} ${res.status}`);
  return res.json() as Promise<T>;
}

export const goongApi = {
  async autocomplete(input: string, signal?: AbortSignal): Promise<PlacePrediction[]> {
    const data = await goongGet<{ predictions?: PlacePrediction[] }>("/Place/AutoComplete", { input }, signal);
    return (data.predictions ?? []).slice(0, 6);
  },

  /** AutoComplete has no coordinates → resolve them from Place Detail */
  async placeDetail(placeId: string, fallbackAddress: string): Promise<ResolvedPlace | null> {
    const data = await goongGet<{
      result?: {
        formatted_address?: string;
        geometry?: { location?: { lat: number; lng: number } };
        compound?: GoongCompound;
      };
    }>("/Place/Detail", { place_id: placeId });
    const loc = data.result?.geometry?.location;
    if (!loc || !Number.isFinite(loc.lat) || !Number.isFinite(loc.lng)) return null;
    return {
      address: fallbackAddress || data.result?.formatted_address || "",
      latitude: loc.lat,
      longitude: loc.lng,
      compound: data.result?.compound ?? {},
    };
  },

  async reverseGeocode(latitude: number, longitude: number): Promise<ResolvedPlace | null> {
    const data = await goongGet<{
      results?: { formatted_address?: string; compound?: GoongCompound }[];
    }>("/Geocode", { latlng: `${latitude},${longitude}` });
    const place = data.results?.[0];
    if (!place) return null;
    return {
      address: place.formatted_address ?? "",
      latitude,
      longitude,
      compound: place.compound ?? {},
    };
  },
};
