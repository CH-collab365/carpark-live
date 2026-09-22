import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { INITIAL_CARPARKS } from './data/singaporeCarparks';
import { SINGAPORE_LOCATIONS } from './data/singaporeLocations';
import { Carpark, VehicleType, AvailabilityFilter, LocationPreset } from './types';
import { getDistanceMeters, getLotsForVehicleType } from './utils/geo';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { FilterBar } from './components/FilterBar';
import { CarparkCard } from './components/CarparkCard';
import { MapView } from './components/MapView';
import { BottomNav, NavTab } from './components/BottomNav';
import { CarparkDetailModal } from './components/CarparkDetailModal';
import { SavedCarparksView } from './components/SavedCarparksView';
import { RatesAndApiView } from './components/RatesAndApiView';
import { HeatmapView } from './components/HeatmapView';
import { syncClaritySPARoute } from './utils/clarity';
import { Map, List, Navigation, AlertCircle, ChevronUp, ChevronDown } from 'lucide-react';

export default function App() {
  const [carparks, setCarparks] = useState<Carpark[]>(INITIAL_CARPARKS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<LocationPreset | null>(null);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [centerCoords, setCenterCoords] = useState<{ lat: number; lng: number } | null>({
    lat: 1.29027,
    lng: 103.851959
  });
  const [vehicleType, setVehicleType] = useState<VehicleType>('car');
  const [filter, setFilter] = useState<AvailabilityFilter>('all');
  const [sortBy, setSortBy] = useState<'distance' | 'lots' | 'name'>('distance');
  const [activeTab, setActiveTab] = useState<NavTab>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '') as NavTab;
      if (['explore', 'map', 'heatmap', 'saved', 'rates'].includes(hash)) {
        return hash;
      }
    }
    return 'explore';
  });
  const [selectedCarpark, setSelectedCarpark] = useState<Carpark | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState('Just now');
  const [showExploreMapPreview, setShowExploreMapPreview] = useState(true);
  const [isMapListExpanded, setIsMapListExpanded] = useState(false);

  // Favorite Carparks in LocalStorage
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('park_sg_favorites');
      return stored ? JSON.parse(stored) : ['mbs-carpark', 'toa-payoh-hub', 'vivocity-carpark'];
    } catch {
      return ['mbs-carpark', 'toa-payoh-hub'];
    }
  });

  const handleToggleFavorite = useCallback((id: string) => {
    setFavoriteIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('park_sg_favorites', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  // Compute distances from reference point (userCoords or selectedLocation or central Singapore)
  const referenceCoords = useMemo(() => {
    if (userCoords) return userCoords;
    if (selectedLocation) return { lat: selectedLocation.lat, lng: selectedLocation.lng };
    return { lat: 1.29027, lng: 103.851959 }; // Default central Singapore
  }, [userCoords, selectedLocation]);

  // Update carparks with distance
  const carparksWithDistance = useMemo(() => {
    return carparks.map((cp) => ({
      ...cp,
      distanceMeters: getDistanceMeters(
        referenceCoords.lat,
        referenceCoords.lng,
        cp.lat,
        cp.lng
      )
    }));
  }, [carparks, referenceCoords]);

  // Handle Location Selection from Search or Hotspots
  const handleSelectLocation = useCallback((loc: LocationPreset) => {
    setSelectedLocation(loc);
    setSearchQuery(loc.name);
    setCenterCoords({ lat: loc.lat, lng: loc.lng });
  }, []);

  // Handle Geolocation "Locate Me"
  const handleLocateMe = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        setUserCoords(coords);
        setCenterCoords(coords);
        setSelectedLocation(null);
        setSearchQuery('Current Location');
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        // Fallback to Singapore central (Marina Bay) if permission denied
        setUserCoords({ lat: 1.2838, lng: 103.8591 });
        setCenterCoords({ lat: 1.2838, lng: 103.8591 });
        setSearchQuery('Marina Bay (Simulated GPS)');
        setIsLocating(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  }, []);

  // Refresh lot simulation: randomly fluctuates lots by ±1-4 lots for authentic real-time Singapore feel
  const handleRefreshData = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setCarparks((prev) =>
        prev.map((cp) => {
          const delta = Math.floor(Math.random() * 7) - 3;
          const newCarAvailable = Math.max(
            0,
            Math.min(cp.lotTypes.car.total, cp.lotTypes.car.available + delta)
          );
          return {
            ...cp,
            availableLots: newCarAvailable,
            lotTypes: {
              ...cp.lotTypes,
              car: {
                ...cp.lotTypes.car,
                available: newCarAvailable
              }
            },
            lastUpdated: 'Just now'
          };
        })
      );
      setLastUpdatedTime('Just now');
      setIsRefreshing(false);
    }, 600);
  }, []);

  // Periodic automatic lot fluctuation simulation (every 40s)
  useEffect(() => {
    const timer = setInterval(() => {
      setCarparks((prev) =>
        prev.map((cp) => {
          const delta = Math.floor(Math.random() * 5) - 2;
          const newCar = Math.max(
            0,
            Math.min(cp.lotTypes.car.total, cp.lotTypes.car.available + delta)
          );
          return {
            ...cp,
            availableLots: newCar,
            lotTypes: {
              ...cp.lotTypes,
              car: { ...cp.lotTypes.car, available: newCar }
            }
          };
        })
      );
    }, 40000);
    return () => clearInterval(timer);
  }, []);

  // Synchronize Clarity tracking on SPA tab changes with real fixed page.url and page.identifier
  useEffect(() => {
    syncClaritySPARoute(activeTab);
  }, [activeTab]);

  // Handle browser back/forward and hash changes in SPA
  useEffect(() => {
    const handleHash = () => {
      if (typeof window !== 'undefined') {
        const hash = window.location.hash.replace('#', '') as NavTab;
        if (['explore', 'map', 'heatmap', 'saved', 'rates'].includes(hash)) {
          setActiveTab(hash);
        }
      }
    };
    window.addEventListener('hashchange', handleHash);
    window.addEventListener('popstate', handleHash);
    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('popstate', handleHash);
    };
  }, []);

  // Show carpark on map action
  const handleShowOnMap = useCallback((carpark: Carpark) => {
    setSelectedCarpark(carpark);
    setCenterCoords({ lat: carpark.lat, lng: carpark.lng });
    setActiveTab('map');
  }, []);

  // Filter & Search Logic
  const filteredCarparks = useMemo(() => {
    let result = carparksWithDistance;

    // Search query filter (matches name, address, area, code, postal)
    if (searchQuery.trim() && searchQuery !== 'Current Location') {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (cp) =>
          cp.name.toLowerCase().includes(q) ||
          cp.area.toLowerCase().includes(q) ||
          cp.address.toLowerCase().includes(q) ||
          cp.code.toLowerCase().includes(q)
      );
    }

    // Availability Filter
    if (filter === 'ample') {
      result = result.filter((cp) => {
        const lots = getLotsForVehicleType(cp, vehicleType);
        return lots.available > 50;
      });
    } else if (filter === 'available') {
      result = result.filter((cp) => {
        const lots = getLotsForVehicleType(cp, vehicleType);
        return lots.available > 0;
      });
    } else if (filter === 'ev') {
      result = result.filter((cp) => cp.hasEVCharging);
    } else if (filter === 'hdb') {
      result = result.filter((cp) => cp.agency === 'HDB' || cp.agency === 'URA');
    } else if (filter === 'commercial') {
      result = result.filter((cp) => cp.agency === 'Commercial');
    }

    // Sorting
    return [...result].sort((a, b) => {
      if (sortBy === 'distance') {
        return (a.distanceMeters ?? 999999) - (b.distanceMeters ?? 999999);
      }
      if (sortBy === 'lots') {
        const lotsA = getLotsForVehicleType(a, vehicleType).available;
        const lotsB = getLotsForVehicleType(b, vehicleType).available;
        return lotsB - lotsA;
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }, [carparksWithDistance, searchQuery, filter, sortBy, vehicleType]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 font-sans antialiased">
      {/* Top App Header */}
      <Header
        vehicleType={vehicleType}
        onChangeVehicleType={setVehicleType}
        onRefreshData={handleRefreshData}
        isRefreshing={isRefreshing}
        lastUpdatedTime={lastUpdatedTime}
      />

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 pt-4 pb-8">
        {/* EXPLORE TAB */}
        {activeTab === 'explore' && (
          <div className="space-y-4">
            {/* Search Bar with Singapore presets */}
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSelectLocation={handleSelectLocation}
              selectedLocation={selectedLocation}
              onLocateMe={handleLocateMe}
              isLocating={isLocating}
            />

            {/* Quick Map Preview Toggle for Explore Tab */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Nearby Singapore Parking
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                <span className="text-xs text-slate-500">
                  Sorted by {sortBy === 'distance' ? 'Nearest' : sortBy === 'lots' ? 'Availability' : 'Name'}
                </span>
              </div>

              <button
                id="toggle-map-preview-btn"
                onClick={() => setShowExploreMapPreview(!showExploreMapPreview)}
                className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-xl transition-all"
              >
                {showExploreMapPreview ? (
                  <>
                    <List className="w-3.5 h-3.5" />
                    <span>Hide Map</span>
                  </>
                ) : (
                  <>
                    <Map className="w-3.5 h-3.5" />
                    <span>Show Map</span>
                  </>
                )}
              </button>
            </div>

            {/* Collapsible Interactive Map in Explore View */}
            {showExploreMapPreview && (
              <div className="h-64 sm:h-72 w-full transition-all">
                <MapView
                  carparks={filteredCarparks}
                  selectedCarpark={selectedCarpark}
                  onSelectCarpark={setSelectedCarpark}
                  centerCoords={centerCoords}
                  userCoords={userCoords}
                  vehicleType={vehicleType}
                  onLocateMe={handleLocateMe}
                />
              </div>
            )}

            {/* Filter Pills & Sorting */}
            <FilterBar
              filter={filter}
              onChangeFilter={setFilter}
              sortBy={sortBy}
              onChangeSortBy={setSortBy}
              totalCount={filteredCarparks.length}
            />

            {/* List of Carpark Cards */}
            {filteredCarparks.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-8 text-center max-w-md mx-auto my-6 shadow-xs">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">No carparks found</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Try searching for another location, resetting filters, or viewing all Singapore lots.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedLocation(null);
                    setFilter('all');
                  }}
                  className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-all"
                >
                  Reset Search &amp; Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredCarparks.map((carpark) => (
                  <CarparkCard
                    key={carpark.id}
                    carpark={carpark}
                    vehicleType={vehicleType}
                    isFavorite={favoriteIds.includes(carpark.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onSelectCarpark={setSelectedCarpark}
                    onShowOnMap={handleShowOnMap}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* FULL MAP VIEW TAB */}
        {activeTab === 'map' && (
          <div className="space-y-3">
            {/* Search within Map */}
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSelectLocation={handleSelectLocation}
              selectedLocation={selectedLocation}
              onLocateMe={handleLocateMe}
              isLocating={isLocating}
            />

            {/* Full Height Map */}
            <div className="relative h-[calc(100vh-230px)] min-h-[460px] w-full">
              <MapView
                carparks={filteredCarparks}
                selectedCarpark={selectedCarpark}
                onSelectCarpark={setSelectedCarpark}
                centerCoords={centerCoords}
                userCoords={userCoords}
                vehicleType={vehicleType}
                onLocateMe={handleLocateMe}
              />

              {/* Expandable Bottom Drawer of Lots on Map */}
              <div
                className={`absolute bottom-3 left-3 right-3 z-20 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 transition-all duration-300 ${
                  isMapListExpanded ? 'max-h-72' : 'max-h-28'
                } flex flex-col overflow-hidden`}
              >
                {/* Header / Drawer Handle */}
                <div
                  onClick={() => setIsMapListExpanded(!isMapListExpanded)}
                  className="px-4 py-2 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-100/80 transition-colors flex-shrink-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">
                      Nearby Lots ({filteredCarparks.length})
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Tap pin or card to inspect
                    </span>
                  </div>
                  <button className="p-1 text-slate-400 hover:text-slate-600">
                    {isMapListExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronUp className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Horizontal / Vertical mini card scroll */}
                <div className="p-2 overflow-y-auto divide-y divide-slate-100 space-y-1">
                  {filteredCarparks.slice(0, 10).map((cp) => {
                    const lotInfo = getLotsForVehicleType(cp, vehicleType);
                    const isSelected = selectedCarpark?.id === cp.id;
                    return (
                      <div
                        key={cp.id}
                        onClick={() => {
                          setSelectedCarpark(cp);
                          setCenterCoords({ lat: cp.lat, lng: cp.lng });
                        }}
                        className={`p-2 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected ? 'bg-rose-50 border border-rose-200' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="min-w-0 flex-1 pr-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {cp.name}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                              {cp.agency}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">{cp.address}</p>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <div className="text-sm font-black text-slate-900">
                            {lotInfo.available}
                            <span className="text-[10px] font-normal text-slate-500 ml-1">
                              /{lotInfo.total}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-bold ${
                              lotInfo.available > 50
                                ? 'text-emerald-600'
                                : lotInfo.available > 10
                                ? 'text-amber-600'
                                : 'text-rose-600'
                            }`}
                          >
                            {lotInfo.available > 50
                              ? 'Ample'
                              : lotInfo.available > 10
                              ? 'Moderate'
                              : 'Limited'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HEATMAP TAB */}
        {activeTab === 'heatmap' && (
          <HeatmapView
            carparks={carparksWithDistance}
            vehicleType={vehicleType}
            onSelectCarpark={setSelectedCarpark}
            onShowOnMap={handleShowOnMap}
          />
        )}

        {/* SAVED TAB */}
        {activeTab === 'saved' && (
          <SavedCarparksView
            carparks={carparksWithDistance}
            favoriteIds={favoriteIds}
            vehicleType={vehicleType}
            onToggleFavorite={handleToggleFavorite}
            onSelectCarpark={setSelectedCarpark}
            onShowOnMap={handleShowOnMap}
            onExplore={() => setActiveTab('explore')}
          />
        )}

        {/* RATES & API TAB */}
        {activeTab === 'rates' && <RatesAndApiView />}
      </main>

      {/* Selected Carpark Detail Modal / Drawer */}
      <CarparkDetailModal
        carpark={selectedCarpark}
        onClose={() => setSelectedCarpark(null)}
        vehicleType={vehicleType}
        isFavorite={selectedCarpark ? favoriteIds.includes(selectedCarpark.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        savedCount={favoriteIds.length}
      />
    </div>
  );
}
