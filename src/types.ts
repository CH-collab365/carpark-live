export interface LotCapacity {
  total: number;
  available: number;
}

export interface CarparkRates {
  weekdayDay: string;
  weekdayNight: string;
  saturday: string;
  sundayPH: string;
  gracePeriodMins: number;
  isFreeParking?: boolean;
  freeParkingNote?: string;
}

export interface Carpark {
  id: string;
  code: string;
  name: string;
  address: string;
  area: string;
  agency: 'HDB' | 'URA' | 'LTA' | 'Commercial';
  lat: number;
  lng: number;
  totalLots: number;
  availableLots: number;
  lotTypes: {
    car: LotCapacity;
    motorcycle?: LotCapacity;
    heavyVehicle?: LotCapacity;
  };
  rates: CarparkRates;
  heightLimitM: number;
  hasEVCharging: boolean;
  evChargerCount?: number;
  isSheltered: boolean;
  parkingSystem: string;
  lastUpdated: string;
  distanceMeters?: number;
}

export type VehicleType = 'car' | 'motorcycle' | 'heavyVehicle';

export type AvailabilityFilter = 'all' | 'ample' | 'available' | 'ev' | 'hdb' | 'commercial';

export interface LocationPreset {
  id: string;
  name: string;
  desc: string;
  lat: number;
  lng: number;
  area: string;
  postalCode?: string;
}
