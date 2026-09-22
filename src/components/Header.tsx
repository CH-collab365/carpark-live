import React from 'react';
import { Car, RefreshCw, Radio, Bike, Truck } from 'lucide-react';
import { VehicleType } from '../types';

interface HeaderProps {
  vehicleType: VehicleType;
  onChangeVehicleType: (type: VehicleType) => void;
  onRefreshData: () => void;
  isRefreshing: boolean;
  lastUpdatedTime: string;
}

export const Header: React.FC<HeaderProps> = ({
  vehicleType,
  onChangeVehicleType,
  onRefreshData,
  isRefreshing,
  lastUpdatedTime
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand & Singapore Badge */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white shadow-sm shadow-rose-500/20 flex-shrink-0">
            <span className="font-black text-sm tracking-tighter">SG</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-black text-slate-900 tracking-tight leading-none">
                ParkSG
              </h1>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Singapore Real-Time Lot Availability
            </p>
          </div>
        </div>

        {/* Vehicle Type Switcher & Refresh Button */}
        <div className="flex items-center gap-2">
          {/* Vehicle Type Pills */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-0.5 border border-slate-200/60">
            <button
              id="vehicle-car-btn"
              onClick={() => onChangeVehicleType('car')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                vehicleType === 'car'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Car Lots"
            >
              <Car className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Car</span>
            </button>

            <button
              id="vehicle-motorcycle-btn"
              onClick={() => onChangeVehicleType('motorcycle')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                vehicleType === 'motorcycle'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Motorcycle Lots"
            >
              <Bike className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Motor</span>
            </button>
          </div>

          {/* Refresh Action */}
          <button
            id="refresh-lots-btn"
            onClick={onRefreshData}
            disabled={isRefreshing}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all border border-slate-200/80 active:scale-95 flex items-center gap-1"
            title={`Refresh lot counts (Last updated ${lastUpdatedTime})`}
          >
            <RefreshCw className={`w-4 h-4 text-slate-600 ${isRefreshing ? 'animate-spin text-rose-600' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
