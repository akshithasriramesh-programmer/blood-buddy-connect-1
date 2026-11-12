import React, { useState, useEffect } from 'react';
import { User, Donor, BloodRequest } from './types';
import { 
  initializeStorage, 
  getCurrentUser, 
  setCurrentUser, 
  getDonors, 
  getRequests, 
  getAllUsers, 
  saveUser, 
  createBloodRequest, 
  respondToRequest, 
  updateRequestStatus 
} from './data/storage';
import { Navbar } from './components/Navbar';
import { MainDashboard } from './components/MainDashboard';
import { ReceiverDashboard } from './components/ReceiverDashboard';
import { DonorDashboard } from './components/DonorDashboard';
import { EmergencyRequestsView } from './components/EmergencyRequestsView';
import { CompatibilityGuide } from './components/CompatibilityGuide';
import { AuthModal } from './components/AuthModal';
import { MessageDonorModal } from './components/MessageDonorModal';
import { PostRequestModal } from './components/PostRequestModal';
import { 
  Heart, 
  Droplet, 
  ShieldCheck, 
  PhoneCall, 
  AlertCircle, 
  Sparkles,
  Users,
  Building,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  const [currentUser, setUser] = useState<User | null>(null);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);

  // Navigation
  const [activeTab, setActiveTab] = useState<'dashboard' | 'search' | 'requests' | 'donor-profile' | 'compatibility'>('dashboard');

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'signup'>('login');
  const [selectedDonorForMessage, setSelectedDonorForMessage] = useState<Donor | null>(null);
  const [isPostRequestOpen, setIsPostRequestOpen] = useState(false);

  // Global toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Initialize storage & state on mount
  useEffect(() => {
    initializeStorage();
    const loadedUser = getCurrentUser();
    setUser(loadedUser);
    setDonors(getDonors());
    setRequests(getRequests());
    setRegisteredUsers(getAllUsers());
  }, []);

  // Handlers
  const handleOpenAuth = (mode: 'login' | 'signup' = 'login') => {
    setAuthInitialMode(mode);
    setIsAuthOpen(true);
  };

  const handleLoginSuccess = (user: User) => {
    setUser(user);
    setCurrentUser(user);
    // Reload donors in case user was added
    setDonors(getDonors());
    showToast(`Signed in as ${user.name}`);
    if (user.role === 'donor') {
      setActiveTab('donor-profile');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUser(null);
    setActiveTab('dashboard');
    showToast('Signed out successfully');
  };

  const handleQuickToggleAvailability = (isAvailable: boolean) => {
    if (!currentUser) return;
    const updated = { ...currentUser, isAvailable };
    handleUpdateProfile(updated);
  };

  const handleRegisterUser = (newUser: User) => {
    saveUser(newUser);
    setRegisteredUsers(getAllUsers());
    setDonors(getDonors());
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setUser(updatedUser);
    setCurrentUser(updatedUser);
    saveUser(updatedUser);
    setDonors(getDonors());
    showToast('Profile and availability updated');
  };

  const handleSubmitRequest = (newReqData: Omit<BloodRequest, 'id' | 'createdAt' | 'status' | 'responses'>) => {
    const created = createBloodRequest(newReqData);
    setRequests(getRequests());
    setActiveTab('requests');
    showToast(`Emergency request for ${created.patientName} broadcasted!`);
  };

  const handleRespondToRequest = (requestId: string, message: string) => {
    const donorName = currentUser?.name || 'Local Voluntary Donor';
    const donorBloodGroup = currentUser?.bloodGroup || 'O+';
    const donorPhone = currentUser?.phone || '+1 (555) 999-8877';

    respondToRequest(requestId, {
      donorId: currentUser?.id || `anon-${Date.now()}`,
      donorName,
      donorBloodGroup,
      donorPhone,
      message,
    });
    setRequests(getRequests());
    showToast('Your donation offer was sent to the patient coordinator!');
  };

  const handleUpdateRequestStatus = (requestId: string, status: 'OPEN' | 'IN_PROGRESS' | 'FULFILLED') => {
    updateRequestStatus(requestId, status);
    setRequests(getRequests());
    showToast(`Request marked as ${status.toLowerCase()}`);
  };

  const emergencyCount = requests.filter(r => r.urgency === 'EMERGENCY' && r.status !== 'FULFILLED').length;
  const availableDonorsCount = donors.filter(d => d.isAvailable).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-bold border border-slate-700 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onOpenPostRequest={() => setIsPostRequestOpen(true)}
        emergencyCount={emergencyCount}
      />

      {/* Emergency Ticker Banner (if active emergencies) */}
      {emergencyCount > 0 && activeTab !== 'requests' && (
        <div 
          onClick={() => setActiveTab('requests')}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
        >
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span>
            🚨 Active Emergency: {emergencyCount} urgent blood requests pending in your region. Click to view cases & donate!
          </span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <MainDashboard
            currentUser={currentUser}
            donors={donors}
            requests={requests}
            onNavigateTab={setActiveTab}
            onOpenAuth={handleOpenAuth}
            onOpenPostRequest={() => setIsPostRequestOpen(true)}
            onOpenMessageModal={donor => setSelectedDonorForMessage(donor)}
            onQuickToggleAvailability={handleQuickToggleAvailability}
          />
        )}

        {activeTab === 'search' && (
          <ReceiverDashboard
            donors={donors}
            currentUser={currentUser}
            onOpenMessageModal={donor => setSelectedDonorForMessage(donor)}
            onOpenPostRequest={() => setIsPostRequestOpen(true)}
            onOpenAuth={() => handleOpenAuth('login')}
          />
        )}

        {activeTab === 'requests' && (
          <EmergencyRequestsView
            requests={requests}
            currentUser={currentUser}
            onOpenPostRequest={() => setIsPostRequestOpen(true)}
            onRespondToRequest={handleRespondToRequest}
            onUpdateRequestStatus={handleUpdateRequestStatus}
          />
        )}

        {activeTab === 'donor-profile' && currentUser?.role === 'donor' && (
          <DonorDashboard
            currentUser={currentUser}
            onUpdateProfile={handleUpdateProfile}
            requests={requests}
            onRespondToRequest={handleRespondToRequest}
          />
        )}

        {activeTab === 'compatibility' && (
          <CompatibilityGuide />
        )}
      </main>

      {/* Floating Request Button for Quick Action on Mobile */}
      <div className="fixed bottom-5 left-5 md:hidden z-30">
        <button
          onClick={() => setIsPostRequestOpen(true)}
          className="p-3.5 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-xl shadow-rose-600/40 flex items-center justify-center active:scale-95"
          title="Emergency Blood Request"
        >
          <Droplet className="w-6 h-6 fill-white" />
        </button>
      </div>

      {/* Medical-Themed Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white">
                  <Droplet className="w-4 h-4 fill-white" />
                </div>
                <span className="font-black text-lg text-slate-900 tracking-tight">
                  Blood<span className="text-red-600">Buddy</span> Connect
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                A non-profit emergency voluntary blood network connecting generous donors with hospitals and patients in immediate need.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Voluntary & Non-Commercial</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
                Live Network Stats
              </h4>
              <ul className="text-xs space-y-2 text-slate-600">
                <li className="flex items-center justify-between">
                  <span>Registered Donors:</span>
                  <span className="font-bold text-slate-900">{donors.length}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Available on Call:</span>
                  <span className="font-bold text-emerald-600">{availableDonorsCount}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Active SOS Requests:</span>
                  <span className="font-bold text-red-600">{requests.filter(r => r.status === 'OPEN').length}</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
                Quick Navigation
              </h4>
              <ul className="text-xs space-y-2 text-slate-600">
                <li>
                  <button onClick={() => setActiveTab('dashboard')} className="hover:text-red-600 transition-colors">
                    Executive Dashboard
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('search')} className="hover:text-red-600 transition-colors">
                    Find Available Donors
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('requests')} className="hover:text-red-600 transition-colors">
                    Urgent Emergency Board
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('compatibility')} className="hover:text-red-600 transition-colors">
                    Blood Compatibility Checker
                  </button>
                </li>
                <li>
                  <button onClick={() => handleOpenAuth('signup')} className="hover:text-red-600 transition-colors">
                    Register as Blood Donor
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                Emergency Disclaimer
              </h4>
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-[11px] text-red-950 leading-relaxed">
                <strong>Medical Notice:</strong> Blood Buddy Connect facilitates direct donor communication. In acute life-threatening situations, always alert 911 or visit the nearest emergency trauma center immediately.
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <p>© {new Date().getFullYear()} Blood Buddy Connect. Built to save lives, one connection at a time.</p>
            <div className="flex items-center gap-4">
              <span>Universal Donor: <strong>O-</strong></span>
              <span>•</span>
              <span>Universal Recipient: <strong>AB+</strong></span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authInitialMode}
        onLoginSuccess={handleLoginSuccess}
        registeredUsers={registeredUsers}
        onRegisterUser={handleRegisterUser}
      />

      <MessageDonorModal
        donor={selectedDonorForMessage}
        onClose={() => setSelectedDonorForMessage(null)}
        currentUser={currentUser}
      />

      <PostRequestModal
        isOpen={isPostRequestOpen}
        onClose={() => setIsPostRequestOpen(false)}
        currentUser={currentUser}
        onSubmitRequest={handleSubmitRequest}
      />
    </div>
  );
}
