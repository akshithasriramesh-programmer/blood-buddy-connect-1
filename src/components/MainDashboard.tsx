import React, { useState } from 'react';
import { User, Donor, BloodRequest, BloodGroup } from '../types';
import { BLOOD_GROUPS, isCompatible } from '../data/mockData';
import { 
  Heart, 
  Droplet, 
  AlertTriangle, 
  Users, 
  Clock, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  MessageSquare, 
  ArrowRight, 
  Activity, 
  Plus, 
  CheckCircle2, 
  Flame, 
  Sparkles,
  Building2,
  TrendingUp,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Sliders,
  Layers,
  Sparkle,
  Check,
  Send,
  Zap,
  Info
} from 'lucide-react';

interface MainDashboardProps {
  currentUser: User | null;
  donors: Donor[];
  requests: BloodRequest[];
  onNavigateTab: (tab: 'dashboard' | 'search' | 'requests' | 'donor-profile' | 'compatibility') => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onOpenPostRequest: () => void;
  onOpenMessageModal: (donor: Donor) => void;
  onQuickToggleAvailability?: (isAvailable: boolean) => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({
  currentUser,
  donors,
  requests,
  onNavigateTab,
  onOpenAuth,
  onOpenPostRequest,
  onOpenMessageModal,
  onQuickToggleAvailability,
}) => {
  // Aggregate stats
  const totalDonors = donors.length;
  const availableDonors = donors.filter(d => d.isAvailable).length;
  const openRequests = requests.filter(r => r.status === 'OPEN');
  const emergencyRequests = openRequests.filter(r => r.urgency === 'EMERGENCY');
  const totalDonationCount = donors.reduce((acc, d) => acc + (d.totalDonations || 0), 0);
  const estimatedLivesSaved = totalDonationCount * 3;

  // Active feature filter and expanded feature state
  const [activeFeatureFilter, setActiveFeatureFilter] = useState<'all' | 'patient' | 'donor' | 'emergency'>('all');
  const [expandedFeatureId, setExpandedFeatureId] = useState<string | null>('search-donors');

  const toggleFeature = (id: string) => {
    setExpandedFeatureId(prev => (prev === id ? null : id));
  };

  // Blood group breakdown of available donors
  const bloodInventory = BLOOD_GROUPS.map(bg => {
    const donorsWithGroup = donors.filter(d => d.bloodGroup === bg && d.isAvailable).length;
    const pendingUnits = requests
      .filter(r => r.status === 'OPEN' && r.bloodGroup === bg)
      .reduce((acc, r) => acc + r.unitsNeeded, 0);

    let status: 'CRITICAL' | 'MODERATE' | 'STABLE' = 'STABLE';
    if (donorsWithGroup === 0 || pendingUnits > donorsWithGroup) {
      status = 'CRITICAL';
    } else if (donorsWithGroup <= 1 || bg === 'O-' || bg === 'B-') {
      status = 'MODERATE';
    }

    return {
      group: bg,
      availableCount: donorsWithGroup,
      pendingUnits,
      status,
    };
  });

  // Recent 3 critical requests
  const priorityRequests = [...openRequests]
    .sort((a, b) => (a.urgency === 'EMERGENCY' ? -1 : 1))
    .slice(0, 3);

  // Available donors showcase (top 4)
  const availableDonorsShowcase = donors.filter(d => d.isAvailable).slice(0, 4);

  // Current donor matching requests
  const donorMatchingRequests = currentUser?.role === 'donor' && currentUser.bloodGroup
    ? openRequests.filter(r => isCompatible(currentUser.bloodGroup!, r.bloodGroup))
    : [];

  // Platform features specification with interactive tap-to-expand details
  const platformFeatures = [
    {
      id: 'search-donors',
      title: 'Verified Donor Search & Smart Matching',
      tagline: 'Locate ready-to-donate voluntary donors in your city',
      category: 'patient',
      badge: 'Patient Tool',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: Users,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
      summary: 'Comprehensive search engine filtering across all 8 blood types, cities, and live availability status.',
      capabilities: [
        '8 Blood Types Support: Instant filtering for A+, A-, B+, B-, AB+, AB-, O+, and O-.',
        'Smart Compatibility Mode: Automatically reveals compatible alternative donors (e.g., O- universal donors for any patient).',
        'Multi-City Geolocation: Search across 16+ metropolitan centers or custom areas.',
        'Live Availability Filter: Exclude resting or unavailable donors with a single tap.'
      ],
      steps: [
        'Select the patient’s required blood type and target city.',
        'Toggle "Include compatible donor types" if exact matches are scarce.',
        'Tap Call or Message to connect directly with the donor.'
      ],
      actionLabel: 'Launch Donor Search',
      onAction: () => onNavigateTab('search'),
    },
    {
      id: 'emergency-sos',
      title: 'Urgent Hospital SOS Broadcasts',
      tagline: 'Alert local compatible donors to emergency hospital cases',
      category: 'emergency',
      badge: 'Emergency Response',
      badgeClass: 'bg-red-100 text-red-800 border-red-200',
      icon: AlertTriangle,
      iconColor: 'text-red-600',
      iconBg: 'bg-red-50',
      summary: 'Broadcast emergency blood requirements directly to registered donors with hospital room info and direct doctor phone.',
      capabilities: [
        '3 Urgency Tiers: Critical (within 2 hours), Urgent (within 24 hours), or Scheduled Surgery.',
        'Direct Hospital Ward Details: Includes room, ward, and contact person credentials.',
        'Real-time Responder Tracking: See how many volunteer donors have committed to visit the hospital.',
        'Status Management: Patient coordinators can mark cases as In Progress or Fulfilled.'
      ],
      steps: [
        'Click "Request Blood (SOS)" from the navigation bar or dashboard.',
        'Input patient name, units needed, hospital name, and coordinator phone.',
        'Broadcast is live immediately; donors can tap "I Can Donate" to respond.'
      ],
      actionLabel: 'Broadcast Urgent Request',
      onAction: onOpenPostRequest,
    },
    {
      id: 'donor-dashboard',
      title: 'Donor Center & 90-Day Cooldown Tracker',
      tagline: 'Track donation eligibility, status, and community impact',
      category: 'donor',
      badge: 'Donor Management',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: UserCheck,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
      summary: 'Dedicated dashboard for registered donors to manage availability, monitor recovery intervals, and view matching cases.',
      capabilities: [
        'Tactile Availability Switch: Toggle between 🟢 Available to Donate and ⚪ Resting with instant update.',
        'Cooldown Calculator: Automatic 90-day whole blood safe recovery counter with visual progress ring.',
        'Lives Saved Metrics: Tracks your total donations and calculates estimated lives saved (3 per donation).',
        'Nearby Emergency Alerts: Live stream of hospital SOS requests matching your blood type.'
      ],
      steps: [
        'Sign in as a Blood Donor and open the Donor Dashboard.',
        'Flip your live status to "Available" whenever you are ready for calls.',
        'View the emergency feed to accept urgent hospital requests nearby.'
      ],
      actionLabel: currentUser?.role === 'donor' ? 'Open Donor Dashboard' : 'Register as a Blood Donor',
      onAction: () => {
        if (currentUser?.role === 'donor') {
          onNavigateTab('donor-profile');
        } else {
          onOpenAuth('signup');
        }
      },
    },
    {
      id: 'direct-communication',
      title: 'Instant 1-Tap Call & Emergency Messaging',
      tagline: 'Zero-friction direct communication between patients and donors',
      category: 'patient',
      badge: 'Zero Friction',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: Phone,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50',
      summary: 'Direct telephone dialing, pre-composed hospital SMS templates, and WhatsApp message routing.',
      capabilities: [
        '1-Tap Direct Call: Launches device telephone dialer (tel:) with confirmed contact number.',
        'Pre-Formatted Emergency SMS: One-click urgent templates ready to text with hospital name and patient ward.',
        'WhatsApp Integration: Instant WhatsApp Web link populated with case details.',
        'Copy-to-Clipboard: Rapidly copy donor contact info to forward to ICU desks.'
      ],
      steps: [
        'Browse donors in the directory or emergency responders.',
        'Tap "Call Now" for urgent telephone contact.',
        'Or tap "Message" to pick a template and dispatch via SMS or WhatsApp.'
      ],
      actionLabel: 'Test Direct Messaging',
      onAction: () => {
        if (donors.length > 0) {
          onOpenMessageModal(donors[0]);
        } else {
          onNavigateTab('search');
        }
      },
    },
    {
      id: 'compatibility-matrix',
      title: 'Interactive Blood Transfusion Matrix',
      tagline: 'Clinical crossmatch reference for patients and healthcare staff',
      category: 'emergency',
      badge: 'Medical Reference',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
      icon: Activity,
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-50',
      summary: 'Visual 8x8 interactive matrix explaining exact red blood cell compatibility, universal donor rules, and donation tips.',
      capabilities: [
        'Interactive Blood Group Selector: Tap any blood group to inspect who they can donate to and receive from.',
        'Universal Donor Callout: Explains why O- negative blood is universally accepted in emergency trauma.',
        'Full 8x8 Grid Table: Complete medical transfusion matrix with checkmarks and crossmatches.',
        'Preparation Guidelines: Critical tips on hydration, iron-rich nutrition, and rest intervals.'
      ],
      steps: [
        'Navigate to the Blood Matrix tab from the header or button below.',
        'Tap any of the 8 blood groups (e.g. O+, A-, AB+).',
        'Review the safe donor and recipient lists.'
      ],
      actionLabel: 'Open Blood Compatibility Matrix',
      onAction: () => onNavigateTab('compatibility'),
    },
    {
      id: 'dual-role-auth',
      title: 'Dual-Role Accounts & One-Click Demo Logins',
      tagline: 'Tailored interfaces for both voluntary donors and emergency receivers',
      category: 'donor',
      badge: 'Accounts & Access',
      badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: ShieldCheck,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-50',
      summary: 'Frictionless authentication with role-switching, client-side persistence, and instant demo accounts.',
      capabilities: [
        'Role Switcher: Register as a Blood Donor (with blood group & availability) or a Patient/Receiver.',
        'Instant 1-Click Demo Profiles: Test instantly as Sarah Jenkins (O+ donor) or David Reynolds (patient).',
        'Persistent Local Storage: Retains user sessions, profile edits, and custom emergency requests.',
        'Form Validation: Real-time checks for phone numbers, email syntax, and passwords.'
      ],
      steps: [
        'Tap "Log In" or "Register" in the navigation bar.',
        'Choose your role: Blood Donor or Patient / Receiver.',
        'Or click a Demo Account button to test immediately without typing.'
      ],
      actionLabel: currentUser ? 'Switch Account / Log Out' : 'Sign In / Test Demo Accounts',
      onAction: () => onOpenAuth('login'),
    },
  ];

  const filteredFeatures = platformFeatures.filter(f => {
    if (activeFeatureFilter === 'all') return true;
    return f.category === activeFeatureFilter;
  });

  return (
    <div className="space-y-8">
      
      {/* Hero Welcome & Emergency Command Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-rose-950 rounded-3xl p-6 sm:p-9 text-white shadow-xl relative overflow-hidden">
        {/* Glow orb */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-rose-200 border border-white/10 text-xs font-bold backdrop-blur">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Emergency Blood Network</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              {currentUser ? (
                <>Welcome back, <span className="text-rose-400">{currentUser.name}</span></>
              ) : (
                <>Every Second Counts. <span className="text-rose-400">Save a Life.</span></>
              )}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              Real-time platform linking voluntary blood donors with hospitals, trauma centers, and patients in need of immediate transfusions across the country.
            </p>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() => onNavigateTab('search')}
                className="py-2.5 px-5 rounded-xl font-bold text-xs sm:text-sm bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2 active:scale-95"
              >
                <Users className="w-4 h-4" />
                <span>Find Donors</span>
              </button>

