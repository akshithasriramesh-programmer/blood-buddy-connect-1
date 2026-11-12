import React, { useState, useMemo } from 'react';
import { Donor, BloodGroup, User } from '../types';
import { BLOOD_GROUPS, POPULAR_CITIES, isCompatible, getCompatibleDonorsFor } from '../data/mockData';
import { 
  Search, 
  MapPin, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Filter, 
  HeartHandshake, 
  Sparkles, 
  CheckCircle2, 
  Info,
  Clock,
  ArrowUpDown,
  AlertCircle
} from 'lucide-react';

interface ReceiverDashboardProps {
  donors: Donor[];
  currentUser: User | null;
  onOpenMessageModal: (donor: Donor) => void;
  onOpenPostRequest: () => void;
  onOpenAuth: () => void;
}

export const ReceiverDashboard: React.FC<ReceiverDashboardProps> = ({
  donors,
  currentUser,
  onOpenMessageModal,
  onOpenPostRequest,
  onOpenAuth,
}) => {
  // Filters
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup | 'ALL'>('ALL');
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [availableOnly, setAvailableOnly] = useState<boolean>(true);
  const [includeCompatible, setIncludeCompatible] = useState<boolean>(true);

  // Filtered donors calculation
  const filteredDonors = useMemo(() => {
    return donors.filter(donor => {
      // 1. Availability filter
      if (availableOnly && !donor.isAvailable) {
        return false;
      }

      // 2. City filter
      if (selectedCity !== 'All Cities') {
        const donorCityLower = donor.city.toLowerCase();
        const filterCityLower = selectedCity.toLowerCase();
        if (!donorCityLower.includes(filterCityLower)) {
          return false;
        }
      }

      // 3. Keyword search (name or city)
      if (searchKeyword.trim()) {
        const kw = searchKeyword.toLowerCase();
        const matchesName = donor.name.toLowerCase().includes(kw);
        const matchesCity = donor.city.toLowerCase().includes(kw);
        const matchesBlood = donor.bloodGroup.toLowerCase().includes(kw);
        if (!matchesName && !matchesCity && !matchesBlood) {
          return false;
        }
      }

      // 4. Blood group matching
      if (selectedGroup !== 'ALL') {
        if (includeCompatible) {
          // Check if this donor can donate to the requested patient group
          const compatible = isCompatible(donor.bloodGroup, selectedGroup);
          if (!compatible) return false;
        } else {
          // Exact match only
          if (donor.bloodGroup !== selectedGroup) return false;
        }
      }

      return true;
    });
  }, [donors, selectedGroup, selectedCity, searchKeyword, availableOnly, includeCompatible]);

  // If a blood group is selected, calculate which groups can donate
  const compatibleTypes = useMemo(() => {
    if (selectedGroup === 'ALL') return [];
    return getCompatibleDonorsFor(selectedGroup);
  }, [selectedGroup]);

  return (
    <div className="space-y-6">
      
      {/* Search & Hero Card */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold text-rose-100 backdrop-blur mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Real-Time Blood Donor Network</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Find Blood Donors Instantly
          </h1>
          <p className="text-sm sm:text-base text-rose-100 mt-2 leading-relaxed">
            Search verified, voluntary donors ready to help patients in emergency rooms and hospitals. Filter by required blood type and city.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={onOpenPostRequest}
              className="py-2.5 px-5 rounded-xl font-bold text-xs sm:text-sm bg-white text-red-600 hover:bg-rose-50 shadow-lg shadow-black/10 transition-all flex items-center gap-2"
            >
              <HeartHandshake className="w-4 h-4 text-red-600" />
              <span>Broadcast Emergency SOS Request</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Control Box */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
        
        {/* Blood Group Pills */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span>Select Required Blood Group</span>
              {selectedGroup !== 'ALL' && (
                <span className="text-[11px] font-normal text-slate-500 lowercase">
                  (for patient needing {selectedGroup})
                </span>
              )}
            </label>

            {selectedGroup !== 'ALL' && (
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeCompatible}
                  onChange={e => setIncludeCompatible(e.target.checked)}
                  className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                />
                <span>Include all compatible donor types</span>
              </label>
            )}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
            <button
              type="button"
              onClick={() => setSelectedGroup('ALL')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                selectedGroup === 'ALL'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              All Types
            </button>
            {BLOOD_GROUPS.map(bg => (
              <button
                key={bg}
                type="button"
                onClick={() => setSelectedGroup(bg)}
                className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-black border transition-all ${
                  selectedGroup === bg
                    ? 'bg-red-600 text-white border-red-600 shadow-md scale-102'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {bg}
              </button>
            ))}
          </div>

          {/* Compatibility hint for chosen blood group */}
          {selectedGroup !== 'ALL' && includeCompatible && (
            <div className="mt-2.5 p-2.5 bg-rose-50/70 border border-rose-200/60 rounded-xl flex items-center gap-2 text-xs text-red-900">
              <Info className="w-4 h-4 text-red-600 shrink-0" />
              <span>
                A patient needing <strong>{selectedGroup}</strong> can safely receive blood from donors with:{' '}
                <strong>{compatibleTypes.join(', ')}</strong>.
              </span>
            </div>
          )}
        </div>

        {/* City and Search Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t border-slate-100">
          
          {/* City Selector */}
          <div className="sm:col-span-5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              City / Region
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={selectedCity}
                onChange={e => setSelectedCity(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-500 bg-white"
              >
                {POPULAR_CITIES.map(city => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Keyword */}
          <div className="sm:col-span-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Search by Name / Hospital
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
                placeholder="Type donor name or keyword..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Availability Switch */}
          <div className="sm:col-span-3 flex items-end">
            <label className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100/70 transition-colors">
              <span className="text-xs font-bold text-slate-800">
                🟢 Available Only
              </span>
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={e => setAvailableOnly(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
              />
            </label>
          </div>
        </div>

        {/* Quick popular city shortcuts */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-semibold text-slate-600 whitespace-nowrap">
            Popular:
          </span>
          {['New York', 'Chicago', 'Houston', 'Los Angeles', 'Seattle', 'Boston', 'Miami'].map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedCity(c)}
              className={`px-2.5 py-1 rounded-lg text-xs whitespace-nowrap transition-colors ${
                selectedCity === c
                  ? 'bg-red-100 text-red-700 font-bold border border-red-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
          {selectedCity !== 'All Cities' && (
            <button
              type="button"
              onClick={() => setSelectedCity('All Cities')}
              className="text-[11px] text-red-600 font-bold hover:underline ml-1"
            >
              Reset City
            </button>
          )}
        </div>
      </div>

      {/* Results Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Donor Results</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-slate-200 text-slate-800">
              {filteredDonors.length} {filteredDonors.length === 1 ? 'Donor' : 'Donors'}
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            {selectedGroup === 'ALL'
              ? 'Showing all registered voluntary donors'
              : `Matching donors for ${selectedGroup} in ${selectedCity}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPostRequest}
            className="text-xs font-bold text-red-600 hover:text-red-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
            <span>Need Urgent Blood? Post SOS</span>
          </button>
        </div>
      </div>

      {/* Donors Grid */}
      {filteredDonors.length === 0 ? (
        <div className="p-10 rounded-3xl bg-white border border-slate-200 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-red-600 flex items-center justify-center mx-auto shadow-inner">
            <HeartHandshake className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">No Donors Match Your Current Filter</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
              We couldn't find available donors with this exact blood group and city combination. Try selecting "All Cities" or posting an emergency broadcast request so local donors are notified.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setSelectedGroup('ALL');
                setSelectedCity('All Cities');
                setSearchKeyword('');
                setAvailableOnly(false);
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              Clear All Filters
            </button>
            <button
              onClick={onOpenPostRequest}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700 shadow-md shadow-rose-600/20 transition-all flex items-center gap-1.5"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Broadcast Emergency SOS Request</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDonors.map(donor => {
            const cleanPhone = donor.phone.replace(/[^0-9+]/g, '');
            const isTargetMatch = selectedGroup !== 'ALL' && donor.bloodGroup === selectedGroup;
            const isUniversal = donor.bloodGroup === 'O-';

            return (
              <div
                key={donor.id}
                className="bg-white rounded-3xl border border-slate-200/90 hover:border-rose-300 hover:shadow-lg hover:shadow-rose-500/5 transition-all p-5 flex flex-col justify-between group"
              >
                <div>
                  {/* Card Top: Blood Type Badge & Status */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-red-600 to-rose-600 text-white font-black text-xl flex items-center justify-center shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
                        {donor.bloodGroup}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                            {donor.name}
                          </h3>
                          {donor.verified && (
                            <span title="Verified Donor">
                              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{donor.city}</span>
                          {donor.distance && (
                            <span className="text-[11px] text-slate-400 font-medium">({donor.distance})</span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <div>
                      {donor.isAvailable ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
                          Resting
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Badges / Compatibility info */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {isUniversal && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        ⭐ Universal Donor (O-)
                      </span>
                    )}
                    {isTargetMatch && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-red-700 border border-rose-200">
                        🎯 Exact Blood Match
                      </span>
                    )}
                    {donor.totalDonations > 0 && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700">
                        🩸 {donor.totalDonations} Donations
                      </span>
                    )}
                  </div>

                  {/* Bio / Info */}
                  {donor.bio && (
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                      {donor.bio}
                    </p>
                  )}
                </div>

                {/* Bottom Actions: Call & Message */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                    <span className="text-[11px] font-semibold text-slate-500">Phone:</span>
                    <span className="font-bold text-slate-800">{donor.phone}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Direct Call Button */}
                    <a
                      href={`tel:${cleanPhone}`}
                      className="py-2.5 px-3 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-98"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Now</span>
                    </a>

                    {/* Direct Message Button */}
                    <button
                      type="button"
                      onClick={() => onOpenMessageModal(donor)}
                      className="py-2.5 px-3 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-98"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-rose-300" />
                      <span>Message</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
