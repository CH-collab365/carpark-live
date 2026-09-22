import React from 'react';
import { AvailabilityFilter } from '../types';
import { SlidersHorizontal, Zap, Building2, CheckCircle, ArrowUpDown } from 'lucide-react';

interface FilterBarProps {
  filter: AvailabilityFilter;
  onChangeFilter: (f: AvailabilityFilter) => void;
  sortBy: 'distance' | 'lots' | 'name';
  onChangeSortBy: (s: 'distance' | 'lots' | 'name') => void;
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  onChangeFilter,
  sortBy,
  onChangeSortBy,
  totalCount
}) => {
  const filterOptions: { id: AvailabilityFilter; label: string; icon?: React.ReactNode }[] = [
    { id: 'all', label: 'All Lots' },
    { id: 'ample', label: 'Ample Lots (>50)' },
    { id: 'available', label: 'Has Vacancy (>0)' },
    { id: 'ev', label: 'EV Charging', icon: <Zap className="w-3 h-3 text-emerald-500" /> },
    { id: 'hdb', label: 'HDB & URA', icon: <Building2 className="w-3 h-3" /> },
    { id: 'commercial', label: 'Malls & Retail' }
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1 pb-2">
      {/* Scrollable Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scrollbar-none pb-1 sm:pb-0">
        {filterOptions.map((opt) => {
          const isActive = filter === opt.id;
          return (
            <button
              key={opt.id}
              id={`filter-pill-${opt.id}`}
              onClick={() => onChangeFilter(opt.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200/90 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sort selection & match count */}
      <div className="flex items-center justify-between sm:justify-end gap-2 text-xs text-slate-500 flex-shrink-0">
        <span className="font-semibold text-slate-700">
          {totalCount} {totalCount === 1 ? 'carpark' : 'carparks'}
        </span>

        <div className="flex items-center gap-1 bg-white border border-slate-200/90 rounded-xl px-2.5 py-1">
          <ArrowUpDown className="w-3 h-3 text-slate-400" />
          <select
            id="sort-by-select"
            value={sortBy}
            onChange={(e) => onChangeSortBy(e.target.value as any)}
            className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="distance">Nearest First</option>
            <option value="lots">Most Available Lots</option>
            <option value="name">Alphabetical</option>
          </select>
        </div>
      </div>
    </div>
  );
};
