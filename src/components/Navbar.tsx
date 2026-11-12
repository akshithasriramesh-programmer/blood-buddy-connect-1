import React from 'react';
import { User } from '../types';
import { 
  HeartHandshake, 
  Search, 
  AlertCircle, 
  UserCheck, 
  Activity, 
  LogOut, 
  LogIn, 
  Droplet,
  LayoutDashboard
} from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  activeTab: 'dashboard' | 'search' | 'requests' | 'donor-profile' | 'compatibility';
  setActiveTab: (tab: 'dashboard' | 'search' | 'requests' | 'donor-profile' | 'compatibility') => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onLogout: () => void;
  onOpenPostRequest: () => void;
  emergencyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onLogout,
  onOpenPostRequest,
  emergencyCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-rose-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none group"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 text-white shadow-md shadow-rose-500/25 group-hover:scale-105 transition-transform">
              <Droplet className="w-6 h-6 fill-white" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-red-600 transition-colors">
                  Blood<span className="text-red-600">Buddy</span>
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-50 text-red-700 border border-rose-200 hidden sm:inline-block">
                  Connect
                </span>
              </div>
              <p className="text-[11px] text-slate-700 font-medium hidden sm:block">
                Urgent Blood Donor & Patient Network
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white text-red-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'search'
                  ? 'bg-white text-red-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Search className="w-4 h-4" />
              Find Donors
            </button>

            <button
              onClick={() => setActiveTab('requests')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all relative ${
                activeTab === 'requests'
                  ? 'bg-white text-red-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Urgent SOS
              {emergencyCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-xs font-bold bg-red-600 text-white animate-pulse">
                  {emergencyCount}
                </span>
              )}
            </button>

            {currentUser?.role === 'donor' && (
              <button
                onClick={() => setActiveTab('donor-profile')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'donor-profile'
                    ? 'bg-white text-red-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <UserCheck className="w-4 h-4 text-emerald-600" />
                Donor Center
              </button>
            )}

            <button
              onClick={() => setActiveTab('compatibility')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'compatibility'
                  ? 'bg-white text-red-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Activity className="w-4 h-4" />
              Blood Matrix
            </button>
          </nav>

          {/* Right Action / Auth Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Urgent Broadcast button */}
            <button
              onClick={onOpenPostRequest}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-rose-500/20 hover:from-red-700 hover:to-rose-700 transition-all active:scale-95"
            >
              <HeartHandshake className="w-4 h-4" />
              <span className="hidden xs:inline">Request Blood</span>
              <span className="xs:hidden">SOS</span>
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div 
                  onClick={() => currentUser.role === 'donor' && setActiveTab('donor-profile')}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-colors ${
                    currentUser.role === 'donor' 
                      ? 'bg-rose-50 border-rose-200 cursor-pointer hover:bg-rose-100/70' 
                      : 'bg-slate-50 border-slate-200'
                  }`}
                  title={currentUser.role === 'donor' ? 'Click to open Donor Dashboard' : 'Current Patient User'}
                >
                  <div className="w-8 h-8 rounded-lg bg-red-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                    {currentUser.bloodGroup || currentUser.name.charAt(0)}
                  </div>
                  <div className="hidden sm:block text-left text-xs">
                    <p className="font-bold text-slate-800 leading-tight truncate max-w-[110px]">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-slate-700 font-semibold flex items-center gap-1">
                      {currentUser.role === 'donor' ? (
                        <span className="text-emerald-700 font-bold">● Donor ({currentUser.bloodGroup})</span>
                      ) : (
                        <span className="text-blue-700 font-bold">● Patient/Receiver</span>
                      )}
                    </p>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-red-600 hover:bg-rose-50 transition-colors flex items-center gap-1.5 border border-slate-200"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4 text-slate-500 hover:text-red-600" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-red-600 hover:bg-rose-50 transition-colors border border-slate-200"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Log In</span>
                </button>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg font-medium whitespace-nowrap ${
              activeTab === 'dashboard' ? 'text-red-600 font-bold bg-rose-50' : 'text-slate-600'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg font-medium whitespace-nowrap ${
              activeTab === 'search' ? 'text-red-600 font-bold bg-rose-50' : 'text-slate-600'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Donors
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg font-medium whitespace-nowrap relative ${
              activeTab === 'requests' ? 'text-red-600 font-bold bg-rose-50' : 'text-slate-600'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            SOS
            {emergencyCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center font-bold">
                {emergencyCount}
              </span>
            )}
          </button>

          {currentUser?.role === 'donor' && (
            <button
              onClick={() => setActiveTab('donor-profile')}
              className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg font-medium whitespace-nowrap ${
                activeTab === 'donor-profile' ? 'text-red-600 font-bold bg-rose-50' : 'text-slate-600'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              Profile
            </button>
          )}

          <button
            onClick={() => setActiveTab('compatibility')}
            className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg font-medium whitespace-nowrap ${
              activeTab === 'compatibility' ? 'text-red-600 font-bold bg-rose-50' : 'text-slate-600'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Matrix
          </button>
        </div>
      </div>
    </header>
  );
};
