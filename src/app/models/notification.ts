export interface Notifications {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  appointmentId: string;
  read: boolean;
  createdAt: Date;
}
