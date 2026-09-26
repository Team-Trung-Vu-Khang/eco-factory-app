type Point = { latitude?: number; longitude?: number };

/** Great-circle distance in km, undefined when either side has no GPS */
export const distanceKm = (a: Point, b: Point) => {
  if (a.latitude == null || a.longitude == null || b.latitude == null || b.longitude == null) return undefined;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.latitude - a.latitude);
  const dLng = rad(b.longitude - a.longitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
};
