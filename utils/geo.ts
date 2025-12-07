export interface UserLocation {
  latitude: number;
  longitude: number;
}

export interface RouteStep {
  instruction: string;
  distance: number;
  duration: number;
  coordinates: { latitude: number; longitude: number }[];
}

export interface NavigationInfo {
  totalDistance: number;
  totalDuration: number;
  steps: RouteStep[];
}

export function calculateDistance(
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

export function calculateRealisticRoute(
  start: UserLocation,
  end: { latitude: number; longitude: number }
): NavigationInfo {
  const totalDistance = calculateDistance(
    start.latitude,
    start.longitude,
    end.latitude,
    end.longitude
  );

  const averageSpeed = 30;
  const totalDuration = (totalDistance / averageSpeed) * 60;

  const steps: RouteStep[] = [];
  const numSteps = Math.max(3, Math.floor(totalDistance * 2));

  for (let i = 0; i <= numSteps; i++) {
    const ratio = i / numSteps;
    const lat = start.latitude + (end.latitude - start.latitude) * ratio;
    const lng = start.longitude + (end.longitude - start.longitude) * ratio;

    const curvature = Math.sin(ratio * Math.PI * 4) * 0.001;
    const adjustedLat = lat + curvature;
    const adjustedLng = lng + curvature * 0.5;

    if (i > 0) {
      const prevLat = steps[steps.length - 1]?.coordinates[0]?.latitude ?? start.latitude;
      const prevLng = steps[steps.length - 1]?.coordinates[0]?.longitude ?? start.longitude;
      const stepDistance = calculateDistance(prevLat, prevLng, adjustedLat, adjustedLng);
      const stepDuration = (stepDistance / averageSpeed) * 60;

      let instruction = "";
      if (i % 3 === 0) instruction = "Düz devam et";
      else if (i % 2 === 0) instruction = "Sağa dön";
      else instruction = "Sola dön";

      steps.push({
        instruction,
        distance: stepDistance,
        duration: stepDuration,
        coordinates: [{ latitude: adjustedLat, longitude: adjustedLng }],
      });
    } else {
      steps.push({
        instruction: "Başla",
        distance: 0,
        duration: 0,
        coordinates: [{ latitude: adjustedLat, longitude: adjustedLng }],
      });
    }
  }

  return { totalDistance, totalDuration, steps };
}
