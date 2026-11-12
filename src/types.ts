export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type UserRole = 'donor' | 'receiver';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bloodGroup?: BloodGroup;
  city: string;
  phone: string;
  isAvailable?: boolean;
  lastDonationDate?: string;
  totalDonations?: number;
  bio?: string;
  registeredAt: string;
}

export interface Donor {
  id: string;
  userId?: string;
  name: string;
  bloodGroup: BloodGroup;
  city: string;
  phone: string;
  email?: string;
  isAvailable: boolean;
  lastDonationDate?: string;
  totalDonations: number;
  verified: boolean;
  distance?: string;
  bio?: string;
  emergencyResponseReady?: boolean;
}

export type UrgencyLevel = 'EMERGENCY' | 'URGENT' | 'STANDARD';
export type RequestStatus = 'OPEN' | 'IN_PROGRESS' | 'FULFILLED';

export interface BloodRequest {
  id: string;
  patientName: string;
  bloodGroup: BloodGroup;
  unitsNeeded: number;
  hospitalName: string;
  hospitalAddress: string;
  city: string;
  contactPerson: string;
  contactPhone: string;
  urgency: UrgencyLevel;
  status: RequestStatus;
  createdByUserId: string;
  createdByName: string;
  createdAt: string;
  additionalNotes?: string;
  responses?: {
    donorId: string;
    donorName: string;
    donorBloodGroup: BloodGroup;
    donorPhone: string;
    respondedAt: string;
    message?: string;
  }[];
}

export interface CompatibilityInfo {
  canDonateTo: BloodGroup[];
  canReceiveFrom: BloodGroup[];
  description: string;
}
