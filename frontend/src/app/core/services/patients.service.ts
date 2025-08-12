import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Patient { 
  id: string; 
  fullName: string; 
  dateOfBirth: Date; 
  gender: string; 
  contact: string; 
  address: string; 
}

export interface CreatePatient {
    fullName: string;
    dateOfBirth: Date;
    gender: string;
    contact: string;
    address: string;
}

@Injectable({ providedIn: 'root' })
export class PatientsService {
  constructor(private http: HttpClient) {}
  search(q?: string) {
    let params = new HttpParams(); if (q) params = params.set('q', q);
    return this.http.get<Patient[]>(`${environment.apiUrl}/patients`, { params });
  }
  get(id: string) { return this.http.get<Patient>(`${environment.apiUrl}/patients/${id}`); }
  create(p: CreatePatient) { return this.http.post<Patient>(`${environment.apiUrl}/patients`, p); }
  update(id: string, p: CreatePatient) { return this.http.put<void>(`${environment.apiUrl}/patients/${id}`, p); }
}



