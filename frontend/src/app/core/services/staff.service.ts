import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  userName: string;
  email: string;
  fullName: string;
  roles: string[];
}

export interface CreateUserRequest {
  username: string;
  email: string;
  fullName: string;
  password: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  private apiUrl = `${environment.apiUrl}/staff`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  createUser(user: CreateUserRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }

  getRoles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/roles`);
  }
}
