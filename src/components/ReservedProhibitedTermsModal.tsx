import React, { useState } from 'react';
import {
  PROHIBITED_TERMS,
  RESERVED_RIGHTS,
  COMPLIANCE_SCENARIOS,
  ProhibitedTermItem,
} from '../data/prohibitedTerms';
import {
  ShieldAlert,
  Lock,
  AlertTriangle,
  Scale,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Search,
  MessageCircle,
  X,
  FileText,
  ShieldCheck,
} from 'lucide-react';

interface ReservedProhibitedTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenReportIncident?: () => void;
}

export const ReservedProhibitedTermsModal: React.FC<ReservedProhibitedTermsModalProps> = ({
  isOpen,
  onClose,
  onOpenReportIncident,
}) => {
  const [activeTab, setActiveTab] = useState<'prohibited' | 'reserved' | 'checker'>('prohibited');
  const [scenarioFilter, setScenarioFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const customerServicePhone = '0748469925';

  if (!isOpen) return null;

  const filteredProhibited = PROHIBITED_TERMS.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    return true;
  });

  const filteredScenarios = COMPLIANCE_SCENARIOS.filter((item) => {
    if (!scenarioFilter.trim()) return true;
    const q = scenarioFilter.toLowerCase();
    return item.query.toLowerCase().includes(q) || item.explanation.toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-rose-400 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Reserved Rights &amp; Prohibited Terms Charter</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Strict governance guidelines, forbidden field practices, and platform reserved protections.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 border-b border-slate-200 text-xs font-medium">
          <button
            onClick={() => setActiveTab('prohibited')}
            className={`py-3 text-center transition-colors border-b-2 cursor-pointer ${
              activeTab === 'prohibited'
                ? 'border-rose-600 text-rose-700 font-semibold bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800 bg-slate-50/50'
            }`}
          >
            1. Prohibited Terms &amp; Practices ({PROHIBITED_TERMS.length})
          </button>
          <button
            onClick={() => setActiveTab('reserved')}
            className={`py-3 text-center transition-colors border-b-2 cursor-pointer ${
              activeTab === 'reserved'
                ? 'border-slate-900 text-slate-900 font-semibold bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800 bg-slate-50/50'
            }`}
          >
            2. Platform Reserved Rights ({RESERVED_RIGHTS.length})
          </button>
          <button
            onClick={() => setActiveTab('checker')}
            className={`py-3 text-center transition-colors border-b-2 cursor-pointer ${
              activeTab === 'checker'
                ? 'border-amber-600 text-amber-700 font-semibold bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800 bg-slate-50/50'
            }`}
          >
            3. Interactive Compliance Checker
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4 text-xs text-slate-800 bg-slate-50/40">
          {/* TAB 1: Prohibited Terms */}
          {activeTab === 'prohibited' && (
            <div className="space-y-4">
              {/* Category Filter */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-medium">Filter Category:</span>
                <div className="flex flex-wrap gap-1.5">
                  {['all', 'Financial & Payment', 'On-Site Security & Tooling', 'Operational & Personnel', 'IP & Confidentiality'].map(
                    (cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-2.5 py-1 text-xs rounded-md font-medium cursor-pointer transition-colors ${
                          selectedCategory === cat
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cat === 'all' ? 'All Prohibited Clauses' : cat}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Prohibited List */}
              <div className="space-y-3">
                {filteredProhibited.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[11px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 uppercase">
                            PROHIBITED: {item.id}
                          </span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-500 text-[11px]">{item.category}</span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm mt-1">{item.term}</h3>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 text-right shrink-0">
                        {item.legalReference}
                      </div>
                    </div>

                    <p className="text-slate-600 leading-relaxed text-xs">{item.ruleDescription}</p>

                    <div className="p-2.5 bg-rose-50/60 rounded-lg border border-rose-100 space-y-1">
                      <div className="font-semibold text-rose-950 text-[11px] uppercase tracking-wider">
                        Specific Forbidden Acts:
                      </div>
                      <ul className="list-disc list-inside space-y-0.5 text-[11px] text-rose-900">
                        {item.prohibitedActions.map((act, idx) => (
                          <li key={idx}>{act}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500 border-t border-slate-100">
                      <div>
                        <strong className="text-slate-800">Mandatory Penalty: </strong>
                        <span className="text-rose-700 font-medium">{item.penalty}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Reserved Rights */}
          {activeTab === 'reserved' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <Lock className="w-4 h-4" />
                  <span>Platform Protection &amp; Legal Sovereignty</span>
                </div>
                <h3 className="font-bold text-sm">
                  Technix Platform Reserved Rights &amp; Enforcement Authorities
                </h3>
                <p className="text-slate-300 text-xs leading-relaxed">
                  These non-negotiable reserved rights empower Technix administration and customer service agents to protect client factory infrastructure, prevent equipment theft, and ensure bonded settlement.
                </p>
              </div>

              <div className="space-y-3">
                {RESERVED_RIGHTS.map((rr) => (
                  <div
                    key={rr.id}
                    className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[11px] text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {rr.id}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">{rr.title}</h4>
                      </div>
                      <span className="text-slate-500 text-[11px] font-medium">{rr.scope}</span>
                    </div>

                    <p className="text-slate-600 text-xs leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                      {rr.enforcementAction}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Interactive Compliance Checker */}
          {activeTab === 'checker' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-900 text-sm block">
                  Interactive Practice &amp; Scenario Compliance Tester
                </span>
                <p className="text-slate-500 text-xs">
                  Test hypothetical field situations, payment requests, or on-site practices against Technix Reserved and Prohibited terms.
                </p>

                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search practice (e.g., cash payment, borrowing tools, dead phone, apprentice)..."
                    value={scenarioFilter}
                    onChange={(e) => setScenarioFilter(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {filteredScenarios.map((sc) => (
                  <div
                    key={sc.id}
                    className="p-4 bg-white border border-slate-200 rounded-xl space-y-2.5 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="font-semibold text-slate-900 text-xs flex-1">
                        &ldquo;{sc.query}&rdquo;
                      </div>
                      <span
                        className={`font-mono font-bold text-[11px] px-2.5 py-1 rounded shrink-0 border ${
                          sc.status === 'STRICTLY_PROHIBITED'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : sc.status === 'RESERVED_RIGHT'
                            ? 'bg-slate-100 text-slate-800 border-slate-300'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {sc.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <p className="text-slate-600 text-xs leading-relaxed">{sc.explanation}</p>

                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-[11px]">
                      <strong className="text-slate-800">Required Action: </strong>
                      <span className="text-slate-700">{sc.actionRequired}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <span>Report breaches immediately via WhatsApp: </span>
            <a
              href={`https://wa.me/254748469925?text=${encodeURIComponent('Hello Customer Service, I would like to report a prohibited practice or breach of terms.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-emerald-700 hover:text-emerald-900 font-mono flex items-center gap-1 underline"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>{customerServicePhone}</span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            {onOpenReportIncident && (
              <button
                onClick={() => {
                  onClose();
                  onOpenReportIncident();
                }}
                className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-lg font-semibold text-xs transition-colors cursor-pointer"
              >
                File Violation Report
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer"
            >
              Acknowledge &amp; Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
