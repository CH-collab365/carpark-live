import React, { useState, useMemo, useEffect } from 'react';
import { Carpark, VehicleType } from '../types';
import { getLotsForVehicleType } from '../utils/geo';
import {
  CLARITY_PAGE_CONFIGS,
  CLARITY_PROJECT_ID,
  reloadClarityTracker,
  recordClarityInteraction,
  ClaritySyncResult
} from '../utils/clarity';
import {
  Flame,
  Activity,
  RefreshCw,
  CheckCircle2,
  ExternalLink,
  Code2,
  MousePointerClick,
  Layers,
  Sparkles,
  Zap,
  Info,
  Sliders,
  TrendingUp,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Eye
} from 'lucide-react';

interface HeatmapViewProps {
  carparks: Carpark[];
  vehicleType: VehicleType;
  onSelectCarpark: (carpark: Carpark) => void;
  onShowOnMap: (carpark: Carpark) => void;
}

type HeatMetric = 'occupancy' | 'density' | 'ev';
type DistrictFilter = 'all' | 'marina' | 'orchard' | 'bugis' | 'west' | 'east' | 'north';

export const HeatmapView: React.FC<HeatmapViewProps> = ({
  carparks,
  vehicleType,
  onSelectCarpark,
  onShowOnMap
}) => {
  const [metric, setMetric] = useState<HeatMetric>('occupancy');
  const [district, setDistrict] = useState<DistrictFilter>('all');
  const [heatRadius, setHeatRadius] = useState<number>(36);
  const [selectedHotspot, setSelectedHotspot] = useState<Carpark | null>(null);
  const [showCodeDetails, setShowCodeDetails] = useState(false);
  const [testClickCount, setTestClickCount] = useState(0);
  const [lastReloadInfo, setLastReloadInfo] = useState<ClaritySyncResult | null>(null);
  const [isReloading, setIsReloading] = useState(false);
  const [pollVote, setPollVote] = useState<string | null>(null);

  // Initialize or listen for SPA reload events
  useEffect(() => {
    // Perform initial reload sync for heatmap tab
    const res = reloadClarityTracker('heatmap');
    setLastReloadInfo(res);

    const handleSpaReload = (e: Event) => {
      const customEvent = e as CustomEvent<ClaritySyncResult>;
      if (customEvent.detail) {
        setLastReloadInfo(customEvent.detail);
      }
    };

    window.addEventListener('clarity-spa-reload', handleSpaReload);
    return () => {
      window.removeEventListener('clarity-spa-reload', handleSpaReload);
    };
  }, []);

  // Filter carparks based on selected district
  const filteredCarparks = useMemo(() => {
    return carparks.filter((cp) => {
      if (district === 'all') return true;
      const area = (cp.area + ' ' + cp.name + ' ' + cp.address).toLowerCase();
      if (district === 'marina') return area.includes('marina') || area.includes('downtown') || area.includes('raffles') || area.includes('cbd');
      if (district === 'orchard') return area.includes('orchard') || area.includes('somerset') || area.includes('tanglin') || area.includes('scotts');
      if (district === 'bugis') return area.includes('bugis') || area.includes('rochor') || area.includes('beach road') || area.includes('city hall');
      if (district === 'west') return area.includes('jurong') || area.includes('clementi') || area.includes('buona');
      if (district === 'east') return area.includes('tampines') || area.includes('bedok') || area.includes('changi') || area.includes('marine');
      if (district === 'north') return area.includes('woodlands') || area.includes('bishan') || area.includes('toa payoh') || area.includes('yishun');
      return true;
    });
  }, [carparks, district]);

  // Aggregate Singapore Heatmap statistics
  const stats = useMemo(() => {
    let totalCap = 0;
    let totalAvail = 0;
    let highCongestionCount = 0; // > 80% occupied
    let evCount = 0;

    filteredCarparks.forEach((cp) => {
      const lots = getLotsForVehicleType(cp, vehicleType);
      totalCap += lots.total;
      totalAvail += lots.available;
      const occupied = lots.total - lots.available;
      const pct = lots.total > 0 ? (occupied / lots.total) * 100 : 0;
      if (pct >= 80) highCongestionCount++;
      if (cp.hasEVCharging) evCount++;
    });

    const overallOccupancyPct = totalCap > 0 ? Math.round(((totalCap - totalAvail) / totalCap) * 100) : 0;

    return {
      totalCap,
      totalAvail,
      overallOccupancyPct,
      highCongestionCount,
      evCount,
      totalCarparks: filteredCarparks.length
    };
  }, [filteredCarparks, vehicleType]);

  // Map projection coordinates for SVG Singapore map container
  // Singapore bounding box: Lat ~ 1.22 to 1.47, Lng ~ 103.60 to 104.02
  const minLat = 1.24;
  const maxLat = 1.46;
  const minLng = 103.64;
  const maxLng = 103.99;

  const projectToMap = (lat: number, lng: number) => {
    const xPct = Math.max(0, Math.min(100, ((lng - minLng) / (maxLng - minLng)) * 100));
    // Invert Y for latitude since higher lat is north (top of SVG)
    const yPct = Math.max(0, Math.min(100, (1 - (lat - minLat) / (maxLat - minLat)) * 100));
    return { x: xPct, y: yPct };
  };

  const handleManualReload = () => {
    setIsReloading(true);
    const result = reloadClarityTracker('heatmap');
    setLastReloadInfo(result);
    recordClarityInteraction('clarity_manual_reload_triggered', {
      tab: 'heatmap',
      fixedUrl: result.url,
      fixedIdentifier: result.identifier,
      timestamp: result.timestamp
    });
    setTimeout(() => setIsReloading(false), 500);
  };

  const handleTestInteraction = (name: string) => {
    setTestClickCount((prev) => prev + 1);
    recordClarityInteraction(`heatmap_interaction_${name}`, {
      clickCount: testClickCount + 1,
      selectedMetric: metric,
      district,
      timestamp: new Date().toISOString()
    });
  };

  const activeConfig = CLARITY_PAGE_CONFIGS.heatmap;

  return (
    <div className="space-y-5">
      {/* Top Clarity Tracker Status Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-rose-950 text-white rounded-3xl p-5 shadow-lg border border-slate-700/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                Clarity Live Tracking
              </span>
              <span className="text-xs text-slate-400">
                Project: <strong className="text-slate-200">{CLARITY_PROJECT_ID}</strong>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1.5 flex items-center gap-2">
              <Flame className="w-6 h-6 text-rose-500" />
              Singapore Carpark Heatmap
            </h1>
            <p className="text-xs text-slate-300 max-w-xl mt-1 leading-relaxed">
              Real-time parking density, high-occupancy hotspots, and behavioral analytics with Microsoft Clarity.
            </p>
          </div>

          {/* Clarity SPA Reload Button */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              id="reload-clarity-btn"
              onClick={handleManualReload}
              disabled={isReloading}
              className="flex items-center gap-2 px-3.5 py-2 bg-white/10 hover:bg-white/20 active:bg-white/25 text-white text-xs font-bold rounded-xl border border-white/20 transition-all shadow-sm"
              title="Reloads Clarity tracking context for the current SPA tab"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isReloading ? 'animate-spin text-rose-400' : ''}`} />
              <span>{isReloading ? 'Reloading...' : 'Reload Tracker'}</span>
            </button>

            <button
              id="view-clarity-code-btn"
              onClick={() => setShowCodeDetails(!showCodeDetails)}
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-600/30 hover:bg-rose-600/40 text-rose-200 text-xs font-semibold rounded-xl border border-rose-500/30 transition-all"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{showCodeDetails ? 'Hide Code' : 'Embed Config'}</span>
            </button>
          </div>
        </div>

        {/* Real Fixed Values Display Row */}
        <div className="mt-4 pt-4 border-t border-slate-700/80 grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
          <div className="bg-slate-800/80 rounded-xl p-2.5 border border-slate-700/60">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Fixed page.url
            </span>
            <span className="font-mono text-[11px] text-rose-300 truncate block mt-0.5 font-bold" title={activeConfig.url}>
              {activeConfig.url}
            </span>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-2.5 border border-slate-700/60">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Fixed page.identifier
            </span>
            <span className="font-mono text-[11px] text-amber-300 truncate block mt-0.5 font-bold">
              {activeConfig.identifier}
            </span>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-2.5 border border-slate-700/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                SPA Route Reload
              </span>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active ({lastReloadInfo?.timestamp || 'Just now'})
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              Synced
            </span>
          </div>
        </div>

        {/* Expandable Embedded Clarity Code Inspector */}
        {showCodeDetails && (
          <div className="mt-4 bg-slate-950 rounded-2xl p-4 border border-rose-500/30 text-slate-300 text-xs space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-300 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-rose-400" />
                Clarity Code Snippet (Real Fixed Values Applied)
              </span>
              <span className="text-[10px] text-slate-400">
                Zero commented-out placeholders
              </span>
            </div>

            <pre className="bg-slate-900/90 p-3 rounded-xl overflow-x-auto text-[11px] font-mono text-slate-200 border border-slate-800 leading-relaxed">
{`<!-- Microsoft Clarity Configuration with Real Fixed Values -->
<script type="text/javascript">
  var clarity_config = function () {
    this.page = this.page || {};
    this.page.url = "${activeConfig.url}";
    this.page.identifier = "${activeConfig.identifier}";
  };
  window.clarity_config = clarity_config;
  window.page = {
    url: "${activeConfig.url}",
    identifier: "${activeConfig.identifier}"
  };

  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
</script>`}
            </pre>

            <div className="text-[11px] text-slate-400 leading-relaxed bg-slate-900/50 p-2.5 rounded-xl border border-slate-800 flex items-start gap-2">
              <Info className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>SPA Tab Reload Architecture:</strong> When navigating between <code>explore</code>, <code>map</code>, <code>heatmap</code>, <code>saved</code>, or <code>rates</code>, the application automatically dispatches Clarity <code>identify</code>, updates <code>clarity_config.page</code>, and synchronizes browser history so every tab change is accurately logged as a distinct pageview with behavioral heatmaps.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Control Panel: Heatmap Mode & District Filters */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Metric Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => {
                setMetric('occupancy');
                handleTestInteraction('metric_occupancy');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                metric === 'occupancy'
                  ? 'bg-white text-rose-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Occupancy Pressure</span>
            </button>

            <button
              onClick={() => {
                setMetric('density');
                handleTestInteraction('metric_density');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                metric === 'density'
                  ? 'bg-white text-rose-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Lot Capacity Density</span>
            </button>

            <button
              onClick={() => {
                setMetric('ev');
                handleTestInteraction('metric_ev');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                metric === 'ev'
                  ? 'bg-white text-rose-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>EV Hotspots</span>
            </button>
          </div>

          {/* Heat Radius Slider */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Sliders className="w-3.5 h-3.5" />
            <span>Heat Radius:</span>
            <input
              type="range"
              min="20"
              max="60"
              value={heatRadius}
              onChange={(e) => setHeatRadius(Number(e.target.value))}
              className="w-24 accent-rose-600 cursor-pointer"
            />
            <span className="font-mono text-[11px] text-slate-700 w-6">{heatRadius}px</span>
          </div>
        </div>

        {/* District Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-slate-400 font-semibold mr-1 flex-shrink-0">District:</span>
          {[
            { id: 'all' as DistrictFilter, label: 'All Singapore' },
            { id: 'marina' as DistrictFilter, label: 'Marina Bay / CBD' },
            { id: 'orchard' as DistrictFilter, label: 'Orchard & Somerset' },
            { id: 'bugis' as DistrictFilter, label: 'Bugis & City Hall' },
            { id: 'west' as DistrictFilter, label: 'Jurong & West' },
            { id: 'east' as DistrictFilter, label: 'Tampines & East' },
            { id: 'north' as DistrictFilter, label: 'Toa Payoh & North' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setDistrict(item.id);
                handleTestInteraction(`district_${item.id}`);
              }}
              className={`px-3 py-1 rounded-xl font-semibold whitespace-nowrap transition-all ${
                district === item.id
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Heatmap Metrics Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Overall Occupancy</span>
            <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {stats.overallOccupancyPct}%
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {stats.totalCap - stats.totalAvail} lots parked
          </div>
        </div>

        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Available Lots</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">
            {stats.totalAvail.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Across {stats.totalCarparks} carparks
          </div>
        </div>

        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>High Demand Zones</span>
            <Flame className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-600 mt-1">
            {stats.highCongestionCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            &gt;80% capacity utilized
          </div>
        </div>

        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>EV Charging Ready</span>
            <Zap className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-600 mt-1">
            {stats.evCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Rapid AC/DC stations
          </div>
        </div>
      </div>

      {/* Main Heatmap Visualizer Canvas Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-rose-600" />
              Singapore Thermal Density Map
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Hover or tap any hotspot node to inspect real-time capacity and occupancy metrics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-semibold">Thermal Legend:</span>
            <div className="flex items-center gap-1 text-[10px] font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span className="text-slate-600">Free</span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block ml-1" />
              <span className="text-slate-600">Med</span>
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block ml-1" />
              <span className="text-slate-600">Full</span>
            </div>
          </div>
        </div>

        {/* Heatmap Stage with SVG and Singapore Geographical layout */}
        <div className="relative w-full h-[380px] sm:h-[440px] bg-slate-900 overflow-hidden select-none">
          {/* Subtle Grid and Radar circles background */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* SVG Map Container */}
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              {/* Radial gradients for thermal hotspots */}
              <radialGradient id="heat-high" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.85" />
                <stop offset="40%" stopColor="#f43f5e" stopOpacity="0.45" />
                <stop offset="70%" stopColor="#fb7185" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
              </radialGradient>

              <radialGradient id="heat-med" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="45%" stopColor="#f59e0b" stopOpacity="0.4" />
                <stop offset="75%" stopColor="#fbbf24" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </radialGradient>

              <radialGradient id="heat-low" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.75" />
                <stop offset="45%" stopColor="#10b981" stopOpacity="0.35" />
                <stop offset="75%" stopColor="#34d399" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </radialGradient>

              <radialGradient id="heat-ev" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Singapore stylized coastline reference silhouette */}
            <path
              d="M 12 36 Q 22 28 35 25 Q 52 24 68 25 Q 85 28 92 42 Q 95 56 86 68 Q 72 75 58 76 Q 44 78 30 75 Q 16 68 12 52 Z"
              fill="#1e293b"
              fillOpacity="0.6"
              stroke="#334155"
              strokeWidth="0.4"
            />
            {/* Sentosa island indicator */}
            <ellipse cx="50" cy="85" rx="8" ry="3.5" fill="#1e293b" fillOpacity="0.6" stroke="#334155" strokeWidth="0.3" />

            {/* Thermal Heat Glow Circles */}
            {filteredCarparks.map((cp) => {
              const { x, y } = projectToMap(cp.lat, cp.lng);
              const lots = getLotsForVehicleType(cp, vehicleType);
              const occupancyPct = lots.total > 0 ? ((lots.total - lots.available) / lots.total) * 100 : 0;

              let gradientId = 'heat-low';
              let radiusScale = (heatRadius / 36) * 6;

              if (metric === 'occupancy') {
                if (occupancyPct >= 80) {
                  gradientId = 'heat-high';
                  radiusScale *= 1.4;
                } else if (occupancyPct >= 50) {
                  gradientId = 'heat-med';
                  radiusScale *= 1.1;
                } else {
                  gradientId = 'heat-low';
                  radiusScale *= 0.9;
                }
              } else if (metric === 'density') {
                if (lots.total > 1500) {
                  gradientId = 'heat-high';
                  radiusScale *= 1.5;
                } else if (lots.total > 600) {
                  gradientId = 'heat-med';
                  radiusScale *= 1.2;
                } else {
                  gradientId = 'heat-low';
                }
              } else if (metric === 'ev') {
                if (cp.hasEVCharging) {
                  gradientId = 'heat-ev';
                  radiusScale *= 1.3;
                } else {
                  return null; // hide non-EV in EV mode
                }
              }

              return (
                <circle
                  key={`glow-${cp.id}`}
                  cx={x}
                  cy={y}
                  r={radiusScale}
                  fill={`url(#${gradientId})`}
                  className="pointer-events-none transition-all duration-300"
                />
              );
            })}

            {/* Interactive Node Pins */}
            {filteredCarparks.map((cp) => {
              const { x, y } = projectToMap(cp.lat, cp.lng);
              const lots = getLotsForVehicleType(cp, vehicleType);
              const occupancyPct = lots.total > 0 ? ((lots.total - lots.available) / lots.total) * 100 : 0;
              const isSelected = selectedHotspot?.id === cp.id;

              let pinColor = '#10b981';
              if (occupancyPct >= 80) pinColor = '#f43f5e';
              else if (occupancyPct >= 50) pinColor = '#f59e0b';

              return (
                <g
                  key={`pin-${cp.id}`}
                  className="cursor-pointer transition-transform hover:scale-125"
                  onClick={() => {
                    setSelectedHotspot(cp);
                    handleTestInteraction(`carpark_click_${cp.code}`);
                  }}
                >
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 2.6 : 1.6}
                    fill={pinColor}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? 0.8 : 0.4}
                  />
                  {isSelected && (
                    <circle
                      cx={x}
                      cy={y}
                      r={3.8}
                      fill="none"
                      stroke={pinColor}
                      strokeWidth={0.5}
                      strokeDasharray="1,1"
                      className="animate-spin"
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* District Labels Overlay */}
          <div className="absolute top-3 left-4 text-[10px] font-bold text-slate-400/80 pointer-events-none">
            NORTH (Woodlands)
          </div>
          <div className="absolute top-1/2 left-4 text-[10px] font-bold text-slate-400/80 pointer-events-none">
            WEST (Jurong)
          </div>
          <div className="absolute top-1/2 right-4 text-[10px] font-bold text-slate-400/80 pointer-events-none">
            EAST (Changi & Tampines)
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-rose-400/90 pointer-events-none">
            CENTRAL / CBD & MARINA BAY
          </div>

          {/* Selected Hotspot Floating Popover */}
          {selectedHotspot && (
            <div className="absolute top-4 right-4 z-20 w-72 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl border border-slate-200 text-slate-900 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                    {selectedHotspot.area} • {selectedHotspot.code}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 mt-0.5 line-clamp-1">
                    {selectedHotspot.name}
                  </h4>
                </div>
                <button
                  onClick={() => setSelectedHotspot(null)}
                  className="text-slate-400 hover:text-slate-600 text-xs px-1"
                >
                  ✕
                </button>
              </div>

              {(() => {
                const lots = getLotsForVehicleType(selectedHotspot, vehicleType);
                const occ = lots.total > 0 ? Math.round(((lots.total - lots.available) / lots.total) * 100) : 0;
                return (
                  <div className="mt-2.5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Available:</span>
                      <strong className="text-slate-900">
                        {lots.available} / {lots.total} lots
                      </strong>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          occ >= 80 ? 'bg-rose-500' : occ >= 50 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${occ}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Occupancy:</span>
                      <span className="font-bold text-slate-800">{occ}% Full</span>
                    </div>

                    <div className="pt-2 flex gap-2">
                      <button
                        onClick={() => onSelectCarpark(selectedHotspot)}
                        className="flex-1 py-1.5 bg-slate-900 text-white rounded-xl text-[11px] font-bold hover:bg-slate-800"
                      >
                        Inspect Rates
                      </button>
                      <button
                        onClick={() => onShowOnMap(selectedHotspot)}
                        className="flex-1 py-1.5 bg-rose-50 text-rose-700 rounded-xl text-[11px] font-bold hover:bg-rose-100"
                      >
                        Show on Map
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Behavioral Interaction Zone for Clarity Recording */}
      <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <MousePointerClick className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Clarity Behavioral Heatmap &amp; Session Test Pad
              </h3>
              <p className="text-xs text-slate-500">
                Interact with the controls below. Microsoft Clarity captures genuine clicks, scroll depth, and taps.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-xl">
            {testClickCount} Events Generated
          </span>
        </div>

        {/* Interactive Test Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <button
            id="clarity-test-click-hotspots"
            onClick={() => handleTestInteraction('find_cbd_hotspot')}
            className="p-3 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-2xl text-left transition-all group"
          >
            <span className="text-[10px] text-slate-400 font-semibold uppercase block group-hover:text-rose-600">
              Query
            </span>
            <span className="text-xs font-bold text-slate-800 block mt-0.5">
              CBD Hotspots
            </span>
          </button>

          <button
            id="clarity-test-click-ev"
            onClick={() => handleTestInteraction('scan_ev_chargers')}
            className="p-3 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-200 rounded-2xl text-left transition-all group"
          >
            <span className="text-[10px] text-slate-400 font-semibold uppercase block group-hover:text-amber-600">
              Filter
            </span>
            <span className="text-xs font-bold text-slate-800 block mt-0.5">
              EV High-Speed
            </span>
          </button>

          <button
            id="clarity-test-click-cheap"
            onClick={() => handleTestInteraction('find_cheapest_rates')}
            className="p-3 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-2xl text-left transition-all group"
          >
            <span className="text-[10px] text-slate-400 font-semibold uppercase block group-hover:text-emerald-600">
              Analyze
            </span>
            <span className="text-xs font-bold text-slate-800 block mt-0.5">
              Budget Parking
            </span>
          </button>

          <button
            id="clarity-test-rage-click"
            onClick={() => handleTestInteraction('simulated_rage_click')}
            className="p-3 bg-white hover:bg-slate-100 border border-slate-200 rounded-2xl text-left transition-all group"
          >
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">
              Behavior
            </span>
            <span className="text-xs font-bold text-slate-800 block mt-0.5">
              Tap / Scroll Test
            </span>
          </button>
        </div>

        {/* Quick Driver Feedback Micro-Poll */}
        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <span className="font-semibold text-slate-700">
            Driving in Singapore right now? How is carpark lot availability?
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {['Very Crowded', 'Moderate', 'Plenty of Lots'].map((option) => (
              <button
                key={option}
                onClick={() => {
                  setPollVote(option);
                  handleTestInteraction(`poll_vote_${option.replace(/\s+/g, '_').toLowerCase()}`);
                }}
                className={`px-3 py-1 rounded-xl font-bold transition-all ${
                  pollVote === option
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200'
                }`}
              >
                {option} {pollVote === option ? '✓' : ''}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top 5 High-Occupancy Hotspots in Singapore */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-rose-600" />
              Highest Demand Parking Hotspots
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Carparks with the steepest demand curves and least available lots in real-time.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-400">Live Snapshot</span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredCarparks
            .slice()
            .sort((a, b) => {
              const aLots = getLotsForVehicleType(a, vehicleType);
              const bLots = getLotsForVehicleType(b, vehicleType);
              const aOcc = aLots.total > 0 ? (aLots.total - aLots.available) / aLots.total : 0;
              const bOcc = bLots.total > 0 ? (bLots.total - bLots.available) / bLots.total : 0;
              return bOcc - aOcc;
            })
            .slice(0, 5)
            .map((cp, idx) => {
              const lots = getLotsForVehicleType(cp, vehicleType);
              const occPct = lots.total > 0 ? Math.round(((lots.total - lots.available) / lots.total) * 100) : 0;
              return (
                <div
                  key={cp.id}
                  onClick={() => onSelectCarpark(cp)}
                  className="py-3 flex items-center justify-between hover:bg-slate-50/80 px-2 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1 pr-3">
                    <span className="w-5 text-center font-black text-xs text-slate-400">
                      #{idx + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900 truncate">
                          {cp.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                          {cp.agency}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {cp.area} • {cp.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-900">
                        {lots.available} lots left
                      </div>
                      <div
                        className={`text-[10px] font-black ${
                          occPct >= 80
                            ? 'text-rose-600'
                            : occPct >= 50
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {occPct}% Full
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
