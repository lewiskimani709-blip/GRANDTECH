import React, { useState } from 'react';
import { TechnicalPersonnel, WorkMode, PaymentMode, PayoutMethod, TechnicalDiscipline, ClientRequisition } from '../types';
import { WORK_MODE_CONFIG, PAYMENT_MODE_CONFIG, PAYOUT_METHOD_CONFIG } from '../data/seedPersonnel';
import { X, CheckCircle, FileText } from 'lucide-react';

interface ClientRequisitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetPersonnel: TechnicalPersonnel | null;
  initialWorkMode?: WorkMode;
  initialPaymentMode?: PaymentMode;
  onSubmitRequisition: (requisition: ClientRequisition) => void;
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

export const ClientRequisitionModal: React.FC<ClientRequisitionModalProps> = ({
  isOpen,
  onClose,
  targetPersonnel,
  initialWorkMode,
  initialPaymentMode,
  onSubmitRequisition,
}) => {
  const [clientName, setClientName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [projectTitle, setProjectTitle] = useState(
    targetPersonnel
      ? `${targetPersonnel.discipline} Dispatch for ${targetPersonnel.fullName}`
      : 'Technical Engineering Dispatch'
  );
  const [discipline, setDiscipline] = useState<TechnicalDiscipline>(
    targetPersonnel?.discipline || 'Automation & Robotics'
  );
  const [selectedWorkMode, setSelectedWorkMode] = useState<WorkMode>(
    initialWorkMode || targetPersonnel?.workModes[0] || 'onsite'
  );
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<PaymentMode>(
    initialPaymentMode || targetPersonnel?.paymentModes[0] || 'day_rate'
  );
  const [targetBudget, setTargetBudget] = useState<number>(
    targetPersonnel?.paymentStructure.dayRate?.amount
      ? targetPersonnel.paymentStructure.dayRate.amount * 5
      : 3500
  );
  const [currency] = useState('USD');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [durationEstimate, setDurationEstimate] = useState('2 weeks / 10 operational days');
  const [siteLocation, setSiteLocation] = useState(targetPersonnel?.location || '');
  const [payoutMethod, setPayoutMethod] = useState<PayoutMethod>('escrow');
  const [scopeDescription, setScopeDescription] = useState(
    'Factory line commissioning, safety logic validation, and field acceptance testing.'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName.trim() || !clientEmail.trim() || !companyName.trim()) {
      alert('Please fill in your Client Contact details (Name, Company, and Email).');
      return;
    }

    const newReq: ClientRequisition = {
      id: `req-${Date.now().toString().slice(-6)}`,
      clientName: clientName.trim(),
      companyName: companyName.trim(),
      clientEmail: clientEmail.trim(),
      projectTitle: projectTitle.trim(),
      discipline,
      selectedWorkMode,
      selectedPaymentMode,
      targetBudget: Number(targetBudget) || 1000,
      currency,
      startDate,
      durationEstimate,
      siteLocation: siteLocation.trim() || undefined,
      scopeDescription: scopeDescription.trim(),
      assignedPersonnelId: targetPersonnel?.id,
      assignedPersonnelName: targetPersonnel?.fullName,
      payoutMethod,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    onSubmitRequisition(newReq);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-700" />
              Issue Technical Personnel Requisition
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Lock in your project scope, mode of work, and payment terms for verified dispatch.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Assigned Engineer Banner if present */}
        {targetPersonnel && (
          <div className="px-6 py-3 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Selected Personnel:</span>
              <strong className="text-slate-900">{targetPersonnel.fullName}</strong>
              <span className="text-slate-400">·</span>
              <span className="text-slate-600">{targetPersonnel.title}</span>
            </div>
            <span className="font-mono text-slate-600 font-semibold">
              ★ {targetPersonnel.rating.toFixed(2)}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
          {/* Client Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Client Contact Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Jordan Weber"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Company / Organization *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Apex Industrial Systems"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Corporate Email *
              </label>
              <input
                type="email"
                required
                placeholder="j.weber@apex-systems.de"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Project Title & Discipline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Project / Requisition Title *
              </label>
              <input
                type="text"
                required
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Technical Discipline
              </label>
              <select
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value as TechnicalDiscipline)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                {DISCIPLINES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mode of Work & Mode of Payment Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Designated Mode of Work *
              </label>
              <select
                value={selectedWorkMode}
                onChange={(e) => setSelectedWorkMode(e.target.value as WorkMode)}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 font-medium"
              >
                {(Object.keys(WORK_MODE_CONFIG) as WorkMode[]).map((mode) => (
                  <option key={mode} value={mode}>
                    {WORK_MODE_CONFIG[mode].label}
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {WORK_MODE_CONFIG[selectedWorkMode]?.shortDesc}
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Designated Payment Mode *
              </label>
              <select
                value={selectedPaymentMode}
                onChange={(e) => setSelectedPaymentMode(e.target.value as PaymentMode)}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 font-medium"
              >
                {(Object.keys(PAYMENT_MODE_CONFIG) as PaymentMode[]).map((pMode) => (
                  <option key={pMode} value={pMode}>
                    {PAYMENT_MODE_CONFIG[pMode].label}
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {PAYMENT_MODE_CONFIG[selectedPaymentMode]?.billingSchedule}
              </span>
            </div>
          </div>

          {/* Budget, Timeline & Payout */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Target Budget Amount ({currency}) *
              </label>
              <input
                type="number"
                required
                value={targetBudget}
                onChange={(e) => setTargetBudget(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono tabular-nums text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Mobilization / Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Duration / Estimated Effort
              </label>
              <input
                type="text"
                value={durationEstimate}
                onChange={(e) => setDurationEstimate(e.target.value)}
                placeholder="e.g. 5 days or 40 hours"
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Site Location & Settlement Channel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Physical Site Address / Remote Room Link
              </label>
              <input
                type="text"
                value={siteLocation}
                onChange={(e) => setSiteLocation(e.target.value)}
                placeholder="e.g. Plant 4, Industriestrasse 12, Munich"
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Settlement & Payout Channel
              </label>
              <select
                value={payoutMethod}
                onChange={(e) => setPayoutMethod(e.target.value as PayoutMethod)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                {(Object.keys(PAYOUT_METHOD_CONFIG) as PayoutMethod[]).map((pm) => (
                  <option key={pm} value={pm}>
                    {PAYOUT_METHOD_CONFIG[pm].label} ({PAYOUT_METHOD_CONFIG[pm].settlementTime})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Scope description */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Scope of Work &amp; Acceptance Criteria *
            </label>
            <textarea
              rows={3}
              required
              value={scopeDescription}
              onChange={(e) => setScopeDescription(e.target.value)}
              placeholder="State the technical deliverables, safety requirements, required tooling, and milestone signoff criteria..."
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 leading-relaxed"
            />
          </div>

          {/* Reserved Rights & Prohibited Terms Client Agreement */}
          <div className="p-3 bg-slate-900 text-white rounded-xl space-y-1.5 border border-slate-800 text-[11px]">
            <div className="font-semibold text-amber-400">
              Mandatory Client Compliance &amp; Prohibited Terms
            </div>
            <label className="flex items-start gap-2 cursor-pointer text-slate-300">
              <input type="checkbox" required defaultChecked className="mt-0.5 rounded border-slate-600" />
              <span>
                I agree to verify the assigned technician&apos;s 6-digit <strong>App Authorisation Code</strong> before permitting physical site access, never execute off-platform cash payments, and respect all Technix <strong>Reserved &amp; Prohibited Terms</strong> (Hotline: 0748469925).
              </span>
            </label>
          </div>

          {/* Submit footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <span className="text-slate-500 font-mono text-[11px]">
              Escrow Protected · 0748469925
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer shadow-xs whitespace-nowrap"
              >
                Confirm & Issue Requisition
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
