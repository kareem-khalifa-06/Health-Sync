// ─────────────────────────────────────────────
//  Patient Model
// ─────────────────────────────────────────────

export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export type BloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-';

export type PatientStatus = 'active' | 'inactive' | 'discharged' | 'deceased';

// ─────────────────────────────────────────────

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
}

// ─────────────────────────────────────────────

export interface Patient {
  id: string;
  userId: string;

  // Personal Info
  firstName: string;
  lastName: string;
  fullName: string;
  initials: string;
  avatarUrl?: string;
  dateOfBirth: string; // ISO 8601 date string: "YYYY-MM-DD"
  gender: Gender;

  // Contact Info
  address: string;
  email: string;
  phone: string;
  emergencyContact: EmergencyContact;

  // Insurance
  insuranceProvider: string;
  insuranceNumber: string;

  // Medical Info
  bloodGroup: BloodGroup;
  allergies: string[];
  chronicConditions: string[];
  currentMedications: Medication[];

  // Meta
  registeredDate: string; // ISO 8601 datetime string
  lastVisit: string; // ISO 8601 datetime string
  status: PatientStatus;
}

// ─────────────────────────────────────────────
//  Factory / Default
// ─────────────────────────────────────────────

export const createDefaultPatient = (): Patient => ({
  id: '',
  userId: '',
  firstName: '',
  lastName: '',
  fullName: '',
  initials: '',
  avatarUrl: undefined,
  dateOfBirth: '',
  gender: 'male',
  address: '',
  email: '',
  phone: '',
  emergencyContact: {
    name: '',
    relationship: '',
    phone: '',
  },
  insuranceProvider: '',
  insuranceNumber: '',
  bloodGroup: 'O+',
  allergies: [],
  chronicConditions: [],
  currentMedications: [],
  registeredDate: new Date().toISOString(),
  lastVisit: new Date().toISOString(),
  status: 'active',
});
