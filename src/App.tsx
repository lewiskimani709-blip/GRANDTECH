import React, { useState, useEffect, useMemo } from 'react';
import {
  TechnicalPersonnel,
  ClientNeedFilter,
  ClientRequisition,
  WorkMode,
  PaymentMode,
  MeetingSession,
  SecurityIncidentReport,
} from './types';
import { INITIAL_PERSONNEL, WORK_MODE_CONFIG, PAYMENT_MODE_CONFIG } from './data/seedPersonnel';
import { Header } from './components/Header';
import { FiltersBar } from './components/FiltersBar';
import { PersonnelCard } from './components/PersonnelCard';
import { PersonnelTableView } from './components/PersonnelTableView';
import { PersonnelDetailModal } from './components/PersonnelDetailModal';
import { PersonnelRegisterModal } from './components/PersonnelRegisterModal';
import { SmartMatchWizard } from './components/SmartMatchWizard';
import { ClientRequisitionModal } from './components/ClientRequisitionModal';
import { RequisitionsTracker } from './components/RequisitionsTracker';
import { MeetingsTrackerView } from './components/MeetingsTrackerView';
import { ClientTechnicianMeetingModal } from './components/ClientTechnicianMeetingModal';
import { CustomerServiceWhatsAppWidget } from './components/CustomerServiceWhatsAppWidget';
import { InviteTechnicianModal } from './components/InviteTechnicianModal';
import { SecurityThreatModal } from './components/SecurityThreatModal';
import { AppAuthorisationCodeModal } from './components/AppAuthorisationCodeModal';
import { ReservedProhibitedTermsModal } from './components/ReservedProhibitedTermsModal';
import {
  SlidersHorizontal,
  UserPlus,
  FileCheck2,
  Calendar,
  Share2,
  ShieldAlert,
  Key,
  MessageCircle,
} from 'lucide-react';

const STORAGE_KEY_PERSONNEL = 'technix_personnel_roster_v2';
const STORAGE_KEY_REQUISITIONS = 'technix_client_requisitions_v2';
const STORAGE_KEY_MEETINGS = 'technix_client_meetings_v2';
const STORAGE_KEY_SECURITY_INCIDENTS = 'technix_security_incidents_v2';

const INITIAL_REQUISITIONS: ClientRequisition[] = [
  {
    id: 'req-829104',
    clientName: 'Stefan Gruber',
    companyName: 'Bavaria Robotics Werk GmbH',
    clientEmail: 's.gruber@bavaria-robotics.de',
    projectTitle: 'Automotive Stamping Line KUKA Robotic Cell Commissioning',
    discipline: 'Automation & Robotics',
    selectedWorkMode: 'onsite',
    selectedPaymentMode: 'day_rate',
    targetBudget: 4400,
    currency: 'EUR',
    startDate: '2026-11-02',
    durationEstimate: '5 operational days',
    siteLocation: 'Plant 2, Dingolfing, Bavaria',
    scopeDescription: 'Fine-tune 6-axis welding kinematics, verify Profinet safety interlocks, and sign off CE compliance.',
    assignedPersonnelId: 'tech-001',
    assignedPersonnelName: 'Sarah M. Jenkins',
    payoutMethod: 'escrow',
    status: 'active_dispatch',
    createdAt: '2026-10-24T08:30:00Z',
    authorizationCode: 'AUTH-829104',
  },
  {
    id: 'req-829105',
    clientName: 'Claire Thornton',
    companyName: 'Veloce Data Infrastructure Ltd',
    clientEmail: 'c.thornton@velocedata.co.uk',
    projectTitle: 'Multi-Region Kubernetes Terraform Pipeline Hardening',
    discipline: 'Cloud & DevOps Architecture',
    selectedWorkMode: 'remote',
    selectedPaymentMode: 'hourly',
    targetBudget: 4200,
    currency: 'GBP',
    startDate: '2026-10-30',
    durationEstimate: '30 technical hours',
    scopeDescription: 'Audit ArgoCD deployment manifests, implement AWS Transit Gateway, and configure zero-trust mTLS.',
    assignedPersonnelId: 'tech-002',
    assignedPersonnelName: 'Elena Rostova',
    payoutMethod: 'corporate_invoice',
    status: 'confirmed',
    createdAt: '2026-10-25T14:15:00Z',
    authorizationCode: 'AUTH-619482',
  },
];