              <button
                onClick={onOpenPostRequest}
                className="py-2.5 px-5 rounded-xl font-bold text-xs sm:text-sm bg-white text-slate-900 hover:bg-slate-100 shadow-lg shadow-black/10 transition-all flex items-center gap-2 active:scale-95"
              >
                <Plus className="w-4 h-4 text-red-600" />
                <span>Broadcast SOS Request</span>
              </button>

              <a
                href="#features-directory"
                className="py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-2"
              >
                <Layers className="w-4 h-4 text-amber-300" />
                <span>Explore Features</span>
              </a>
            </div>
          </div>

          {/* User Quick Hub or Quick Login Card */}
          <div className="w-full lg:w-80 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 flex flex-col justify-between shrink-0">
            {currentUser ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-red-600 font-black text-sm flex items-center justify-center text-white shadow-md">
                      {currentUser.bloodGroup || currentUser.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white truncate max-w-[130px]">{currentUser.name}</p>
                      <p className="text-[10px] text-rose-300 font-semibold uppercase tracking-wider">
                        {currentUser.role === 'donor' ? 'Registered Donor' : 'Patient / Receiver'}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-300 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-400" />
                    {currentUser.city}
                  </span>
                </div>

                {currentUser.role === 'donor' ? (
                  <div className="space-y-3 pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-300">Live Status:</span>
                      <button
                        onClick={() => onQuickToggleAvailability && onQuickToggleAvailability(!currentUser.isAvailable)}
                        className={`px-3 py-1 rounded-full text-xs font-black transition-all ${
                          currentUser.isAvailable
                            ? 'bg-emerald-500 text-white shadow-xs'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {currentUser.isAvailable ? '🟢 Available Now' : '⚪ Resting'}
                      </button>
                    </div>

                    {donorMatchingRequests.length > 0 && (
                      <div 
                        onClick={() => onNavigateTab('donor-profile')}
                        className="p-2.5 rounded-xl bg-red-600/40 border border-red-500/40 text-xs text-white cursor-pointer hover:bg-red-600/50 transition-colors flex items-center justify-between"
                      >
                        <span className="font-bold flex items-center gap-1.5">
                          <Flame className="w-4 h-4 text-amber-300" />
                          {donorMatchingRequests.length} Urgent cases match {currentUser.bloodGroup}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <button
                      onClick={() => onNavigateTab('donor-profile')}
                      className="w-full py-2 bg-white/15 hover:bg-white/25 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Open Donor Dashboard</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 pt-2 border-t border-white/10">
                    <p className="text-xs text-slate-300">
                      Looking for blood? You can broadcast an urgent request or contact verified donors in {currentUser.city}.
                    </p>
                    <button
                      onClick={onOpenPostRequest}
                      className="w-full py-2 bg-red-600 hover:bg-red-700 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Post Emergency Request</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-200 uppercase tracking-wider">
                    Quick Access
                  </span>
                  <span className="text-[10px] text-slate-400">Demo Profiles</span>
                </div>
                <p className="text-xs text-slate-300">
                  Join the voluntary network or sign in instantly to test donor availability & emergency responses.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => onOpenAuth('login')}
                    className="py-2 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 transition-colors"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => onOpenAuth('signup')}
                    className="py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPI Stats Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* Available Donors */}
        <div 
          onClick={() => onNavigateTab('search')}
          className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:border-red-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Donors On Call
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{availableDonors}</span>
            <span className="text-xs text-emerald-600 font-bold">/ {totalDonors} registered</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Ready for hospital dispatch
          </p>
        </div>

        {/* Urgent Emergency Cases */}
        <div 
          onClick={() => onNavigateTab('requests')}
          className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:border-red-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Active SOS Requests
            </span>
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-red-600">{openRequests.length}</span>
            {emergencyRequests.length > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold animate-pulse">
                {emergencyRequests.length} Critical
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-600 mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3 text-red-500" />
            Avg match within 18 mins
          </p>
        </div>

        {/* Lives Saved Counter */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:border-red-300 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Lives Touched
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Heart className="w-4 h-4 fill-red-600 text-red-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{estimatedLivesSaved}+</span>
            <span className="text-xs text-rose-600 font-bold">saved</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1">
            From {totalDonationCount} verified blood units
          </p>
        </div>

        {/* Network Hospitals */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:border-red-300 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Cities Covered
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">16+</span>
            <span className="text-xs text-blue-600 font-bold">Metros</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            100% voluntary & verified
          </p>
        </div>
      </div>

      {/* NEW: INTERACTIVE FEATURE EXPLORER - TAP TO EXPAND CAPABILITIES */}
      <section id="features-directory" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
        
        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-red-700 text-xs font-bold border border-rose-200 mb-1.5">
              <Zap className="w-3.5 h-3.5 text-red-600" />
              <span>Interactive Platform Tour</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Platform Features & Capabilities
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Tap any feature card below to view in-depth capabilities, workflows, and launch directly.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start md:self-auto overflow-x-auto text-xs">
            <button
              onClick={() => setActiveFeatureFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                activeFeatureFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Features ({platformFeatures.length})
            </button>
            <button
              onClick={() => setActiveFeatureFilter('patient')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                activeFeatureFilter === 'patient'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Patient Tools
            </button>
            <button
              onClick={() => setActiveFeatureFilter('donor')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                activeFeatureFilter === 'donor'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Donor Hub
            </button>
            <button
              onClick={() => setActiveFeatureFilter('emergency')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                activeFeatureFilter === 'emergency'
                  ? 'bg-white text-red-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Emergency SOS
            </button>
          </div>
        </div>

        {/* Feature Cards Grid (Interactive Tap-To-Expand) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFeatures.map(feat => {
            const isExpanded = expandedFeatureId === feat.id;
            const IconComp = feat.icon;

            return (
              <div
                key={feat.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isExpanded
                    ? 'border-red-500 ring-2 ring-red-500/10 bg-white shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                {/* Tappable Card Header */}
                <button
                  type="button"
                  onClick={() => toggleFeature(feat.id)}
                  className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-3 transition-colors hover:bg-slate-50/70"
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`w-11 h-11 rounded-2xl ${feat.iconBg} ${feat.iconColor} flex items-center justify-center shrink-0 shadow-xs mt-0.5`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${feat.badgeClass}`}>
                          {feat.badge}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {isExpanded ? 'Tap to collapse' : 'Tap to expand'}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                        {feat.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {feat.tagline}
                      </p>
                    </div>
                  </div>

                  <div className={`p-2 rounded-xl transition-transform ${isExpanded ? 'bg-red-50 text-red-600 rotate-180' : 'bg-slate-100 text-slate-500'}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-4 animate-fade-in">
                    <p className="text-xs text-slate-700 leading-relaxed font-medium pt-2">
                      {feat.summary}
                    </p>

                    {/* Capabilities Checklist */}
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-2">
                        Key Capabilities Included:
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {feat.capabilities.map((cap, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{cap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* How It Works Workflow */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1.5 flex items-center gap-1">
                        <Info className="w-3.5 h-3.5 text-blue-600" />
                        <span>How To Use This Feature:</span>
                      </span>
                      <ol className="list-decimal list-inside space-y-1 text-xs text-slate-600">
                        {feat.steps.map((st, i) => (
                          <li key={i}>{st}</li>
                        ))}
                      </ol>
                    </div>

                    {/* Direct Launch Action Button */}
                    <div className="pt-2 flex items-center justify-between gap-3">
                      <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                        Ready to test this feature?
                      </span>
                      <button
                        type="button"
                        onClick={feat.onAction}
                        className="w-full sm:w-auto py-2.5 px-5 rounded-xl font-bold text-xs bg-red-600 hover:bg-red-700 text-white shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                      >
                        <span>{feat.actionLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Main Grid: Blood Inventory Radar & Priority Emergency Cases */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Live Blood Supply / Shortage Radar */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-red-600" />
                  Live Blood Supply & Urgency Radar
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Available donors on call vs pending emergency requests by blood group
                </p>
              </div>

              <button
                onClick={() => onNavigateTab('search')}
                className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 self-start sm:self-auto"
              >
                <span>Browse Directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Blood Groups Status Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {bloodInventory.map(item => {
                const isCritical = item.status === 'CRITICAL';
                const isModerate = item.status === 'MODERATE';

                return (
                  <div
                    key={item.group}
                    onClick={() => onNavigateTab('search')}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left hover:scale-102 ${
                      isCritical
                        ? 'border-red-300 bg-rose-50/60 hover:bg-rose-50'
                        : isModerate
                        ? 'border-amber-200 bg-amber-50/50 hover:bg-amber-50'
                        : 'border-slate-200 bg-slate-50/60 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="w-9 h-9 rounded-xl bg-red-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                        {item.group}
                      </span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        isCritical
                          ? 'bg-red-600 text-white animate-pulse'
                          : isModerate
                          ? 'bg-amber-500 text-white'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-slate-800">
                      {item.availableCount} {item.availableCount === 1 ? 'Donor' : 'Donors'}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {item.pendingUnits > 0 ? (
                        <span className="text-red-700 font-bold">{item.pendingUnits} units needed</span>
                      ) : (
                        <span>Inventory stable</span>
                      )}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Quick explanation tag */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-600" />
                  <strong>Critical</strong>: Urgent donor shortage
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <strong>Moderate</strong>: Steady demand
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <strong>Stable</strong>: Available reserves
                </span>
              </div>
              <span className="text-[11px] text-red-600 font-semibold cursor-pointer hover:underline" onClick={() => onNavigateTab('compatibility')}>
                Check Compatibility Matrix →
              </span>
            </div>
          </div>

          {/* Available Donors Ready to Help (Showcase) */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                  Verified Donors Currently On Call
                </h3>
                <p className="text-xs text-slate-500">
                  Ready to respond to hospital emergencies today
                </p>
              </div>

              <button
                onClick={() => onNavigateTab('search')}
                className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <span>View All ({availableDonors})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {availableDonorsShowcase.map(donor => {
                const cleanPhone = donor.phone.replace(/[^0-9+]/g, '');

                return (
                  <div
                    key={donor.id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-rose-300 hover:shadow-xs transition-all flex items-center justify-between gap-3 bg-white"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-rose-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-xs">
                        {donor.bloodGroup}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                            {donor.name}
                          </h4>
                          {donor.verified && (
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{donor.city}</span>
                          <span className="text-emerald-600 font-bold">● Available</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <a
                        href={`tel:${cleanPhone}`}
                        className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                        title={`Call ${donor.name}`}
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => onOpenMessageModal(donor)}
                        className="p-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                        title={`Message ${donor.name}`}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Urgent SOS Cases & Community Actions */}
        <div className="space-y-6">
          
          {/* Priority Emergency SOS Card */}
          <div className="bg-white p-6 rounded-3xl border border-rose-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <Flame className="w-5 h-5 text-red-600" />
                  Urgent Cases Awaiting Donors
                </h3>
                <p className="text-xs text-slate-500">Immediate hospital requirements</p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-black bg-red-100 text-red-700">
                {openRequests.length} Open
              </span>
            </div>

            {priorityRequests.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl">
                No active emergencies right now.
              </div>
            ) : (
              <div className="space-y-3">
                {priorityRequests.map(req => (
                  <div
                    key={req.id}
                    onClick={() => onNavigateTab('requests')}
                    className="p-3.5 rounded-2xl border border-rose-100 bg-rose-50/40 hover:bg-rose-50 hover:border-rose-300 transition-all cursor-pointer space-y-2 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-red-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                          {req.bloodGroup}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                            {req.patientName}
                          </h4>
                          <p className="text-[10px] text-slate-500">
                            {req.hospitalName}, {req.city}
                          </p>
                        </div>
                      </div>

                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        req.urgency === 'EMERGENCY'
                          ? 'bg-red-600 text-white animate-pulse'
                          : 'bg-amber-500 text-white'
                      }`}>
                        {req.urgency}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-rose-100/60">
                      <span>Needs <strong>{req.unitsNeeded} units</strong></span>
                      <span className="text-red-700 font-bold group-hover:underline flex items-center gap-0.5">
                        <span>Respond</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => onNavigateTab('requests')}
              className="w-full py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-red-700 font-bold text-xs hover:bg-rose-100 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>View All Emergency Requests</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Life-Saving Fact & Eligibility Card */}
          <div className="bg-gradient-to-br from-red-600 to-rose-600 p-6 rounded-3xl text-white shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <h4 className="font-bold text-sm">Did You Know?</h4>
            </div>
            <p className="text-xs text-rose-100 leading-relaxed">
              A single blood donation takes less than 15 minutes and can save up to <strong>3 individual patient lives</strong> in trauma surgery, oncology, and pediatrics.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onOpenAuth('signup')}
                className="w-full py-2.5 bg-white text-red-700 rounded-xl font-bold text-xs hover:bg-rose-50 transition-colors shadow-xs"
              >
                Join as a Registered Donor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
