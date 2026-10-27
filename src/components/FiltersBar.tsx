import React from 'react';
import { ClientNeedFilter, WorkMode, PaymentMode, TechnicalDiscipline } from '../types';
import { Search, SlidersHorizontal, LayoutGrid, Table, X } from 'lucide-react';
import { WORK_MODE_CONFIG, PAYMENT_MODE_CONFIG } from '../data/seedPersonnel';

interface FiltersBarProps {
  filter: ClientNeedFilter;
  onFilterChange: (updated: Partial<ClientNeedFilter>) => void;
  onReset: () => void;
  totalCount: number;
  filteredCount: number;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  onOpenMatchmaker: () => void;
}

const DISCIPLINES: TechnicalDiscipline[] = [
  'Automation & Robotics',
  'Cloud & DevOps Architecture',
  'Electrical & Power Systems',
  'Embedded & Firmware',
  'HVAC & Thermal Systems',
  'Cybersecurity & ICS Audit',
  'Mechanical & CNC Fabrication',
  'Data & Machine Learning',
  'Telecommunications & Fiber',
  'Civil & Structural Inspection',
];

export const FiltersBar: React.FC<FiltersBarProps> = ({
  filter,
  onFilterChange,
  onReset,
  totalCount,
  filteredCount,
  viewMode,
  onViewModeChange,
  onOpenMatchmaker,
}) => {
  const isFiltered =
    filter.query !== '' ||
    filter.discipline !== 'all' ||
    filter.workMode !== 'all' ||
    filter.paymentMode !== 'all' ||
    filter.availability !== 'all';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs mb-6 space-y-4">
      {/* Top Search & Smart Match CTA */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by technical discipline, equipment, PLC/hardware, city, or engineer name..."
            value={filter.query}
            onChange={(e) => onFilterChange({ query: e.target.value })}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition-all"
          />
          {filter.query && (
            <button
              onClick={() => onFilterChange({ query: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenMatchmaker}
            className="px-3.5 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-700" />
            <span>Smart Match Wizard</span>
          </button>

          {/* Grid vs Table View Toggle */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200">
            <button
              onClick={() => onViewModeChange('grid')}
              title="Card Grid View"
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              title="High-Density Table View"
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Table className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Structured Filter Row: Mode of Work */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500 w-24 shrink-0">
            Mode of Work:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => onFilterChange({ workMode: 'all' })}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                filter.workMode === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              All Modes
            </button>
            {(Object.keys(WORK_MODE_CONFIG) as WorkMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => onFilterChange({ workMode: mode })}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  filter.workMode === mode
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {WORK_MODE_CONFIG[mode].label}
              </button>
            ))}
          </div>
        </div>

        {/* Structured Filter Row: Payment Mode */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500 w-24 shrink-0">
            Payment Mode:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => onFilterChange({ paymentMode: 'all' })}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                filter.paymentMode === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              All Payment Models
            </button>
            {(Object.keys(PAYMENT_MODE_CONFIG) as PaymentMode[]).map((pMode) => (
              <button
                key={pMode}
                onClick={() => onFilterChange({ paymentMode: pMode })}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  filter.paymentMode === pMode
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {PAYMENT_MODE_CONFIG[pMode].label}
              </button>
            ))}
          </div>
        </div>

        {/* Row 3: Discipline selector + Availability + Reset */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Discipline:</span>
              <select
                value={filter.discipline}
                onChange={(e) => onFilterChange({ discipline: e.target.value })}
                className="text-xs py-1 px-2.5 bg-slate-50 border border-slate-200 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
              >
                <option value="all">All Engineering Disciplines</option>
                {DISCIPLINES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Availability:</span>
              <select
                value={filter.availability}
                onChange={(e) => onFilterChange({ availability: e.target.value })}
                className="text-xs py-1 px-2.5 bg-slate-50 border border-slate-200 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
              >
                <option value="all">Any Availability</option>
                <option value="immediate">Available Immediately</option>
                <option value="within_48h">Within 48 Hours</option>
                <option value="advisory_only">Advisory / Part-Time</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Sort:</span>
              <select
                value={filter.sortBy}
                onChange={(e) =>
                  onFilterChange({
                    sortBy: e.target.value as ClientNeedFilter['sortBy'],
                  })
                }
                className="text-xs py-1 px-2.5 bg-slate-50 border border-slate-200 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
              >
                <option value="match">Best Client Match</option>
                <option value="rating">Highest Rated</option>
                <option value="experience">Years of Experience</option>
                <option value="price_asc">Rate (Lowest First)</option>
                <option value="price_desc">Rate (Highest First)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono tabular-nums text-slate-500">
              Showing {filteredCount} of {totalCount} technical personnel
            </span>

            {isFiltered && (
              <button
                onClick={onReset}
                className="text-xs text-rose-600 hover:text-rose-800 font-medium underline underline-offset-2 cursor-pointer"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
