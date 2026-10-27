export interface ProhibitedTermItem {
  id: string;
  category: 'Financial & Payment' | 'On-Site Security & Tooling' | 'Operational & Personnel' | 'IP & Confidentiality';
  term: string;
  ruleDescription: string;
  prohibitedActions: string[];
  penalty: string;
  legalReference: string;
}

export interface ReservedRightItem {
  id: string;
  title: string;
  scope: string;
  enforcementAction: string;
}

export interface ComplianceScenario {
  id: string;
  query: string;
  status: 'STRICTLY_PROHIBITED' | 'RESERVED_RIGHT' | 'PERMITTED_WITH_AUTHORISATION';
  explanation: string;
  actionRequired: string;
}

export const PROHIBITED_TERMS: ProhibitedTermItem[] = [
  {
    id: 'pt-001',
    category: 'Financial & Payment',
    term: 'Off-Platform Cash & Unauthorized Surcharges',
    ruleDescription:
      'All payments, mobilization stipends, overtime fees, and equipment rentals must be routed strictly through the Technix escrow or verified invoice system.',
    prohibitedActions: [
      'Demanding or accepting direct physical cash or personal mobile money transfers on-site',
      'Adding unapproved surcharges outside the signed Dispatch Requisition',
      'Circumventing escrow milestone release protocols',
    ],
    penalty: 'Immediate permanent ban, forfeiture of pending payout escrow, and security blacklist.',
    legalReference: 'Technix Financial Governance Clause 4.2 & Anti-Extortion Act',
  },
  {
    id: 'pt-002',
    category: 'On-Site Security & Tooling',
    term: 'Unauthorized Tool Retention & Equipment Theft',
    ruleDescription:
      'Personnel and clients are strictly forbidden from withholding, expropriating, or removing any machinery, diagnostic tool, calibration gear, or hardware from the designated job site without signed clearance.',
    prohibitedActions: [
      'Taking client diagnostic rigs, laptops, or spare parts off-site overnight without written permit',
      'Retaining technician testing tools as leverage over commercial disputes',
      'Tampering with equipment serial numbers or asset tags',
    ],
    penalty:
      'Immediate criminal referral to law enforcement, police report filing, and activation of the $50,000 Tool Bond.',
    legalReference: 'Penal Code §302 (Theft & Conversion of Industrial Assets)',
  },
  {
    id: 'pt-003',
    category: 'Operational & Personnel',
    term: 'Work Without Valid App Authorisation Code & Impersonation',
    ruleDescription:
      'No technician is permitted to commence work, enter restricted factory floors, or touch electrical/mechanical infrastructure without presenting their active 6-digit App Authorisation Code.',
    prohibitedActions: [
      'Sending an unvetted substitute, apprentice, or third-party in place of the registered technician',
      'Commencing work when the App Authorisation Code is expired or invalid',
      'Borrowing or sharing another technician’s login credentials or dispatch pass',
    ],
    penalty:
      'Immediate expulsion from site, total nullification of insurance coverage, and liability for all site risks.',
    legalReference: 'Occupational Safety & Site Access Compliance Mandate ISO 45001',
  },
  {
    id: 'pt-004',
    category: 'Operational & Personnel',
    term: 'Safety Bypass & Critical Interlock Disablement',
    ruleDescription:
      'Technical personnel must strictly uphold functional safety standards (SIL2/SIL3, NFPA 70E, OSHA 1910). Bypassing safety interlocks for operational speed is strictly prohibited.',
    prohibitedActions: [
      'Bridging safety circuit interlocks or light curtains without LOTO (Lockout/Tagout) documentation',
      'Performing high-voltage or pressurized steam work without specified PPE and arc flash protection',
      'Operating machinery under the influence of intoxicating substances or extreme fatigue',
    ],
    penalty: 'Immediate termination of dispatch, statutory reporting to labor safety authorities.',
    legalReference: 'Industrial Safety Standards Act & Machinery Directive 2006/42/EC',
  },
  {
    id: 'pt-005',
    category: 'IP & Confidentiality',
    term: 'Industrial Espionage & Proprietary Logic Exfiltration',
    ruleDescription:
      'All SCADA databases, PLC ladder code, CAD blueprints, network topologies, and client operational procedures are strictly proprietary.',
    prohibitedActions: [
      'Copying or leaking client PLC source code, schematics, or recipes to external flash drives',
      'Photographing sensitive production lines without client media permit',
      'Installing unauthorized remote access trojans or backdoors in client ICS networks',
    ],
    penalty:
      'Civil litigation for trade secret misappropriation and damages, permanent industry de-registration.',
    legalReference: 'Uniform Trade Secrets Act & Computer Misuse and Cybercrimes Act',
  },
  {
    id: 'pt-006',
    category: 'On-Site Security & Tooling',
    term: 'Hostile Behavior, Intimidation & Extortion',
    ruleDescription:
      'Threats of physical harm, hostile verbal abuse, refusal to vacate client property upon termination, or site sabotage are criminal violations.',
    prohibitedActions: [
      'Threatening client staff or refusing to leave site upon official dispatch cancellation',
      'Holding plant operations hostage by intentionally locking PLC passwords or changing master keys',
      'Any form of harassment, extortion, or blackmail',
    ],
    penalty:
      'Immediate emergency dispatch of security/police via 0748469925, criminal prosecution.',
    legalReference: 'Criminal Law & Extortion Sanctions',
  },
];

