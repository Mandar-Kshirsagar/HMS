import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface DocumentItem { id:number; patientId:string; fileName:string; filePath:string; contentType:string; uploadedAt:string; }

@Injectable({ providedIn: 'root' })
export class DocumentsService {
  constructor(private http: HttpClient) {}
  list(patientId: string) { return this.http.get<DocumentItem[]>(`${environment.apiUrl}/documents/patient/${patientId}`); }
  upload(patientId: string, file: File) {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<DocumentItem>(`${environment.apiUrl}/documents/upload/${patientId}`, form);
  }
}


