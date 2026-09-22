import React from 'react';
import { Search, MapPin, Navigation, X, Crosshair } from 'lucide-react';
import { LocationPreset } from '../types';
import { SINGAPORE_LOCATIONS } from '../data/singaporeLocations';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectLocation: (loc: LocationPreset) => void;
  selectedLocation: LocationPreset | null;
  onLocateMe: () => void;
  isLocating: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onSelectLocation,
  selectedLocation,
  onLocateMe,
  isLocating
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  // Filter presets based on user input
  const suggestions = React.useMemo(() => {
    if (!searchQuery.trim()) return SINGAPORE_LOCATIONS.slice(0, 6);
    const q = searchQuery.toLowerCase().trim();
    return SINGAPORE_LOCATIONS.filter(
      (loc) =>
        loc.name.toLowerCase().includes(q) ||
        loc.area.toLowerCase().includes(q) ||
        loc.desc.toLowerCase().includes(q) ||
        (loc.postalCode && loc.postalCode.includes(q))
    );
  }, [searchQuery]);

  return (
    <div id="singapore-search-container" className="relative w-full z-30">
      <div className="relative flex items-center">
        <div className="absolute left-3.5 pointer-events-none text-slate-400 flex items-center">
          <Search className="w-4 h-4 text-rose-500" />
        </div>

        <input
          id="singapore-carpark-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search Singapore place, MRT, mall, or postal code (e.g. Marina Bay, 018956)..."
          className="w-full pl-10 pr-24 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
        />

        <div className="absolute right-2.5 flex items-center gap-1">
          {searchQuery && (
            <button
              id="clear-search-btn"
              onClick={() => {
                onSearchChange('');
              }}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            id="locate-me-btn"
            onClick={onLocateMe}
            disabled={isLocating}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 active:scale-95 transition-all"
            title="Use Current Location in Singapore"
          >
            <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-rose-600' : ''}`} />
            <span className="hidden sm:inline">{isLocating ? 'Locating...' : 'Near Me'}</span>
          </button>
        </div>
      </div>

      {/* Selected location indicator pill if active */}
      {selectedLocation && !isFocused && (
        <div className="mt-2 flex items-center justify-between px-3 py-1.5 bg-rose-50/70 border border-rose-100 rounded-xl text-xs text-rose-800">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
            <span className="font-semibold truncate">Filtered near {selectedLocation.name}</span>
            <span className="text-rose-500 text-[11px] hidden sm:inline">({selectedLocation.area})</span>
          </div>
          <button
            onClick={() => onSearchChange('')}
            className="text-[11px] font-semibold text-rose-700 hover:text-rose-900 underline ml-2 flex-shrink-0"
          >
            Reset
          </button>
        </div>
      )}

      {/* Dropdown Suggestions */}
      {isFocused && (
        <>
          <div
            className="fixed inset-0 z-20"
            onClick={() => setIsFocused(false)}
          />
          <div
            id="search-suggestions-dropdown"
            className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-30 max-h-72 overflow-y-auto"
          >
            <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {searchQuery ? 'Matching Singapore Locations' : 'Popular Singapore Hotspots'}
            </div>

            {suggestions.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-slate-500">
                No matching Singapore locations found for &ldquo;{searchQuery}&rdquo;. Try &ldquo;Orchard&rdquo;, &ldquo;MBS&rdquo;, or a 6-digit postal code.
              </div>
            ) : (
              suggestions.map((loc) => (
                <button
                  key={loc.id}
                  id={`suggestion-${loc.id}`}
                  onClick={() => {
                    onSelectLocation(loc);
                    setIsFocused(false);
                  }}
                  className="w-full px-3.5 py-2.5 text-left flex items-start gap-2.5 hover:bg-slate-50 active:bg-rose-50/50 transition-colors"
                >
                  <div className="p-1.5 bg-slate-100 rounded-lg text-slate-600 mt-0.5 flex-shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-rose-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-800 truncate">{loc.name}</span>
                      <span className="text-[10px] font-medium px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                        {loc.area}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{loc.desc}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </>
      )}

      {/* Quick location chips */}
      {!isFocused && !searchQuery && (
        <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 scrollbar-none no-scrollbar text-xs">
          <span className="text-[11px] font-medium text-slate-400 flex-shrink-0 flex items-center gap-1 mr-1">
            <Navigation className="w-3 h-3" /> Quick:
          </span>
          {SINGAPORE_LOCATIONS.slice(0, 6).map((loc) => (
            <button
              key={loc.id}
              id={`quick-chip-${loc.id}`}
              onClick={() => onSelectLocation(loc)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                selectedLocation?.id === loc.id
                  ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {loc.name.split('/')[0].trim()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
