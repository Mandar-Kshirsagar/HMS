import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecordsService, MedicalRecord } from '../../core/services/records.service';
import { DocumentsService, DocumentItem } from '../../core/services/documents.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="card">
    <div class="card-header"><div class="title">EMR & Documents</div></div>
    <div class="toolbar">
      <input class="input" placeholder="Patient Id" [(ngModel)]="patientId"/>
      <button class="btn" (click)="load()">Load</button>
    </div>
    <div class="grid cols-2" *ngIf="patientId">
      <div>
        <div class="title" style="margin-bottom:8px;">Records</div>
        <div class="toolbar">
          <input class="input" placeholder="Diagnosis" [(ngModel)]="newRecord.diagnosis"/>
          <input class="input" placeholder="Prescription" [(ngModel)]="newRecord.prescription"/>
        </div>
        <div class="toolbar">
          <input class="input" placeholder="Treatment" [(ngModel)]="newRecord.treatmentPlan"/>
          <button class="btn btn-primary" (click)="addRecord()">Add</button>
        </div>
        <table>
          <thead><tr><th>Date</th><th>Diagnosis</th><th>Prescription</th></tr></thead>
          <tbody>
            <tr *ngFor="let r of records">
              <td>{{r.visitDate | date:'short'}}</td>
              <td>{{r.diagnosis}}</td>
              <td>{{r.prescription}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <div class="title" style="margin-bottom:8px;">Documents</div>
        <div class="toolbar">
          <input type="file" (change)="onFile($event)"/>
          <button class="btn" [disabled]="!file" (click)="upload()">Upload</button>
        </div>
        <table>
          <thead><tr><th>Name</th><th>Type</th><th>When</th><th></th></tr></thead>
          <tbody>
            <tr *ngFor="let d of docs">
              <td>{{d.fileName}}</td><td>{{d.contentType}}</td><td>{{d.uploadedAt | date:'short'}}</td>
              <td><a class="btn" [href]="d.filePath" target="_blank">Open</a></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>`
})
export class RecordsComponent {
  patientId = '';
  records: MedicalRecord[] = [];
  docs: DocumentItem[] = [];
  file?: File;
  newRecord: Partial<MedicalRecord> = { diagnosis: '', prescription: '', treatmentPlan: '' };
  constructor(private rs: RecordsService, private ds: DocumentsService) {}
  load() {
    if (!this.patientId) return;
    this.rs.list(this.patientId).subscribe(r => this.records = r);
    this.ds.list(this.patientId).subscribe(d => this.docs = d);
  }
  onFile(e: any) { this.file = e.target.files?.[0]; }
  upload() { if (this.file) this.ds.upload(this.patientId, this.file).subscribe(() => this.load()); }
  addRecord() {
    const r: any = { ...this.newRecord, patientId: this.patientId, doctorUserId: 'drsmith', visitDate: new Date().toISOString() };
    this.rs.add(r).subscribe(() => { this.newRecord = { diagnosis: '', prescription: '', treatmentPlan: '' }; this.load(); });
  }
}


