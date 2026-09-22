import { Carpark, VehicleType } from '../types';

/**
 * Calculates the great-circle distance between two points on the Earth's surface in meters
 */
export function getDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export function formatDistance(meters?: number): string {
  if (meters === undefined || meters === null) return '';
  if (meters < 1000) {
    return `${meters}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

export type AvailabilityStatus = 'ample' | 'moderate' | 'limited' | 'full';

export function getLotStatus(available: number, total: number): {
  status: AvailabilityStatus;
  label: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  dotClass: string;
  ringClass: string;
} {
  if (available <= 0) {
    return {
      status: 'full',
      label: 'Full',
      bgClass: 'bg-rose-50',
      textClass: 'text-rose-700',
      borderClass: 'border-rose-200',
      dotClass: 'bg-rose-500',
      ringClass: 'ring-rose-400/30'
    };
  }
  if (available < 15) {
    return {
      status: 'limited',
      label: 'Very Limited',
      bgClass: 'bg-rose-50',
      textClass: 'text-rose-600',
      borderClass: 'border-rose-200',
      dotClass: 'bg-rose-500',
      ringClass: 'ring-rose-400/20'
    };
  }
  if (available <= 50) {
    return {
      status: 'moderate',
      label: 'Filling Fast',
      bgClass: 'bg-amber-50',
      textClass: 'text-amber-700',
      borderClass: 'border-amber-200',
      dotClass: 'bg-amber-500',
      ringClass: 'ring-amber-400/30'
    };
  }
  return {
    status: 'ample',
    label: 'Ample Lots',
    bgClass: 'bg-emerald-50',
    textClass: 'text-emerald-700',
    borderClass: 'border-emerald-200',
    dotClass: 'bg-emerald-500',
    ringClass: 'ring-emerald-400/30'
  };
}

export function getLotsForVehicleType(carpark: Carpark, vehicle: VehicleType): { available: number; total: number } {
  if (vehicle === 'motorcycle' && carpark.lotTypes.motorcycle) {
    return carpark.lotTypes.motorcycle;
  }
  if (vehicle === 'heavyVehicle' && carpark.lotTypes.heavyVehicle) {
    return carpark.lotTypes.heavyVehicle;
  }
  return carpark.lotTypes.car;
}
