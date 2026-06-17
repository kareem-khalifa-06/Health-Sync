import { roleGuard } from './auth.guard';
export const patientGuard = roleGuard('patient');
