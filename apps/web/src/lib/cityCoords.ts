// City → [lon, lat]. Mirrors the API's COORDS table, used for the dark world-map.
export const CITY_COORDS: Record<string, [number, number]> = {
  'Ho Chi Minh': [106.6297, 10.8231],
  Rotterdam: [4.4777, 51.9244],
  Mumbai: [72.8777, 19.076],
  London: [-0.1276, 51.5074],
  Frankfurt: [8.6821, 50.1109],
  'New York': [-74.006, 40.7128],
  Shanghai: [121.4737, 31.2304],
  'Long Beach': [-118.1937, 33.767],
  Antwerp: [4.4025, 51.2194],
  Santos: [-46.3322, -23.9608],
  Madrid: [-3.7038, 40.4168],
  Paris: [2.3522, 48.8566],
  Lyon: [4.8357, 45.764],
  Milan: [9.19, 45.4642],
  Shenzhen: [114.0579, 22.5431],
  Berlin: [13.405, 52.52],
  Istanbul: [28.9784, 41.0082],
  Chicago: [-87.6298, 41.8781],
  'San Francisco': [-122.4194, 37.7749],
  Austin: [-97.7431, 30.2672],
  Yokohama: [139.6425, 35.4437],
  Hamburg: [9.9937, 53.5511],
  Singapore: [103.8198, 1.3521],
  'Los Angeles': [-118.2437, 34.0522],
};

export function coordsFor(city: string): [number, number] | null {
  return CITY_COORDS[city] ?? null;
}
