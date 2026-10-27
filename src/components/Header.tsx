import React from 'react';

interface HeaderProps {
  activeTab: 'directory' | 'matchmaker' | 'requisitions' | 'meetings';
  onTabChange: (tab: 'directory' | 'matchmaker' | 'requisitions' | 'meetings') => void;
  onOpenRegister: () => void;
  onOpenInviteModal: () => void;
  onOpenSecurityModal: () => void;
  onOpenAuthCodeModal: () => void;
  onOpenProhibitedTermsModal: () => void;
  requisitionsCount: number;
  meetingsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenRegister,
  onOpenInviteModal,
  onOpenSecurityModal,
  onOpenAuthCodeModal,
  onOpenProhibitedTermsModal,
  requisitionsCount,
  meetingsCount,
}) => {
  const customerServicePhone = '0748469925';

  return (
    <header className="flex items-center justify-between gap-6 px-6 py-3.5 bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Zone 1: Wordmark & Customer Service Tag */}
      <div className="flex items-center gap-3 shrink-0">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onTabChange('directory');
          }}
          className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-slate-800 transition-colors"
        >
          Technix
        </a>
        <a
          href={`https://wa.me/254748469925?text=${encodeURIComponent('Hello Customer Service, I need assistance.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[11px] font-mono font-medium border border-emerald-200 hover:bg-emerald-100 transition-colors"
          title="WhatsApp Support Hotline"
        >
          <span>Support: {customerServicePhone}</span>
        </a>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden lg:flex items-center gap-5 text-xs font-medium text-slate-600">
        <button
          onClick={() => onTabChange('directory')}
          className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeTab === 'directory'
              ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
              : 'hover:text-slate-900'
          }`}
        >
          Personnel Registry
        </button>

        <button
          onClick={() => onTabChange('matchmaker')}
          className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeTab === 'matchmaker'
              ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
              : 'hover:text-slate-900'
          }`}
        >
          Smart Client Match
        </button>

        <button
          onClick={() => onTabChange('meetings')}
          className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 pb-0.5 flex items-center gap-1.5 ${
            activeTab === 'meetings'
              ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
              : 'hover:text-slate-900'
          }`}
        >
          <span>Meet Technicians</span>
          {meetingsCount > 0 && (
            <span className="text-[11px] font-mono tabular-nums bg-slate-900 text-white px-1.5 py-0.2 rounded">
              {meetingsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onTabChange('requisitions')}
          className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 pb-0.5 flex items-center gap-1.5 ${
            activeTab === 'requisitions'
              ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
              : 'hover:text-slate-900'
          }`}
        >
          <span>Client Requisitions</span>
          {requisitionsCount > 0 && (
            <span className="text-[11px] font-mono tabular-nums bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded">
              {requisitionsCount}
            </span>
          )}
        </button>

        <button
          onClick={onOpenInviteModal}
          className="cursor-pointer text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
        >
          Invited Personnel Space
        </button>

        <button
          onClick={onOpenAuthCodeModal}
          className="cursor-pointer text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
        >
          Verify Auth Code
        </button>

        <button
          onClick={onOpenSecurityModal}
          className="cursor-pointer text-rose-600 hover:text-rose-800 transition-colors whitespace-nowrap shrink-0 font-medium"
        >
          Anti-Theft &amp; Threat
        </button>

        <button
          onClick={onOpenProhibitedTermsModal}
          className="cursor-pointer text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
        >
          Prohibited Terms
        </button>
      </nav>

      {/* Zone 3: Quick Action & Registration */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onOpenInviteModal}
          className="hidden sm:inline-flex px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
        >
          + Invite Talent
        </button>

        <button
          onClick={onOpenRegister}
          className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs active:scale-[0.98]"
        >
          + Register Personnel
        </button>
      </div>
    </header>
  );
};
