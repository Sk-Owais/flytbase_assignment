// helperFunctions.ts

/**
 * Converts degrees to radians.
 * @param degrees - The degree value to convert.
 * @returns The value in radians.
 */
export function toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }
  
  /**
   * Calculates the Haversine distance between two geographic points.
   * @param lat1 - Latitude of the first point in degrees.
   * @param lon1 - Longitude of the first point in degrees.
   * @param lat2 - Latitude of the second point in degrees.
   * @param lon2 - Longitude of the second point in degrees.
   * @returns The distance between the points in meters.
   */
  export function haversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lon2 - lon1);
  
    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return R * c; // Distance in meters
  }
  
  /**
   * Calculates the time required to travel a certain distance at a given speed.
   * @param distance - The distance to travel in meters.
   * @param speed - The speed in meters per second.
   * @returns The time required to travel the distance in seconds.
   */
  export function calculateTravelTime(distance: number, speed: number): number {
    return distance / speed;
  }
  
  /**
   * Calculates an interpolated value between two numbers based on a fraction.
   * @param start - The starting value.
   * @param end - The ending value.
   * @param fraction - A number between 0 and 1 representing the interpolation fraction.
   * @returns The interpolated value.
   */
  export function interpolate(start: number, end: number, fraction: number): number {
    return start + fraction * (end - start);
  }
  
  /**
   * Simulates a delay for a specified duration.
   * @param ms - The delay duration in milliseconds.
   * @returns A promise that resolves after the specified duration.
   */
  export function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  