import React, { useState } from 'react';
import { TechnicalPersonnel, WorkMode, PaymentMode } from '../types';
import { WORK_MODE_CONFIG, PAYMENT_MODE_CONFIG, PAYOUT_METHOD_CONFIG } from '../data/seedPersonnel';
import { X, ShieldCheck, MapPin, Wrench, Clock, DollarSign, Calculator, CheckCircle2 } from 'lucide-react';

interface PersonnelDetailModalProps {
  personnel: TechnicalPersonnel | null;
  isOpen: boolean;
  onClose: () => void;
  onBook: (personnel: TechnicalPersonnel, mode?: WorkMode, payment?: PaymentMode) => void;
  onMeetTechnician?: (personnel: TechnicalPersonnel) => void;
}

export const PersonnelDetailModal: React.FC<PersonnelDetailModalProps> = ({
  personnel,
  isOpen,
  onClose,
  onBook,
  onMeetTechnician,
}) => {
  if (!isOpen || !personnel) return null;

  // Rate calculator state
  const [calcWorkMode, setCalcWorkMode] = useState<WorkMode>(personnel.workModes[0]);
  const [calcPaymentMode, setCalcPaymentMode] = useState<PaymentMode>(personnel.paymentModes[0]);
  const [calcUnits, setCalcUnits] = useState<number>(3); // e.g. 3 days or 20 hours

  // Calculate dynamic quote
  let estimatedCost = 0;
  let unitLabel = '';

  if (calcPaymentMode === 'day_rate' && personnel.paymentStructure.dayRate) {
    estimatedCost = personnel.paymentStructure.dayRate.amount * calcUnits;
    unitLabel = `${calcUnits} field days @ ${personnel.paymentStructure.dayRate.currency} ${personnel.paymentStructure.dayRate.amount}/day`;
  } else if (calcPaymentMode === 'hourly' && personnel.paymentStructure.hourlyRate) {
    const hours = Math.max(calcUnits, personnel.paymentStructure.hourlyRate.minHours || 1);
    estimatedCost = personnel.paymentStructure.hourlyRate.amount * hours;
    unitLabel = `${hours} technical hours @ ${personnel.paymentStructure.hourlyRate.currency} ${personnel.paymentStructure.hourlyRate.amount}/hr`;
  } else if (calcPaymentMode === 'monthly_retainer' && personnel.paymentStructure.monthlyRetainer) {
    estimatedCost = personnel.paymentStructure.monthlyRetainer.amount * Math.max(1, Math.round(calcUnits / 30));
    unitLabel = `Dedicated monthly retainer reservation`;
  } else if (calcPaymentMode === 'emergency_surge' && personnel.paymentStructure.emergencySurge) {
    const base = personnel.paymentStructure.emergencySurge.calloutBaseFee;
    const hours = calcUnits;
    estimatedCost = base + hours * personnel.paymentStructure.emergencySurge.hourlySurcharge;
    unitLabel = `Base callout (${personnel.paymentStructure.emergencySurge.calloutBaseFee}) + ${hours} emergency hrs`;
  } else if (personnel.paymentStructure.milestoneFixed) {
    estimatedCost = personnel.paymentStructure.milestoneFixed.minProjectRate;
    unitLabel = `Base milestone quote baseline`;
  }

  const initials = personnel.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono uppercase text-slate-500 font-semibold tracking-wider">
              Technical Personnel Dossier
            </span>
            <span className="text-slate-300" aria-hidden="true">/</span>
            <span className="text-xs font-mono text-slate-700 font-semibold">{personnel.id}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Top Profile Summary */}
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div className="shrink-0">
              {personnel.avatarUrl ? (
                <img
                  src={personnel.avatarUrl}
                  alt={personnel.fullName}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-xl object-cover bg-slate-100 border border-slate-200"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xl">
                  {initials}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-xl font-bold text-slate-900">
                  {personnel.fullName}
                </h2>
                <div className="flex items-center gap-2 font-mono tabular-nums text-xs">
                  <span className="font-semibold text-slate-900">★ {personnel.rating.toFixed(2)}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-600">{personnel.completedJobs} jobs completed</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-emerald-700 font-medium">{personnel.onTimeDispatchRate}% on-time</span>
                </div>
              </div>

              <p className="text-sm font-medium text-slate-700 mt-0.5">
                {personnel.title}
              </p>

              {/* Zero-Pill Unboxed Metadata */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 mt-2">
                <span>{personnel.discipline}</span>
                <span aria-hidden="true">·</span>
                <span>{personnel.seniority}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{personnel.yearsExperience} years field experience</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {personnel.location} ({personnel.timezone})
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mt-3">
                {personnel.bio}
              </p>
            </div>
          </div>

          {/* Section: Modes of Work Matrix */}
          <div className="border-t border-slate-200 pt-5">
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
              Modes of Work & Field Deployment Capabilities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {personnel.workModeDetails.map((detail) => (
                <div
                  key={detail.mode}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-slate-900">
                      {WORK_MODE_CONFIG[detail.mode]?.label || detail.mode}
                    </span>
                    <span className="text-emerald-700 font-medium">Verified Active</span>
                  </div>
                  <p className="text-slate-600 mb-2 leading-relaxed">
                    {detail.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-2 text-[11px] font-mono text-slate-500">
                    {detail.maxTravelDistanceKm && (
                      <span>Travel Radius: up to {detail.maxTravelDistanceKm} km</span>
                    )}
                    {detail.noticePeriodHours && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>Notice SLA: {detail.noticePeriodHours}h dispatch window</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Payment Modes & Rate Matrix */}
          <div className="border-t border-slate-200 pt-5">
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
              Payment Modes & Structured Tariff
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {personnel.paymentStructure.dayRate && (
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <span className="text-[11px] font-medium text-slate-500 block mb-1">
                    Day Rate / Per Diem
                  </span>
                  <div className="text-base font-bold font-mono tabular-nums text-slate-900">
                    {personnel.paymentStructure.dayRate.currency} {personnel.paymentStructure.dayRate.amount}
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Per {personnel.paymentStructure.dayRate.hoursPerDay}h operational shift
                  </span>
                </div>
              )}

              {personnel.paymentStructure.hourlyRate && (
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <span className="text-[11px] font-medium text-slate-500 block mb-1">
                    Hourly Metered Rate
                  </span>
                  <div className="text-base font-bold font-mono tabular-nums text-slate-900">
                    {personnel.paymentStructure.hourlyRate.currency} {personnel.paymentStructure.hourlyRate.amount}/hr
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Min {personnel.paymentStructure.hourlyRate.minHours || 1} hours reservation
                  </span>
                </div>
              )}

              {personnel.paymentStructure.milestoneFixed && (
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <span className="text-[11px] font-medium text-slate-500 block mb-1">
                    Milestone / Fixed Project
                  </span>
                  <div className="text-base font-bold font-mono tabular-nums text-slate-900">
                    From {personnel.paymentStructure.milestoneFixed.currency} {personnel.paymentStructure.milestoneFixed.minProjectRate}
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Quote turn: {personnel.paymentStructure.milestoneFixed.quoteTimeline}
                  </span>
                </div>
              )}

              {personnel.paymentStructure.emergencySurge && (
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white sm:col-span-2">
                  <span className="text-[11px] font-medium text-slate-500 block mb-1">
                    Emergency Callout Tariff
                  </span>
                  <div className="text-sm font-bold font-mono tabular-nums text-slate-900">
                    {personnel.paymentStructure.emergencySurge.currency} {personnel.paymentStructure.emergencySurge.calloutBaseFee} base + {personnel.paymentStructure.emergencySurge.currency} {personnel.paymentStructure.emergencySurge.hourlySurcharge}/hr
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Guaranteed rapid mobilization within {personnel.paymentStructure.emergencySurge.responseTimeMinutes / 60} hours
                  </span>
                </div>
              )}
            </div>

            {/* Accepted Payout Methods */}
            <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600">
              <span className="font-semibold text-slate-800">Accepted Settlement:</span>
              {personnel.acceptedPayoutMethods.map((pm, i) => (
                <React.Fragment key={pm}>
                  <span>{PAYOUT_METHOD_CONFIG[pm]?.label || pm}</span>
                  {i < personnel.acceptedPayoutMethods.length - 1 && (
                    <span className="text-slate-300" aria-hidden="true">·</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Section: Interactive Cost & Dispatch Estimator */}
          <div className="border-t border-slate-200 pt-5">
            <div className="p-4 rounded-xl border border-slate-300 bg-slate-900 text-white space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-slate-400" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                    Interactive Requisition Estimator
                  </h3>
                </div>
                <span className="text-xs text-slate-400">Instant Estimate Calculator</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">Target Mode of Work</label>
                  <select
                    value={calcWorkMode}
                    onChange={(e) => setCalcWorkMode(e.target.value as WorkMode)}
                    className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  >
                    {personnel.workModes.map((wm) => (
                      <option key={wm} value={wm}>
                        {WORK_MODE_CONFIG[wm]?.label || wm}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Payment Mode</label>
                  <select
                    value={calcPaymentMode}
                    onChange={(e) => setCalcPaymentMode(e.target.value as PaymentMode)}
                    className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  >
                    {personnel.paymentModes.map((pm) => (
                      <option key={pm} value={pm}>
                        {PAYMENT_MODE_CONFIG[pm]?.label || pm}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Estimated Units (Days/Hours)</label>
                  <input
                    type="number"
                    min={1}
                    value={calcUnits}
                    onChange={(e) => setCalcUnits(Math.max(1, Number(e.target.value)))}
                    className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono tabular-nums"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">{unitLabel}</span>
                  <span className="text-slate-300 font-medium">Estimated Requisition Total</span>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold font-mono tabular-nums text-white">
                    ${estimatedCost.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Escrow Protected · Net Terms Available
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Tooling, Equipment & Certifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-slate-200 pt-5">
            <div>
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-slate-600" />
                Equipment & Hardware Rigs
              </h3>
              <div className="space-y-1.5 text-xs text-slate-700">
                {personnel.equipmentAndTooling.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-slate-400 shrink-0">·</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
                Verified Licenses & Certifications
              </h3>
              <div className="space-y-2 text-xs">
                {personnel.certifications.map((cert, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{cert.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {cert.issuer} {cert.licenseNumber ? `(${cert.licenseNumber})` : ''}
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">{cert.year}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Dispatch SLA confirmed · Instant contract & invoicing available
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onMeetTechnician?.(personnel);
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              Meet Technician
            </button>
            <button
              onClick={() => {
                onClose();
                onBook(personnel, calcWorkMode, calcPaymentMode);
              }}
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap"
            >
              Book / Issue Requisition
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
