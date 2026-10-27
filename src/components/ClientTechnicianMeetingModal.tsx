import React, { useState } from 'react';
import { TechnicalPersonnel, MeetingSession } from '../types';
import { Calendar, Clock, Video, MapPin, ShieldCheck, Key, X, CheckCircle, ExternalLink, Share2, MessageCircle } from 'lucide-react';

interface ClientTechnicianMeetingModalProps {
  technician: TechnicalPersonnel | null;
  isOpen: boolean;
  onClose: () => void;
  onScheduleMeeting: (meeting: MeetingSession) => void;
}

export const ClientTechnicianMeetingModal: React.FC<ClientTechnicianMeetingModalProps> = ({
  technician,
  isOpen,
  onClose,
  onScheduleMeeting,
}) => {
  const [clientName, setClientName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [meetingType, setMeetingType] = useState<'video_consultation' | 'onsite_dispatch' | 'urgent_briefing'>(
    'video_consultation'
  );
  const [scheduledDate, setScheduledDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [scheduledTime, setScheduledTime] = useState('10:00');
  const [locationOrUrl, setLocationOrUrl] = useState('Technix Secure Room: https://meet.technix.org/room-');
  const [agenda, setAgenda] = useState(
    'Initial technical briefing on system architecture, tooling compatibility, and field scope requirements.'
  );
  const [confirmedMeeting, setConfirmedMeeting] = useState<MeetingSession | null>(null);

  if (!isOpen || !technician) return null;

  const generateAuthCode = () => {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    return `AUTH-${randomDigits}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName.trim() || !clientEmail.trim() || !clientPhone.trim()) {
      alert('Please fill in your name, company email, and contact phone number.');
      return;
    }

    const authCode = generateAuthCode();
    const meetingSession: MeetingSession = {
      id: `meet-${Date.now().toString().slice(-6)}`,
      technicianId: technician.id,
      technicianName: technician.fullName,
      technicianDiscipline: technician.discipline,
      clientName: clientName.trim(),
      companyName: companyName.trim() || 'Direct Client Requisition',
      clientEmail: clientEmail.trim(),
      clientPhone: clientPhone.trim(),
      meetingType,
      scheduledDate,
      scheduledTime,
      locationOrUrl:
        meetingType === 'video_consultation'
          ? `https://meet.technix.org/room-${authCode.toLowerCase()}`
          : locationOrUrl.trim() || technician.location,
      agenda: agenda.trim(),
      authorizationCode: authCode,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
    };

    onScheduleMeeting(meetingSession);
    setConfirmedMeeting(meetingSession);
  };

  const handleShareWhatsApp = () => {
    if (!confirmedMeeting) return;
    const msg = `*Technix Client-Technician Meeting Confirmed*\n\nTechnician: ${confirmedMeeting.technicianName} (${confirmedMeeting.technicianDiscipline})\nClient: ${confirmedMeeting.clientName} (${confirmedMeeting.companyName})\nDate: ${confirmedMeeting.scheduledDate} at ${confirmedMeeting.scheduledTime}\nMeeting Type: ${confirmedMeeting.meetingType.replace('_', ' ').toUpperCase()}\n*App Authorisation Code: ${confirmedMeeting.authorizationCode}*\nCustomer Service: 0748469925`;
    window.open(`https://wa.me/254748469925?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Meet Technician &amp; Schedule Technical Consultation
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Connect directly with verified technician {technician.fullName} with mutual App Authorisation verification.
            </p>
          </div>
          <button
            onClick={() => {
              setConfirmedMeeting(null);
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Technician Banner */}
        <div className="px-6 py-3.5 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            {technician.avatarUrl ? (
              <img
                src={technician.avatarUrl}
                alt={technician.fullName}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-lg object-cover border border-slate-200"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center font-bold text-slate-700">
                {technician.fullName.slice(0, 2)}
              </div>
            )}
            <div>
              <div className="font-bold text-slate-900">{technician.fullName}</div>
              <div className="text-slate-600 text-[11px]">{technician.title}</div>
            </div>
          </div>
          <div className="text-right font-mono text-[11px]">
            <span className="text-slate-500">Location: </span>
            <span className="font-semibold text-slate-800">{technician.location}</span>
          </div>
        </div>

        {!confirmedMeeting ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
            {/* Meeting Format Selector */}
            <div>
              <label className="block font-semibold text-slate-800 mb-2">
                Select Meeting / Consultation Format:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setMeetingType('video_consultation')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    meetingType === 'video_consultation'
                      ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Video className="w-4 h-4 text-slate-700 mb-1" />
                  <div className="font-bold text-slate-900">Virtual Consultation</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Secure video/audio review of schematics &amp; scope.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setMeetingType('onsite_dispatch')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    meetingType === 'onsite_dispatch'
                      ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-slate-700 mb-1" />
                  <div className="font-bold text-slate-900">On-Site Walkthrough</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Physical site inspection and physical equipment audit.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setMeetingType('urgent_briefing')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    meetingType === 'urgent_briefing'
                      ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-rose-600 mb-1" />
                  <div className="font-bold text-slate-900">Urgent Dispatch</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Emergency briefing for immediate machine outage.</p>
                </button>
              </div>
            </div>

            {/* Client Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Client / Representative Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arthur Kamau"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Company / Organization
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apex Industrial Works"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Client Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="arthur@client-corp.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Client Phone / WhatsApp Contact *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0748469925 or your phone"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                />
              </div>
            </div>

            {/* Schedule Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  required
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Preferred Time Slot *
                </label>
                <input
                  type="time"
                  required
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                />
              </div>
            </div>

            {/* Location or Address */}
            {meetingType !== 'video_consultation' && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Physical Site Meeting Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unit 4, Westlands Industrial Complex, Nairobi"
                  value={locationOrUrl}
                  onChange={(e) => setLocationOrUrl(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
            )}

            {/* Technical Agenda */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Technical Scope &amp; Meeting Agenda
              </label>
              <textarea
                rows={3}
                value={agenda}
                onChange={(e) => setAgenda(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            {/* Security Notice */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] flex items-start gap-2">
              <Key className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>App Authorisation Code Enforced:</strong> An official 6-digit cryptographic security code will be generated upon confirmation. The technician must present this code upon arrival to confirm identity and prevent theft or imposters.
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <span className="text-slate-500 font-mono text-[11px]">
                Support: 0748469925
              </span>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer shadow-xs whitespace-nowrap"
              >
                Confirm &amp; Generate Authorisation Code
              </button>
            </div>
          </form>
        ) : (
          /* Confirmation & Authorization Code Showcase */
          <div className="p-6 space-y-5 text-xs text-slate-800">
            <div className="text-center space-y-2 py-2">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Meeting &amp; Dispatch Scheduled Successfully
              </h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Both client and technician have been locked into the appointment registry.
              </p>
            </div>

            {/* App Authorisation Code Display */}
            <div className="p-5 bg-slate-900 text-white rounded-2xl text-center space-y-2 border border-slate-800 shadow-md">
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold flex items-center justify-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>Official App Authorisation Code</span>
              </div>
              <div className="text-3xl font-mono font-bold tracking-widest text-amber-400 py-1">
                {confirmedMeeting.authorizationCode}
              </div>
              <p className="text-[11px] text-slate-300 max-w-sm mx-auto leading-relaxed">
                Verify this code with the technician upon physical arrival or video start. If the technician cannot provide this code, do not permit site access and call Customer Service at 0748469925 immediately.
              </p>
            </div>

            {/* Summary Details */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Technician:</span>
                <strong className="text-slate-900">{confirmedMeeting.technicianName}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Client Contact:</span>
                <span className="font-semibold text-slate-900">{confirmedMeeting.clientName} ({confirmedMeeting.clientPhone})</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Scheduled Date &amp; Time:</span>
                <span className="font-mono tabular-nums text-slate-900 font-bold">{confirmedMeeting.scheduledDate} at {confirmedMeeting.scheduledTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Channel / Location:</span>
                <span className="text-slate-800 truncate max-w-xs">{confirmedMeeting.locationOrUrl}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Share via WhatsApp to Customer Service 0748469925</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setConfirmedMeeting(null);
                  onClose();
                }}
                className="py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-medium text-xs transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
