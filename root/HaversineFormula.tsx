// utils/haversine.ts
export interface Coordinates {
    latitude: number;
    longitude: number;
  }
  
  export const haversineDistance = (coords1: Coordinates, coords2: Coordinates): number => {
    const toRad = (value: number): number => (value * Math.PI) / 180;
  
    const R = 3958.8; // Radius of the Earth in miles
  
    const dLat = toRad(coords2.latitude - coords1.latitude);
    const dLon = toRad(coords2.longitude - coords1.longitude);
  
    const lat1 = toRad(coords1.latitude);
    const lat2 = toRad(coords2.latitude);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return R * c; // Distance in miles
  };
  