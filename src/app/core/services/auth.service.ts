// core/services/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { User } from '../../models/user';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base_url = 'http://localhost:3000';
  currentUser = signal<User | null>(null);
  baseRouteMap: any = {
    admin: 'adminLayout',
    doctor: 'doctorLayout',
    patient: 'patientLayout',
    receptionist: 'receptionistLayout',
  };
  baseRoute: string = '';
  getBaseRoute(): string {
    const role = this.getRole();
    return this.baseRouteMap[role!];
  }
  constructor(private _HttpClient: HttpClient) {
    this.restoreSession();
  }
  _Router = inject(Router);

  private generateFakeJWT(user: User): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(
      JSON.stringify({
        id: user.id,
        email: user.email,
        role: user.role,
        iat: Date.now(),
        exp: Date.now() + 1000 * 60 * 60 * 24,
      }),
    );
    const signature = btoa('fake-signature');
    return `${header}.${payload}.${signature}`;
  }

  decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    const decoded = this.decodeToken(token);
    return decoded ? Date.now() > decoded.exp : true;
  }

  private restoreSession(): void {
    const token = this.getToken();
    if (token && !this.isTokenExpired()) {
      const decoded = this.decodeToken(token);
      this._HttpClient
        .get<User>(`${this.base_url}/users/${decoded.id}`)
        .subscribe({ next: (user) => this.currentUser.set(user) });
    } else {
      this.logout();
    }
  }

  login(email: string, password: string): Observable<User> {
    return this._HttpClient
      .get<User[]>(`${this.base_url}/users?email=${email}&password=${password}`)
      .pipe(
        map((users) => {
          if (users.length === 0) throw new Error('Invalid credentials');
          return users[0];
        }),
        tap((user) => {
          const token = this.generateFakeJWT(user);
          localStorage.setItem('token', token);
          this.currentUser.set(user);
        }),
      );
  }

  register(newUser: User): Observable<User> {
    return this._HttpClient.post<User>(`${this.base_url}/users`, newUser).pipe(
      tap((user) => {
        const token = this.generateFakeJWT(user);
        localStorage.setItem('token', token);
        this.currentUser.set(user);
      }),
    );
  }
  getRole() {
    return this.currentUser()?.role;
  }

  logout(): void {
    console.log('logged out');
    this._Router.navigate(['/']);
    localStorage.removeItem('token');
    this.currentUser.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && !this.isTokenExpired();
  }
}
