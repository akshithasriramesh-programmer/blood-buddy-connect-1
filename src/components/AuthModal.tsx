import React, { useState } from 'react';
import { UserRole, BloodGroup, User } from '../types';
import { BLOOD_GROUPS, DEMO_USERS } from '../data/mockData';
import { 
  X, 
  Droplet, 
  Lock, 
  Mail, 
  User as UserIcon, 
  MapPin, 
  Phone, 
  HeartHandshake, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  onLoginSuccess: (user: User) => void;
  registeredUsers: User[];
  onRegisterUser: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onLoginSuccess,
  registeredUsers,
  onRegisterUser,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [role, setRole] = useState<UserRole>('donor');
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [city, setCity] = useState('New York');
  const [phone, setPhone] = useState('');

  // Validation & errors
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickDemo = (demoUser: User) => {
    setErrorMessage(null);
    setSuccessMessage(`Logged in successfully as ${demoUser.name} (${demoUser.role === 'donor' ? 'Donor' : 'Patient/Receiver'})`);
    setTimeout(() => {
      onLoginSuccess(demoUser);
      onClose();
    }, 400);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    // Check if user exists in registered users or demo users
    const matchedUser = [...registeredUsers, ...DEMO_USERS].find(
      u => u.email.toLowerCase() === trimmedEmail
    );

    if (matchedUser) {
      setSuccessMessage(`Welcome back, ${matchedUser.name}!`);
      setTimeout(() => {
        onLoginSuccess(matchedUser);
        onClose();
      }, 500);
    } else {
      // Allow seamless login by creating a session for this email
      const generatedUser: User = {
        id: `user-${Date.now()}`,
        name: trimmedEmail.split('@')[0].replace(/[^a-zA-Z]/g, ' ') || 'Blood Buddy User',
        email: trimmedEmail,
        role: role,
        bloodGroup: role === 'donor' ? bloodGroup : undefined,
        city: city || 'New York',
        phone: phone || '+1 (555) 000-0000',
        isAvailable: true,
        registeredAt: new Date().toISOString(),
      };
      onRegisterUser(generatedUser);
      setSuccessMessage(`Account signed in as ${generatedUser.name}`);
      setTimeout(() => {
        onLoginSuccess(generatedUser);
        onClose();
      }, 500);
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhone = phone.trim();
    const trimmedCity = city.trim();

    if (!trimmedName) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!trimmedEmail || !/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (!trimmedPhone) {
      setErrorMessage('Please enter a valid phone number for emergency contact.');
      return;
    }
    if (!trimmedCity) {
      setErrorMessage('Please enter your primary city or region.');
      return;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: trimmedName,
      email: trimmedEmail,
      role: role,
      bloodGroup: role === 'donor' ? bloodGroup : undefined,
      city: trimmedCity,
      phone: trimmedPhone,
      isAvailable: role === 'donor' ? true : undefined,
      totalDonations: role === 'donor' ? 0 : undefined,
      registeredAt: new Date().toISOString(),
    };

    onRegisterUser(newUser);
    setSuccessMessage(`Account created successfully! Welcome, ${newUser.name}.`);
    setTimeout(() => {
      onLoginSuccess(newUser);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden my-8">
        
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-6 py-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-inner">
              <Droplet className="w-7 h-7 fill-white text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                {mode === 'login' ? 'Welcome to Blood Buddy' : 'Join Blood Buddy Connect'}
              </h2>
              <p className="text-xs text-rose-100 mt-0.5">
                {mode === 'login'
                  ? 'Sign in to manage your availability or urgent requests'
                  : 'Every blood donation saves up to 3 lives in emergency rooms'}
              </p>
            </div>
          </div>

          {/* Toggle between Login and Signup */}
          <div className="flex mt-5 bg-black/20 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'login' ? 'bg-white text-red-700 shadow-sm' : 'text-rose-100 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'signup' ? 'bg-white text-red-700 shadow-sm' : 'text-rose-100 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Status feedback */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs font-semibold text-red-700 animate-fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs font-semibold text-emerald-800 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Role Selection Switcher */}
          <div className="mb-5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('donor')}
                className={`p-3 rounded-2xl border text-left transition-all relative ${
                  role === 'donor'
                    ? 'border-red-600 bg-rose-50/70 shadow-xs ring-2 ring-red-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">🩸</span>
                  <span className="font-bold text-sm text-slate-900">Blood Donor</span>
                </div>
                <p className="text-[11px] text-slate-700 mt-1">
                  Ready to donate blood to save patients
                </p>
                {role === 'donor' && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-600" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setRole('receiver')}
                className={`p-3 rounded-2xl border text-left transition-all relative ${
                  role === 'receiver'
                    ? 'border-red-600 bg-rose-50/70 shadow-xs ring-2 ring-red-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏥</span>
                  <span className="font-bold text-sm text-slate-900">Patient / Receiver</span>
                </div>
                <p className="text-[11px] text-slate-700 mt-1">
                  Searching for blood donors or hospital help
                </p>
                {role === 'receiver' && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-600" />
                )}
              </button>
            </div>
          </div>

          {/* Form */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. sarah.donor@bloodbuddy.org"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-md shadow-rose-500/25 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span>Sign In as {role === 'donor' ? 'Blood Donor' : 'Patient/Receiver'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="name@email.com"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Donor specific: Blood Group selector */}
              {role === 'donor' && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-800">
                      Blood Group *
                    </label>
                    <span className="text-[11px] text-red-600 font-semibold">
                      Required for donor matching
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {BLOOD_GROUPS.map(bg => (
                      <button
                        key={bg}
                        type="button"
                        onClick={() => setBloodGroup(bg)}
                        className={`py-2 text-xs font-black rounded-xl border transition-all ${
                          bloodGroup === bg
                            ? 'bg-red-600 text-white border-red-600 shadow-sm scale-102'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {bg}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City / Location *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="e.g. New York, NY"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Create Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-md shadow-rose-500/25 transition-all flex items-center justify-center gap-2 mt-3"
              >
                <span>Register as {role === 'donor' ? 'Blood Donor' : 'Patient / Receiver'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Quick Demo One-Click Accounts */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                ⚡ Quick Demo Accounts
              </span>
              <span className="text-[10px] text-slate-600">Click to instantly log in</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo(DEMO_USERS[0])}
                className="flex items-center gap-2.5 p-2 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100/80 text-left transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-red-600 text-white font-black text-xs flex items-center justify-center">
                  O+
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-800">Sarah (Donor)</p>
                  <p className="text-[10px] text-slate-700">O+ Universal Blood, NYC</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo(DEMO_USERS[1])}
                className="flex items-center gap-2.5 p-2 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/80 text-left transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                  🏥
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-800">David (Receiver)</p>
                  <p className="text-[10px] text-slate-700">Patient Seeking Donors</p>
                </div>
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-600">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secure connection & privacy protected for emergency medical needs</span>
          </div>
        </div>
      </div>
    </div>
  );
};
