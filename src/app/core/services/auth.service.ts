import { Injectable, inject, signal } from '@angular/core';
import { Observable, from, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { SupabaseService } from './supabase.service';

const CACHE_KEY = 'hs_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private supabase = inject(SupabaseService);
  private router   = inject(Router);

  currentUser = signal<User | null>(null);
  isReady     = signal(false);

  baseRouteMap: Record<string, string> = {
    admin:        'adminLayout',
    doctor:       'doctorLayout',
    patient:      'patientLayout',
    receptionist: 'receptionistLayout',
  };

  constructor() { this.restoreSession(); }

  // ── Session restore ───────────────────────────────────────────
  // Step 1: paint from cache instantly (0ms)
  // Step 2: verify Supabase Auth session in background
  private restoreSession(): void {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) this.currentUser.set(JSON.parse(cached));

    this.supabase.client.auth.getSession().then(({ data }) => {
      if (data.session?.user.email) {
        this.loadProfile(data.session.user.email).then(() => this.isReady.set(true));
      } else {
        this.clearSession();
        this.isReady.set(true);
      }
    });

    // Sync on token refresh or sign-out in another tab
    this.supabase.client.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        this.clearSession();
      } else if (event === 'TOKEN_REFRESHED') {
        this.loadProfile(session.user.email!);
      }
    });
  }

  // Uses execute() → toCamelCase() → correct User shape
  private async loadProfile(email: string): Promise<void> {
    try {
      const user = await this.supabase.execute<User>(
        this.supabase.client
          .from('users')
          .select('*')
          .eq('email', email)
          .maybeSingle()
      );
      if (user) {
        localStorage.setItem(CACHE_KEY, JSON.stringify(user)); // camelCase cached
        this.currentUser.set(user);
      }
    } catch {
      this.clearSession();
    }
  }

  // ── Login ─────────────────────────────────────────────────────
  // signInWithPassword → creates Supabase Auth session → RLS JWT is valid
  // loadProfile        → fetches camelCase User via execute()
  login(email: string, password: string): Observable<User> {
    return from(
      this.supabase.client.auth
        .signInWithPassword({ email, password })
        .then(async ({ error }) => {
          if (error) throw new Error('Invalid credentials');
          await this.loadProfile(email);
          const user = this.currentUser();
          if (!user) throw new Error('Profile not found');
          return user;
        })
    ).pipe(
      tap(() => this.isReady.set(true))
    );
  }

  // ── Helpers ───────────────────────────────────────────────────
  getRole()      { return this.currentUser()?.role; }
  getBaseRoute() { return this.baseRouteMap[this.getRole()!]; }
  isLoggedIn()   { return !!this.currentUser(); }

  // ── Logout ────────────────────────────────────────────────────
  logout(): void {
    this.supabase.client.auth.signOut().then(() => {
      this.clearSession();
      this.router.navigate(['/']);
    });
  }

  private clearSession(): void {
    localStorage.removeItem(CACHE_KEY);
    this.currentUser.set(null);
  }
}