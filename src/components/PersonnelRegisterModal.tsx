import React, { useState } from 'react';
import { TechnicalPersonnel, WorkMode, PaymentMode, PayoutMethod, TechnicalDiscipline, Certification } from '../types';
import { WORK_MODE_CONFIG, PAYMENT_MODE_CONFIG, PAYOUT_METHOD_CONFIG } from '../data/seedPersonnel';
import { X, Check, Plus, Trash2, ShieldCheck, Wrench } from 'lucide-react';

interface PersonnelRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (personnel: TechnicalPersonnel) => void;
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

export const PersonnelRegisterModal: React.FC<PersonnelRegisterModalProps> = ({
  isOpen,
  onClose,
  onRegister,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('');
  const [discipline, setDiscipline] = useState<TechnicalDiscipline>('Automation & Robotics');
  const [seniority, setSeniority] = useState<'Mid-Level' | 'Senior' | 'Principal Specialist' | 'Lead Engineer'>('Senior');
  const [yearsExperience, setYearsExperience] = useState<number>(8);
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('');
  const [timezone, setTimezone] = useState('UTC+0 (GMT)');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Modes of Work
  const [selectedWorkModes, setSelectedWorkModes] = useState<WorkMode[]>(['onsite', 'remote']);
  const [onsiteDistance, setOnsiteDistance] = useState<number>(500);
  const [emergencySlaHours, setEmergencySlaHours] = useState<number>(2);

  // Payment Modes
  const [selectedPaymentModes, setSelectedPaymentModes] = useState<PaymentMode[]>(['day_rate', 'hourly']);
  const [currency, setCurrency] = useState('USD');
  const [hourlyRate, setHourlyRate] = useState<number>(120);
  const [hourlyMinHours, setHourlyMinHours] = useState<number>(4);
  const [dayRate, setDayRate] = useState<number>(950);
  const [milestoneMin, setMilestoneMin] = useState<number>(3000);
  const [retainerAmount, setRetainerAmount] = useState<number>(7500);
  const [emergencyBase, setEmergencyBase] = useState<number>(500);
  const [emergencyHourly, setEmergencyHourly] = useState<number>(200);

  // Payout Methods
  const [selectedPayoutMethods, setSelectedPayoutMethods] = useState<PayoutMethod[]>([
    'bank_wire',
    'escrow',
    'corporate_invoice',
  ]);

  // Skills & Tooling
  const [skillsInput, setSkillsInput] = useState('PLC Programming, SCADA, Field Diagnostics');
  const [equipmentInput, setEquipmentInput] = useState('Fluke 87V Multimeter, Industrial Laptop Field Rig');
  const [certName, setCertName] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certList, setCertList] = useState<Certification[]>([
    { name: 'Certified Automation Professional (CAP)', issuer: 'ISA', year: 2023, verified: true },
  ]);

  const toggleWorkMode = (mode: WorkMode) => {
    if (selectedWorkModes.includes(mode)) {
      if (selectedWorkModes.length > 1) {
        setSelectedWorkModes(selectedWorkModes.filter((m) => m !== mode));
      }
    } else {
      setSelectedWorkModes([...selectedWorkModes, mode]);
    }
  };

  const togglePaymentMode = (pm: PaymentMode) => {
    if (selectedPaymentModes.includes(pm)) {
      if (selectedPaymentModes.length > 1) {
        setSelectedPaymentModes(selectedPaymentModes.filter((m) => m !== pm));
      }
    } else {
      setSelectedPaymentModes([...selectedPaymentModes, pm]);
    }
  };

  const togglePayoutMethod = (pm: PayoutMethod) => {
    if (selectedPayoutMethods.includes(pm)) {
      if (selectedPayoutMethods.length > 1) {
        setSelectedPayoutMethods(selectedPayoutMethods.filter((m) => m !== pm));
      }
    } else {
      setSelectedPayoutMethods([...selectedPayoutMethods, pm]);
    }
  };

  const handleAddCert = () => {
    if (certName.trim() && certIssuer.trim()) {
      setCertList([
        ...certList,
        {
          name: certName.trim(),
          issuer: certIssuer.trim(),
          year: new Date().getFullYear(),
          verified: true,
        },
      ]);
      setCertName('');
      setCertIssuer('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !contactEmail.trim() || !title.trim()) {
      alert('Please fill in required fields: Full Name, Professional Title, and Contact Email.');
      return;
    }

    const newPersonnel: TechnicalPersonnel = {
      id: `tech-${Date.now()}`,
      fullName: fullName.trim(),
      title: title.trim(),
      discipline,
      seniority,
      yearsExperience: Number(yearsExperience) || 5,
      bio: bio.trim() || `${title} with ${yearsExperience} years of experience in ${discipline}.`,
      location: location.trim() || 'Global Dispatch',
      country: country.trim() || 'Verified Jurisdiction',
      timezone,
      avatarUrl: '',
      workModes: selectedWorkModes,
      workModeDetails: selectedWorkModes.map((mode) => ({
        mode,
        available: true,
        description: WORK_MODE_CONFIG[mode].shortDesc,
        maxTravelDistanceKm: mode === 'onsite' ? onsiteDistance : undefined,
        noticePeriodHours: mode === 'emergency_callout' ? emergencySlaHours : 24,
      })),
      paymentModes: selectedPaymentModes,
      paymentStructure: {
        hourlyRate: selectedPaymentModes.includes('hourly')
          ? { amount: Number(hourlyRate), currency, minHours: Number(hourlyMinHours) }
          : undefined,
        dayRate: selectedPaymentModes.includes('day_rate')
          ? { amount: Number(dayRate), currency, hoursPerDay: 8 }
          : undefined,
        milestoneFixed: selectedPaymentModes.includes('milestone_fixed')
          ? { minProjectRate: Number(milestoneMin), currency, quoteTimeline: '24 hours' }
          : undefined,
        monthlyRetainer: selectedPaymentModes.includes('monthly_retainer')
          ? { amount: Number(retainerAmount), currency, hoursIncluded: 50 }
          : undefined,
        emergencySurge: selectedPaymentModes.includes('emergency_surge')
          ? {
              calloutBaseFee: Number(emergencyBase),
              hourlySurcharge: Number(emergencyHourly),
              currency,
              responseTimeMinutes: emergencySlaHours * 60,
            }
          : undefined,
      },
      acceptedPayoutMethods: selectedPayoutMethods,
      primarySkills: skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      equipmentAndTooling: equipmentInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      certifications: certList,
      availabilityStatus: 'immediate',
      rating: 5.0,
      reviewCount: 1,
      completedJobs: 1,
      onTimeDispatchRate: 100,
      registeredDate: new Date().toISOString().split('T')[0],
      contactEmail: contactEmail.trim(),
      contactPhone: contactPhone.trim() || '+1 555 0100',
    };

    onRegister(newPersonnel);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Technical Personnel Registration
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Register technical credentials, modes of work, and accepted payment models for instant client discovery.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator (Clean unboxed bar) */}
        <div className="grid grid-cols-4 border-b border-slate-200 text-xs font-medium">
          {[
            { num: 1, title: 'Profile & Discipline' },
            { num: 2, title: 'Modes of Work' },
            { num: 3, title: 'Payment & Rates' },
            { num: 4, title: 'Tools & Certifications' },
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => setStep(s.num as any)}
              className={`py-2.5 px-3 text-center transition-colors border-b-2 cursor-pointer ${
                step === s.num
                  ? 'border-slate-900 text-slate-900 font-semibold bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800 bg-slate-50/50'
              }`}
            >
              <span>{s.num}. {s.title}</span>
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Sarah M. Jenkins"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Professional Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Senior Automation & Robotics Engineer"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary Discipline *
                  </label>
                  <select
                    value={discipline}
                    onChange={(e) => setDiscipline(e.target.value as TechnicalDiscipline)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  >
                    {DISCIPLINES.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Seniority Level
                  </label>
                  <select
                    value={seniority}
                    onChange={(e) => setSeniority(e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  >
                    <option value="Mid-Level">Mid-Level Engineer</option>
                    <option value="Senior">Senior Specialist</option>
                    <option value="Lead Engineer">Lead Engineer</option>
                    <option value="Principal Specialist">Principal Specialist</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Years of Field Experience
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={45}
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 tabular-nums font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Base City & State/Region
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Munich, Germany or Austin, TX"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary Timezone
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., UTC+1 (CET) or UTC-5 (EST)"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="+49 89 2384 9102"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Email (Dispatch Routing) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="engineer.direct@specialist.org"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Technical Professional Summary
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your commissioning experience, specialized control architectures, hardware platforms, and client scope history..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Select Supported Modes of Work (Select all that apply)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(Object.keys(WORK_MODE_CONFIG) as WorkMode[]).map((mode) => {
                    const isSelected = selectedWorkModes.includes(mode);
                    return (
                      <div
                        key={mode}
                        onClick={() => toggleWorkMode(mode)}
                        className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          isSelected
                            ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-slate-900">
                            {WORK_MODE_CONFIG[mode].label}
                          </span>
                          <div
                            className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                              isSelected
                                ? 'bg-slate-900 border-slate-900 text-white'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                        </div>
                        <p className="text-slate-500 leading-normal">
                          {WORK_MODE_CONFIG[mode].shortDesc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Work Mode Detailed Limits */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-semibold text-slate-900">
                  Field Dispatch Logistics & SLAs
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Max On-Site Travel Radius (km)
                    </label>
                    <input
                      type="number"
                      value={onsiteDistance}
                      onChange={(e) => setOnsiteDistance(Number(e.target.value))}
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg font-mono tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Emergency Callout Response Window (Hours)
                    </label>
                    <input
                      type="number"
                      value={emergencySlaHours}
                      onChange={(e) => setEmergencySlaHours(Number(e.target.value))}
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg font-mono tabular-nums"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-800">
                  Select Accepted Payment Modes & Define Rates
                </label>
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <span>Billing Currency:</span>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="p-1 text-xs border border-slate-300 rounded font-mono font-semibold"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {/* Hourly */}
                <div
                  className={`p-3.5 rounded-xl border text-xs transition-all ${
                    selectedPaymentModes.includes('hourly')
                      ? 'border-slate-900 bg-slate-50/50'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center gap-2 font-semibold text-slate-900 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedPaymentModes.includes('hourly')}
                        onChange={() => togglePaymentMode('hourly')}
                        className="rounded border-slate-300"
                      />
                      <span>Hourly Rate (Timesheet Metered)</span>
                    </label>
                    <span className="text-slate-500 font-mono">Billed weekly</span>
                  </div>
                  {selectedPaymentModes.includes('hourly') && (
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                      <div>
                        <span className="text-slate-600 block mb-0.5">Rate ({currency}/hr)</span>
                        <input
                          type="number"
                          value={hourlyRate}
                          onChange={(e) => setHourlyRate(Number(e.target.value))}
                          className="w-full text-xs p-2 bg-white border border-slate-300 rounded font-mono tabular-nums"
                        />
                      </div>
                      <div>
                        <span className="text-slate-600 block mb-0.5">Min Hours Required</span>
                        <input
                          type="number"
                          value={hourlyMinHours}
                          onChange={(e) => setHourlyMinHours(Number(e.target.value))}
                          className="w-full text-xs p-2 bg-white border border-slate-300 rounded font-mono tabular-nums"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Day Rate */}
                <div
                  className={`p-3.5 rounded-xl border text-xs transition-all ${
                    selectedPaymentModes.includes('day_rate')
                      ? 'border-slate-900 bg-slate-50/50'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center gap-2 font-semibold text-slate-900 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedPaymentModes.includes('day_rate')}
                        onChange={() => togglePaymentMode('day_rate')}
                        className="rounded border-slate-300"
                      />
                      <span>Day Rate / Per Diem (8–10h shift)</span>
                    </label>
                    <span className="text-slate-500 font-mono">Full-day dispatch</span>
                  </div>
                  {selectedPaymentModes.includes('day_rate') && (
                    <div className="pt-2 border-t border-slate-200">
                      <span className="text-slate-600 block mb-0.5">Daily Rate ({currency})</span>
                      <input
                        type="number"
                        value={dayRate}
                        onChange={(e) => setDayRate(Number(e.target.value))}
                        className="w-full text-xs p-2 bg-white border border-slate-300 rounded font-mono tabular-nums"
                      />
                    </div>
                  )}
                </div>

                {/* Milestone Fixed */}
                <div
                  className={`p-3.5 rounded-xl border text-xs transition-all ${
                    selectedPaymentModes.includes('milestone_fixed')
                      ? 'border-slate-900 bg-slate-50/50'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center gap-2 font-semibold text-slate-900 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedPaymentModes.includes('milestone_fixed')}
                        onChange={() => togglePaymentMode('milestone_fixed')}
                        className="rounded border-slate-300"
                      />
                      <span>Milestone / Fixed Project</span>
                    </label>
                    <span className="text-slate-500 font-mono">Escrow released</span>
                  </div>
                  {selectedPaymentModes.includes('milestone_fixed') && (
                    <div className="pt-2 border-t border-slate-200">
                      <span className="text-slate-600 block mb-0.5">
                        Minimum Project Scope ({currency})
                      </span>
                      <input
                        type="number"
                        value={milestoneMin}
                        onChange={(e) => setMilestoneMin(Number(e.target.value))}
                        className="w-full text-xs p-2 bg-white border border-slate-300 rounded font-mono tabular-nums"
                      />
                    </div>
                  )}
                </div>

                {/* Emergency Surge */}
                <div
                  className={`p-3.5 rounded-xl border text-xs transition-all ${
                    selectedPaymentModes.includes('emergency_surge')
                      ? 'border-slate-900 bg-slate-50/50'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center gap-2 font-semibold text-slate-900 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedPaymentModes.includes('emergency_surge')}
                        onChange={() => togglePaymentMode('emergency_surge')}
                        className="rounded border-slate-300"
                      />
                      <span>Emergency Surge (24/7 Outage Response)</span>
                    </label>
                    <span className="text-slate-500 font-mono">Urgent dispatch</span>
                  </div>
                  {selectedPaymentModes.includes('emergency_surge') && (
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                      <div>
                        <span className="text-slate-600 block mb-0.5">Mobilization Base ({currency})</span>
                        <input
                          type="number"
                          value={emergencyBase}
                          onChange={(e) => setEmergencyBase(Number(e.target.value))}
                          className="w-full text-xs p-2 bg-white border border-slate-300 rounded font-mono tabular-nums"
                        />
                      </div>
                      <div>
                        <span className="text-slate-600 block mb-0.5">Emergency Hourly Surcharge</span>
                        <input
                          type="number"
                          value={emergencyHourly}
                          onChange={(e) => setEmergencyHourly(Number(e.target.value))}
                          className="w-full text-xs p-2 bg-white border border-slate-300 rounded font-mono tabular-nums"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Supported Payout Channels */}
              <div className="pt-3 border-t border-slate-200">
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Accepted Payout & Settlement Channels
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(Object.keys(PAYOUT_METHOD_CONFIG) as PayoutMethod[]).map((pm) => (
                    <label
                      key={pm}
                      className="flex items-start gap-2 p-2.5 rounded-lg border border-slate-200 bg-white text-xs cursor-pointer hover:bg-slate-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPayoutMethods.includes(pm)}
                        onChange={() => togglePayoutMethod(pm)}
                        className="mt-0.5 rounded border-slate-300"
                      />
                      <div>
                        <div className="font-semibold text-slate-900">
                          {PAYOUT_METHOD_CONFIG[pm].label}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {PAYOUT_METHOD_CONFIG[pm].settlementTime}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Primary Technical Competencies & Software (comma-separated)
                </label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="e.g. Siemens TIA Portal, KUKA KRC4, Profinet, Safety PLC SIL3"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Hardware Rigs, Equipment & Testing Tools Owned
                </label>
                <input
                  type="text"
                  value={equipmentInput}
                  onChange={(e) => setEquipmentInput(e.target.value)}
                  placeholder="e.g. Fluke 1738 Power Logger, Rigol DS1054Z Oscilloscope, Core Alignment Splicer"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              {/* Certifications Builder */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Verified Certifications & Professional Licenses
                </label>
                <div className="space-y-2 mb-3">
                  {certList.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <span className="font-semibold text-slate-900">{c.name}</span>
                          <span className="text-slate-400 mx-1.5">·</span>
                          <span className="text-slate-600">{c.issuer}</span>
                          <span className="text-slate-400 mx-1.5">·</span>
                          <span className="font-mono text-slate-500">{c.year}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCertList(certList.filter((_, idx) => idx !== i))}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Certification Name (e.g. TÜV Functional Safety)"
                    value={certName}
                    onChange={(e) => setCertName(e.target.value)}
                    className="flex-1 text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Issuing Authority (e.g. TÜV Rheinland)"
                    value={certIssuer}
                    onChange={(e) => setCertIssuer(e.target.value)}
                    className="flex-1 text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleAddCert}
                    className="px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg shrink-0 cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* Mandatory Reserved & Prohibited Terms Agreement */}
              <div className="p-3.5 bg-slate-900 text-white rounded-xl space-y-2 border border-slate-800">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                  <span>Mandatory Reserved Rights &amp; Prohibited Terms Agreement</span>
                </div>
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-200">
                  <input
                    type="checkbox"
                    required
                    defaultChecked
                    className="mt-0.5 rounded border-slate-600"
                  />
                  <span className="leading-relaxed">
                    I solemnly agree to the Technix <strong>Reserved Rights &amp; Prohibited Terms Charter</strong>. I will strictly present my 6-digit <strong>App Authorisation Code</strong> prior to site entry, never accept off-platform cash, never remove client tools or equipment without written clearance, and acknowledge Technix&apos;s reserved right to freeze escrow balances and escalate any theft or threat to law enforcement (Hotline: 0748469925).
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Form Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((step - 1) as any)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((step + 1) as any)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer shadow-xs"
              >
                Register & Publish to Live Registry
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
