import React from 'react';
import { TechnicalPersonnel } from '../types';
import { WORK_MODE_CONFIG, PAYMENT_MODE_CONFIG } from '../data/seedPersonnel';
import { ShieldCheck, MapPin, Briefcase, Wrench } from 'lucide-react';

interface PersonnelCardProps {
  personnel: TechnicalPersonnel;
  onSelect: (personnel: TechnicalPersonnel) => void;
  onQuickBook: (personnel: TechnicalPersonnel) => void;
  onMeetTechnician?: (personnel: TechnicalPersonnel) => void;
}

export const PersonnelCard: React.FC<PersonnelCardProps> = ({
  personnel,
  onSelect,
  onQuickBook,
  onMeetTechnician,
}) => {
  // Primary rate indicator
  const primaryRate = personnel.paymentStructure.dayRate
    ? `${personnel.paymentStructure.dayRate.currency} ${personnel.paymentStructure.dayRate.amount}/day`
    : personnel.paymentStructure.hourlyRate
    ? `${personnel.paymentStructure.hourlyRate.currency} ${personnel.paymentStructure.hourlyRate.amount}/hr`
    : personnel.paymentStructure.monthlyRetainer
    ? `${personnel.paymentStructure.monthlyRetainer.currency} ${personnel.paymentStructure.monthlyRetainer.amount}/mo`
    : 'Custom Quote';

  const initials = personnel.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all flex flex-col justify-between group shadow-xs">
      <div>
        {/* Top Header: Avatar & Core Information */}
        <div className="flex items-start gap-3.5 mb-3.5">
          <div className="relative shrink-0">
            {personnel.avatarUrl ? (
              <img
                src={personnel.avatarUrl}
                alt={personnel.fullName}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-semibold text-sm">
                {initials}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="font-semibold text-slate-900 text-base leading-snug truncate">
                {personnel.fullName}
              </h3>
              <span className="text-xs font-mono tabular-nums text-slate-700 font-medium shrink-0">
                ★ {personnel.rating.toFixed(2)} ({personnel.reviewCount})
              </span>
            </div>

            <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
              {personnel.title}
            </p>

            {/* Zero-Pill unboxed metadata line */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <span>{personnel.discipline}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{personnel.yearsExperience} yrs exp</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-0.5 truncate">
                <MapPin className="w-3 h-3 shrink-0" />
                {personnel.location}
              </span>
            </div>
          </div>
        </div>

        {/* Short Bio */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {personnel.bio}
        </p>

        {/* Modes of Work (Clean unboxed typographic line) */}
        <div className="mb-3.5 pt-3 border-t border-slate-100">
          <div className="text-[11px] font-medium text-slate-400 mb-1">
            Modes of Work
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-700">
            {personnel.workModes.map((mode, idx) => (
              <React.Fragment key={mode}>
                <span className="font-medium text-slate-800">
                  {WORK_MODE_CONFIG[mode]?.label || mode}
                </span>
                {idx < personnel.workModes.length - 1 && (
                  <span className="text-slate-300" aria-hidden="true">
                    /
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Payment Modes & Rate Highlight */}
        <div className="mb-4 pt-3 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-[11px] font-medium text-slate-400">
              Payment &amp; Rates
            </span>
            <span className="text-xs font-mono tabular-nums font-semibold text-slate-900">
              {primaryRate}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-1.5 text-xs text-slate-500">
            {personnel.paymentModes.map((pMode, idx) => (
              <React.Fragment key={pMode}>
                <span>{PAYMENT_MODE_CONFIG[pMode]?.label || pMode}</span>
                {idx < personnel.paymentModes.length - 1 && (
                  <span className="text-slate-300" aria-hidden="true">
                    ·
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Verified credentials & Anti-theft bonded teaser */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-4 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <div className="flex items-center gap-1.5 truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="truncate">
              {personnel.certifications.length > 0
                ? `${personnel.certifications[0].name}`
                : 'ID & Tool Bond Verified'}
            </span>
          </div>
          <span className="font-mono tabular-nums text-slate-600 shrink-0 ml-2">
            {personnel.completedJobs} jobs ({personnel.onTimeDispatchRate}% on-time)
          </span>
        </div>
      </div>

      {/* Action Buttons: View Profile, Meet Technician, Book */}
      <div className="grid grid-cols-3 gap-2 pt-2">
        <button
          onClick={() => onSelect(personnel)}
          className="px-2 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer text-center truncate"
        >
          Profile
        </button>
        <button
          onClick={() => onMeetTechnician?.(personnel)}
          className="px-2 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer text-center truncate"
          title="Schedule direct client-technician consultation"
        >
          Meet Tech
        </button>
        <button
          onClick={() => onQuickBook(personnel)}
          className="px-2 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer text-center truncate"
        >
          Dispatch
        </button>
      </div>
    </div>
  );
};
