function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function calculateTimeToTravel(distance: number, speed: number): number {
  const timeInSeconds = distance / speed;
  return timeInSeconds * 1000;
}

function getCurrentPosition(): { lat: number; lng: number; alt: number } {
  const lat = 37.7749 + (Math.random() - 0.5) * 0.01;
  const lng = -122.4194 + (Math.random() - 0.5) * 0.01;
  const alt = Math.floor(Math.random() * 200);
  return { lat, lng, alt };
}

function calculateTotalDistance(
  waypoints: { lat: number; lng: number }[]
): number {
  let totalDistance = 0;

  for (let i = 1; i < waypoints.length; i++) {
    const prevWaypoint = waypoints[i - 1];
    const currentWaypoint = waypoints[i];

    totalDistance += calculateDistance(
      prevWaypoint.lat,
      prevWaypoint.lng,
      currentWaypoint.lat,
      currentWaypoint.lng
    );
  }

  return totalDistance;
}

export {
  calculateDistance,
  calculateTimeToTravel,
  getCurrentPosition,
  calculateTotalDistance,
};
