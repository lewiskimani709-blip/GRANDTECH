import React from 'react';
import { TechnicalPersonnel } from '../types';
import { WORK_MODE_CONFIG, PAYMENT_MODE_CONFIG } from '../data/seedPersonnel';
import { MapPin, ShieldCheck, ChevronRight } from 'lucide-react';

interface PersonnelTableViewProps {
  personnelList: TechnicalPersonnel[];
  onSelect: (personnel: TechnicalPersonnel) => void;
  onQuickBook: (personnel: TechnicalPersonnel) => void;
  onMeetTechnician?: (personnel: TechnicalPersonnel) => void;
}

export const PersonnelTableView: React.FC<PersonnelTableViewProps> = ({
  personnelList,
  onSelect,
  onQuickBook,
  onMeetTechnician,
}) => {
  if (personnelList.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
        <p className="text-sm text-slate-500 font-medium">
          No technical personnel match your current search and filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              <th className="py-3 px-4">Technical Personnel</th>
              <th className="py-3 px-4">Discipline & Exp</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Modes of Work</th>
              <th className="py-3 px-4">Payment Structure</th>
              <th className="py-3 px-4">Performance</th>
              <th className="py-3 px-4 text-right">Dispatch Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {personnelList.map((person) => {
              const primaryRate = person.paymentStructure.dayRate
                ? `${person.paymentStructure.dayRate.currency} ${person.paymentStructure.dayRate.amount}/day`
                : person.paymentStructure.hourlyRate
                ? `${person.paymentStructure.hourlyRate.currency} ${person.paymentStructure.hourlyRate.amount}/hr`
                : person.paymentStructure.monthlyRetainer
                ? `${person.paymentStructure.monthlyRetainer.currency} ${person.paymentStructure.monthlyRetainer.amount}/mo`
                : 'Custom';

              const initials = person.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .substring(0, 2);

              return (
                <tr
                  key={person.id}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => onSelect(person)}
                >
                  {/* Column 1: Personnel Info */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {person.avatarUrl ? (
                        <img
                          src={person.avatarUrl}
                          alt={person.fullName}
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-md object-cover bg-slate-100 border border-slate-200 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center font-semibold text-slate-700 shrink-0 text-xs">
                          {initials}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 truncate">
                          {person.fullName}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {person.title}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Column 2: Discipline */}
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-800">
                      {person.discipline}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                      {person.seniority} · {person.yearsExperience} yrs
                    </div>
                  </td>

                  {/* Column 3: Location */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 text-slate-700">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{person.location}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono tabular-nums">
                      {person.timezone}
                    </div>
                  </td>

                  {/* Column 4: Modes of Work */}
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap items-center gap-x-1.5 text-slate-700">
                      {person.workModes.map((wm, i) => (
                        <React.Fragment key={wm}>
                          <span className="font-medium text-slate-800">
                            {WORK_MODE_CONFIG[wm]?.label || wm}
                          </span>
                          {i < person.workModes.length - 1 && (
                            <span className="text-slate-300">/</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {person.availabilityStatus === 'immediate'
                        ? 'Available Immediately'
                        : person.availabilityStatus === 'within_48h'
                        ? 'Notice: 48h'
                        : 'Advisory'}
                    </div>
                  </td>

                  {/* Column 5: Payment Structure */}
                  <td className="py-3 px-4">
                    <div className="font-mono tabular-nums font-semibold text-slate-900">
                      {primaryRate}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      {person.paymentModes.map((pm, idx) => (
                        <React.Fragment key={pm}>
                          <span>{PAYMENT_MODE_CONFIG[pm]?.label || pm}</span>
                          {idx < person.paymentModes.length - 1 && (
                            <span className="text-slate-300">·</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </td>

                  {/* Column 6: Rating & Reliability */}
                  <td className="py-3 px-4">
                    <div className="font-mono tabular-nums font-medium text-slate-800">
                      ★ {person.rating.toFixed(2)} ({person.completedJobs} jobs)
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-slate-600" />
                      <span>{person.onTimeDispatchRate}% on-time</span>
                    </div>
                  </td>

                  {/* Column 7: Dispatch Action */}
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onMeetTechnician?.(person)}
                        className="px-2.5 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap cursor-pointer"
                        title="Meet Technician"
                      >
                        Meet
                      </button>
                      <button
                        onClick={() => onQuickBook(person)}
                        className="px-2.5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer shadow-xs"
                      >
                        Dispatch
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
