import React from 'react';
import { Heart, MapPin, Compass, Trash2, ArrowUpRight } from 'lucide-react';
import { Carpark, VehicleType } from '../types';
import { CarparkCard } from './CarparkCard';

interface SavedCarparksViewProps {
  carparks: Carpark[];
  favoriteIds: string[];
  vehicleType: VehicleType;
  onToggleFavorite: (id: string) => void;
  onSelectCarpark: (carpark: Carpark) => void;
  onShowOnMap: (carpark: Carpark) => void;
  onExplore: () => void;
}

export const SavedCarparksView: React.FC<SavedCarparksViewProps> = ({
  carparks,
  favoriteIds,
  vehicleType,
  onToggleFavorite,
  onSelectCarpark,
  onShowOnMap,
  onExplore
}) => {
  const savedCarparks = carparks.filter((c) => favoriteIds.includes(c.id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Saved Carparks</h2>
          <p className="text-xs text-slate-500">
            Quickly monitor real-time lot availability for your saved Singapore parking spots
          </p>
        </div>

        {savedCarparks.length > 0 && (
          <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl">
            {savedCarparks.length} saved
          </span>
        )}
      </div>

      {savedCarparks.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 text-center max-w-md mx-auto my-8 shadow-xs">
          <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No saved carparks yet</h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Tap the heart icon on any carpark card to bookmark your frequently visited parking locations (e.g. your home HDB, office tower, or favorite mall).
          </p>

          <button
            onClick={onExplore}
            className="mt-5 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 mx-auto"
          >
            <Compass className="w-4 h-4" />
            <span>Find Carparks Near You</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {savedCarparks.map((cp) => (
            <CarparkCard
              key={cp.id}
              carpark={cp}
              vehicleType={vehicleType}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
              onSelectCarpark={onSelectCarpark}
              onShowOnMap={onShowOnMap}
            />
          ))}
        </div>
      )}
    </div>
  );
};