const INITIAL_MEETINGS: MeetingSession[] = [
  {
    id: 'meet-104921',
    technicianId: 'tech-001',
    technicianName: 'Sarah M. Jenkins',
    technicianDiscipline: 'Automation & Robotics',
    clientName: 'Stefan Gruber',
    companyName: 'Bavaria Robotics Werk GmbH',
    clientEmail: 's.gruber@bavaria-robotics.de',
    clientPhone: '+49 89 4410 9200',
    meetingType: 'onsite_dispatch',
    scheduledDate: '2026-11-02',
    scheduledTime: '09:00',
    locationOrUrl: 'Plant 2, Dingolfing, Bavaria',
    agenda: 'Physical line handover, tool safety calibration, and multi-axis KUKA cell staging.',
    authorizationCode: 'AUTH-829104',
    status: 'authorized',
    createdAt: '2026-10-25T11:00:00Z',
  },
  {
    id: 'meet-104922',
    technicianId: 'tech-002',
    technicianName: 'Elena Rostova',
    technicianDiscipline: 'Cloud & DevOps Architecture',
    clientName: 'Claire Thornton',
    companyName: 'Veloce Data Infrastructure Ltd',
    clientEmail: 'c.thornton@velocedata.co.uk',
    clientPhone: '+44 20 8921 4401',
    meetingType: 'video_consultation',
    scheduledDate: '2026-10-30',
    scheduledTime: '14:00',
    locationOrUrl: 'https://meet.technix.org/room-auth-619482',
    agenda: 'Architecture review of multi-region Terraform modules and ArgoCD mTLS enforcement.',
    authorizationCode: 'AUTH-619482',
    status: 'scheduled',
    createdAt: '2026-10-26T15:20:00Z',
  },
];

const DEFAULT_FILTER: ClientNeedFilter = {
  query: '',
  discipline: 'all',
  workMode: 'all',
  paymentMode: 'all',
  maxHourlyRate: 2000,
  maxDayRate: 5000,
  payoutMethod: 'all',
  availability: 'all',
  sortBy: 'match',
};

