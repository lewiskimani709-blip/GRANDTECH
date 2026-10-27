import React from 'react';
import { MeetingSession } from '../types';
import { Calendar, Clock, Video, MapPin, Key, MessageCircle, CheckCircle2, ShieldCheck, UserCheck, Plus } from 'lucide-react';

interface MeetingsTrackerViewProps {
  meetings: MeetingSession[];
  onNewMeeting: () => void;
  onUpdateStatus: (id: string, status: MeetingSession['status']) => void;
  onOpenSecurityModal: () => void;
}

export const MeetingsTrackerView: React.FC<MeetingsTrackerViewProps> = ({
  meetings,
  onNewMeeting,
  onUpdateStatus,
  onOpenSecurityModal,
}) => {
  const customerServicePhone = '0748469925';

  const handleShareMeetingWhatsApp = (m: MeetingSession) => {
    const text = `*Technix Meeting & Authorisation Pass*\n\nMeeting ID: ${m.id}\nTechnician: ${m.technicianName} (${m.technicianDiscipline})\nClient: ${m.clientName} (${m.companyName})\nDate: ${m.scheduledDate} at ${m.scheduledTime}\nType: ${m.meetingType.replace('_', ' ').toUpperCase()}\n*Authorisation Code: ${m.authorizationCode}*\nLocation: ${m.locationOrUrl}\n\nCustomer Support: ${customerServicePhone}`;
    window.open(`https://wa.me/254748469925?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-slate-700" />
            <span>Meet Respective Technicians &amp; Dispatch Appointments</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Direct client-to-technician video consultations and on-site walkthroughs. Every session is protected by a unique 6-digit <strong>App Authorisation Code</strong> to prevent imposters and tool theft.
          </p>
        </div>

        <button
          onClick={onNewMeeting}
          className="px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer whitespace-nowrap shadow-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Client-Technician Meeting</span>
        </button>
      </div>

      {meetings.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-800">
            No scheduled technician meetings yet
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Clients can schedule a 1-on-1 virtual consultation or on-site walkthrough directly from any technician&apos;s profile card.
          </p>
          <button
            onClick={onNewMeeting}
            className="px-4 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Meet a Technician
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Meeting Header */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="text-[11px] font-mono uppercase text-slate-400 font-semibold tracking-wider">
                      {meeting.id} · {meeting.meetingType.replace('_', ' ').toUpperCase()}
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mt-0.5">
                      {meeting.technicianName}
                    </h3>
                    <p className="text-xs text-slate-500">{meeting.technicianDiscipline}</p>
                  </div>

                  {/* App Authorisation Code Capsule */}
                  <div className="bg-slate-900 text-amber-400 px-3 py-1.5 rounded-lg text-right border border-slate-800 shrink-0">
                    <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold flex items-center justify-end gap-1">
                      <Key className="w-3 h-3 text-amber-400" />
                      <span>App Auth Code</span>
                    </div>
                    <div className="font-mono font-bold text-xs tracking-wider">
                      {meeting.authorizationCode}
                    </div>
                  </div>
                </div>

                {/* Details list */}
                <div className="space-y-2 py-3 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-mono tabular-nums font-medium text-slate-900">
                      {meeting.scheduledDate} at {meeting.scheduledTime}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {meeting.meetingType === 'video_consultation' ? (
                      <Video className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span className="truncate text-slate-600">{meeting.locationOrUrl}</span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 leading-relaxed mt-2">
                    <strong className="text-slate-800">Client / Organization: </strong>
                    {meeting.clientName} ({meeting.companyName}) · Phone: {meeting.clientPhone}
                    <div className="mt-1 text-slate-500">
                      <strong>Agenda: </strong>{meeting.agenda}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 text-[11px]">Status:</span>
                  <select
                    value={meeting.status}
                    onChange={(e) =>
                      onUpdateStatus(meeting.id, e.target.value as MeetingSession['status'])
                    }
                    className="p-1 bg-slate-50 border border-slate-200 rounded text-xs font-medium text-slate-800 cursor-pointer"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="authorized">Code Verified / Authorized</option>
                    <option value="in_progress">In Session</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShareMeetingWhatsApp(meeting)}
                    className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg font-medium text-xs transition-colors flex items-center gap-1 cursor-pointer"
                    title="Send Details to WhatsApp 0748469925"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </button>

                  {meeting.meetingType === 'video_consultation' ? (
                    <a
                      href={meeting.locationOrUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Enter Room
                    </a>
                  ) : (
                    <button
                      onClick={onOpenSecurityModal}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium cursor-pointer"
                    >
                      Anti-Theft Check
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
