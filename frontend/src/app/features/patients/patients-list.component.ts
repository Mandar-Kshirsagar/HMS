import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../shared/material/material.module';
import { PatientsService, Patient } from '../../core/services/patients.service';

@Component({
  selector: 'app-patients-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MaterialModule],
  template: `
    <div class="patients-container">
      <!-- Header Section -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-title">
            <h1>Patient Management</h1>
            <p>Manage and view all patient information</p>
          </div>
          <div class="header-actions">
            <button mat-raised-button color="primary" routerLink="/patients/new" class="add-patient-btn">
              <mat-icon>person_add</mat-icon>
              Add New Patient
            </button>
          </div>
        </div>
      </div>

      <!-- Search and Filters -->
      <mat-card class="search-card">
        <div class="search-content">
          <div class="search-section">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Search Patients</mat-label>
              <input matInput placeholder="Search by name, ID, or phone..." [(ngModel)]="q" (keyup)="load()"/>
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
            
            <button mat-stroked-button (click)="load()" class="search-btn">
              <mat-icon>search</mat-icon>
              Search
            </button>
          </div>
        </div>
      </mat-card>

      <!-- Patients Table -->
      <mat-card class="table-card">
        <div class="table-header">
          <h3>Patient List</h3>
          <div class="table-actions">
            <button mat-stroked-button (click)="exportData()">
              <mat-icon>download</mat-icon>
              Export
            </button>
            <button mat-stroked-button (click)="refreshData()">
              <mat-icon>refresh</mat-icon>
              Refresh
            </button>
          </div>
        </div>
        
        <div class="table-container">
          <table mat-table [dataSource]="patients" class="patients-table">
            <!-- Patient ID Column -->
            <ng-container matColumnDef="patientId">
              <th mat-header-cell *matHeaderCellDef>Patient ID</th>
              <td mat-cell *matCellDef="let p">{{p.id}}</td>
            </ng-container>

            <!-- Avatar & Name Column -->
            <ng-container matColumnDef="avatarName">
              <th mat-header-cell *matHeaderCellDef>Patient</th>
              <td mat-cell *matCellDef="let p">
                <div class="patient-info">
                  <div class="patient-avatar">
                    <mat-icon>person</mat-icon>
                  </div>
                  <div class="patient-details">
                    <div class="patient-name">{{p.fullName}}</div>
                    <div class="patient-email">{{p.email || 'No email'}}</div>
                  </div>
                </div>
              </td>
            </ng-container>

            <!-- Contact Column -->
            <ng-container matColumnDef="contact">
              <th mat-header-cell *matHeaderCellDef>Contact</th>
              <td mat-cell *matCellDef="let p">{{p.contact}}</td>
            </ng-container>

            <!-- DOB & Age Column -->
            <ng-container matColumnDef="dobAge">
              <th mat-header-cell *matHeaderCellDef>Age</th>
              <td mat-cell *matCellDef="let p">
                <div class="age-info">
                  <div class="dob">{{p.dateOfBirth | date}}</div>
                  <div class="age">{{calculateAge(p.dateOfBirth)}} years</div>
                </div>
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let p">
                <div class="action-buttons">
                  <button mat-icon-button [matMenuTriggerFor]="actionMenu" class="action-menu-btn">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #actionMenu="matMenu">
                    <button mat-menu-item [routerLink]="['/patients', p.id, 'edit']">
                      <mat-icon>edit</mat-icon>
                      <span>Edit Patient</span>
                    </button>
                    <button mat-menu-item [routerLink]="['/patients', p.id]">
                      <mat-icon>visibility</mat-icon>
                      <span>View Details</span>
                    </button>
                    <button mat-menu-item>
                      <mat-icon>event</mat-icon>
                      <span>Schedule Appointment</span>
                    </button>
                    <button mat-menu-item>
                      <mat-icon>description</mat-icon>
                      <span>Medical Records</span>
                    </button>
                    <mat-divider></mat-divider>
                    <button mat-menu-item class="danger-action">
                      <mat-icon>delete</mat-icon>
                      <span>Delete Patient</span>
                    </button>
                  </mat-menu>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                class="patient-row" 
                [routerLink]="['/patients', row.id]"
                style="cursor: pointer;"></tr>
          </table>
        </div>

        <!-- Empty State -->
        <div class="empty-state" *ngIf="patients.length === 0">
          <mat-icon class="empty-icon">people_outline</mat-icon>
          <h3>No patients found</h3>
          <p>Try adjusting your search criteria or add a new patient</p>
          <button mat-raised-button color="primary" routerLink="/patients/new">
            <mat-icon>person_add</mat-icon>
            Add First Patient
          </button>
        </div>

        <!-- Pagination -->
        <mat-paginator [length]="totalPatients" 
                      [pageSize]="pageSize" 
                      [pageSizeOptions]="[10, 25, 50, 100]"
                      (page)="onPageChange($event)"
                      class="pagination">
        </mat-paginator>
      </mat-card>
    </div>
  `,
  styles: [`
    .patients-container {
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

    .add-patient-btn {
      height: 48px;
      padding: 0 24px;
      font-weight: 500;
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

    .table-card {
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .table-header {
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

    .table-actions {
      display: flex;
      gap: 12px;
    }

    .table-container {
      overflow-x: auto;
    }

    .patients-table {
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

    .patient-row {
      transition: background-color 0.2s ease;
      
      &:hover {
        background-color: #f8fafc;
      }
    }

    .patient-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .patient-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea, #764ba2);
      display: flex;
      align-items: center;
      justify-content: center;
      
      mat-icon {
        color: white;
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
    }

    .patient-details .patient-name {
      font-weight: 500;
      color: #1f2937;
    }

    .patient-details .patient-email {
      font-size: 0.875rem;
      color: #6b7280;
      margin-top: 2px;
    }

    .age-info .dob {
      font-weight: 500;
      color: #1f2937;
    }

    .age-info .age {
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
        margin: 0 0 24px 0;
      }
    }

    .pagination {
      margin-top: 16px;
    }

    @media (max-width: 1024px) {
      .header-content {
        flex-direction: column;
        gap: 20px;
        text-align: center;
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
      
      .table-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }
    }
  `]
})
export class PatientsListComponent implements OnInit {
  patients: Patient[] = [];
  q = '';
  displayedColumns = ['patientId', 'avatarName', 'contact', 'dobAge', 'actions'];
  totalPatients = 0;
  pageSize = 25;
  
  constructor(private svc: PatientsService) {}
  
  ngOnInit() { 
    this.load(); 
  }
  
  load() { 
    this.svc.search(this.q).subscribe(d => {
      this.patients = d;
      this.totalPatients = d.length;
    }); 
  }
  
  calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
  
  exportData() {
    // Implement export functionality
    console.log('Exporting patient data...');
  }
  
  refreshData() {
    this.load();
  }
  
  onPageChange(event: any) {
    // Implement pagination logic
    console.log('Page changed:', event);
  }
}


