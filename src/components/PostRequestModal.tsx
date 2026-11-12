import React, { useState } from 'react';
import { BloodGroup, UrgencyLevel, BloodRequest, User } from '../types';
import { BLOOD_GROUPS, POPULAR_CITIES } from '../data/mockData';
import { 
  X, 
  AlertCircle, 
  HeartHandshake, 
  MapPin, 
  Building2, 
  User as UserIcon, 
  Phone, 
  FileText,
  Clock
} from 'lucide-react';

interface PostRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onSubmitRequest: (req: Omit<BloodRequest, 'id' | 'createdAt' | 'status' | 'responses'>) => void;
}

export const PostRequestModal: React.FC<PostRequestModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSubmitRequest,
}) => {
  const [patientName, setPatientName] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [unitsNeeded, setUnitsNeeded] = useState<number>(2);
  const [hospitalName, setHospitalName] = useState('');
  const [hospitalAddress, setHospitalAddress] = useState('');
  const [city, setCity] = useState(currentUser?.city || 'New York');
  const [contactPerson, setContactPerson] = useState(currentUser?.name || '');
  const [contactPhone, setContactPhone] = useState(currentUser?.phone || '');
  const [urgency, setUrgency] = useState<UrgencyLevel>('EMERGENCY');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!patientName.trim()) {
      setError('Please provide the patient name or case description.');
      return;
    }
    if (!hospitalName.trim()) {
      setError('Please provide the hospital or medical center name.');
      return;
    }
    if (!city.trim() || city === 'All Cities') {
      setError('Please select or specify the city/region.');
      return;
    }
    if (!contactPerson.trim()) {
      setError('Please provide a contact person name.');
      return;
    }
    if (!contactPhone.trim()) {
      setError('Please provide a working phone number.');
      return;
    }

    onSubmitRequest({
      patientName: patientName.trim(),
      bloodGroup,
      unitsNeeded,
      hospitalName: hospitalName.trim(),
      hospitalAddress: hospitalAddress.trim() || `${hospitalName.trim()}, ${city.trim()}`,
      city: city.trim(),
      contactPerson: contactPerson.trim(),
      contactPhone: contactPhone.trim(),
      urgency,
      createdByUserId: currentUser?.id || `anon-${Date.now()}`,
      createdByName: currentUser?.name || contactPerson.trim(),
      additionalNotes: additionalNotes.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-6 py-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shadow-inner">
              <HeartHandshake className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Broadcast Urgent Blood Request</h2>
              <p className="text-xs text-rose-100 mt-0.5">
                Notify compatible donors nearby for emergency assistance
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs font-semibold text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Urgency Level Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Urgency Level
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setUrgency('EMERGENCY')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  urgency === 'EMERGENCY'
                    ? 'border-red-600 bg-red-50 ring-2 ring-red-500/20 text-red-700 font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 text-xs font-black">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                  <span>EMERGENCY</span>
                </div>
                <p className="text-[10px] text-slate-600 mt-0.5">Within 2 hours</p>
              </button>

              <button
                type="button"
                onClick={() => setUrgency('URGENT')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  urgency === 'URGENT'
                    ? 'border-amber-600 bg-amber-50 ring-2 ring-amber-500/20 text-amber-800 font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-black text-amber-700">⚠️ URGENT</div>
                <p className="text-[10px] text-slate-600 mt-0.5">Within 24 hours</p>
              </button>

              <button
                type="button"
                onClick={() => setUrgency('STANDARD')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  urgency === 'STANDARD'
                    ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500/20 text-blue-800 font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-black text-blue-700">🗓️ SCHEDULED</div>
                <p className="text-[10px] text-slate-600 mt-0.5">Planned surgery</p>
              </button>
            </div>
          </div>

          {/* Blood group & Units */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Blood Group Needed *
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {BLOOD_GROUPS.map(bg => (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => setBloodGroup(bg)}
                    className={`py-2 text-xs font-black rounded-lg border transition-all ${
                      bloodGroup === bg
                        ? 'bg-red-600 text-white border-red-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Units Needed *
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(u => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUnitsNeeded(u)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                      unitsNeeded === u
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {u} {u === 1 ? 'Unit' : 'Units'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Patient Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Patient Name / Identification *
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={patientName}
                onChange={e => setPatientName(e.target.value)}
                placeholder="e.g. John Miller (ICU Ward 3B)"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Hospital & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hospital / Medical Center *
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={hospitalName}
                  onChange={e => setHospitalName(e.target.value)}
                  placeholder="e.g. St. Jude Hospital"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                City / Region *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="e.g. New York, NY"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>

          {/* Hospital Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Hospital Address / Blood Bank Ward
            </label>
            <input
              type="text"
              value={hospitalAddress}
              onChange={e => setHospitalAddress(e.target.value)}
              placeholder="e.g. 1200 Medical Way, Blood Bank 2nd Floor"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Contact Person & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Person Name *
              </label>
              <input
                type="text"
                required
                value={contactPerson}
                onChange={e => setContactPerson(e.target.value)}
                placeholder="e.g. Dr. Roberts / Family Member"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Direct Contact Phone *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={e => setContactPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Clinical / Emergency Details
            </label>
            <textarea
              rows={2}
              value={additionalNotes}
              onChange={e => setAdditionalNotes(e.target.value)}
              placeholder="e.g. Trauma case, patient undergoing urgent vascular procedure. Compatible with A+ or O+."
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-lg shadow-rose-600/25 transition-all flex items-center justify-center gap-2"
            >
              <HeartHandshake className="w-5 h-5" />
              <span>Broadcast Emergency Request Now</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
