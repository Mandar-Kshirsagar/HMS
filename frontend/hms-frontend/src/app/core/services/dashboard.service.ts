import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private http: HttpClient) {}
  summary() { return this.http.get<{ totalPatients:number; totalDoctors:number; appointmentsToday:number }>(`${environment.apiUrl}/dashboard/summary`); }
  monthly(year: number) { return this.http.get<{ month:number; visits:number }[]>(`${environment.apiUrl}/dashboard/visits-monthly?year=${year}`); }
}


