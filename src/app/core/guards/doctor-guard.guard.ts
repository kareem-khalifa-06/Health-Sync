import { roleGuard } from './auth.guard';
export const doctorGuard = roleGuard('doctor');
