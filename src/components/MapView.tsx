import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Carpark, VehicleType } from '../types';
import { getLotsForVehicleType } from '../utils/geo';
import { Navigation2, Layers, Locate } from 'lucide-react';

interface MapViewProps {
  carparks: Carpark[];
  selectedCarpark: Carpark | null;
  onSelectCarpark: (carpark: Carpark) => void;
  centerCoords: { lat: number; lng: number } | null;
  userCoords: { lat: number; lng: number } | null;
  vehicleType: VehicleType;
  className?: string;
  onLocateMe?: () => void;
}

export const MapView: React.FC<MapViewProps> = ({
  carparks,
  selectedCarpark,
  onSelectCarpark,
  centerCoords,
  userCoords,
  vehicleType,
  className = '',
  onLocateMe
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Default center Singapore (Marina Bay / City)
    const initialLat = centerCoords?.lat ?? 1.29027;
    const initialLng = centerCoords?.lng ?? 103.851959;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 13,
      zoomControl: false,
      attributionControl: false
    });

    // Clean, high-legibility tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);

    // Zoom control in top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    // Resize observer to ensure proper map rendering
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update center when centerCoords changes
  useEffect(() => {
    if (!mapInstanceRef.current || !centerCoords) return;
    mapInstanceRef.current.flyTo([centerCoords.lat, centerCoords.lng], 15, {
      duration: 1.2
    });
  }, [centerCoords]);

  // Update user GPS pin
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (userCoords) {
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([userCoords.lat, userCoords.lng]);
      } else {
        const userIcon = L.divIcon({
          className: 'custom-user-pin',
          html: `
            <div class="relative flex items-center justify-center w-8 h-8">
              <span class="absolute inline-flex w-full h-full rounded-full bg-sky-400 opacity-60 animate-ping"></span>
              <span class="relative inline-flex items-center justify-center w-5 h-5 rounded-full bg-sky-600 border-2 border-white shadow-md text-white font-bold text-[9px]">
                Me
              </span>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        userMarkerRef.current = L.marker([userCoords.lat, userCoords.lng], {
          icon: userIcon,
          zIndexOffset: 1000
        }).addTo(map);
      }
    } else if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }
  }, [userCoords]);

  // Render Carpark Markers with Real-time Lot Badges
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    const layer = markersLayerRef.current;
    layer.clearLayers();

    carparks.forEach((carpark) => {
      const lotInfo = getLotsForVehicleType(carpark, vehicleType);
      const isSelected = selectedCarpark?.id === carpark.id;

      // Determine pin color based on lots
      let pinBg = 'bg-emerald-600 text-white';
      let ringColor = 'ring-emerald-400/40';
      if (lotInfo.available <= 0) {
        pinBg = 'bg-slate-700 text-white';
        ringColor = 'ring-slate-400/30';
      } else if (lotInfo.available < 15) {
        pinBg = 'bg-rose-600 text-white';
        ringColor = 'ring-rose-400/40';
      } else if (lotInfo.available <= 50) {
        pinBg = 'bg-amber-500 text-white';
        ringColor = 'ring-amber-400/40';
      }

      const isSelectedClasses = isSelected
        ? 'ring-4 ring-rose-500 scale-125 z-50 animate-bounce'
        : 'hover:scale-110';

      const customIcon = L.divIcon({
        className: 'custom-carpark-marker',
        html: `
          <div class="relative group cursor-pointer flex flex-col items-center">
            <div class="px-2 py-1 rounded-full shadow-lg border-2 border-white ${pinBg} ${isSelectedClasses} font-black text-[11px] tracking-tight flex items-center gap-1 transition-all">
              <span class="truncate max-w-[45px]">${lotInfo.available}</span>
            </div>
            <div class="w-1.5 h-1.5 bg-slate-900 rotate-45 -mt-0.5 border border-white"></div>
          </div>
        `,
        iconSize: [48, 30],
        iconAnchor: [24, 28]
      });

      const marker = L.marker([carpark.lat, carpark.lng], {
        icon: customIcon
      });

      marker.on('click', () => {
        onSelectCarpark(carpark);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo([carpark.lat, carpark.lng]);
        }
      });

      // Bind simple tooltip
      marker.bindTooltip(
        `<div class="text-xs font-bold text-slate-900">${carpark.name}</div>
         <div class="text-[11px] text-slate-600">${lotInfo.available} available &bull; ${carpark.agency}</div>`,
        { direction: 'top', offset: [0, -20] }
      );

      layer.addLayer(marker);
    });
  }, [carparks, selectedCarpark, vehicleType, onSelectCarpark]);

  const handleRecenterSingapore = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([1.29027, 103.851959], 13);
  };

  return (
    <div className={`relative w-full h-full min-h-[300px] overflow-hidden rounded-2xl border border-slate-200 shadow-xs bg-slate-100 ${className}`}>
      {/* Map DOM Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Map Controls */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        <button
          onClick={handleRecenterSingapore}
          className="p-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl shadow-md border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-transform active:scale-95"
          title="Recenter Singapore"
        >
          <Navigation2 className="w-4 h-4 text-rose-600" />
          <span className="hidden sm:inline">Recenter SG</span>
        </button>

        {onLocateMe && (
          <button
            onClick={onLocateMe}
            className="p-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl shadow-md border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-transform active:scale-95"
            title="My Location"
          >
            <Locate className="w-4 h-4 text-sky-600" />
            <span className="hidden sm:inline">My GPS</span>
          </button>
        )}
      </div>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-10 bg-white/95 backdrop-blur-xs p-2 rounded-xl shadow-md border border-slate-200/80 text-[10px] text-slate-600 flex items-center gap-2.5">
        <span className="font-bold text-slate-700">Lots:</span>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>&gt;50</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span>15-50</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          <span>&lt;15</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-slate-700" />
          <span>Full</span>
        </div>
      </div>
    </div>
  );
};
