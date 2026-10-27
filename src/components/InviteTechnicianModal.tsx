import React, { useState } from 'react';
import { Share2, MessageCircle, Link, Check, ExternalLink, Headset, ShieldCheck, X, Sparkles, Send } from 'lucide-react';

interface InviteTechnicianModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegisterWithCode?: (code: string) => void;
}

export const InviteTechnicianModal: React.FC<InviteTechnicianModalProps> = ({
  isOpen,
  onClose,
  onOpenRegisterWithCode,
}) => {
  const [activeTab, setActiveTab] = useState<'social_share' | 'customer_service' | 'redeem_code'>('social_share');
  const [copied, setCopied] = useState(false);
  const [redeemCodeInput, setRedeemCodeInput] = useState('');
  const [redeemError, setRedeemError] = useState('');
  const [redeemSuccess, setRedeemSuccess] = useState(false);

  const customerServicePhone = '0748469925';
  const inviteCode = 'TECH-INV-254';
  const inviteUrl = `https://technix.org/join?invite=${inviteCode}`;
  const inviteMessage = `Join the verified Technix Technical Personnel Registry. Register your engineering discipline, set your preferred work mode (On-Site/Remote/Emergency) & payment rates, and receive client dispatch requests. Invite Link: ${inviteUrl} or call Customer Service at ${customerServicePhone}.`;

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(inviteMessage)}`, '_blank');
  };

  const handleShareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(inviteUrl)}`, '_blank');
  };

  const handleShareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(inviteMessage)}`, '_blank');
  };

  const handleWhatsAppCustomerService = () => {
    const msg = `Hello Customer Service (${customerServicePhone}), I would like to refer/invite a technical personnel to join the Technix registry for official vetting.`;
    window.open(`https://wa.me/254748469925?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleValidateCode = (e: React.FormEvent) => {
    e.preventDefault();
    setRedeemError('');
    if (!redeemCodeInput.trim()) {
      setRedeemError('Please enter an invitation or authorization code.');
      return;
    }

    const clean = redeemCodeInput.trim().toUpperCase();
    if (clean.startsWith('TECH-') || clean.startsWith('AUTH-') || clean.length >= 6) {
      setRedeemSuccess(true);
      setTimeout(() => {
        onClose();
        onOpenRegisterWithCode?.(clean);
      }, 1200);
    } else {
      setRedeemError('Invalid code. Please check with customer service at 0748469925.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Invited Technical Personnel Portal
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Invite skilled engineers via social networks or customer service referral at {customerServicePhone}.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-3 border-b border-slate-200 text-xs font-medium">
          <button
            onClick={() => setActiveTab('social_share')}
            className={`py-3 text-center transition-colors border-b-2 cursor-pointer ${
              activeTab === 'social_share'
                ? 'border-slate-900 text-slate-900 font-semibold bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800 bg-slate-50/50'
            }`}
          >
            1. Social Media Links
          </button>
          <button
            onClick={() => setActiveTab('customer_service')}
            className={`py-3 text-center transition-colors border-b-2 cursor-pointer ${
              activeTab === 'customer_service'
                ? 'border-slate-900 text-slate-900 font-semibold bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800 bg-slate-50/50'
            }`}
          >
            2. Customer Service Referral
          </button>
          <button
            onClick={() => setActiveTab('redeem_code')}
            className={`py-3 text-center transition-colors border-b-2 cursor-pointer ${
              activeTab === 'redeem_code'
                ? 'border-slate-900 text-slate-900 font-semibold bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800 bg-slate-50/50'
            }`}
          >
            3. Enter Invitation Code
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 text-xs text-slate-800 max-h-[70vh] overflow-y-auto">
          {activeTab === 'social_share' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-900 block mb-1">
                  Shareable Technical Personnel Referral Link
                </span>
                <p className="text-slate-500 text-xs mb-3">
                  Share this invitation link with qualified engineers, technicians, and industrial specialists.
                </p>

                <div className="flex items-center gap-2">
                  <div className="flex-1 p-2.5 bg-white border border-slate-300 rounded-lg font-mono text-slate-800 truncate text-xs select-all">
                    {inviteUrl}
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Link className="w-4 h-4" />}
                    <span>{copied ? 'Copied' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>

              {/* Social Channels */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Broadcast via Social Media Networks:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={handleShareWhatsApp}
                    className="p-3 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 rounded-xl text-left transition-colors flex items-center gap-2.5 cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <MessageCircle className="w-4 h-4 fill-current" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">WhatsApp</div>
                      <div className="text-[11px] text-emerald-800">Direct Share / Groups</div>
                    </div>
                  </button>

                  <button
                    onClick={handleShareLinkedIn}
                    className="p-3 bg-blue-50 hover:bg-blue-100/80 border border-blue-200 rounded-xl text-left transition-colors flex items-center gap-2.5 cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">LinkedIn</div>
                      <div className="text-[11px] text-blue-800">Engineering Network</div>
                    </div>
                  </button>

                  <button
                    onClick={handleShareTwitter}
                    className="p-3 bg-slate-100 hover:bg-slate-200/80 border border-slate-300 rounded-xl text-left transition-colors flex items-center gap-2.5 cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
                      <Send className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">X / Twitter</div>
                      <div className="text-[11px] text-slate-600">Post Technical Call</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'customer_service' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Headset className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      Customer Service Technician Intake Desk
                    </h3>
                    <p className="text-emerald-900 text-xs font-mono font-semibold">
                      WhatsApp Support Line: {customerServicePhone}
                    </p>
                  </div>
                </div>

                <p className="text-slate-700 text-xs leading-relaxed">
                  Have an exceptional technician or engineer you want to nominate? Contact our Customer Care agent directly on WhatsApp at <strong>{customerServicePhone}</strong>. We will manually verify their credentials, issue their official App Authorisation Code, and assign their on-boarding tier.
                </p>

                <button
                  onClick={handleWhatsAppCustomerService}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Chat with Customer Care at {customerServicePhone}</span>
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 space-y-1">
                <div className="font-semibold text-slate-800">What customer service verifies:</div>
                <ul className="list-disc list-inside text-[11px] space-y-0.5 text-slate-600">
                  <li>National ID &amp; Professional Engineering / Technician License</li>
                  <li>Clean criminal background check &amp; tool ownership verification</li>
                  <li>Proof of previous client commissioning or industrial site log</li>
                  <li>Issuance of Anti-Theft Protection Bond</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'redeem_code' && (
            <form onSubmit={handleValidateCode} className="space-y-4">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="font-bold text-slate-900 text-sm">
                  Invited Technician Code Redemption
                </h3>
                <p className="text-slate-600 text-xs">
                  If you received an invitation code via WhatsApp, social media, or customer service ({customerServicePhone}), enter it below to claim your verified technician registration.
                </p>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Enter Invitation / Authorisation Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. TECH-INV-254 or AUTH-829104"
                    value={redeemCodeInput}
                    onChange={(e) => {
                      setRedeemCodeInput(e.target.value);
                      setRedeemError('');
                    }}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono text-sm uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                  {redeemError && (
                    <p className="text-rose-600 text-[11px] mt-1 font-medium">{redeemError}</p>
                  )}
                  {redeemSuccess && (
                    <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg text-[11px] mt-2 flex items-center gap-1.5 font-medium">
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Code Verified! Redirecting to fast-track onboarding...</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={redeemSuccess}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs transition-colors cursor-pointer"
                >
                  Verify Code &amp; Fast-Track Registration
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Need help? Call or WhatsApp <strong>{customerServicePhone}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-md transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
