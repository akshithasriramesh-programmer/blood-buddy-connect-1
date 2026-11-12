import React, { useState } from 'react';
import { User, BloodGroup, BloodRequest, Donor } from '../types';
import { BLOOD_GROUPS, isCompatible, BLOOD_COMPATIBILITY } from '../data/mockData';
import { 
  Heart, 
  Calendar, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Award, 
  ShieldCheck, 
  Droplet, 
  ArrowRight,
  Flame,
  UserCheck,
  Send
} from 'lucide-react';

interface DonorDashboardProps {
  currentUser: User;
  onUpdateProfile: (updated: User) => void;
  requests: BloodRequest[];
  onRespondToRequest: (requestId: string, message: string) => void;
}

export const DonorDashboard: React.FC<DonorDashboardProps> = ({
  currentUser,
  onUpdateProfile,
  requests,
  onRespondToRequest,
}) => {
  // Form state
  const [name, setName] = useState(currentUser.name);
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(currentUser.bloodGroup || 'O+');
  const [city, setCity] = useState(currentUser.city || 'New York');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [isAvailable, setIsAvailable] = useState<boolean>(currentUser.isAvailable ?? true);
  const [lastDonationDate, setLastDonationDate] = useState<string>(currentUser.lastDonationDate || '2026-06-15');
  const [totalDonations, setTotalDonations] = useState<number>(currentUser.totalDonations ?? 4);

  // Status message
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [respondingToId, setRespondingToId] = useState<string | null>(null);
  const [responseMsg, setResponseMsg] = useState('I can donate and am available to visit the hospital today.');
  const [responseSentId, setResponseSentId] = useState<string | null>(null);

  // Calculate days since last donation & cooldown
  const calculateEligibility = () => {
    if (!lastDonationDate) return { isEligible: true, daysLeft: 0, daysSince: 999 };
    const lastDate = new Date(lastDonationDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastDate.getTime());
    const daysSince = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const cooldownDays = 90; // Standard 3-month whole blood interval
    const daysLeft = Math.max(0, cooldownDays - daysSince);
    return {
      isEligible: daysSince >= cooldownDays,
      daysLeft,
      daysSince,
      percentage: Math.min(100, Math.round((daysSince / cooldownDays) * 100)),
    };
  };

  const eligibility = calculateEligibility();

  const handleToggleAvailability = (newStatus: boolean) => {
    setIsAvailable(newStatus);
    const updated: User = {
      ...currentUser,
      isAvailable: newStatus,
    };
    onUpdateProfile(updated);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: User = {
      ...currentUser,
      name: name.trim(),
      bloodGroup,
      city: city.trim(),
      phone: phone.trim(),
      bio: bio.trim(),
      isAvailable,
      lastDonationDate,
      totalDonations,
    };
    onUpdateProfile(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSendResponse = (requestId: string) => {
    onRespondToRequest(requestId, responseMsg);
    setResponseSentId(requestId);
    setRespondingToId(null);
    setTimeout(() => setResponseSentId(null), 4000);
  };

  // Find matching urgent requests in city or compatible
  const matchingRequests = requests.filter(req => {
    if (req.status === 'FULFILLED') return false;
    return isCompatible(bloodGroup, req.bloodGroup);
  });

  const compatibilityDetails = BLOOD_COMPATIBILITY[bloodGroup];

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Hero Profile Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-rose-950 rounded-3xl text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-lg shadow-rose-600/30 border-2 border-white/20">
              {bloodGroup}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {currentUser.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/10 text-rose-200 border border-white/20">
                  Donor Profile
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  {city}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  {phone}
                </span>
              </p>
            </div>
          </div>

          {/* Big Tactile Availability Toggle */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
                Live Donor Availability
              </span>
              <p className="text-sm font-bold mt-0.5 flex items-center gap-2">
                {isAvailable ? (
                  <>
                    <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
                    <span className="text-emerald-300">Available to Donate Now</span>
                  </>
                ) : (
                  <>
                    <span className="w-3 h-3 rounded-full bg-slate-400" />
                    <span className="text-slate-300">Temporarily Resting</span>
                  </>
                )}
              </p>
            </div>

            <div className="flex items-center bg-black/30 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => handleToggleAvailability(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isAvailable
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Available
              </button>
              <button
                type="button"
                onClick={() => handleToggleAvailability(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  !isAvailable
                    ? 'bg-slate-700 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Paused
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <span className="text-[11px] text-slate-400 block font-medium">Donations</span>
            <p className="text-xl sm:text-2xl font-black text-white mt-0.5 flex items-center gap-1.5">
              <Droplet className="w-5 h-5 text-red-500 fill-red-500" />
              {totalDonations}
            </p>
          </div>

          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <span className="text-[11px] text-slate-400 block font-medium">Potential Lives Saved</span>
            <p className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5 flex items-center gap-1.5">
              <Heart className="w-5 h-5 text-emerald-400 fill-emerald-400" />
              {totalDonations * 3}
            </p>
          </div>

          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <span className="text-[11px] text-slate-400 block font-medium">Next Eligibility</span>
            <p className="text-sm sm:text-base font-bold text-white mt-1">
              {eligibility.isEligible ? (
                <span className="text-emerald-400 font-black">Eligible Today!</span>
              ) : (
                <span className="text-amber-300 font-bold">{eligibility.daysLeft} days remaining</span>
              )}
            </p>
          </div>

          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <span className="text-[11px] text-slate-400 block font-medium">Urgent Matches</span>
            <p className="text-xl sm:text-2xl font-black text-rose-400 mt-0.5 flex items-center gap-1.5">
              <Flame className="w-5 h-5 text-rose-400" />
              {matchingRequests.length}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Editable Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-red-600" />
                  Edit Donor Profile & Availability
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Keep your phone and blood group updated so patients can contact you immediately
                </p>
              </div>

              {saveSuccess && (
                <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-1.5 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Profile Saved!</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Phone Number (Public to Patients)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Blood Group Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Your Blood Group
                  </label>
                  <span className="text-[11px] text-red-600 font-semibold">
                    {compatibilityDetails.description}
                  </span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {BLOOD_GROUPS.map(bg => (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => setBloodGroup(bg)}
                      className={`py-2.5 text-sm font-black rounded-xl border transition-all ${
                        bloodGroup === bg
                          ? 'bg-red-600 text-white border-red-600 shadow-md scale-102'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    City / Neighborhood
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="e.g. New York, Brooklyn"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Last Donation Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      value={lastDonationDate}
                      onChange={e => setLastDonationDate(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Total Donations Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={totalDonations}
                    onChange={e => setTotalDonations(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Availability Status
                  </label>
                  <select
                    value={isAvailable ? 'available' : 'unavailable'}
                    onChange={e => setIsAvailable(e.target.value === 'available')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  >
                    <option value="available">🟢 Available to Donate</option>
                    <option value="unavailable">⚪ Not Available (Resting)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  About You / Preferred Hospitals
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="e.g. Can visit Mount Sinai or NYU Langone on short notice. Available evening hours."
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-sm bg-red-600 hover:bg-red-700 text-white shadow-md shadow-rose-600/25 transition-all flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Save Profile & Status</span>
                </button>
              </div>
            </form>
          </div>

          {/* Compatible Urgent Requests feed */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-red-600" />
                  Urgent Requests Compatible With Your Blood Group ({bloodGroup})
                </h3>
                <p className="text-xs text-slate-500">
                  Patients currently waiting for {bloodGroup} or compatible blood
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-black bg-rose-50 text-red-700 border border-rose-200">
                {matchingRequests.length} Active
              </span>
            </div>

            {responseSentId && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Your donation offer has been sent to the hospital and patient coordinator!</span>
              </div>
            )}

            {matchingRequests.length === 0 ? (
              <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Heart className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">No active emergency requests for {bloodGroup} right now.</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Thank you for standing by to save lives!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {matchingRequests.map(req => (
                  <div
                    key={req.id}
                    className="p-4 rounded-2xl border border-rose-100 bg-rose-50/30 hover:bg-rose-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-red-600 text-white">
                          Needs {req.bloodGroup}
                        </span>
                        <span className="font-bold text-sm text-slate-900">{req.patientName}</span>
                        <span className="text-xs text-slate-500">• {req.unitsNeeded} Units</span>
                      </div>
                      <p className="text-xs text-slate-600 flex items-center gap-1.5">
                        <Building2Icon className="w-3.5 h-3.5 text-slate-400" />
                        <span>{req.hospitalName}, {req.city}</span>
                      </p>
                      {req.additionalNotes && (
                        <p className="text-[11px] text-slate-500 italic line-clamp-1">
                          "{req.additionalNotes}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <a
                        href={`tel:${req.contactPhone}`}
                        className="py-1.5 px-3 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Call</span>
                      </a>

                      <button
                        onClick={() => setRespondingToId(respondingToId === req.id ? null : req.id)}
                        className="py-1.5 px-3.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs flex items-center gap-1.5"
                      >
                        <Heart className="w-3.5 h-3.5 fill-white" />
                        <span>I Can Donate</span>
                      </button>
                    </div>

                    {respondingToId === req.id && (
                      <div className="w-full mt-3 pt-3 border-t border-rose-200 sm:col-span-2 space-y-2">
                        <label className="block text-[11px] font-bold text-slate-700">
                          Confirm Message to Patient Coordinator:
                        </label>
                        <input
                          type="text"
                          value={responseMsg}
                          onChange={e => setResponseMsg(e.target.value)}
                          className="w-full p-2 text-xs rounded-lg border border-slate-300"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setRespondingToId(null)}
                            className="px-2.5 py-1 text-xs text-slate-600"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSendResponse(req.id)}
                            className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-lg flex items-center gap-1"
                          >
                            <Send className="w-3 h-3" />
                            <span>Confirm & Send Contact</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Cooldown calculator & Guide */}
        <div className="space-y-6">
          
          {/* Eligibility Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-red-600" />
              Donation Cooldown Status
            </h3>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <div className="relative inline-flex items-center justify-center mb-3">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center font-black text-xl border-4 ${
                  eligibility.isEligible
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-amber-400 bg-amber-50 text-amber-800'
                }`}>
                  {eligibility.isEligible ? '100%' : `${eligibility.percentage}%`}
                </div>
              </div>

              <h4 className="font-bold text-sm text-slate-800">
                {eligibility.isEligible ? 'Fully Eligible to Donate!' : 'Recovery Period Active'}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                {eligibility.isEligible
                  ? `It has been ${eligibility.daysSince} days since your last whole blood donation. You are in peak condition to give.`
                  : `${eligibility.daysLeft} days until your next safe whole blood donation. Your body is replenishing red cells.`}
              </p>

              <div className="w-full bg-slate-200 h-2 rounded-full mt-4 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    eligibility.isEligible ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${eligibility.percentage}%` }}
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-2">
              <div className="flex items-center justify-between">
                <span>Last Donation:</span>
                <span className="font-semibold text-slate-700">{lastDonationDate || 'None recorded'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Safe Gap (Whole Blood):</span>
                <span className="font-semibold text-slate-700">90 Days (3 Months)</span>
              </div>
            </div>
          </div>

          {/* Compatibility Summary Card */}
          <div className="bg-gradient-to-br from-rose-50 to-red-50 p-6 rounded-3xl border border-rose-200/70 shadow-xs">
            <h3 className="text-sm font-bold text-red-950 flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-red-600" />
              Your Blood Can Save:
            </h3>

            <p className="text-xs text-red-900 leading-relaxed mb-4">
              As an <strong>{bloodGroup}</strong> donor, you can safely donate red blood cells to patients with:
            </p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {compatibilityDetails.canDonateTo.map(bg => (
                <span
                  key={bg}
                  className="px-2.5 py-1 rounded-lg text-xs font-black bg-white text-red-700 border border-rose-200 shadow-xs"
                >
                  {bg}
                </span>
              ))}
            </div>

            <p className="text-xs text-red-900 leading-relaxed">
              In an emergency where you need blood, you can receive from:
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {compatibilityDetails.canReceiveFrom.map(bg => (
                <span
                  key={bg}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/70 text-slate-800 border border-slate-200"
                >
                  {bg}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function Building2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  );
}
