import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { AuthService } from '../services/auth.service';

export const subscriptionGuard: CanActivateFn = async () => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);

  const clinicId = supabase.clinicId;
  if (!clinicId) return router.createUrlTree(['/']);

  const { data: clinic } = await supabase.client
    .from('clinics')
    .select('plan, trial_ends_at')
    .eq('id', clinicId)
    .single();

  if (!clinic) return router.createUrlTree(['/']);

  const isTrialExpired =
    clinic.plan === 'trial' && new Date(clinic.trial_ends_at) < new Date();

  const isActive = clinic.plan === 'starter' || clinic.plan === 'pro';

  if (isTrialExpired && !isActive) {
    return router.createUrlTree(['/expired']);
  }

  return true;
};
