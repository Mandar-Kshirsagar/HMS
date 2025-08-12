import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Appointment { id:number; patientId:string; doctorUserId:string; start:string; end:string; status:string; reason?:string; }

@Injectable({ providedIn: 'root' })
export class AppointmentsService {
  constructor(private http: HttpClient) {}
  doctorSchedule(doctorUserId: string, day?: Date) {
    let params = new HttpParams(); if (day) params = params.set('day', day.toISOString());
    return this.http.get<Appointment[]>(`${environment.apiUrl}/appointments/doctor/${doctorUserId}`, { params });
  }
  book(a: Omit<Appointment, 'id'>) { return this.http.post<Appointment>(`${environment.apiUrl}/appointments`, a); }
  reschedule(id: number, newStart: Date) { return this.http.put<void>(`${environment.apiUrl}/appointments/${id}/reschedule`, newStart.toISOString()); }
  cancel(id: number) { return this.http.put<void>(`${environment.apiUrl}/appointments/${id}/cancel`, {}); }
}


