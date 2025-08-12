import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../shared/material/material.module';
import { RecordsService, MedicalRecord } from '../../core/services/records.service';
import { DocumentsService, DocumentItem } from '../../core/services/documents.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MaterialModule],
  template: `
  <mat-card>
    <div class="card-header"><div class="title">EMR & Documents</div></div>
    <div class="toolbar">
      <mat-form-field appearance="outline">
        <mat-label>Patient ID</mat-label>
        <input matInput placeholder="Patient Id" [(ngModel)]="patientId"/>
      </mat-form-field>
      <button mat-raised-button color="primary" (click)="load()">Load</button>
    </div>
    <div class="grid cols-2" *ngIf="patientId">
      <div>
        <div class="title" style="margin-bottom:8px;">Records</div>
        <div class="toolbar">
          <mat-form-field appearance="outline">
            <mat-label>Diagnosis</mat-label>
            <input matInput placeholder="Diagnosis" [(ngModel)]="newRecord.diagnosis"/>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Prescription</mat-label>
            <input matInput placeholder="Prescription" [(ngModel)]="newRecord.prescription"/>
          </mat-form-field>
        </div>
        <div class="toolbar">
          <mat-form-field appearance="outline">
            <mat-label>Treatment</mat-label>
            <input matInput placeholder="Treatment" [(ngModel)]="newRecord.treatmentPlan"/>
          </mat-form-field>
          <button mat-raised-button color="primary" (click)="addRecord()">Add</button>
        </div>
        <table mat-table [dataSource]="records" class="mat-elevation-z1">
          <ng-container matColumnDef="visitDate">
            <th mat-header-cell *matHeaderCellDef>Date</th>
            <td mat-cell *matCellDef="let r">{{r.visitDate | date:'short'}}</td>
          </ng-container>
          <ng-container matColumnDef="diagnosis">
            <th mat-header-cell *matHeaderCellDef>Diagnosis</th>
            <td mat-cell *matCellDef="let r">{{r.diagnosis}}</td>
          </ng-container>
          <ng-container matColumnDef="prescription">
            <th mat-header-cell *matHeaderCellDef>Prescription</th>
            <td mat-cell *matCellDef="let r">{{r.prescription}}</td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="recordsDisplayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: recordsDisplayedColumns;"></tr>
        </table>
      </div>
      <div>
        <div class="title" style="margin-bottom:8px;">Documents</div>
        <div class="toolbar">
          <input type="file" (change)="onFile($event)"/>
          <button mat-raised-button [disabled]="!file" (click)="upload()">Upload</button>
        </div>
        <table mat-table [dataSource]="docs" class="mat-elevation-z1">
          <ng-container matColumnDef="fileName">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let d">{{d.fileName}}</td>
          </ng-container>
          <ng-container matColumnDef="contentType">
            <th mat-header-cell *matHeaderCellDef>Type</th>
            <td mat-cell *matCellDef="let d">{{d.contentType}}</td>
          </ng-container>
          <ng-container matColumnDef="uploadedAt">
            <th mat-header-cell *matHeaderCellDef>When</th>
            <td mat-cell *matCellDef="let d">{{d.uploadedAt | date:'short'}}</td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let d"><a mat-button [href]="d.filePath" target="_blank">Open</a></td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="docsDisplayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: docsDisplayedColumns;"></tr>
        </table>
      </div>
    </div>
  </mat-card>`
})
export class RecordsComponent {
  patientId = '';
  records: MedicalRecord[] = [];
  docs: DocumentItem[] = [];
  file?: File;
  newRecord: Partial<MedicalRecord> = { diagnosis: '', prescription: '', treatmentPlan: '' };
  recordsDisplayedColumns = ['visitDate', 'diagnosis', 'prescription'];
  docsDisplayedColumns = ['fileName', 'contentType', 'uploadedAt', 'actions'];
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


