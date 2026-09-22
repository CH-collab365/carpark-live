import React from 'react';
import { Compass, Map, Flame, Heart, Info } from 'lucide-react';

export type NavTab = 'explore' | 'map' | 'heatmap' | 'saved' | 'rates';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  savedCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  savedCount
}) => {
  const tabs = [
    {
      id: 'explore' as NavTab,
      label: 'Explore',
      icon: Compass,
      desc: 'Search & List'
    },
    {
      id: 'map' as NavTab,
      label: 'Map View',
      icon: Map,
      desc: 'Interactive Map'
    },
    {
      id: 'heatmap' as NavTab,
      label: 'Heatmap',
      icon: Flame,
      desc: 'Occupancy & Clarity'
    },
    {
      id: 'saved' as NavTab,
      label: 'Saved',
      icon: Heart,
      desc: 'Favorites',
      badge: savedCount > 0 ? savedCount : undefined
    },
    {
      id: 'rates' as NavTab,
      label: 'SG Info',
      icon: Info,
      desc: 'Rates & API'
    }
  ];

  return (
    <nav
      id="singapore-bottom-navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]"
    >
      <div className="max-w-md mx-auto px-4 py-2 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`bottom-nav-tab-${tab.id}`}
              onClick={() => onChangeTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-rose-600 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight">
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
