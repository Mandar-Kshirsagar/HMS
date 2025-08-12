import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface MedicalRecord { id:number; patientId:string; doctorUserId:string; visitDate:string; diagnosis:string; prescription:string; treatmentPlan:string; notes?:string; }

@Injectable({ providedIn: 'root' })
export class RecordsService {
  constructor(private http: HttpClient) {}
  list(patientId: string) { return this.http.get<MedicalRecord[]>(`${environment.apiUrl}/records/patient/${patientId}`); }
  add(r: Omit<MedicalRecord,'id'>) { return this.http.post<MedicalRecord>(`${environment.apiUrl}/records`, r); }
}


