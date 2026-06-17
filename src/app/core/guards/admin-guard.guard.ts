import { roleGuard } from './auth.guard';
export const adminGuard = roleGuard('admin');
