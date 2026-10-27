export type WorkMode = 'remote' | 'onsite' | 'hybrid' | 'emergency_callout' | 'shift';

export type PaymentMode = 'hourly' | 'milestone_fixed' | 'day_rate' | 'monthly_retainer' | 'emergency_surge';

export type PayoutMethod = 'bank_wire' | 'escrow' | 'corporate_invoice' | 'crypto_usdc' | 'card_instant';

export type TechnicalDiscipline =
  | 'Automation & Robotics'
  | 'Cloud & DevOps Architecture'
  | 'Electrical & Power Systems'
  | 'Embedded & Firmware'
  | 'HVAC & Thermal Systems'
  | 'Cybersecurity & ICS Audit'
  | 'Mechanical & CNC Fabrication'
  | 'Data & Machine Learning'
  | 'Telecommunications & Fiber'
  | 'Civil & Structural Inspection';

export interface Certification {
  name: string;
  issuer: string;
  year: number;
  verified: boolean;
  licenseNumber?: string;
}

export interface PaymentStructure {
  hourlyRate?: {
    amount: number;
    currency: string;
    minHours?: number;
  };
  dayRate?: {
    amount: number;
    currency: string;
    hoursPerDay: number;
  };
  milestoneFixed?: {
    minProjectRate: number;
    currency: string;
    quoteTimeline: string;
  };
  monthlyRetainer?: {
    amount: number;
    currency: string;
    hoursIncluded: number;
  };
  emergencySurge?: {
    calloutBaseFee: number;
    hourlySurcharge: number;
    currency: string;
    responseTimeMinutes: number;
  };
}

export interface WorkModeDetail {
  mode: WorkMode;
  available: boolean;
  description: string;
  maxTravelDistanceKm?: number;
  timezones?: string[];
  noticePeriodHours?: number;
}

export interface TechnicalPersonnel {
  id: string;
  fullName: string;
  title: string;
  discipline: TechnicalDiscipline;
  seniority: 'Mid-Level' | 'Senior' | 'Principal Specialist' | 'Lead Engineer';
  yearsExperience: number;
  bio: string;
  location: string;
  country: string;
  timezone: string;
  avatarUrl: string;
  workModes: WorkMode[];
  workModeDetails: WorkModeDetail[];
  paymentModes: PaymentMode[];
  paymentStructure: PaymentStructure;
  acceptedPayoutMethods: PayoutMethod[];
  primarySkills: string[];
  equipmentAndTooling: string[];
  certifications: Certification[];
  availabilityStatus: 'immediate' | 'within_48h' | 'booked_next_week' | 'advisory_only';
  rating: number;
  reviewCount: number;
  completedJobs: number;
  onTimeDispatchRate: number;
  registeredDate: string;
  contactEmail: string;
  contactPhone: string;
  featured?: boolean;
}

export interface ClientNeedFilter {
  query: string;
  discipline: string;
  workMode: WorkMode | 'all';
  paymentMode: PaymentMode | 'all';
  maxHourlyRate: number;
  maxDayRate: number;
  payoutMethod: PayoutMethod | 'all';
  availability: string;
  sortBy: 'match' | 'rating' | 'experience' | 'price_asc' | 'price_desc';
}

export interface MeetingSession {
  id: string;
  technicianId: string;
  technicianName: string;
  technicianDiscipline: string;
  clientName: string;
  companyName: string;
  clientEmail: string;
  clientPhone: string;
  meetingType: 'video_consultation' | 'onsite_dispatch' | 'urgent_briefing';
  scheduledDate: string;
  scheduledTime: string;
  locationOrUrl: string;
  agenda: string;
  authorizationCode: string;
  status: 'scheduled' | 'authorized' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface SecurityIncidentReport {
  id: string;
  reporterRole: 'client' | 'technician' | 'field_supervisor';
  reporterName: string;
  reporterPhone: string;
  incidentType:
    | 'theft_equipment'
    | 'unauthorized_impersonation'
    | 'safety_threat'
    | 'payment_fraud'
    | 'site_damage';
  involvedPartyName: string;
  authorizationCodeRef?: string;
  incidentDate: string;
  location: string;
  description: string;
  actionTaken: string;
  status: 'investigating' | 'account_frozen' | 'resolved_police_notified';
  reportedAt: string;
}

export interface TechnicianInvite {
  id: string;
  inviteCode: string;
  referrerName: string;
  referrerRole: 'technician' | 'client' | 'customer_service';
  channel: 'whatsapp' | 'social_media' | 'customer_service' | 'direct_link';
  claimedByEmail?: string;
  status: 'pending' | 'claimed' | 'expired';
  createdAt: string;
}

export interface ClientRequisition {
  id: string;
  clientName: string;
  companyName: string;
  clientEmail: string;
  projectTitle: string;
  discipline: TechnicalDiscipline;
  selectedWorkMode: WorkMode;
  selectedPaymentMode: PaymentMode;
  targetBudget: number;
  currency: string;
  startDate: string;
  durationEstimate: string;
  siteLocation?: string;
  scopeDescription: string;
  assignedPersonnelId?: string;
  assignedPersonnelName?: string;
  payoutMethod: PayoutMethod;
  status: 'pending_review' | 'confirmed' | 'active_dispatch' | 'completed';
  createdAt: string;
  authorizationCode?: string;
}
