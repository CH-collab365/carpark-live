import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Zap, 
  Car, 
  Navigation, 
  Clock, 
  ShieldCheck, 
  Info, 
  Heart, 
  Code2, 
  CheckCircle2, 
  ExternalLink,
  DollarSign
} from 'lucide-react';
import { Carpark, VehicleType } from '../types';
import { getLotStatus, getLotsForVehicleType } from '../utils/geo';

interface CarparkDetailModalProps {
  carpark: Carpark | null;
  onClose: () => void;
  vehicleType: VehicleType;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const CarparkDetailModal: React.FC<CarparkDetailModalProps> = ({
  carpark,
  onClose,
  vehicleType,
  isFavorite,
  onToggleFavorite
}) => {
  const [activeTab, setActiveTab] = useState<'rates' | 'api'>('rates');

  if (!carpark) return null;

  const lotInfo = getLotsForVehicleType(carpark, vehicleType);
  const status = getLotStatus(lotInfo.available, lotInfo.total);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div 
        className="fixed inset-0"
        onClick={onClose}
      />

      <div
        id="carpark-detail-modal"
        className="relative z-10 w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-250"
      >
        {/* Header */}
        <div className="px-5 pt-4 pb-3 border-b border-slate-100 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {carpark.agency} &bull; {carpark.code}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {carpark.area}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
              {carpark.name}
            </h2>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-slate-400" />
              {carpark.address}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <button
              id="modal-fav-btn"
              onClick={() => onToggleFavorite(carpark.id)}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-rose-500 transition-colors"
              title={isFavorite ? 'Remove from Saved' : 'Save Carpark'}
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorite ? 'fill-rose-500 text-rose-500' : ''
                }`}
              />
            </button>
            <button
              id="modal-close-btn"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Lot Availability Banner */}
        <div className={`px-5 py-3 ${status.bgClass} border-b ${status.borderClass} flex items-center justify-between`}>
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
              Real-time Availability ({vehicleType === 'car' ? 'Cars' : vehicleType === 'motorcycle' ? 'Motorcycles' : 'Heavy Vehicles'})
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {lotInfo.available.toLocaleString()}
              </span>
              <span className="text-xs text-slate-600 font-medium">
                vacant lots of {lotInfo.total.toLocaleString()} total
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${status.bgClass} ${status.textClass} border ${status.borderClass}`}>
              <span className={`w-2 h-2 rounded-full ${status.dotClass} animate-ping`} />
              {status.label}
            </span>
            <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-end gap-1">
              <Clock className="w-2.5 h-2.5" />
              {carpark.lastUpdated}
            </div>
          </div>
        </div>

        {/* Tabs: Rates / API Hook */}
        <div className="flex border-b border-slate-200 px-5 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('rates')}
            className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'rates'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            Parking Charges &amp; Hours
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'api'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            API Connection Ready
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-slate-700 text-xs">
          {activeTab === 'rates' ? (
            <>
              {/* Tariff Table */}
              <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
                <div className="bg-slate-50 px-3.5 py-2 font-bold text-slate-800 text-xs flex justify-between items-center">
                  <span>Standard Tariff Schedule</span>
                  <span className="text-[10px] font-normal text-slate-500">
                    Grace: {carpark.rates.gracePeriodMins} mins
                  </span>
                </div>
                <div className="divide-y divide-slate-100">
                  <div className="px-3.5 py-2.5 flex justify-between items-start">
                    <span className="text-slate-500 font-medium">Monday - Friday (Day)</span>
                    <span className="font-semibold text-slate-900 text-right max-w-[65%]">
                      {carpark.rates.weekdayDay}
                    </span>
                  </div>
                  <div className="px-3.5 py-2.5 flex justify-between items-start bg-slate-50/40">
                    <span className="text-slate-500 font-medium">Monday - Friday (Night)</span>
                    <span className="font-semibold text-slate-900 text-right max-w-[65%]">
                      {carpark.rates.weekdayNight}
                    </span>
                  </div>
                  <div className="px-3.5 py-2.5 flex justify-between items-start">
                    <span className="text-slate-500 font-medium">Saturday</span>
                    <span className="font-semibold text-slate-900 text-right max-w-[65%]">
                      {carpark.rates.saturday}
                    </span>
                  </div>
                  <div className="px-3.5 py-2.5 flex justify-between items-start bg-slate-50/40">
                    <span className="text-slate-500 font-medium">Sunday &amp; Public Holidays</span>
                    <span className="font-semibold text-slate-900 text-right max-w-[65%]">
                      {carpark.rates.sundayPH}
                    </span>
                  </div>
                </div>
              </div>

              {/* Free Parking or Special Notice */}
              {carpark.rates.freeParkingNote && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Promotions &amp; Concessions:</span>
                    <p className="mt-0.5 text-[11px] text-emerald-700">
                      {carpark.rates.freeParkingNote}
                    </p>
                  </div>
                </div>
              )}

              {/* Carpark Facility Highlights */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Height Clearance</span>
                  <span className="text-sm font-bold text-slate-800 font-mono mt-0.5 block">
                    {carpark.heightLimitM} meters
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {carpark.heightLimitM >= 2.1 ? 'SUV & Van accessible' : 'Low clearance, check roof racks'}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">EV Fast Charging</span>
                  <span className="text-sm font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                    {carpark.hasEVCharging ? (
                      <>
                        <Zap className="w-3.5 h-3.5 text-emerald-600" />
                        {carpark.evChargerCount || 4} Chargers Active
                      </>
                    ) : (
                      <span className="text-slate-500">No EV points</span>
                    )}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {carpark.hasEVCharging ? 'Type 2 AC & CCS2 DC' : 'Nearby charging stations only'}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Parking Barrier</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                    {carpark.parkingSystem}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Supports ERP IU Card, EZ-Link &amp; NETS FlashPay
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Sheltered Coverage</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                    {carpark.isSheltered ? 'Covered / Basement' : 'Open Surface Lot'}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {carpark.isSheltered ? 'Weather protected' : 'Subject to rain & heat'}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs">
                <div className="font-bold flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-blue-600" />
                  Plug-and-Play API Schema Prepared
                </div>
                <p className="mt-1 text-blue-700 text-[11px] leading-relaxed">
                  The frontend data structure directly mirrors Singapore Gov DataMall and data.gov.sg Carpark Availability API responses. You can plug in your endpoint by updating the fetcher in <code className="bg-blue-100 px-1 py-0.5 rounded font-mono">src/data/singaporeCarparks.ts</code> or an API route.
                </p>
              </div>

              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Target API Sample (data.gov.sg / LTA DataMall):
                </div>
                <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl font-mono text-[10px] overflow-x-auto">
{JSON.stringify({
  carpark_number: carpark.code,
  carpark_info: [
    {
      total_lots: lotInfo.total.toString(),
      lot_type: vehicleType === 'car' ? 'C' : 'M',
      lots_available: lotInfo.available.toString()
    }
  ],
  update_datetime: new Date().toISOString()
}, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Action */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
          <a
            id="navigate-google-maps-btn"
            href={`https://www.google.com/maps/dir/?api=1&destination=${carpark.lat},${carpark.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-center text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-[0.99]"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Start Turn-by-Turn Navigation</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
          </a>
        </div>
      </div>
    </div>
  );
};
