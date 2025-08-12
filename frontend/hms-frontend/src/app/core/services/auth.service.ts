import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface UserClaims { sub: string; unique_name?: string; fullName?: string; role?: string | string[]; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'hms_token';
  constructor(private http: HttpClient) {}
  login(username: string, password: string) {
    return this.http.post<{ token: string; roles: string[] }>(`${environment.apiUrl}/auth/login`, { username, password });
  }
  storeToken(token: string) { localStorage.setItem(this.tokenKey, token); }
  getToken(): string | null { return localStorage.getItem(this.tokenKey); }
  logout() { localStorage.removeItem(this.tokenKey); }
  getUser(): UserClaims | null {
    const token = this.getToken(); if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1])) as any;
      return {
        sub: payload['sub'],
        unique_name: payload['unique_name'],
        fullName: payload['fullName'],
        role: payload['role']
      } as UserClaims;
    } catch { return null; }
  }
  hasRole(required: string[]): boolean {
    const token = this.getToken(); if (!token) return false;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const roles = ([] as string[]).concat(payload['role'] || payload['roles'] || []);
    return required.some(r => roles.includes(r));
  }
  isAuthenticated(): boolean { return !!this.getToken(); }
}


