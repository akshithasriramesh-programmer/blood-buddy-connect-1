import React, { useState } from 'react';
import { BloodRequest, User, BloodGroup } from '../types';
import { POPULAR_CITIES, BLOOD_GROUPS } from '../data/mockData';
import { 
  AlertTriangle, 
  HeartHandshake, 
  Building2, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Plus, 
  User as UserIcon,
  Filter,
  Send,
  Heart
} from 'lucide-react';

interface EmergencyRequestsViewProps {
  requests: BloodRequest[];
  currentUser: User | null;
  onOpenPostRequest: () => void;
  onRespondToRequest: (requestId: string, message: string) => void;
  onUpdateRequestStatus: (requestId: string, status: 'OPEN' | 'IN_PROGRESS' | 'FULFILLED') => void;
}

export const EmergencyRequestsView: React.FC<EmergencyRequestsViewProps> = ({
  requests,
  currentUser,
  onOpenPostRequest,
  onRespondToRequest,
  onUpdateRequestStatus,
}) => {
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup | 'ALL'>('ALL');
  const [activeOnly, setActiveOnly] = useState<boolean>(true);
  
  // Volunteer response drawer/input
  const [respondingToId, setRespondingToId] = useState<string | null>(null);
  const [responseMsg, setResponseMsg] = useState('I am nearby and can donate blood for this emergency today.');
  const [responseSuccessId, setResponseSuccessId] = useState<string | null>(null);

  const filteredRequests = requests.filter(req => {
    if (activeOnly && req.status === 'FULFILLED') return false;
    if (selectedCity !== 'All Cities' && !req.city.toLowerCase().includes(selectedCity.toLowerCase())) return false;
    if (selectedGroup !== 'ALL' && req.bloodGroup !== selectedGroup) return false;
    return true;
  });

  const handleSendResponse = (requestId: string) => {
    onRespondToRequest(requestId, responseMsg);
    setResponseSuccessId(requestId);
    setRespondingToId(null);
    setTimeout(() => setResponseSuccessId(null), 4000);
  };

  const getUrgencyBadge = (urgency: BloodRequest['urgency']) => {
    switch (urgency) {
      case 'EMERGENCY':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-red-600 text-white shadow-xs animate-pulse">
            <span className="w-2 h-2 rounded-full bg-white" />
            CRITICAL (2 Hours)
          </span>
        );
      case 'URGENT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs">
            ⚠️ URGENT (24 Hours)
          </span>
        );
      case 'STANDARD':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
            🗓️ SCHEDULED SURGERY
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-red-700 via-rose-700 to-red-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold text-rose-100 mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
            <span>Emergency Hospital Requests</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Urgent Blood SOS Broadcasts
          </h1>
          <p className="text-xs sm:text-sm text-rose-100 mt-1 max-w-2xl leading-relaxed">
            Real-time emergency requests posted by patients, doctors, and family members needing immediate blood units for surgery and trauma care.
          </p>
        </div>

        <button
          onClick={onOpenPostRequest}
          className="self-start md:self-center py-3 px-5 rounded-2xl font-bold text-xs sm:text-sm bg-white text-red-700 hover:bg-rose-50 shadow-lg shadow-black/10 transition-all flex items-center gap-2 shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Post Emergency Request</span>
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              className="pl-3 pr-8 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
            >
              {POPULAR_CITIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <select
              value={selectedGroup}
              onChange={e => setSelectedGroup(e.target.value as BloodGroup | 'ALL')}
              className="pl-3 pr-8 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
            >
              <option value="ALL">All Blood Groups</option>
              {BLOOD_GROUPS.map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>
        </div>

        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={activeOnly}
            onChange={e => setActiveOnly(e.target.checked)}
            className="rounded border-slate-300 text-red-600 focus:ring-red-500"
          />
          <span>Active Requests Only</span>
        </label>
      </div>

      {responseSuccessId && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs sm:text-sm font-bold text-emerald-800 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Thank you! Your donation response has been registered and the contact person has been notified.</span>
        </div>
      )}

      {/* Requests Feed */}
      {filteredRequests.length === 0 ? (
        <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
          <Heart className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No SOS Requests Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            There are no active emergency requests matching this filter right now.
          </p>
          <button
            onClick={onOpenPostRequest}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700"
          >
            Post a Request
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map(req => {
            const cleanPhone = req.contactPhone.replace(/[^0-9+]/g, '');
            const isOwner = currentUser && (currentUser.id === req.createdByUserId || currentUser.name === req.createdByName);
            const isFulfilled = req.status === 'FULFILLED';

            return (
              <div
                key={req.id}
                className={`bg-white rounded-3xl border p-5 sm:p-6 transition-all shadow-xs ${
                  isFulfilled
                    ? 'border-slate-200 opacity-75'
                    : req.urgency === 'EMERGENCY'
                    ? 'border-red-300 ring-1 ring-red-500/10'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  
                  {/* Left: Blood badge & patient details */}
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-red-600 to-rose-600 text-white font-black text-2xl flex flex-col items-center justify-center shadow-md shadow-rose-500/20 shrink-0">
                      <span>{req.bloodGroup}</span>
                      <span className="text-[10px] font-bold tracking-tight text-rose-100">
                        {req.unitsNeeded} {req.unitsNeeded === 1 ? 'Unit' : 'Units'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-lg font-bold text-slate-900">{req.patientName}</h2>
                        {getUrgencyBadge(req.urgency)}
                        {isFulfilled && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                            ✓ Fulfilled
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 font-semibold flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-slate-500 shrink-0" />
                        <span>{req.hospitalName} — {req.city}</span>
                      </p>

                      <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{req.hospitalAddress}</span>
                      </p>

                      {req.additionalNotes && (
                        <div className="mt-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                          <span className="font-bold text-slate-900">Case Details: </span>
                          {req.additionalNotes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Contact & Action Buttons */}
                  <div className="flex flex-col sm:items-end gap-2.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-left sm:text-right text-xs">
                      <span className="text-slate-500 block">Contact Coordinator:</span>
                      <span className="font-bold text-slate-900">{req.contactPerson}</span>
                      <span className="font-semibold text-slate-700 block">{req.contactPhone}</span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <a
                        href={`tel:${cleanPhone}`}
                        className="py-2 px-3.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Emergency</span>
                      </a>

                      {!isFulfilled && (
                        <button
                          onClick={() => setRespondingToId(respondingToId === req.id ? null : req.id)}
                          className="py-2 px-4 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <HeartHandshake className="w-3.5 h-3.5" />
                          <span>I Can Donate</span>
                        </button>
                      )}

                      {isOwner && !isFulfilled && (
                        <button
                          onClick={() => onUpdateRequestStatus(req.id, 'FULFILLED')}
                          className="py-2 px-3 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300"
                        >
                          Mark Fulfilled
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Inline Response Form for Donors */}
                {respondingToId === req.id && (
                  <div className="mt-4 pt-4 border-t border-rose-100 space-y-2">
                    <label className="block text-xs font-bold text-slate-800">
                      Message to Patient Coordinator:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={responseMsg}
                        onChange={e => setResponseMsg(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500"
                      />
                      <button
                        onClick={() => handleSendResponse(req.id)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Response</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Responders List */}
                {req.responses && req.responses.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{req.responses.length} Volunteer Donor(s) Responded:</span>
                    </span>
                    <div className="mt-1.5 flex flex-wrap gap-2">
                      {req.responses.map((res, i) => (
                        <div
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-1.5"
                        >
                          <span className="font-bold">{res.donorName} ({res.donorBloodGroup})</span>
                          <span>• {res.donorPhone}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
