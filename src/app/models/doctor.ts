
export interface DoctorEducation {
  degree: string; // "MD, FACC — Board-Certified Cardiologist"
  institution: string; // "Johns Hopkins Hospital"
  year: string; // "2012"
}

export interface AvailableTimeSlot {
  start: string; // "09:00"
  end: string; // "12:00"
}

export interface Doctor {
  id: string; 
  userId: string; 
  firstName: string;
  lastName: string;
  fullName: string;
  initials: string; 
  avatarUrl: string;
  specialty: string; // "Cardiology"
  subSpecialty: string; // "Interventional Cardiology"
  department: string; // "Heart & Vascular"
  hospital: string;
  location: string;
  email: string;
  phone: string;
  bio: string;
  qualifications: string[]; // ["MD", "FACC"]
  languages: string[];
  services: string[];
  education: DoctorEducation[];
  achievements: string[];
  experience: number; // years (flat field)
  totalPatients: number; // flat field
  rating: number; // flat field
  totalReviews: number; // flat field
  consultationFee: number;
  status: 'active' | 'on-leave' | 'unavailable';
  isAvailableToday: boolean;
  availableDays: string[]; // ["Monday", "Tuesday", ...]
  availableTimeSlots: AvailableTimeSlot[];
}

// ── doctorSchedules[] ────────────────────────────────────────────────────────

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

export interface DoctorSchedule {
  id: string; // "sch-d1-1"
  doctorId: string; // "d1"
  day: string; // "Monday"
  date: string; // "2026-03-04"
  dayShort: string; // "Mon"
  enabled:boolean;
  slots: TimeSlot[];
}

// ── doctorReviews[] ──────────────────────────────────────────────────────────

export interface DoctorReview {
  id: string; // "rev1"
  doctorId: string; // "d1"
  patientId: string; // "p1"
  patientName: string;
  patientInitials: string;
  rating: number; // 1–5
  date: string; // "2026-02-12"
  comment: string;
  createdAt: string; // "2026-02-12T11:00:00.000Z"
}
