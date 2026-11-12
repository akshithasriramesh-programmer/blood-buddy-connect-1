import { Donor, BloodRequest, User, BloodGroup } from '../types';
import { INITIAL_DONORS, INITIAL_REQUESTS, DEMO_USERS } from './mockData';

const SESSION_KEY = 'blood_buddy_session_v1';
const USERS_KEY = 'blood_buddy_users_v1';
const DONORS_KEY = 'blood_buddy_donors_v1';
const REQUESTS_KEY = 'blood_buddy_requests_v1';

export function initializeStorage(): void {
  if (typeof window === 'undefined') return;

  // Initialize users if empty
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(DEMO_USERS));
  }

  // Initialize donors if empty
  if (!localStorage.getItem(DONORS_KEY)) {
    localStorage.setItem(DONORS_KEY, JSON.stringify(INITIAL_DONORS));
  }

  // Initialize requests if empty
  if (!localStorage.getItem(REQUESTS_KEY)) {
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(INITIAL_REQUESTS));
  }
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User | null): void {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function getAllUsers(): User[] {
  if (typeof window === 'undefined') return DEMO_USERS;
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : DEMO_USERS;
  } catch {
    return DEMO_USERS;
  }
}

export function saveUser(user: User): void {
  const users = getAllUsers();
  const existingIdx = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
  if (existingIdx >= 0) {
    users[existingIdx] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  // If this user is also a donor, sync with donors directory
  if (user.role === 'donor' && user.bloodGroup) {
    upsertDonorFromUser(user);
  }
}

export function getDonors(): Donor[] {
  if (typeof window === 'undefined') return INITIAL_DONORS;
  try {
    const raw = localStorage.getItem(DONORS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_DONORS;
  } catch {
    return INITIAL_DONORS;
  }
}

export function saveDonors(donors: Donor[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DONORS_KEY, JSON.stringify(donors));
}

export function upsertDonorFromUser(user: User): void {
  if (!user.bloodGroup) return;
  const donors = getDonors();
  const existingIdx = donors.findIndex(d => d.userId === user.id || d.email?.toLowerCase() === user.email.toLowerCase());
  
  const donorObj: Donor = {
    id: existingIdx >= 0 ? donors[existingIdx].id : `donor-${Date.now()}`,
    userId: user.id,
    name: user.name,
    bloodGroup: user.bloodGroup,
    city: user.city || 'New York',
    phone: user.phone || '',
    email: user.email,
    isAvailable: user.isAvailable ?? true,
    lastDonationDate: user.lastDonationDate,
    totalDonations: user.totalDonations ?? 0,
    verified: true,
    distance: existingIdx >= 0 ? donors[existingIdx].distance : 'Local Donor',
    bio: user.bio || '',
    emergencyResponseReady: true,
  };

  if (existingIdx >= 0) {
    donors[existingIdx] = donorObj;
  } else {
    donors.unshift(donorObj);
  }
  saveDonors(donors);
}

export function toggleDonorAvailability(donorId: string, isAvailable: boolean): void {
  const donors = getDonors();
  const idx = donors.findIndex(d => d.id === donorId);
  if (idx >= 0) {
    donors[idx].isAvailable = isAvailable;
    saveDonors(donors);
  }

  // Also update session if it matches current user
  const currentUser = getCurrentUser();
  if (currentUser && (currentUser.id === donors[idx]?.userId || currentUser.email === donors[idx]?.email)) {
    const updatedUser = { ...currentUser, isAvailable };
    setCurrentUser(updatedUser);
    saveUser(updatedUser);
  }
}

export function getRequests(): BloodRequest[] {
  if (typeof window === 'undefined') return INITIAL_REQUESTS;
  try {
    const raw = localStorage.getItem(REQUESTS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_REQUESTS;
  } catch {
    return INITIAL_REQUESTS;
  }
}

export function saveRequests(requests: BloodRequest[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
}

export function createBloodRequest(newReq: Omit<BloodRequest, 'id' | 'createdAt' | 'status' | 'responses'>): BloodRequest {
  const requests = getRequests();
  const created: BloodRequest = {
    ...newReq,
    id: `req-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'OPEN',
    responses: [],
  };
  requests.unshift(created);
  saveRequests(requests);
  return created;
}

export function respondToRequest(requestId: string, donor: {
  donorId: string;
  donorName: string;
  donorBloodGroup: BloodGroup;
  donorPhone: string;
  message?: string;
}): void {
  const requests = getRequests();
  const req = requests.find(r => r.id === requestId);
  if (req) {
    if (!req.responses) req.responses = [];
    req.responses.push({
      ...donor,
      respondedAt: new Date().toISOString(),
    });
    if (req.status === 'OPEN') {
      req.status = 'IN_PROGRESS';
    }
    saveRequests(requests);
  }
}

export function updateRequestStatus(requestId: string, status: 'OPEN' | 'IN_PROGRESS' | 'FULFILLED'): void {
  const requests = getRequests();
  const req = requests.find(r => r.id === requestId);
  if (req) {
    req.status = status;
    saveRequests(requests);
  }
}
