export interface User {
  id: string;
  email: string;
  password: string;
  role: 'admin' | 'doctor' | 'receptionist' |'patient';
  firstName: string;
  lastName: string;
  phone: string;
  avatar: string;
  createdAt: Date;
}
