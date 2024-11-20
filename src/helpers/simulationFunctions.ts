function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

// Function to calculate the time to travel between two waypoints based on distance and speed
function calculateTimeToTravel(distance: number, speed: number): number {
  const timeInSeconds = distance / speed; // Assuming speed is in meters per second
  return timeInSeconds * 1000; // Convert to milliseconds
}

function getCurrentPosition(): { lat: number; lng: number; alt: number } {
  // Simulate random position within a range (e.g., around a specific location)
  const lat = 37.7749 + (Math.random() - 0.5) * 0.01; // San Francisco area (latitude)
  const lng = -122.4194 + (Math.random() - 0.5) * 0.01; // San Francisco area (longitude)
  const alt = Math.floor(Math.random() * 200); // Random altitude (0 to 200 meters)
  return { lat, lng, alt };
}

// Function to calculate the total distance between waypoints
function calculateTotalDistance(
  waypoints: { lat: number; lng: number }[]
): number {
  let totalDistance = 0;

  for (let i = 1; i < waypoints.length; i++) {
    const prevWaypoint = waypoints[i - 1];
    const currentWaypoint = waypoints[i];

    // Calculate distance between two consecutive waypoints
    totalDistance += calculateDistance(
      prevWaypoint.lat,
      prevWaypoint.lng,
      currentWaypoint.lat,
      currentWaypoint.lng
    );
  }

  return totalDistance; // Return distance in kilometers
}

export {
  calculateDistance,
  calculateTimeToTravel,
  getCurrentPosition,
  calculateTotalDistance,
};
