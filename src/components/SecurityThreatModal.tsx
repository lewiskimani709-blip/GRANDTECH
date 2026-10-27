import React, { useState } from 'react';
import { SecurityIncidentReport } from '../types';
import { ShieldAlert, AlertTriangle, Lock, FileWarning, CheckCircle, Phone, MessageCircle, X, ShieldCheck } from 'lucide-react';

interface SecurityThreatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (report: SecurityIncidentReport) => void;
}

export const SecurityThreatModal: React.FC<SecurityThreatModalProps> = ({
  isOpen,
  onClose,
  onSubmitReport,
}) => {
  const [activeTab, setActiveTab] = useState<'policy_measures' | 'file_report'>('file_report');
  const [reporterRole, setReporterRole] = useState<'client' | 'technician' | 'field_supervisor'>('client');
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [incidentType, setIncidentType] = useState<SecurityIncidentReport['incidentType']>('theft_equipment');
  const [involvedPartyName, setInvolvedPartyName] = useState('');
  const [authorizationCodeRef, setAuthorizationCodeRef] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [filedCase, setFiledCase] = useState<SecurityIncidentReport | null>(null);

  const customerServicePhone = '0748469925';

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!reporterName.trim() || !reporterPhone.trim() || !description.trim()) {
      alert('Please fill in your name, contact phone, and incident description.');
      return;
    }

    const report: SecurityIncidentReport = {
      id: `INC-${Date.now().toString().slice(-6)}`,
      reporterRole,
      reporterName: reporterName.trim(),
      reporterPhone: reporterPhone.trim(),
      incidentType,
      involvedPartyName: involvedPartyName.trim() || 'Unidentified Individual',
      authorizationCodeRef: authorizationCodeRef.trim() || undefined,
      incidentDate: new Date().toISOString().split('T')[0],
      location: location.trim() || 'On-site Field Operation',
      description: description.trim(),
      actionTaken:
        'Immediate security docket opened. Account flagged for administrative freeze and customer service dispatch notification.',
      status: 'account_frozen',
      reportedAt: new Date().toISOString(),
    };

    onSubmitReport(report);
    setFiledCase(report);
  };

  const handleEscalateWhatsApp = () => {
    if (!filedCase) return;
    const msg = `🚨 *URGENT SECURITY / THEFT REPORT* [${filedCase.id}]\n\nType: ${filedCase.incidentType.replace('_', ' ').toUpperCase()}\nReporter: ${filedCase.reporterName} (${filedCase.reporterPhone})\nInvolved Party: ${filedCase.involvedPartyName}\nAuth Code: ${filedCase.authorizationCodeRef || 'None'}\nLocation: ${filedCase.location}\nDetails: ${filedCase.description}\n\nImmediate dispatch freeze and security intervention requested.`;
    window.open(`https://wa.me/254748469925?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rose-200 bg-rose-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Security, Anti-Theft &amp; Threat Incident Center
              </h2>
              <p className="text-xs text-rose-800 mt-0.5">
                Zero-tolerance enforcement against theft, impersonation, or safety threats.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setFiledCase(null);
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-2 border-b border-slate-200 text-xs font-medium">
          <button
            onClick={() => setActiveTab('file_report')}
            className={`py-3 text-center transition-colors border-b-2 cursor-pointer ${
              activeTab === 'file_report'
                ? 'border-rose-600 text-rose-700 font-semibold bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800 bg-slate-50/50'
            }`}
          >
            File Immediate Incident Report
          </button>
          <button
            onClick={() => setActiveTab('policy_measures')}
            className={`py-3 text-center transition-colors border-b-2 cursor-pointer ${
              activeTab === 'policy_measures'
                ? 'border-slate-900 text-slate-900 font-semibold bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800 bg-slate-50/50'
            }`}
          >
            Anti-Theft Protocol &amp; Legal Measures
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto text-xs text-slate-800 space-y-4">
          {activeTab === 'policy_measures' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                  <Lock className="w-4 h-4" />
                  <span>Mandatory Security Doctrine</span>
                </div>
                <h3 className="font-bold text-sm">
                  Automatic Sanctions for Theft &amp; Threat Violations
                </h3>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Every technical engagement is locked under Technix Mutual Indemnity Terms. Any verified act of theft, physical threat, equipment extortion, or impersonation triggers immediate enforcement.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Instant Escrow Freeze</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-normal">
                    All linked balances, pending milestone payments, and dispatch accounts are frozen within 60 seconds of report receipt.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <FileWarning className="w-4 h-4 text-rose-600" />
                    <span>Police &amp; Legal Referral</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-normal">
                    Verified national identification records, GPS dispatch stamps, and hardware serial numbers are transferred to investigative authorities.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>$50,000 Tool &amp; Site Bond</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-normal">
                    Registered dispatches with verified App Authorisation Codes are covered against loss, hardware theft, or physical damage.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-slate-700" />
                    <span>24/7 Security Escalation</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-normal">
                    Direct live response line via WhatsApp at <strong>{customerServicePhone}</strong> for urgent field interventions.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'file_report' && !filedCase && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs">
                <strong>Emergency Notice:</strong> If you are in immediate physical danger, contact emergency emergency services first, then alert Technix Security via WhatsApp at <strong>{customerServicePhone}</strong>.
              </div>

              {/* Reporter Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Your Role *
                  </label>
                  <select
                    value={reporterRole}
                    onChange={(e) => setReporterRole(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  >
                    <option value="client">Client / Site Owner</option>
                    <option value="technician">Technical Personnel</option>
                    <option value="field_supervisor">Field Supervisor</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Your Phone Number"
                    value={reporterPhone}
                    onChange={(e) => setReporterPhone(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                  />
                </div>
              </div>

              {/* Incident Specification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Type of Incident / Violation *
                  </label>
                  <select
                    value={incidentType}
                    onChange={(e) => setIncidentType(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 font-semibold"
                  >
                    <option value="theft_equipment">Hardware / Tooling / Equipment Theft</option>
                    <option value="unauthorized_impersonation">Unauthorized Impersonator / Fake Technician</option>
                    <option value="safety_threat">Physical Threat or Hostile Behavior</option>
                    <option value="payment_fraud">Payment Fraud / Demanding Unofficial Cash</option>
                    <option value="site_damage">Intentional Site Damage or Sabotage</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Involved Individual / Technician Name
                  </label>
                  <input
                    type="text"
                    placeholder="Name or Technician ID if known"
                    value={involvedPartyName}
                    onChange={(e) => setInvolvedPartyName(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              {/* Location & Authorization Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Incident Location / Site Address
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Industrial Area, Workshop 3"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    App Authorisation Code (if issued)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. AUTH-829104"
                    value={authorizationCodeRef}
                    onChange={(e) => setAuthorizationCodeRef(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono uppercase"
                  />
                </div>
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Description of Threat or Theft Practice *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detail exact stolen tools/equipment, serial numbers, timeline, threats made, or unauthorized actions..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <span className="text-slate-500 font-mono text-[11px]">
                  Hotline: {customerServicePhone}
                </span>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  File Urgent Report &amp; Lock Account
                </button>
              </div>
            </form>
          )}

          {filedCase && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  Security Incident Docket Created: {filedCase.id}
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Administrative safety lock applied. All associated payment payouts have been placed in protective hold.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Incident Category:</span>
                  <strong className="text-slate-900 capitalize">{filedCase.incidentType.replace('_', ' ')}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Action Enforced:</span>
                  <span className="text-rose-700 font-semibold">{filedCase.actionTaken}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Docket Timestamp:</span>
                  <span className="font-mono text-slate-700">{new Date(filedCase.reportedAt).toLocaleString()}</span>
                </div>
              </div>

              {/* Escalate via WhatsApp to 0748469925 */}
              <button
                onClick={handleEscalateWhatsApp}
                className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-md"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Send Incident Docket to Customer Service WhatsApp ({customerServicePhone})</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Anti-theft protocol strictly enforced under ISO 27001 &amp; local penal code.</span>
          <button
            onClick={() => {
              setFiledCase(null);
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
