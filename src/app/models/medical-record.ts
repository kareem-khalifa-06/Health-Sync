// ── Vital Signs ───────────────────────────────────────────────
export interface VitalSigns {
  bloodPressure: string; 
  heartRate: number; 
  temperature: number;
  oxygenSat: number;
  weight: number;
  height: number; 
  respiratoryRate: number;
}

// ── Prescription ──────────────────────────────────────────────
export interface Prescription {
  id: string;
  medication: string;
  dosage: string; // e.g. '500mg'
  frequency: string; // e.g. 'Twice daily'
  duration: string; // e.g. '7 days'
  notes: string;
}

// ── Lab Test ──────────────────────────────────────────────────
export interface LabTest {
  id: string;
  name: string; 
  status: 'ordered' | 'in-progress' | 'completed'|'pending';
  result: string; 
  orderedAt: string;
}

// ── Medical Record ────────────────────────────────────────────
export interface MedicalRecord {
  id:            string;
  appointmentId: string;
  patientId:     string;
  doctorId:      string;
  date:          string;      // ← add this

  diagnosis:     string;
  symptoms:      string[];
  notes:         string;

  vitalSigns:    VitalSigns;
  prescriptions: Prescription[];
  labTests:      LabTest[];

  followUpDate:  string;
  followUpNotes: string;

  createdAt:     string;
  updatedAt:     string;
}
