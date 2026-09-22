import React from 'react';
import { 
  MapPin, 
  Zap, 
  ShieldCheck, 
  ArrowUpRight, 
  Heart, 
  Clock, 
  Layers,
  Car as CarIcon,
  HelpCircle
} from 'lucide-react';
import { Carpark, VehicleType } from '../types';
import { formatDistance, getLotStatus, getLotsForVehicleType } from '../utils/geo';

interface CarparkCardProps {
  carpark: Carpark;
  vehicleType: VehicleType;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelectCarpark: (carpark: Carpark) => void;
  onShowOnMap: (carpark: Carpark) => void;
}

export const CarparkCard: React.FC<CarparkCardProps> = ({
  carpark,
  vehicleType,
  isFavorite,
  onToggleFavorite,
  onSelectCarpark,
  onShowOnMap
}) => {
  const lotInfo = getLotsForVehicleType(carpark, vehicleType);
  const status = getLotStatus(lotInfo.available, lotInfo.total);
  const occupancyPercent = Math.min(
    100,
    Math.round(((lotInfo.total - lotInfo.available) / Math.max(1, lotInfo.total)) * 100)
  );

  const agencyStyles: Record<string, { bg: string; text: string; border: string }> = {
    HDB: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    URA: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    Commercial: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    LTA: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' }
  };

  const agencyBadge = agencyStyles[carpark.agency] || {
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200'
  };

  return (
    <div
      id={`carpark-card-${carpark.id}`}
      className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 p-4 transition-all shadow-xs hover:shadow-md"
    >
      {/* Top row: Agency badge, Area, and Favorite button */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${agencyBadge.bg} ${agencyBadge.text} ${agencyBadge.border}`}
          >
            {carpark.agency}
          </span>
          <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            {carpark.area}
          </span>
          {carpark.rates.isFreeParking && (
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              Free Parking Scheme
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {carpark.distanceMeters !== undefined && (
            <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {formatDistance(carpark.distanceMeters)}
            </span>
          )}
          <button
            id={`fav-btn-${carpark.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(carpark.id);
            }}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-rose-500 transition-colors"
            title={isFavorite ? 'Remove from Saved' : 'Save to Favorites'}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorite ? 'fill-rose-500 text-rose-500' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Carpark Title & Address */}
      <div className="cursor-pointer" onClick={() => onSelectCarpark(carpark)}>
        <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug group-hover:text-rose-600 transition-colors">
          {carpark.name}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{carpark.address}</p>
      </div>

      {/* Real-time availability indicator block */}
      <div 
        onClick={() => onSelectCarpark(carpark)}
        className={`mt-3 p-3 rounded-xl border ${status.bgClass} ${status.borderClass} cursor-pointer transition-transform active:scale-[0.99]`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black tracking-tight text-slate-900">
              {lotInfo.available.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-slate-600">
              / {lotInfo.total.toLocaleString()} lots
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${status.dotClass} animate-pulse`} />
            <span className={`text-xs font-bold ${status.textClass}`}>
              {status.label}
            </span>
          </div>
        </div>

        {/* Capacity Bar */}
        <div className="mt-2 w-full bg-black/5 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              status.status === 'ample'
                ? 'bg-emerald-500'
                : status.status === 'moderate'
                ? 'bg-amber-500'
                : 'bg-rose-500'
            }`}
            style={{ width: `${occupancyPercent}%` }}
          />
        </div>

        <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
          <span>{occupancyPercent}% Occupied</span>
          <span className="flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            {carpark.lastUpdated}
          </span>
        </div>
      </div>

      {/* Pricing & Key Tags */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100 pt-2.5">
        <div className="flex items-center gap-1 truncate mr-2" title={carpark.rates.weekdayDay}>
          <span className="font-semibold text-slate-800 truncate">
            {carpark.rates.weekdayDay.split('(')[0].trim()}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {carpark.hasEVCharging && (
            <span
              className="inline-flex items-center gap-0.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded"
              title={`${carpark.evChargerCount || 4} EV Charging points available`}
            >
              <Zap className="w-3 h-3 text-emerald-600" />
              EV
            </span>
          )}

          <span
            className="text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-mono"
            title={`Max clearance height: ${carpark.heightLimitM}m`}
          >
            {carpark.heightLimitM}m
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-3 flex items-center gap-2">
        <button
          id={`details-btn-${carpark.id}`}
          onClick={() => onSelectCarpark(carpark)}
          className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-center"
        >
          Tariffs & Rates
        </button>

        <button
          id={`map-pin-btn-${carpark.id}`}
          onClick={() => onShowOnMap(carpark)}
          className="py-2 px-3 text-xs font-semibold rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors flex items-center gap-1"
          title="View on Map"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Map</span>
        </button>

        <a
          id={`navigate-btn-${carpark.id}`}
          href={`https://www.google.com/maps/dir/?api=1&destination=${carpark.lat},${carpark.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2 px-3 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-colors flex items-center gap-1 shadow-xs"
          title="Navigate using Google Maps"
        >
          <span>Go</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
