export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: number;
  type: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  reason: string;
  notes: string;
  slotId: string;
  consultationFee: number;
  createdAt: string;
  updatedAt: string;
}
