// auth.service.ts — DEV PHASE (queries Supabase users table, keeps fake JWT)
import { Injectable, inject, signal } from '@angular/core';
import { Observable, from, map, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private supabase = inject(SupabaseService);
  private _Router  = inject(Router);

  currentUser = signal<User | null>(null);

  baseRouteMap: any = {
    admin:         'adminLayout',
    doctor:        'doctorLayout',
    patient:       'patientLayout',
    receptionist:  'receptionistLayout',
  };

  getBaseRoute(): string {
    return this.baseRouteMap[this.getRole()!];
  }

  constructor() {
    this.restoreSession();
  }

  // ── Fake JWT (Phase 2 only — replaced in Phase 3) ────────────
  private generateFakeJWT(user: User): string {
    const header  = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      id:   user.id,
      email: user.email,
      role:  user.role,
      iat:  Date.now(),
      exp:  Date.now() + 1000 * 60 * 60 * 24,
    }));
    return `${header}.${btoa('fake-signature')}`;
  }

  decodeToken(token: string): any {
    try { return JSON.parse(atob(token.split('.')[1])); }
    catch { return null; }
  }

  isTokenExpired(): boolean {
    const decoded = this.decodeToken(this.getToken() ?? '');
    return decoded ? Date.now() > decoded.exp : true;
  }

  private restoreSession(): void {
    const stored = localStorage.getItem('currentUser');
    if (stored && !this.isTokenExpired()) {
      this.currentUser.set(JSON.parse(stored));
    } else {
      this.logout();
    }
  }

  // ── Login — queries Supabase users table ──────────────────────
  login(email: string, password: string): Observable<User> {
    return from(
      this.supabase.client
        .from('users')
        .select('*')
        .eq('email', email)
        // NOTE: plain-text password check — fine for dev phase only
        // Phase 3 replaces this with supabase.auth.signInWithPassword()
        .eq('password', password)
        .single()
        .then(({ data, error }) => {
          if (error) throw new Error('Invalid credentials');
          return {
            ...data,
            fullName: data.full_name,
          } as User;
        })
    ).pipe(
      tap((user) => {
        const token = this.generateFakeJWT(user);
        localStorage.setItem('token', token);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUser.set(user);
      })
    );
  }

  getRole()    { return this.currentUser()?.role; }
  getToken()   { return localStorage.getItem('token'); }
  isLoggedIn() { return !!this.getToken() && !this.isTokenExpired(); }

  logout(): void {
    this._Router.navigate(['/']);
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUser.set(null);
  }
}