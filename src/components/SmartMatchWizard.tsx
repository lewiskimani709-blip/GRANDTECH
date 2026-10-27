import React, { useState, useMemo } from 'react';
import { TechnicalPersonnel, WorkMode, PaymentMode, TechnicalDiscipline } from '../types';
import { WORK_MODE_CONFIG, PAYMENT_MODE_CONFIG, PAYOUT_METHOD_CONFIG } from '../data/seedPersonnel';
import { X, Check, SlidersHorizontal, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

interface SmartMatchWizardProps {
  personnelList: TechnicalPersonnel[];
  isOpen: boolean;
  onClose: () => void;
  onSelectPersonnel: (person: TechnicalPersonnel) => void;
  onDirectDispatch: (person: TechnicalPersonnel, matchDetails?: { workMode: WorkMode; paymentMode: PaymentMode }) => void;
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

export const SmartMatchWizard: React.FC<SmartMatchWizardProps> = ({
  personnelList,
  isOpen,
  onClose,
  onSelectPersonnel,
  onDirectDispatch,
}) => {
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('Automation & Robotics');
  const [selectedWorkMode, setSelectedWorkMode] = useState<WorkMode>('onsite');
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<PaymentMode>('day_rate');
  const [urgency, setUrgency] = useState<'immediate' | 'within_48h' | 'flexible'>('immediate');
  const [budgetConstraint, setBudgetConstraint] = useState<number>(1200);

  // Calculate Match Score for each engineer
  const matchedResults = useMemo(() => {
    return personnelList
      .map((person) => {
        let score = 0;
        const reasons: string[] = [];

        // 1. Discipline Match (40 pts)
        if (person.discipline === selectedDiscipline) {
          score += 40;
          reasons.push(`Exact discipline match in ${person.discipline}`);
        } else {
          score += 5;
        }

        // 2. Work Mode Match (25 pts)
        if (person.workModes.includes(selectedWorkMode)) {
          score += 25;
          reasons.push(`Directly supports ${WORK_MODE_CONFIG[selectedWorkMode].label}`);
        }

        // 3. Payment Mode Match (20 pts)
        if (person.paymentModes.includes(selectedPaymentMode)) {
          score += 20;
          reasons.push(`Contractible under ${PAYMENT_MODE_CONFIG[selectedPaymentMode].label}`);
        }

        // 4. Availability & SLA (15 pts)
        if (urgency === 'immediate') {
          if (person.availabilityStatus === 'immediate') {
            score += 15;
            reasons.push('Available immediately for mobilization');
          } else if (person.availabilityStatus === 'within_48h') {
            score += 8;
          }
        } else {
          score += 15;
        }

        return {
          person,
          matchScore: Math.min(100, score),
          reasons,
        };
      })
      .filter((item) => item.matchScore >= 40)
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [personnelList, selectedDiscipline, selectedWorkMode, selectedPaymentMode, urgency]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Smart Client Matchmaker
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Specify your project requirements, mode of work, and preferred payment structure to find matching verified engineers.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Controls */}
        <div className="p-6 border-b border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-5 bg-white">
          {/* Step 1: Discipline */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              1. Technical Discipline
            </label>
            <select
              value={selectedDiscipline}
              onChange={(e) => setSelectedDiscipline(e.target.value)}
              className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              {DISCIPLINES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Mode of Work */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              2. Required Mode of Work
            </label>
            <select
              value={selectedWorkMode}
              onChange={(e) => setSelectedWorkMode(e.target.value as WorkMode)}
              className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              {(Object.keys(WORK_MODE_CONFIG) as WorkMode[]).map((mode) => (
                <option key={mode} value={mode}>
                  {WORK_MODE_CONFIG[mode].label}
                </option>
              ))}
            </select>
          </div>

          {/* Step 3: Preferred Payment Structure */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              3. Preferred Payment Structure
            </label>
            <select
              value={selectedPaymentMode}
              onChange={(e) => setSelectedPaymentMode(e.target.value as PaymentMode)}
              className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              {(Object.keys(PAYMENT_MODE_CONFIG) as PaymentMode[]).map((pMode) => (
                <option key={pMode} value={pMode}>
                  {PAYMENT_MODE_CONFIG[pMode].label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Stream */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4 bg-slate-50/50">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-medium">
              Ranked Matches for: <strong className="text-slate-800">{selectedDiscipline}</strong> ·{' '}
              <strong className="text-slate-800">{WORK_MODE_CONFIG[selectedWorkMode].label}</strong> ·{' '}
              <strong className="text-slate-800">{PAYMENT_MODE_CONFIG[selectedPaymentMode].label}</strong>
            </span>
            <span className="font-mono tabular-nums">{matchedResults.length} qualified personnel</span>
          </div>

          {matchedResults.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
              <p className="text-sm text-slate-600">
                No personnel found matching this combination. Try broadening your work mode or payment preference.
              </p>
            </div>
          ) : (
            matchedResults.map(({ person, matchScore, reasons }) => {
              const initials = person.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .substring(0, 2);

              return (
                <div
                  key={person.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {person.avatarUrl ? (
                      <img
                        src={person.avatarUrl}
                        alt={person.fullName}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-semibold text-slate-700 shrink-0 text-sm">
                        {initials}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm">
                          {person.fullName}
                        </span>
                        <span className="text-xs text-slate-500">
                          {person.title}
                        </span>
                        <span className="text-xs font-mono tabular-nums text-slate-700 font-semibold ml-auto md:ml-0">
                          ★ {person.rating.toFixed(2)}
                        </span>
                      </div>

                      {/* Unboxed reasons */}
                      <div className="flex flex-wrap items-center gap-x-2 text-xs text-slate-600 mt-1">
                        {reasons.slice(0, 3).map((reason, idx) => (
                          <React.Fragment key={idx}>
                            <span>{reason}</span>
                            {idx < Math.min(2, reasons.length - 1) && (
                              <span className="text-slate-300" aria-hidden="true">
                                ·
                              </span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>

                      {/* Rates line */}
                      <div className="text-xs font-mono tabular-nums text-slate-500 mt-1.5 flex items-center gap-2">
                        <span className="text-slate-800 font-semibold">
                          {person.paymentStructure.dayRate
                            ? `${person.paymentStructure.dayRate.currency} ${person.paymentStructure.dayRate.amount}/day`
                            : person.paymentStructure.hourlyRate
                            ? `${person.paymentStructure.hourlyRate.currency} ${person.paymentStructure.hourlyRate.amount}/hr`
                            : 'Contract Quote'}
                        </span>
                        <span>·</span>
                        <span>Location: {person.location}</span>
                        <span>·</span>
                        <span>{person.onTimeDispatchRate}% On-Time Record</span>
                      </div>
                    </div>
                  </div>

                  {/* Right side: Score & Action */}
                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                    <div className="text-right">
                      <div className="text-xs text-slate-400 font-medium">Fit Score</div>
                      <div className="text-base font-mono tabular-nums font-bold text-slate-900">
                        {matchScore}%
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onDirectDispatch(person, {
                          workMode: selectedWorkMode,
                          paymentMode: selectedPaymentMode,
                        });
                      }}
                      className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                    >
                      Dispatch Now
                    </button>

                    <button
                      onClick={() => {
                        onClose();
                        onSelectPersonnel(person);
                      }}
                      className="px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Profile
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Every technical engineer on Technix is identity-verified with licensed insurance and tool certification.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
