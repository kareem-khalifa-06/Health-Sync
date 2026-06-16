// src/app/core/services/auth.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { Observable, from, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { SupabaseService } from './supabase.service';

const USER_CACHE_KEY = 'hs_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private supabase = inject(SupabaseService);
  private router   = inject(Router);

  // Signals
  currentUser = signal<User | null>(null);
  isReady     = signal(false); // ← guards wait for this before redirecting

  readonly baseRouteMap: Record<string, string> = {
    admin:        'adminLayout',
    doctor:       'doctorLayout',
    receptionist: 'receptionistLayout',
    patient:      'patientLayout',
  };

  constructor() {
    this.restoreSession();
  }

  // ── Session restore ───────────────────────────────────────────────
  // Step 1: paint instantly from cache (synchronous, 0ms)
  // Step 2: verify with Supabase in background (non-blocking)
  private restoreSession(): void {
    // Instant restore — unblocks rendering immediately
    const cached = localStorage.getItem(USER_CACHE_KEY);
    if (cached) {
      this.currentUser.set(JSON.parse(cached));
    }

    // Background verify — corrects stale cache silently
    this.supabase.client.auth.getSession().then(({ data }) => {
      if (data.session?.user.email) {
        this.loadUserProfile(data.session.user.email).then(() => {
          this.isReady.set(true);
        });
      } else {
        this.clearSession();
        this.isReady.set(true);
      }
    });

    // Stay in sync on token refresh / sign-out in other tabs
    this.supabase.client.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        this.clearSession();
      } else if (event === 'TOKEN_REFRESHED') {
        this.loadUserProfile(session.user.email!);
      }
    });
  }

  private async loadUserProfile(email: string): Promise<void> {
    try {
      const user = await this.supabase.execute<User>(
        this.supabase.client
          .from('users')
          .select('*')
          .eq('email', email)
          .maybeSingle()
      );
      if (user) {
        this.currentUser.set(user);
        localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user)); // keep cache fresh
      }
    } catch {
      this.clearSession();
    }
  }

  private clearSession(): void {
    localStorage.removeItem(USER_CACHE_KEY);
    this.currentUser.set(null);
  }

  // ── Login ─────────────────────────────────────────────────────────
  login(email: string, password: string): Observable<User> {
    return from(
      this.supabase.client.auth
        .signInWithPassword({ email, password })
        .then(async ({ error }) => {
          if (error) throw new Error('Invalid credentials');

          const user = await this.supabase.execute<User>(
            this.supabase.client
              .from('users')
              .select('*')
              .eq('email', email)
              .maybeSingle()
          );
          if (!user) throw new Error('User profile not found');
          return user;
        })
    ).pipe(
      tap((user) => {
        localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
        this.currentUser.set(user);
        this.isReady.set(true);
      })
    );
  }

  // ── Helpers ───────────────────────────────────────────────────────
  getRole()      { return this.currentUser()?.role; }
  getBaseRoute() { return this.baseRouteMap[this.getRole()!]; }
  isLoggedIn()   { return !!this.currentUser(); }

  // ── Logout ────────────────────────────────────────────────────────
  logout(): void {
    this.supabase.client.auth.signOut().then(() => {
      this.clearSession();
      this.router.navigate(['/']);
    });
  }
}