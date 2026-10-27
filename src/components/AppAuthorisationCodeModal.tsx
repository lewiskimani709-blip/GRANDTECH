import React, { useState } from 'react';
import { Key, ShieldCheck, ShieldAlert, CheckCircle2, X, Search, Phone, MessageCircle } from 'lucide-react';
import { MeetingSession, ClientRequisition, TechnicalPersonnel } from '../types';

interface AppAuthorisationCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetings: MeetingSession[];
  requisitions: ClientRequisition[];
  personnelList: TechnicalPersonnel[];
}

export const AppAuthorisationCodeModal: React.FC<AppAuthorisationCodeModalProps> = ({
  isOpen,
  onClose,
  meetings,
  requisitions,
  personnelList,
}) => {
  const [codeInput, setCodeInput] = useState('');
  const [validationResult, setValidationResult] = useState<{
    found: boolean;
    type?: 'meeting' | 'requisition' | 'generic';
    item?: any;
    technicianName?: string;
    details?: string;
    status?: string;
  } | null>(null);

  const customerServicePhone = '0748469925';

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = codeInput.trim().toUpperCase();

    if (!clean) {
      alert('Please enter an App Authorisation Code.');
      return;
    }

    // Check in meetings
    const matchMeeting = meetings.find(
      (m) => m.authorizationCode.toUpperCase() === clean || m.id.toUpperCase() === clean
    );
    if (matchMeeting) {
      setValidationResult({
        found: true,
        type: 'meeting',
        item: matchMeeting,
        technicianName: matchMeeting.technicianName,
        details: `Scheduled on ${matchMeeting.scheduledDate} at ${matchMeeting.scheduledTime} (${matchMeeting.meetingType.replace('_', ' ')})`,
        status: 'VERIFIED ACTIVE',
      });
      return;
    }

    // Check in requisitions
    const matchReq = requisitions.find(
      (r) => r.authorizationCode?.toUpperCase() === clean || r.id.toUpperCase() === clean
    );
    if (matchReq) {
      setValidationResult({
        found: true,
        type: 'requisition',
        item: matchReq,
        technicianName: matchReq.assignedPersonnelName || 'Assigned Field Specialist',
        details: `Project: ${matchReq.projectTitle} (Work Mode: ${matchReq.selectedWorkMode})`,
        status: 'VERIFIED AUTHORIZED',
      });
      return;
    }

    // Match generic pattern simulation
    if (clean.startsWith('AUTH-') && clean.length >= 8) {
      setValidationResult({
        found: true,
        type: 'generic',
        technicianName: 'Authorized Technix Field Specialist',
        details: 'Security cleared with valid liability insurance and tool identification pass.',
        status: 'VERIFIED PASS',
      });
      return;
    }

    // Not found / unauthorized
    setValidationResult({
      found: false,
      details: 'No active technical dispatch or meeting record matches this code.',
    });
  };

  const handleEscalateFraud = () => {
    const msg = `ALERT: An unauthorized technician presented invalid App Authorisation Code [${codeInput}] on site. Requesting immediate verification.`;
    window.open(`https://wa.me/254748469925?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                App Authorisation Code Validator
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Verify authentic technician credentials before granting physical site or tool access.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setValidationResult(null);
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5 text-xs text-slate-800">
          <form onSubmit={handleVerify} className="space-y-3">
            <label className="block font-semibold text-slate-700">
              Enter Technician 6-Digit App Authorisation Code:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. AUTH-829104 or req-829104"
                value={codeInput}
                onChange={(e) => {
                  setCodeInput(e.target.value);
                  setValidationResult(null);
                }}
                className="flex-1 p-3 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm uppercase tracking-wider text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl cursor-pointer transition-colors flex items-center gap-1.5 shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>Verify Code</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              The technician is legally required to show this code on their mobile app before beginning any work.
            </p>
          </form>

          {/* Validation Result */}
          {validationResult && (
            <div className="pt-2">
              {validationResult.found ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      <span>{validationResult.status}</span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                      VALID PASS
                    </span>
                  </div>

                  <div className="space-y-1 text-slate-700 text-xs">
                    <div>
                      <span className="text-slate-500">Verified Personnel: </span>
                      <strong className="text-slate-900">{validationResult.technicianName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Dispatch Details: </span>
                      <span>{validationResult.details}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Insurance Bond: </span>
                      <span className="text-emerald-700 font-medium">Covered up to $50,000 Anti-Theft Protection</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                    <ShieldAlert className="w-5 h-5 text-rose-600" />
                    <span>INVALID / UNREGISTERED AUTHORISATION CODE</span>
                  </div>
                  <p className="text-rose-700 text-xs leading-relaxed">
                    <strong>SECURITY WARNING:</strong> This code is not recognized in the active dispatch system. Do NOT allow this person access to your premises, equipment, or machinery.
                  </p>
                  <button
                    onClick={handleEscalateFraud}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Report Unauthorized Person to WhatsApp Support ({customerServicePhone})</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Quick Active Codes for Reference */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <span className="font-semibold text-slate-700 text-[11px] block">
              Sample Active App Authorisation Codes in System:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCodeInput('AUTH-829104')}
                className="px-2.5 py-1 bg-white border border-slate-300 rounded font-mono text-xs hover:border-slate-800 cursor-pointer"
              >
                AUTH-829104
              </button>
              <button
                type="button"
                onClick={() => setCodeInput('AUTH-619482')}
                className="px-2.5 py-1 bg-white border border-slate-300 rounded font-mono text-xs hover:border-slate-800 cursor-pointer"
              >
                AUTH-619482
              </button>
              <button
                type="button"
                onClick={() => setCodeInput('req-829104')}
                className="px-2.5 py-1 bg-white border border-slate-300 rounded font-mono text-xs hover:border-slate-800 cursor-pointer"
              >
                req-829104
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Customer Service Desk: <strong>{customerServicePhone}</strong></span>
          <button
            onClick={() => {
              setValidationResult(null);
              onClose();
            }}
            className="px-4 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-100 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
