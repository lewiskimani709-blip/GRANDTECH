import React, { useState } from 'react';
import { ClientRequisition } from '../types';
import { WORK_MODE_CONFIG, PAYMENT_MODE_CONFIG, PAYOUT_METHOD_CONFIG } from '../data/seedPersonnel';
import { FileText, Printer, CheckCircle2, Clock, MapPin, Building, ArrowRight, DollarSign, X } from 'lucide-react';

interface RequisitionsTrackerProps {
  requisitions: ClientRequisition[];
  onUpdateStatus: (id: string, newStatus: ClientRequisition['status']) => void;
  onNewRequisition: () => void;
}

export const RequisitionsTracker: React.FC<RequisitionsTrackerProps> = ({
  requisitions,
  onUpdateStatus,
  onNewRequisition,
}) => {
  const [selectedSlip, setSelectedSlip] = useState<ClientRequisition | null>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Client Technical Requisitions & Dispatch Orders
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track active client engagements, assigned technical personnel, modes of work, and escrow/invoice payment terms.
          </p>
        </div>

        <button
          onClick={onNewRequisition}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-xs"
        >
          + Issue New Requisition
        </button>
      </div>

      {requisitions.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-800">
            No active client requisitions yet
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Clients can book technical personnel directly or issue open requisitions for their preferred mode of work and payment terms.
          </p>
          <button
            onClick={onNewRequisition}
            className="px-4 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Create First Requisition
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {requisitions.map((req) => (
            <div
              key={req.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-semibold text-slate-900 uppercase">
                    {req.id}
                  </span>
                  <span className="text-slate-300" aria-hidden="true">/</span>
                  <span className="text-xs font-semibold text-slate-800 truncate">
                    {req.projectTitle}
                  </span>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {/* Status indicator */}
                  <span className="text-xs font-medium text-slate-700">
                    Status: <strong className="text-slate-900 capitalize">{req.status.replace('_', ' ')}</strong>
                  </span>
                  <select
                    value={req.status}
                    onChange={(e) =>
                      onUpdateStatus(req.id, e.target.value as ClientRequisition['status'])
                    }
                    className="text-xs p-1 bg-slate-50 border border-slate-200 rounded-md font-medium text-slate-700 cursor-pointer"
                  >
                    <option value="pending_review">Pending Review</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="active_dispatch">Active Dispatch</option>
                    <option value="completed">Completed & Settled</option>
                  </select>
                </div>
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                {/* Client info */}
                <div>
                  <span className="text-[11px] font-medium text-slate-400 block mb-1">
                    Client & Organization
                  </span>
                  <div className="font-semibold text-slate-900">{req.clientName}</div>
                  <div className="text-slate-600">{req.companyName}</div>
                  <div className="text-slate-500 font-mono text-[11px]">{req.clientEmail}</div>
                </div>

                {/* Assigned Personnel */}
                <div>
                  <span className="text-[11px] font-medium text-slate-400 block mb-1">
                    Assigned Technical Personnel
                  </span>
                  <div className="font-semibold text-slate-900">
                    {req.assignedPersonnelName || 'Open Recruitment Dispatch'}
                  </div>
                  <div className="text-slate-600">{req.discipline}</div>
                  {req.siteLocation && (
                    <div className="text-slate-500 flex items-center gap-1 mt-0.5 text-[11px]">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{req.siteLocation}</span>
                    </div>
                  )}
                </div>

                {/* Mode of Work & Payment */}
                <div>
                  <span className="text-[11px] font-medium text-slate-400 block mb-1">
                    Mode of Work & Payment
                  </span>
                  <div className="font-semibold text-slate-900">
                    {WORK_MODE_CONFIG[req.selectedWorkMode]?.label || req.selectedWorkMode}
                  </div>
                  <div className="text-slate-600">
                    {PAYMENT_MODE_CONFIG[req.selectedPaymentMode]?.label || req.selectedPaymentMode}
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    {PAYOUT_METHOD_CONFIG[req.payoutMethod]?.label}
                  </div>
                </div>

                {/* Budget & Target Schedule */}
                <div>
                  <span className="text-[11px] font-medium text-slate-400 block mb-1">
                    Budget & Timeline
                  </span>
                  <div className="font-bold font-mono tabular-nums text-slate-900 text-sm">
                    ${req.targetBudget.toLocaleString()}
                  </div>
                  <div className="text-slate-600 font-mono text-[11px]">
                    Start: {req.startDate}
                  </div>
                  <div className="text-slate-500 text-[11px]">{req.durationEstimate}</div>
                </div>
              </div>

              {/* Scope note */}
              <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-start justify-between gap-4">
                <div className="line-clamp-2">
                  <strong className="text-slate-800">Scope Criteria:</strong> {req.scopeDescription}
                </div>
                <button
                  onClick={() => setSelectedSlip(req)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-md hover:bg-slate-100 transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>Dispatch Slip</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dispatch Slip Modal / Printable Document */}
      {selectedSlip && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-700 font-bold">
                Official Technical Dispatch Slip
              </span>
              <button
                onClick={() => setSelectedSlip(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-6 text-xs text-slate-800 printable-area">
              {/* Slip Header */}
              <div className="flex justify-between items-start border-b border-slate-200 pb-5">
                <div>
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                    TECHNIX TECHNICAL DISPATCH SLIP
                  </h1>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Field Engineering Engagement & Settlement Certificate
                  </p>
                </div>
                <div className="text-right font-mono text-xs">
                  <div className="font-bold text-slate-900">{selectedSlip.id}</div>
                  <div className="text-slate-500">
                    Date: {new Date(selectedSlip.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Parties */}
              <div className="grid grid-cols-2 gap-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Client Requisitioner
                  </div>
                  <div className="font-bold text-slate-900">{selectedSlip.clientName}</div>
                  <div className="text-slate-700">{selectedSlip.companyName}</div>
                  <div className="text-slate-500 font-mono">{selectedSlip.clientEmail}</div>
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Assigned Technical Engineer
                  </div>
                  <div className="font-bold text-slate-900">
                    {selectedSlip.assignedPersonnelName || 'Designated Field Specialist'}
                  </div>
                  <div className="text-slate-700">{selectedSlip.discipline}</div>
                  <div className="text-slate-500">Status: {selectedSlip.status.toUpperCase()}</div>
                </div>
              </div>

              {/* Modes */}
              <div className="space-y-2 border-b border-slate-200 pb-5">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Contract Terms & Deployment Specifications
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-500 block">Designated Mode of Work:</span>
                    <strong className="text-slate-900 text-sm">
                      {WORK_MODE_CONFIG[selectedSlip.selectedWorkMode]?.label || selectedSlip.selectedWorkMode}
                    </strong>
                    <p className="text-slate-600 text-[11px]">
                      {WORK_MODE_CONFIG[selectedSlip.selectedWorkMode]?.shortDesc}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Designated Payment Mode:</span>
                    <strong className="text-slate-900 text-sm">
                      {PAYMENT_MODE_CONFIG[selectedSlip.selectedPaymentMode]?.label || selectedSlip.selectedPaymentMode}
                    </strong>
                    <p className="text-slate-600 text-[11px]">
                      {PAYMENT_MODE_CONFIG[selectedSlip.selectedPaymentMode]?.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Scope & Financials */}
              <div className="space-y-2 border-b border-slate-200 pb-5">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Authorized Scope
                </span>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {selectedSlip.scopeDescription}
                </p>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div>
                  <span className="text-slate-500 block text-[11px]">Settlement Channel</span>
                  <span className="font-medium text-slate-800">
                    {PAYOUT_METHOD_CONFIG[selectedSlip.payoutMethod]?.label}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block text-[11px]">Authorized Total Budget</span>
                  <span className="text-xl font-bold font-mono tabular-nums text-slate-900">
                    ${selectedSlip.targetBudget.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <span className="text-xs text-slate-500 font-mono">
                Technix Escrow Verification Code: TX-VFD-{selectedSlip.id}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedSlip(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Official Slip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
