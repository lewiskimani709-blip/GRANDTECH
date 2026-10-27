import React, { useState } from 'react';
import { MessageCircle, Phone, ShieldAlert, X, Check, ExternalLink, Headset } from 'lucide-react';

interface CustomerServiceWhatsAppWidgetProps {
  onOpenSecurityModal?: () => void;
  onOpenAuthCodeModal?: () => void;
  onOpenProhibitedTermsModal?: () => void;
}

export const CustomerServiceWhatsAppWidget: React.FC<CustomerServiceWhatsAppWidgetProps> = ({
  onOpenSecurityModal,
  onOpenAuthCodeModal,
  onOpenProhibitedTermsModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = '0748469925';
  const whatsappInternational = '254748469925';

  const generateWhatsAppLink = (messageText: string) => {
    return `https://wa.me/${whatsappInternational}?text=${encodeURIComponent(messageText)}`;
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {/* Floating Widget Trigger */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer font-medium text-xs active:scale-95 border-2 border-white"
          aria-label="Customer Service WhatsApp"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <div className="text-left hidden sm:block">
            <div className="text-[10px] uppercase tracking-wider font-bold opacity-90">
              Customer Service
            </div>
            <div className="font-mono font-semibold text-xs tracking-tight">
              0748469925 · WhatsApp
            </div>
          </div>
          <span className="sm:hidden font-mono font-semibold">0748469925</span>
        </button>
      )}

      {/* Expanded Quick Support Panel */}
      {isOpen && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-80 sm:w-96 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Headset className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight">Customer Support 24/7</h3>
                <p className="text-[11px] text-slate-300 font-mono">
                  WhatsApp Hotline: <span className="text-emerald-400 font-semibold">{phoneNumber}</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-4 space-y-3 text-xs bg-slate-50/50">
            <p className="text-slate-600 text-xs leading-relaxed">
              Connect directly with our dedicated technical dispatch and security desk via WhatsApp or phone.
            </p>

            {/* Direct WhatsApp Callout Box */}
            <a
              href={generateWhatsAppLink('Hello Customer Service, I would like assistance with Technix technical dispatch & services.')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 rounded-xl transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 group-hover:text-emerald-950">
                    Chat on WhatsApp
                  </div>
                  <div className="text-[11px] font-mono text-emerald-800 font-semibold">
                    {phoneNumber}
                  </div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-emerald-700 group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* Quick Topic Pre-fills */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Quick Inquiries on WhatsApp:
              </div>

              <a
                href={generateWhatsAppLink('Urgent Dispatch: I need an emergency on-site technician assigned immediately.')}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 hover:text-slate-900 transition-colors"
              >
                🚨 Urgent Technician Dispatch Help
              </a>

              <a
                href={generateWhatsAppLink('Hello, I am a technical personnel invited to register. Please assist with my invitation onboarding and credentials.')}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 hover:text-slate-900 transition-colors"
              >
                🤝 Invited Personnel Onboarding Support
              </a>

              <a
                href={generateWhatsAppLink('Hello Customer Service, I need to verify a technician App Authorisation Code before work commences.')}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 hover:text-slate-900 transition-colors"
              >
                🔐 Verify App Authorisation Code
              </a>
            </div>

            {/* Threat & Theft Rapid Action */}
            <div className="pt-2 border-t border-slate-200 space-y-1.5">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenSecurityModal?.();
                }}
                className="w-full flex items-center justify-center gap-2 p-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-lg font-medium text-xs transition-colors cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Report Theft, Threat or Fraud Incident</span>
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenProhibitedTermsModal?.();
                }}
                className="w-full flex items-center justify-center gap-2 p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-[11px] transition-colors cursor-pointer"
              >
                <span>📜 Reserved Rights &amp; Prohibited Terms</span>
              </button>
            </div>

            {/* Voice call fallback */}
            <div className="pt-1 text-center">
              <a
                href={`tel:${phoneNumber}`}
                className="text-[11px] text-slate-500 hover:text-slate-800 underline underline-offset-2 flex items-center justify-center gap-1"
              >
                <Phone className="w-3 h-3" />
                <span>Prefer direct voice call? Dial {phoneNumber}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
