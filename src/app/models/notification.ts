
export interface Notifications {
  id:        string;
  userId:    string;
  message:   string;
  type:      'appointment' | 'reminder' | 'alert' | 'message';
   appointmentId: string;
  read:      boolean;
  createdAt: string; 
}