export const RESERVED_RIGHTS: ReservedRightItem[] = [
  {
    id: 'rr-001',
    title: 'Right of Immediate Escrow Freeze & Protective Hold',
    scope: 'Financial and Payment Balances',
    enforcementAction:
      'Technix reserves the right to freeze any escrow fund, pending payout, or client deposit within 60 seconds upon receipt of an authentic security threat, theft, or contract breach report.',
  },
  {
    id: 'rr-002',
    title: 'Right of Mandatory Law Enforcement Escalation',
    scope: 'Criminal Violations & Physical Theft',
    enforcementAction:
      'Technix reserves the full right to transfer verified government ID scans, live GPS tracking logs, dispatch timestamps, and hardware serial numbers directly to police investigators and judicial officers.',
  },
  {
    id: 'rr-003',
    title: 'Right of Physical Site Verification & Tool Auditing',
    scope: 'Quality, Identity & Tooling Compliance',
    enforcementAction:
      'Technix field supervisors and customer service representatives (Hotline 0748469925) reserve the right to perform unannounced verification audits of technician credentials, calibration tags, and App Authorisation Codes on site.',
  },
  {
    id: 'rr-004',
    title: 'Right of Permanent Network De-Registration & Blacklisting',
    scope: 'Professional Licensing & Registry Standing',
    enforcementAction:
      'Any personnel or client found engaging in prohibited practices will have their profile revoked, verified badge stripped, and national ID recorded in the shared inter-agency industrial blacklist.',
  },
  {
    id: 'rr-005',
    title: 'Right of Subrogated Insurance Asset Recovery',
    scope: 'Loss Mitigation under $50,000 Bond',
    enforcementAction:
      'Technix reserves the right to pursue full legal indemnification and recovery against offending parties on behalf of insured clients and bonded technicians for all stolen or damaged assets.',
  },
];

export const COMPLIANCE_SCENARIOS: ComplianceScenario[] = [
  {
    id: 'sc-1',
    query: 'Client offers to pay 50% in cash directly to the technician on site to avoid platform processing.',
    status: 'STRICTLY_PROHIBITED',
    explanation:
      'Direct cash settlements violate Prohibited Term PT-001. Cash transactions void all insurance coverage, escrow protection, and legal indemnification.',
    actionRequired: 'Decline cash payment and instruct client to settle strictly via Technix Escrow / Invoice.',
  },
  {
    id: 'sc-2',
    query: 'Technician takes a client-owned high-voltage diagnostic analyzer back to their private workshop overnight for calibration without written permit.',
    status: 'STRICTLY_PROHIBITED',
    explanation:
      'Unauthorized removal of client hardware constitutes equipment theft under PT-002, triggering criminal referral and the $50,000 bond recovery process.',
    actionRequired: 'All equipment leaving site requires signed client equipment release pass and notification to 0748469925.',
  },
  {
    id: 'sc-3',
    query: 'Technician arrives on site but their mobile phone battery is dead, so they ask the client to bypass the 6-digit App Authorisation Code.',
    status: 'STRICTLY_PROHIBITED',
    explanation:
      'Work without verified App Authorisation Code is strictly prohibited under PT-003. Imposters often use this excuse to gain unauthorized physical access.',
    actionRequired: 'Client must call Customer Service at 0748469925 immediately to verify authorization over voice or WhatsApp.',
  },
  {
    id: 'sc-4',
    query: 'Technix administration places a temporary freeze on an active dispatch escrow following an emergency incident report.',
    status: 'RESERVED_RIGHT',
    explanation:
      'This is a designated platform reserved right (RR-001) to safeguard client and technician funds during active security or dispute investigations.',
    actionRequired: 'Cooperate with the Customer Service investigative desk at 0748469925.',
  },
  {
    id: 'sc-5',
    query: 'Technician brings an assistant or junior apprentice to assist on an urgent multi-axis robot commissioning job.',
    status: 'PERMITTED_WITH_AUTHORISATION',
    explanation:
      'Assistant personnel are only allowed if pre-registered, credentialed, and issued an individual secondary App Authorisation Code.',
    actionRequired: 'Register assistant through Invited Personnel Space or WhatsApp Customer Care at 0748469925.',
  },
];
