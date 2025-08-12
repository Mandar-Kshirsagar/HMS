import { Component, OnInit } from '@angular/core';
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
    <div class="records-container">
      <!-- Header Section -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-title">
            <h1>Medical Records & Documents</h1>
            <p>Manage patient medical records and related documents</p>
          </div>
          <div class="header-actions">
            <button mat-raised-button color="primary" (click)="openNewRecordDialog()">
              <mat-icon>add</mat-icon>
              New Record
            </button>
          </div>
        </div>
      </div>

      <!-- Search and Patient Selection -->
      <mat-card class="search-card">
        <div class="search-content">
          <div class="search-section">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Patient ID or Name</mat-label>
              <input matInput placeholder="Enter patient ID or search by name..." [(ngModel)]="patientId" (keyup)="searchPatient()"/>
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
            
            <button mat-stroked-button (click)="load()" class="search-btn">
              <mat-icon>search</mat-icon>
              Load Records
            </button>
          </div>
          
          <div class="patient-info" *ngIf="patientId && patientInfo">
            <div class="patient-avatar">
              <mat-icon>person</mat-icon>
            </div>
            <div class="patient-details">
              <div class="patient-name">{{patientInfo.name}}</div>
              <div class="patient-meta">ID: {{patientId}} | Age: {{patientInfo.age}} | {{patientInfo.gender}}</div>
            </div>
          </div>
        </div>
      </mat-card>

      <!-- Records Overview -->
      <div class="overview-section" *ngIf="patientId">
        <div class="overview-card">
          <div class="overview-header">
            <mat-icon>medical_services</mat-icon>
            <h3>Medical Records Overview</h3>
          </div>
          <div class="overview-stats">
            <div class="stat-item">
              <div class="stat-number">{{records.length}}</div>
              <div class="stat-label">Total Records</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{getRecentRecords()}}</div>
              <div class="stat-label">Last 30 Days</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{docs.length}}</div>
              <div class="stat-label">Documents</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{getActiveConditions()}}</div>
              <div class="stat-label">Active Conditions</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="content-grid" *ngIf="patientId">
        <!-- Medical Records Section -->
        <div class="records-section">
          <mat-card class="records-card">
            <div class="card-header">
              <h3>Medical Records</h3>
              <div class="card-actions">
                <button mat-stroked-button (click)="exportRecords()">
                  <mat-icon>download</mat-icon>
                  Export
                </button>
                <button mat-stroked-button (click)="refreshRecords()">
                  <mat-icon>refresh</mat-icon>
                  Refresh
                </button>
              </div>
            </div>
            
            <!-- Add New Record Form -->
            <div class="add-record-form">
              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Diagnosis</mat-label>
                  <input matInput placeholder="Enter diagnosis..." [(ngModel)]="newRecord.diagnosis"/>
                </mat-form-field>
                
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Prescription</mat-label>
                  <input matInput placeholder="Enter prescription..." [(ngModel)]="newRecord.prescription"/>
                </mat-form-field>
              </div>
              
              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Treatment Plan</mat-label>
                  <textarea matInput placeholder="Enter treatment plan..." [(ngModel)]="newRecord.treatmentPlan" rows="3"></textarea>
                </mat-form-field>
                
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Notes</mat-label>
                  <textarea matInput placeholder="Additional notes..." [(ngModel)]="newRecord.notes" rows="3"></textarea>
                </mat-form-field>
              </div>
              
              <div class="form-actions">
                <button mat-raised-button color="primary" (click)="addRecord()" [disabled]="!isFormValid()">
                  <mat-icon>add</mat-icon>
                  Add Medical Record
                </button>
                <button mat-stroked-button (click)="clearForm()">
                  <mat-icon>clear</mat-icon>
                  Clear
                </button>
              </div>
            </div>
            
            <!-- Records Table -->
            <div class="table-container">
              <table mat-table [dataSource]="records" class="records-table">
                <!-- Date Column -->
                <ng-container matColumnDef="visitDate">
                  <th mat-header-cell *matHeaderCellDef>Visit Date</th>
                  <td mat-cell *matCellDef="let r">
                    <div class="date-info">
                      <div class="visit-date">{{r.visitDate | date:'shortDate'}}</div>
                      <div class="visit-time">{{r.visitDate | date:'shortTime'}}</div>
                    </div>
                  </td>
                </ng-container>

                <!-- Diagnosis Column -->
                <ng-container matColumnDef="diagnosis">
                  <th mat-header-cell *matHeaderCellDef>Diagnosis</th>
                  <td mat-cell *matCellDef="let r">
                    <div class="diagnosis-info">
                      <div class="diagnosis-text">{{r.diagnosis}}</div>
                      <div class="diagnosis-category">{{getDiagnosisCategory(r.diagnosis)}}</div>
                    </div>
                  </td>
                </ng-container>

                <!-- Prescription Column -->
                <ng-container matColumnDef="prescription">
                  <th mat-header-cell *matHeaderCellDef>Prescription</th>
                  <td mat-cell *matCellDef="let r">
                    <div class="prescription-info">
                      <div class="prescription-text">{{r.prescription}}</div>
                      <div class="prescription-status">{{getPrescriptionStatus(r)}}</div>
                    </div>
                  </td>
                </ng-container>

                <!-- Treatment Column -->
                <ng-container matColumnDef="treatment">
                  <th mat-header-cell *matHeaderCellDef>Treatment</th>
                  <td mat-cell *matCellDef="let r">
                    <div class="treatment-info">
                      <div class="treatment-text">{{r.treatmentPlan}}</div>
                      <div class="treatment-progress">{{getTreatmentProgress(r)}}</div>
                    </div>
                  </td>
                </ng-container>

                <!-- Actions Column -->
                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Actions</th>
                  <td mat-cell *matCellDef="let r">
                    <div class="action-buttons">
                      <button mat-icon-button [matMenuTriggerFor]="recordMenu" class="action-menu-btn">
                        <mat-icon>more_vert</mat-icon>
                      </button>
                      <mat-menu #recordMenu="matMenu">
                        <button mat-menu-item (click)="editRecord(r)">
                          <mat-icon>edit</mat-icon>
                          <span>Edit Record</span>
                        </button>
                        <button mat-menu-item (click)="viewRecord(r)">
                          <mat-icon>visibility</mat-icon>
                          <span>View Details</span>
                        </button>
                        <button mat-menu-item (click)="printRecord(r)">
                          <mat-icon>print</mat-icon>
                          <span>Print</span>
                        </button>
                        <mat-divider></mat-divider>
                        <button mat-menu-item (click)="deleteRecord(r.id)" class="danger-action">
                          <mat-icon>delete</mat-icon>
                          <span>Delete</span>
                        </button>
                      </mat-menu>
                    </div>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="recordsDisplayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: recordsDisplayedColumns;" 
                    class="record-row"
                    [class.recent]="isRecentRecord(row)"
                    [class.urgent]="isUrgentRecord(row)"></tr>
              </table>
            </div>

            <!-- Empty State -->
            <div class="empty-state" *ngIf="records.length === 0">
              <mat-icon class="empty-icon">description</mat-icon>
              <h3>No medical records found</h3>
              <p>Start by adding the first medical record for this patient</p>
            </div>
          </mat-card>
        </div>

        <!-- Documents Section -->
        <div class="documents-section">
          <mat-card class="documents-card">
            <div class="card-header">
              <h3>Documents & Files</h3>
              <div class="card-actions">
                <button mat-stroked-button (click)="refreshDocuments()">
                  <mat-icon>refresh</mat-icon>
                  Refresh
                </button>
              </div>
            </div>
            
            <!-- Upload Section -->
            <div class="upload-section">
              <div class="upload-area" (click)="triggerFileInput()" [class.dragover]="isDragOver">
                <mat-icon class="upload-icon">cloud_upload</mat-icon>
                <div class="upload-text">
                  <span class="upload-title">Drop files here or click to upload</span>
                  <span class="upload-subtitle">Supports PDF, images, and documents</span>
                </div>
                <input #fileInput type="file" (change)="onFile($event)" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" style="display: none;">
              </div>
              
              <div class="upload-actions" *ngIf="selectedFiles.length > 0">
                <div class="selected-files">
                  <div class="file-item" *ngFor="let file of selectedFiles; let i = index">
                    <mat-icon class="file-icon">description</mat-icon>
                    <span class="file-name">{{file.name}}</span>
                    <button mat-icon-button (click)="removeFile(i)" class="remove-file-btn">
                      <mat-icon>close</mat-icon>
                    </button>
                  </div>
                </div>
                <button mat-raised-button color="primary" (click)="uploadFiles()" [disabled]="uploading">
                  <mat-icon>upload</mat-icon>
                  {{uploading ? 'Uploading...' : 'Upload Files'}}
                </button>
              </div>
            </div>
            
            <!-- Documents Table -->
            <div class="table-container">
              <table mat-table [dataSource]="docs" class="documents-table">
                <!-- File Icon & Name Column -->
                <ng-container matColumnDef="fileInfo">
                  <th mat-header-cell *matHeaderCellDef>Document</th>
                  <td mat-cell *matCellDef="let d">
                    <div class="file-info">
                      <div class="file-icon" [class]="getFileTypeClass(d.contentType)">
                        <mat-icon>{{getFileIcon(d.contentType)}}</mat-icon>
                      </div>
                      <div class="file-details">
                        <div class="file-name">{{d.fileName}}</div>
                        <div class="file-meta">{{d.contentType}} • {{getFileSize(d)}}</div>
                      </div>
                    </div>
                  </td>
                </ng-container>

                <!-- Upload Date Column -->
                <ng-container matColumnDef="uploadedAt">
                  <th mat-header-cell *matHeaderCellDef>Uploaded</th>
                  <td mat-cell *matCellDef="let d">
                    <div class="upload-info">
                      <div class="upload-date">{{d.uploadedAt | date:'shortDate'}}</div>
                      <div class="upload-time">{{d.uploadedAt | date:'shortTime'}}</div>
                    </div>
                  </td>
                </ng-container>

                <!-- Actions Column -->
                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Actions</th>
                  <td mat-cell *matCellDef="let d">
                    <div class="action-buttons">
                      <button mat-icon-button [matMenuTriggerFor]="docMenu" class="action-menu-btn">
                        <mat-icon>more_vert</mat-icon>
                      </button>
                      <mat-menu #docMenu="matMenu">
                        <a mat-menu-item [href]="d.filePath" target="_blank">
                          <mat-icon>open_in_new</mat-icon>
                          <span>Open</span>
                        </a>
                        <button mat-menu-item (click)="downloadDocument(d)">
                          <mat-icon>download</mat-icon>
                          <span>Download</span>
                        </button>
                        <button mat-menu-item (click)="shareDocument(d)">
                          <mat-icon>share</mat-icon>
                          <span>Share</span>
                        </button>
                        <mat-divider></mat-divider>
                        <button mat-menu-item (click)="deleteDocument(d.id)" class="danger-action">
                          <mat-icon>delete</mat-icon>
                          <span>Delete</span>
                        </button>
                      </mat-menu>
                    </div>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="docsDisplayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: docsDisplayedColumns;" class="document-row"></tr>
              </table>
            </div>

            <!-- Empty State -->
            <div class="empty-state" *ngIf="docs.length === 0">
              <mat-icon class="empty-icon">folder_open</mat-icon>
              <h3>No documents uploaded</h3>
              <p>Upload patient documents, test results, or medical reports</p>
            </div>
          </mat-card>
        </div>
      </div>

      <!-- No Patient Selected State -->
      <div class="no-patient-state" *ngIf="!patientId">
        <mat-icon class="state-icon">person_search</mat-icon>
        <h3>Select a Patient</h3>
        <p>Enter a patient ID or search by name to view their medical records and documents</p>
      </div>
    </div>
    `,
  styles: [`
    .records-container {
      padding: 0;
    }

    .page-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 32px;
      border-radius: 16px;
      margin-bottom: 24px;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-title h1 {
      margin: 0 0 8px 0;
      font-size: 2rem;
      font-weight: 600;
    }

    .header-title p {
      margin: 0;
      opacity: 0.9;
      font-size: 1.1rem;
    }

    .search-card {
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      margin-bottom: 24px;
    }

    .search-content {
      padding: 24px;
    }

    .search-section {
      display: flex;
      gap: 16px;
      align-items: center;
      margin-bottom: 20px;
    }

    .search-field {
      flex: 1;
      max-width: 400px;
    }

    .search-btn {
      height: 56px;
      padding: 0 24px;
    }

    .patient-info {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: #f8fafc;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
    }

    .patient-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea, #764ba2);
      display: flex;
      align-items: center;
      justify-content: center;
      
      mat-icon {
        color: white;
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
    }

    .patient-details .patient-name {
      font-weight: 600;
      color: #1f2937;
      font-size: 1.1rem;
    }

    .patient-details .patient-meta {
      color: #6b7280;
      font-size: 0.875rem;
      margin-top: 4px;
    }

    .overview-section {
      margin-bottom: 24px;
    }

    .overview-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .overview-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
      
      mat-icon {
        color: #667eea;
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
      
      h3 {
        margin: 0;
        color: #1f2937;
        font-weight: 600;
      }
    }

    .overview-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 20px;
    }

    .stat-item {
      text-align: center;
      padding: 16px;
      background: #f8fafc;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      
      .stat-number {
        font-size: 1.5rem;
        font-weight: 700;
        color: #667eea;
        line-height: 1;
      }
      
      .stat-label {
        color: #6b7280;
        font-size: 0.875rem;
        margin-top: 8px;
      }
    }

    .content-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
    }

    .records-card, .documents-card {
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 24px 0;
      margin-bottom: 16px;
      
      h3 {
        margin: 0;
        color: #1f2937;
        font-weight: 600;
      }
    }

    .card-actions {
      display: flex;
      gap: 12px;
    }

    .add-record-form {
      padding: 0 24px 24px;
      border-bottom: 1px solid #e5e7eb;
      margin-bottom: 24px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }

    .form-field {
      width: 100%;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .records-table, .documents-table {
      width: 100%;
      
      .mat-mdc-header-cell {
        background: #f8fafc;
        color: #374151;
        font-weight: 600;
        padding: 16px;
        border-bottom: 2px solid #e5e7eb;
      }
      
      .mat-mdc-cell {
        padding: 16px;
        border-bottom: 1px solid #f3f4f6;
      }
    }

    .record-row {
      transition: background-color 0.2s ease;
      
      &:hover {
        background-color: #f8fafc;
      }
      
      &.recent {
        background-color: #f0fdf4;
        border-left: 4px solid #10b981;
      }
      
      &.urgent {
        background-color: #fef2f2;
        border-left: 4px solid #ef4444;
      }
    }

    .date-info .visit-date {
      font-weight: 500;
      color: #1f2937;
    }

    .date-info .visit-time {
      font-size: 0.875rem;
      color: #6b7280;
      margin-top: 2px;
    }

    .diagnosis-info .diagnosis-text {
      font-weight: 500;
      color: #1f2937;
    }

    .diagnosis-info .diagnosis-category {
      font-size: 0.75rem;
      color: #667eea;
      background: #dbeafe;
      padding: 2px 8px;
      border-radius: 12px;
      display: inline-block;
      margin-top: 4px;
    }

    .prescription-info .prescription-text {
      font-weight: 500;
      color: #1f2937;
    }

    .prescription-info .prescription-status {
      font-size: 0.75rem;
      color: #10b981;
      background: #dcfce7;
      padding: 2px 8px;
      border-radius: 12px;
      display: inline-block;
      margin-top: 4px;
    }

    .treatment-info .treatment-text {
      font-weight: 500;
      color: #1f2937;
    }

    .treatment-info .treatment-progress {
      font-size: 0.75rem;
      color: #f59e0b;
      background: #fef3c7;
      padding: 2px 8px;
      border-radius: 12px;
      display: inline-block;
      margin-top: 4px;
    }

    .upload-section {
      padding: 0 24px 24px;
      border-bottom: 1px solid #e5e7eb;
      margin-bottom: 24px;
    }

    .upload-area {
      border: 2px dashed #d1d5db;
      border-radius: 12px;
      padding: 32px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        border-color: #667eea;
        background: #f8fafc;
      }
      
      &.dragover {
        border-color: #667eea;
        background: #dbeafe;
      }
    }

    .upload-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #9ca3af;
      margin-bottom: 16px;
    }

    .upload-title {
      display: block;
      font-weight: 600;
      color: #374151;
      margin-bottom: 8px;
    }

    .upload-subtitle {
      color: #6b7280;
      font-size: 0.875rem;
    }

    .upload-actions {
      margin-top: 20px;
    }

    .selected-files {
      margin-bottom: 16px;
    }

    .file-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
      background: #f8fafc;
      border-radius: 8px;
      margin-bottom: 8px;
      
      .file-icon {
        color: #6b7280;
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
      
      .file-name {
        flex: 1;
        font-size: 0.875rem;
        color: #374151;
      }
      
      .remove-file-btn {
        color: #ef4444;
      }
    }

    .file-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .file-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &.pdf { background: #fee2e2; }
      &.doc { background: #dbeafe; }
      &.image { background: #dcfce7; }
      &.other { background: #f3f4f6; }
      
      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
        
        &.pdf { color: #dc2626; }
        &.doc { color: #2563eb; }
        &.image { color: #16a34a; }
        &.other { color: #6b7280; }
      }
    }

    .file-details .file-name {
      font-weight: 500;
      color: #1f2937;
    }

    .file-details .file-meta {
      font-size: 0.875rem;
      color: #6b7280;
      margin-top: 2px;
    }

    .upload-info .upload-date {
      font-weight: 500;
      color: #1f2937;
    }

    .upload-info .upload-time {
      font-size: 0.875rem;
      color: #6b7280;
      margin-top: 2px;
    }

    .action-buttons {
      display: flex;
      justify-content: center;
    }

    .action-menu-btn {
      color: #6b7280;
    }

    .danger-action {
      color: #dc2626;
    }

    .empty-state {
      text-align: center;
      padding: 48px 24px;
      
      .empty-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: #d1d5db;
        margin-bottom: 16px;
      }
      
      h3 {
        color: #374151;
        margin: 0 0 8px 0;
        font-weight: 600;
      }
      
      p {
        color: #6b7280;
        margin: 0;
      }
    }

    .no-patient-state {
      text-align: center;
      padding: 80px 24px;
      
      .state-icon {
        font-size: 80px;
        width: 80px;
        height: 80px;
        color: #d1d5db;
        margin-bottom: 24px;
      }
      
      h3 {
        color: #374151;
        margin: 0 0 16px 0;
        font-weight: 600;
        font-size: 1.5rem;
      }
      
      p {
        color: #6b7280;
        font-size: 1.1rem;
        max-width: 500px;
        margin: 0 auto;
      }
    }

    @media (max-width: 1024px) {
      .header-content {
        flex-direction: column;
        gap: 20px;
        text-align: center;
      }
      
      .content-grid {
        grid-template-columns: 1fr;
      }
      
      .overview-stats {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .search-section {
        flex-direction: column;
        align-items: stretch;
      }
      
      .search-field {
        max-width: none;
      }
      
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .overview-stats {
        grid-template-columns: 1fr;
      }
      
      .card-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }
    }
  `]
})
export class RecordsComponent implements OnInit {
  patientId = '';
  records: MedicalRecord[] = [];
  docs: DocumentItem[] = [];
  selectedFiles: File[] = [];
  uploading = false;
  isDragOver = false;
  newRecord: Partial<MedicalRecord> = { 
    diagnosis: '', 
    prescription: '', 
    treatmentPlan: '', 
    notes: '' 
  };
  recordsDisplayedColumns = ['visitDate', 'diagnosis', 'prescription', 'treatment', 'actions'];
  docsDisplayedColumns = ['fileInfo', 'uploadedAt', 'actions'];
  
  // Mock patient info
  patientInfo: any = null;
  
  constructor(private rs: RecordsService, private ds: DocumentsService) {}
  
  ngOnInit() {}
  
  searchPatient() {
    if (this.patientId) {
      // Mock patient info - in real app this would come from patient service
      this.patientInfo = {
        name: 'John Doe',
        age: 35,
        gender: 'Male'
      };
    }
  }
  
  load() {
    if (!this.patientId) return;
    this.rs.list(this.patientId).subscribe(r => this.records = r);
    this.ds.list(this.patientId).subscribe(d => this.docs = d);
  }
  
  isFormValid(): boolean {
    return !!(this.newRecord.diagnosis && this.newRecord.prescription);
  }
  
  addRecord() {
    if (!this.isFormValid()) return;
    
    const r: any = { 
      ...this.newRecord, 
      patientId: this.patientId, 
      doctorUserId: 'drsmith', 
      visitDate: new Date().toISOString() 
    };
    
    this.rs.add(r).subscribe(() => { 
      this.clearForm(); 
      this.load(); 
    });
  }
  
  clearForm() {
    this.newRecord = { diagnosis: '', prescription: '', treatmentPlan: '', notes: '' };
  }
  
  getRecentRecords(): number {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return this.records.filter(r => new Date(r.visitDate) >= thirtyDaysAgo).length;
  }
  
  getActiveConditions(): number {
    return this.records.filter(r => r.diagnosis?.toLowerCase().includes('chronic') || 
                                   r.diagnosis?.toLowerCase().includes('ongoing')).length;
  }
  
  getDiagnosisCategory(diagnosis: string): string {
    if (diagnosis?.toLowerCase().includes('cardiac')) return 'Cardiology';
    if (diagnosis?.toLowerCase().includes('bone') || diagnosis?.toLowerCase().includes('joint')) return 'Orthopedics';
    if (diagnosis?.toLowerCase().includes('brain') || diagnosis?.toLowerCase().includes('nerve')) return 'Neurology';
    if (diagnosis?.toLowerCase().includes('child')) return 'Pediatrics';
    return 'General';
  }
  
  getPrescriptionStatus(record: MedicalRecord): string {
    // Mock status logic
    return 'Active';
  }
  
  getTreatmentProgress(record: MedicalRecord): string {
    // Mock progress logic
    return 'In Progress';
  }
  
  isRecentRecord(record: MedicalRecord): boolean {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return new Date(record.visitDate) >= sevenDaysAgo;
  }
  
  isUrgentRecord(record: MedicalRecord): boolean {
    return record.diagnosis?.toLowerCase().includes('emergency') || 
           record.diagnosis?.toLowerCase().includes('urgent') || false;
  }
  
  // File handling methods
  triggerFileInput() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput?.click();
  }
  
  onFile(event: any) {
    const files = Array.from(event.target.files) as File[];
    this.selectedFiles = [...this.selectedFiles, ...files];
  }
  
  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }
  
  uploadFiles() {
    if (this.selectedFiles.length === 0) return;
    
    this.uploading = true;
    // Mock upload - in real app this would call the service
    setTimeout(() => {
      this.selectedFiles = [];
      this.uploading = false;
      this.load();
    }, 2000);
  }
  
  getFileTypeClass(contentType: string): string {
    if (contentType.includes('pdf')) return 'pdf';
    if (contentType.includes('word') || contentType.includes('document')) return 'doc';
    if (contentType.includes('image')) return 'image';
    return 'other';
  }
  
  getFileIcon(contentType: string): string {
    if (contentType.includes('pdf')) return 'picture_as_pdf';
    if (contentType.includes('word') || contentType.includes('document')) return 'description';
    if (contentType.includes('image')) return 'image';
    return 'insert_drive_file';
  }
  
  getFileSize(doc: DocumentItem): string {
    // Mock file size - in real app this would come from the document data
    return '2.5 MB';
  }
  
  // Action methods
  openNewRecordDialog() {
    console.log('Opening new record dialog...');
  }
  
  editRecord(record: MedicalRecord) {
    console.log('Editing record:', record);
  }
  
  viewRecord(record: MedicalRecord) {
    console.log('Viewing record:', record);
  }
  
  printRecord(record: MedicalRecord) {
    console.log('Printing record:', record);
  }
  
  deleteRecord(id: number) {
    console.log('Deleting record:', id);
  }
  
  downloadDocument(doc: DocumentItem) {
    console.log('Downloading document:', doc);
  }
  
  shareDocument(doc: DocumentItem) {
    console.log('Sharing document:', doc);
  }
  
  deleteDocument(id: number) {
    console.log('Deleting document:', id);
  }
  
  exportRecords() {
    console.log('Exporting records...');
  }
  
  refreshRecords() {
    this.load();
  }
  
  refreshDocuments() {
    this.load();
  }
}