export default function App() {
  const customerServicePhone = '0748469925';

  // Navigation & Active Views
  const [activeTab, setActiveTab] = useState<'directory' | 'matchmaker' | 'requisitions' | 'meetings'>('directory');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Core Data Stores
  const [personnelList, setPersonnelList] = useState<TechnicalPersonnel[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PERSONNEL);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_PERSONNEL;
  });

  const [requisitions, setRequisitions] = useState<ClientRequisition[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REQUISITIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_REQUISITIONS;
  });

  const [meetings, setMeetings] = useState<MeetingSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MEETINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_MEETINGS;
  });

  const [securityReports, setSecurityReports] = useState<SecurityIncidentReport[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SECURITY_INCIDENTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Filter State
  const [filter, setFilter] = useState<ClientNeedFilter>(DEFAULT_FILTER);

  // Modals State
  const [selectedPersonnel, setSelectedPersonnel] = useState<TechnicalPersonnel | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isMatchWizardOpen, setIsMatchWizardOpen] = useState(false);
  const [isRequisitionModalOpen, setIsRequisitionModalOpen] = useState(false);
  const [requisitionTargetPersonnel, setRequisitionTargetPersonnel] = useState<TechnicalPersonnel | null>(null);
  const [initialWorkMode, setInitialWorkMode] = useState<WorkMode | undefined>(undefined);
  const [initialPaymentMode, setInitialPaymentMode] = useState<PaymentMode | undefined>(undefined);

  // New Modals
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [meetingTargetPersonnel, setMeetingTargetPersonnel] = useState<TechnicalPersonnel | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isAuthCodeModalOpen, setIsAuthCodeModalOpen] = useState(false);
  const [isProhibitedTermsModalOpen, setIsProhibitedTermsModalOpen] = useState(false);

  // Sync with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PERSONNEL, JSON.stringify(personnelList));
    } catch {
      // ignore
    }
  }, [personnelList]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REQUISITIONS, JSON.stringify(requisitions));
    } catch {
      // ignore
    }
  }, [requisitions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MEETINGS, JSON.stringify(meetings));
    } catch {
      // ignore
    }
  }, [meetings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SECURITY_INCIDENTS, JSON.stringify(securityReports));
    } catch {
      // ignore
    }
  }, [securityReports]);

  // Handlers
  const handleRegisterPersonnel = (newPerson: TechnicalPersonnel) => {
    setPersonnelList((prev) => [newPerson, ...prev]);
    setSelectedPersonnel(newPerson);
  };

  const handleCreateRequisition = (newReq: ClientRequisition) => {
    setRequisitions((prev) => [newReq, ...prev]);
    setActiveTab('requisitions');
  };

  const handleUpdateRequisitionStatus = (id: string, newStatus: ClientRequisition['status']) => {
    setRequisitions((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const handleScheduleMeeting = (newMeeting: MeetingSession) => {
    setMeetings((prev) => [newMeeting, ...prev]);
    setActiveTab('meetings');
  };

  const handleUpdateMeetingStatus = (id: string, newStatus: MeetingSession['status']) => {
    setMeetings((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
    );
  };

  const handleAddSecurityReport = (report: SecurityIncidentReport) => {
    setSecurityReports((prev) => [report, ...prev]);
  };

  // Filter & Search Logic
  const filteredPersonnel = useMemo(() => {
    return personnelList.filter((person) => {
      // Keyword query
      if (filter.query.trim()) {
        const q = filter.query.toLowerCase();
        const matchesName = person.fullName.toLowerCase().includes(q);
        const matchesTitle = person.title.toLowerCase().includes(q);
        const matchesDiscipline = person.discipline.toLowerCase().includes(q);
        const matchesLocation = person.location.toLowerCase().includes(q);
        const matchesBio = person.bio.toLowerCase().includes(q);
        const matchesSkills = person.primarySkills.some((s) => s.toLowerCase().includes(q));
        const matchesTools = person.equipmentAndTooling.some((t) => t.toLowerCase().includes(q));

        if (
          !matchesName &&
          !matchesTitle &&
          !matchesDiscipline &&
          !matchesLocation &&
          !matchesBio &&
          !matchesSkills &&
          !matchesTools
        ) {
          return false;
        }
      }

      // Discipline
      if (filter.discipline !== 'all' && person.discipline !== filter.discipline) {
        return false;
      }

      // Mode of Work
      if (filter.workMode !== 'all' && !person.workModes.includes(filter.workMode)) {
        return false;
      }

      // Payment Mode
      if (filter.paymentMode !== 'all' && !person.paymentModes.includes(filter.paymentMode)) {
        return false;
      }

      // Availability
      if (filter.availability !== 'all' && person.availabilityStatus !== filter.availability) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filter.sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (filter.sortBy === 'experience') {
        return b.yearsExperience - a.yearsExperience;
      }
      if (filter.sortBy === 'price_asc') {
        const rateA = a.paymentStructure.dayRate?.amount || a.paymentStructure.hourlyRate?.amount || 9999;
        const rateB = b.paymentStructure.dayRate?.amount || b.paymentStructure.hourlyRate?.amount || 9999;
        return rateA - rateB;
      }
      if (filter.sortBy === 'price_desc') {
        const rateA = a.paymentStructure.dayRate?.amount || a.paymentStructure.hourlyRate?.amount || 0;
        const rateB = b.paymentStructure.dayRate?.amount || b.paymentStructure.hourlyRate?.amount || 0;
        return rateB - rateA;
      }
      return b.onTimeDispatchRate - a.onTimeDispatchRate;
    });
  }, [personnelList, filter]);

  // Direct Book Quick Trigger
  const handleQuickBook = (
    person: TechnicalPersonnel,
    mode?: WorkMode,
    payment?: PaymentMode
  ) => {
    setRequisitionTargetPersonnel(person);
    setInitialWorkMode(mode || person.workModes[0]);
    setInitialPaymentMode(payment || person.paymentModes[0]);
    setIsRequisitionModalOpen(true);
  };

  // Meet Technician Trigger
  const handleOpenMeetTechnician = (person: TechnicalPersonnel) => {
    setMeetingTargetPersonnel(person);
    setIsMeetingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Strict 3-Zone Header */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'matchmaker') {
            setIsMatchWizardOpen(true);
          }
        }}
        onOpenRegister={() => setIsRegisterModalOpen(true)}
        onOpenInviteModal={() => setIsInviteModalOpen(true)}
        onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
        onOpenAuthCodeModal={() => setIsAuthCodeModalOpen(true)}
        onOpenProhibitedTermsModal={() => setIsProhibitedTermsModalOpen(true)}
        requisitionsCount={requisitions.length}
        meetingsCount={meetings.length}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'requisitions' ? (
          <RequisitionsTracker
            requisitions={requisitions}
            onUpdateStatus={handleUpdateRequisitionStatus}
            onNewRequisition={() => {
              setRequisitionTargetPersonnel(null);
              setIsRequisitionModalOpen(true);
            }}
          />
        ) : activeTab === 'meetings' ? (
          <MeetingsTrackerView
            meetings={meetings}
            onNewMeeting={() => {
              setMeetingTargetPersonnel(personnelList[0]);
              setIsMeetingModalOpen(true);
            }}
            onUpdateStatus={handleUpdateMeetingStatus}
            onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
          />
        ) : (
          <div className="space-y-6">
            {/* Hero / Context Introduction */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
              <div className="max-w-3xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
                    Official Technician Dispatch &amp; Client Consultation Gateway
                  </span>
                  <span className="text-slate-300">·</span>
                  <a
                    href={`https://wa.me/254748469925?text=${encodeURIComponent('Hello Customer Service, I need assistance.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold hover:bg-emerald-100 transition-colors"
                  >
                    <MessageCircle className="w-3 h-3 fill-current" />
                    <span>WhatsApp: {customerServicePhone}</span>
                  </a>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance leading-snug">
                  Meet Certified Technicians, Register Modes of Work &amp; Payments
                </h1>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-2xl text-pretty">
                  Direct connection between enterprise clients and vetted technical personnel. Schedule 1-on-1 virtual or on-site meetings, lock in your preferred work mode and payment terms, verified with mandatory 6-digit <strong>App Authorisation Codes</strong> and strict anti-theft protocols.
                </p>

                {/* Claim-to-Proof Adjacency strip */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-5 pt-4 border-t border-slate-100 text-xs text-slate-500 font-mono tabular-nums">
                  <div className="flex items-center gap-1.5">
                    <strong className="text-slate-900 font-bold text-sm">
                      {personnelList.length}
                    </strong>
                    <span>Verified Technicians</span>
                  </div>
                  <span className="text-slate-300" aria-hidden="true">·</span>
                  <div className="flex items-center gap-1.5">
                    <strong className="text-slate-900 font-bold text-sm">{meetings.length}</strong>
                    <span>Client Meetings Active</span>
                  </div>
                  <span className="text-slate-300" aria-hidden="true">·</span>
                  <div className="flex items-center gap-1.5">
                    <strong className="text-amber-800 font-bold text-sm">6-Digit</strong>
                    <span>App Auth Codes Enforced</span>
                  </div>
                  <span className="text-slate-300" aria-hidden="true">·</span>
                  <div className="flex items-center gap-1.5">
                    <strong className="text-emerald-700 font-bold text-sm">$50,000</strong>
                    <span>Anti-Theft Tool Bond</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsMatchWizardOpen(true)}
                  className="px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs active:scale-[0.99]"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Launch Smart Matchmaker</span>
                </button>

                <button
                  onClick={() => {
                    setMeetingTargetPersonnel(personnelList[0]);
                    setIsMeetingModalOpen(true);
                  }}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-slate-700" />
                  <span>Meet Respective Technician</span>
                </button>

                <button
                  onClick={() => setIsInviteModalOpen(true)}
                  className="px-4 py-2.5 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-slate-700" />
                  <span>Invited Personnel Space</span>
                </button>

                <button
                  onClick={() => setIsAuthCodeModalOpen(true)}
                  className="px-4 py-2.5 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5 text-amber-600" />
                  <span>Check Auth Code</span>
                </button>

                <button
                  onClick={() => setIsProhibitedTermsModalOpen(true)}
                  className="px-4 py-2.5 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>📜 Prohibited &amp; Reserved Terms</span>
                </button>

                <button
                  onClick={() => setIsSecurityModalOpen(true)}
                  className="px-4 py-2.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-2 cursor-pointer ml-auto"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                  <span>Anti-Theft &amp; Threat Center</span>
                </button>
              </div>
            </div>

            {/* Structured Search & Filters */}
            <FiltersBar
              filter={filter}
              onFilterChange={(updated) => setFilter((prev) => ({ ...prev, ...updated }))}
              onReset={() => setFilter(DEFAULT_FILTER)}
              totalCount={personnelList.length}
              filteredCount={filteredPersonnel.length}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onOpenMatchmaker={() => setIsMatchWizardOpen(true)}
            />

            {/* Results Grid or Table */}
            {viewMode === 'grid' ? (
              filteredPersonnel.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
                  <h3 className="text-sm font-semibold text-slate-800">
                    No technical personnel matched your search criteria
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try clearing one of the work mode or payment mode filters, or reset to view all engineers.
                  </p>
                  <button
                    onClick={() => setFilter(DEFAULT_FILTER)}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredPersonnel.map((person) => (
                    <PersonnelCard
                      key={person.id}
                      personnel={person}
                      onSelect={(p) => setSelectedPersonnel(p)}
                      onQuickBook={(p) => handleQuickBook(p)}
                      onMeetTechnician={(p) => handleOpenMeetTechnician(p)}
                    />
                  ))}
                </div>
              )
            ) : (
              <PersonnelTableView
                personnelList={filteredPersonnel}
                onSelect={(p) => setSelectedPersonnel(p)}
                onQuickBook={(p) => handleQuickBook(p)}
                onMeetTechnician={(p) => handleOpenMeetTechnician(p)}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">Technix</span>
            <span>·</span>
            <span>Customer Service: <strong>{customerServicePhone}</strong> (WhatsApp &amp; Voice)</span>
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <span>App Authorisation Code Enforced</span>
            <span>·</span>
            <span>Zero-Tolerance Anti-Theft Protocol</span>
            <span>·</span>
            <span>Bonded Escrow Payouts</span>
          </div>
        </div>
      </footer>

      {/* Customer Service WhatsApp Floating Desk at 0748469925 */}
      <CustomerServiceWhatsAppWidget
        onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
        onOpenAuthCodeModal={() => setIsAuthCodeModalOpen(true)}
        onOpenProhibitedTermsModal={() => setIsProhibitedTermsModalOpen(true)}
      />

      {/* Modals & Drawers */}
      <PersonnelDetailModal
        personnel={selectedPersonnel}
        isOpen={Boolean(selectedPersonnel)}
        onClose={() => setSelectedPersonnel(null)}
        onBook={(person, mode, payment) => handleQuickBook(person, mode, payment)}
        onMeetTechnician={(person) => handleOpenMeetTechnician(person)}
      />

      <PersonnelRegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegister={handleRegisterPersonnel}
      />

      <SmartMatchWizard
        personnelList={personnelList}
        isOpen={isMatchWizardOpen}
        onClose={() => {
          setIsMatchWizardOpen(false);
          if (activeTab === 'matchmaker') {
            setActiveTab('directory');
          }
        }}
        onSelectPersonnel={(p) => setSelectedPersonnel(p)}
        onDirectDispatch={(p, matchDetails) =>
          handleQuickBook(p, matchDetails?.workMode, matchDetails?.paymentMode)
        }
      />

      <ClientRequisitionModal
        isOpen={isRequisitionModalOpen}
        onClose={() => {
          setIsRequisitionModalOpen(false);
          setRequisitionTargetPersonnel(null);
        }}
        targetPersonnel={requisitionTargetPersonnel}
        initialWorkMode={initialWorkMode}
        initialPaymentMode={initialPaymentMode}
        onSubmitRequisition={handleCreateRequisition}
      />

      {/* Client-Technician Meeting & Consultation Modal */}
      <ClientTechnicianMeetingModal
        technician={meetingTargetPersonnel}
        isOpen={isMeetingModalOpen}
        onClose={() => {
          setIsMeetingModalOpen(false);
          setMeetingTargetPersonnel(null);
        }}
        onScheduleMeeting={handleScheduleMeeting}
      />

      {/* Invited Personnel Space Modal */}
      <InviteTechnicianModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onOpenRegisterWithCode={(code) => {
          setIsRegisterModalOpen(true);
        }}
      />

      {/* Security, Theft & Threat Protocol Modal */}
      <SecurityThreatModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        onSubmitReport={handleAddSecurityReport}
      />

      {/* App Authorisation Code Validator Modal */}
      <AppAuthorisationCodeModal
        isOpen={isAuthCodeModalOpen}
        onClose={() => setIsAuthCodeModalOpen(false)}
        meetings={meetings}
        requisitions={requisitions}
        personnelList={personnelList}
      />

      {/* Reserved Rights & Prohibited Terms Modal */}
      <ReservedProhibitedTermsModal
        isOpen={isProhibitedTermsModalOpen}
        onClose={() => setIsProhibitedTermsModalOpen(false)}
        onOpenReportIncident={() => setIsSecurityModalOpen(true)}
      />
    </div>
  );
}
