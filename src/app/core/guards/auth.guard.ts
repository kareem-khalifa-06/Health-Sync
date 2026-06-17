// src/app/core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { SupabaseService } from '../services/supabase.service';
import { from, map } from 'rxjs';

export const roleGuard = (allowedRole: string): CanActivateFn => {
  return () => {
    const auth     = inject(AuthService);
    const supabase = inject(SupabaseService);
    const toastr   = inject(ToastrService);
    const router   = inject(Router);
    return from(
      supabase.client.auth.getSession().then(({ data }) => {
        const session = data.session;

        if (!session) {
          toastr.error('Session expired. Please log in again.');
          router.navigate(['/login']);
          return false;
        }

        const user = auth.currentUser();
        if (!user) {
          const stored = localStorage.getItem('currentUser');
          if (!stored) {
            toastr.error('Access Denied.');
            router.navigate(['/login']);
            return false;
          }
          auth.currentUser.set(JSON.parse(stored));
        }

        const role = auth.currentUser()?.role;

        if (role === allowedRole) return true;

        toastr.error(`Access Denied. ${allowedRole} area only.`);
        router.navigate(['/login']);
        return false;
      })
    );
  };
};