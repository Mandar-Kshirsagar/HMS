import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../shared/material/material.module';
import { AppointmentsService, Appointment } from '../../core/services/appointments.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MaterialModule],
  template: `
    <div class="appointments-container">
      <!-- Header Section -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-title">
            <h1>Appointment Management</h1>
            <p>Schedule and manage patient appointments</p>
          </div>
          <div class="header-actions">
            <button mat-raised-button color="primary" (click)="openNewAppointmentDialog()">
              <mat-icon>add</mat-icon>
              New Appointment
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="stats-summary">
        <div class="stat-item">
          <div class="stat-icon today">
            <mat-icon>today</mat-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{getTodayAppointments()}}</div>
            <div class="stat-label">Today's Appointments</div>
          </div>
        </div>
        
        <div class="stat-item">
          <div class="stat-icon scheduled">
            <mat-icon>schedule</mat-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{getScheduledAppointments()}}</div>
            <div class="stat-label">Scheduled</div>
          </div>
        </div>
        
        <div class="stat-item">
          <div class="stat-icon completed">
            <mat-icon>check_circle</mat-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{getCompletedAppointments()}}</div>
            <div class="stat-label">Completed Today</div>
          </div>
        </div>
        
        <div class="stat-item">
          <div class="stat-icon urgent">
            <mat-icon>priority_high</mat-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{getUrgentAppointments()}}</div>
            <div class="stat-label">Urgent</div>
          </div>
        </div>
      </div>

      <!-- Search and Filters -->
      <mat-card class="search-card">
        <div class="search-content">
          <div class="search-section">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Search Appointments</mat-label>
              <input matInput placeholder="Search by patient name, reason, or ID..." [(ngModel)]="searchQuery" (keyup)="applySearch()"/>
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="date-field">
              <mat-label>Date</mat-label>
              <input matInput type="date" [(ngModel)]="dayStr" (change)="load()"/>
            </mat-form-field>
            
            <button mat-stroked-button (click)="load()" class="search-btn">
              <mat-icon>search</mat-icon>
              Search
            </button>
          </div>
          
          <div class="filters-section">
            <mat-form-field appearance="outline" class="filter-field">
              <mat-label>Status</mat-label>
              <mat-select [(ngModel)]="selectedStatus" (selectionChange)="applyFilters()">
                <mat-option value="">All Status</mat-option>
                <mat-option value="scheduled">Scheduled</mat-option>
                <mat-option value="confirmed">Confirmed</mat-option>
                <mat-option value="completed">Completed</mat-option>
                <mat-option value="cancelled">Cancelled</mat-option>
                <mat-option value="no-show">No Show</mat-option>
              </mat-select>
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="filter-field">
              <mat-label>Time Range</mat-label>
              <mat-select [(ngModel)]="selectedTimeRange" (selectionChange)="applyFilters()">
                <mat-option value="">All Day</mat-option>
                <mat-option value="morning">Morning (8AM-12PM)</mat-option>
                <mat-option value="afternoon">Afternoon (12PM-5PM)</mat-option>
                <mat-option value="evening">Evening (5PM-8PM)</mat-option>
              </mat-select>
            </mat-form-field>
            
            <button mat-stroked-button (click)="clearFilters()" class="clear-btn">
              <mat-icon>clear</mat-icon>
              Clear
            </button>
          </div>
        </div>
      </mat-card>

      <!-- Calendar View Toggle -->
      <div class="view-toggle">
        <button mat-stroked-button [class.active]="viewMode === 'list'" (click)="setViewMode('list')">
          <mat-icon>list</mat-icon>
          List View
        </button>
        <button mat-stroked-button [class.active]="viewMode === 'calendar'" (click)="setViewMode('calendar')">
          <mat-icon>calendar_today</mat-icon>
          Calendar View
        </button>
      </div>

      <!-- Appointments List -->
      <mat-card class="appointments-card" *ngIf="viewMode === 'list'">
        <div class="card-header">
          <h3>Appointments for {{getFormattedDate()}}</h3>
          <div class="card-actions">
            <button mat-stroked-button (click)="exportSchedule()">
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
          <table mat-table [dataSource]="filteredAppointments" class="appointments-table">
            <!-- Time Column -->
            <ng-container matColumnDef="time">
              <th mat-header-cell *matHeaderCellDef>Time</th>
              <td mat-cell *matCellDef="let a">
                <div class="time-info">
                  <div class="start-time">{{a.start | date:'shortTime'}}</div>
                  <div class="end-time">{{a.end | date:'shortTime'}}</div>
                  <div class="duration">{{getDuration(a.start, a.end)}}</div>
                </div>
              </td>
            </ng-container>

            <!-- Patient Column -->
            <ng-container matColumnDef="patient">
              <th mat-header-cell *matHeaderCellDef>Patient</th>
              <td mat-cell *matCellDef="let a">{{a.patientId}}</td>
            </ng-container>

            <!-- Doctor Column -->
            <ng-container matColumnDef="doctor">
              <th mat-header-cell *matHeaderCellDef>Doctor</th>
              <td mat-cell *matCellDef="let a">{{a.doctorUserId}}</td>
            </ng-container>

            <!-- Reason Column -->
            <ng-container matColumnDef="reason">
              <th mat-header-cell *matHeaderCellDef>Reason</th>
              <td mat-cell *matCellDef="let a">{{a.reason}}</td>
            </ng-container>

            <!-- Status Column -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let a">
                <span class="status-badge" [class]="getStatusClass(a.status)">
                  {{a.status}}
                </span>
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let a">
                <div class="action-buttons">
                  <button mat-icon-button [matMenuTriggerFor]="actionMenu" class="action-menu-btn">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #actionMenu="matMenu">
                    <button mat-menu-item (click)="editAppointment(a)">
                      <mat-icon>edit</mat-icon>
                      <span>Edit Appointment</span>
                    </button>
                    <button mat-menu-item (click)="confirmAppointment(a)">
                      <mat-icon>check_circle</mat-icon>
                      <span>Confirm</span>
                    </button>
                    <button mat-menu-item (click)="completeAppointment(a)">
                      <mat-icon>done</mat-icon>
                      <span>Mark Complete</span>
                    </button>
                    <mat-divider></mat-divider>
                    <button mat-menu-item (click)="cancel(a.id)" class="danger-action">
                      <mat-icon>cancel</mat-icon>
                      <span>Cancel Appointment</span>
                    </button>
                  </mat-menu>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                class="appointment-row"
                [class.urgent]="isUrgent(row)"
                [class.completed]="row.status === 'completed'"></tr>
          </table>
        </div>

        <!-- Empty State -->
        <div class="empty-state" *ngIf="filteredAppointments.length === 0">
          <mat-icon class="empty-icon">event_busy</mat-icon>
          <h3>No appointments found</h3>
          <p>Try adjusting your search criteria or schedule a new appointment</p>
          <button mat-raised-button color="primary" (click)="openNewAppointmentDialog()">
            <mat-icon>add</mat-icon>
            Schedule Appointment
          </button>
        </div>
      </mat-card>

      <!-- Calendar View -->
      <mat-card class="calendar-card" *ngIf="viewMode === 'calendar'">
        <div class="card-header">
          <h3>Calendar View - {{getFormattedDate()}}</h3>
          <div class="calendar-navigation">
            <button mat-icon-button (click)="previousDay()">
              <mat-icon>chevron_left</mat-icon>
            </button>
            <button mat-stroked-button (click)="goToToday()">Today</button>
            <button mat-icon-button (click)="nextDay()">
              <mat-icon>chevron_right</mat-icon>
            </button>
          </div>
        </div>
        
        <div class="calendar-grid">
          <div class="time-slot" *ngFor="let slot of getTimeSlots()" 
               [class.has-appointment]="hasAppointmentAtTime(slot)"
               [class.urgent]="isUrgentAtTime(slot)">
            <div class="time-label">{{slot}}</div>
            <div class="appointment-slot" *ngIf="hasAppointmentAtTime(slot)">
              <div class="appointment-info">
                <div class="patient-name">{{getAppointmentAtTime(slot)?.patientName}}</div>
                <div class="appointment-reason">{{getAppointmentAtTime(slot)?.reason}}</div>
              </div>
            </div>
          </div>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .appointments-container {
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

    .stats-summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }

    .stat-item {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      display: flex;
      align-items: center;
      gap: 16px;
      transition: transform 0.3s ease;
      
      &:hover {
        transform: translateY(-4px);
      }
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &.today { background: linear-gradient(135deg, #667eea, #764ba2); }
      &.scheduled { background: linear-gradient(135deg, #f093fb, #f5576c); }
      &.completed { background: linear-gradient(135deg, #10b981, #059669); }
      &.urgent { background: linear-gradient(135deg, #ef4444, #dc2626); }
      
      mat-icon {
        color: white;
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
    }

    .stat-info .stat-number {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
      line-height: 1;
    }

    .stat-info .stat-label {
      color: #6b7280;
      font-size: 0.875rem;
      margin-top: 4px;
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
      flex-wrap: wrap;
    }

    .search-field {
      flex: 1;
      min-width: 250px;
    }

    .date-field, .doctor-field {
      min-width: 160px;
    }

    .search-btn {
      height: 56px;
      padding: 0 24px;
    }

    .filters-section {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
    }

    .filter-field {
      min-width: 160px;
    }

    .clear-btn {
      height: 56px;
      padding: 0 20px;
    }

    .view-toggle {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
      
      button {
        border-radius: 8px;
        
        &.active {
          background: #667eea;
          color: white;
        }
      }
    }

    .appointments-card, .calendar-card {
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

    .card-actions, .calendar-navigation {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .appointments-table {
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

    .appointment-row {
      transition: background-color 0.2s ease;
      
      &:hover {
        background-color: #f8fafc;
      }
      
      &.urgent {
        background-color: #fef2f2;
        border-left: 4px solid #ef4444;
      }
      
      &.completed {
        background-color: #f0fdf4;
        border-left: 4px solid #10b981;
      }
    }

    .time-info {
      .start-time {
        font-weight: 600;
        color: #1f2937;
      }
      
      .end-time {
        font-size: 0.875rem;
        color: #6b7280;
        margin-top: 2px;
      }
      
      .duration {
        font-size: 0.75rem;
        color: #9ca3af;
        margin-top: 2px;
      }
    }

    .status-badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 500;
      text-align: center;
      
      &.scheduled { background: #dbeafe; color: #2563eb; }
      &.confirmed { background: #dcfce7; color: #16a34a; }
      &.completed { background: #dcfce7; color: #16a34a; }
      &.cancelled { background: #fee2e2; color: #dc2626; }
      &.no-show { background: #fef3c7; color: #d97706; }
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

    .calendar-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1px;
      background: #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
      margin: 0 24px 24px;
    }

    .time-slot {
      background: white;
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 16px;
      min-height: 60px;
      
      &.has-appointment {
        background: #f0fdf4;
        border-left: 4px solid #10b981;
      }
      
      &.urgent {
        background: #fef2f2;
        border-left: 4px solid #ef4444;
      }
    }

    .time-label {
      min-width: 80px;
      font-weight: 500;
      color: #374151;
    }

    .appointment-slot {
      flex: 1;
      
      .appointment-info .patient-name {
        font-weight: 500;
        color: #1f2937;
      }
      
      .appointment-info .appointment-reason {
        font-size: 0.875rem;
        color: #6b7280;
        margin-top: 2px;
      }
    }

    @media (max-width: 1024px) {
      .header-content {
        flex-direction: column;
        gap: 20px;
        text-align: center;
      }
      
      .stats-summary {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .search-section {
        flex-direction: column;
        align-items: stretch;
      }
      
      .search-field {
        min-width: auto;
      }
    }

    @media (max-width: 768px) {
      .stats-summary {
        grid-template-columns: 1fr;
      }
      
      .filters-section {
        flex-direction: column;
        align-items: stretch;
      }
      
      .card-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }
    }
  `]
})
export class AppointmentsComponent implements OnInit {
  doctorId = '';
  dayStr = '';
  searchQuery = '';
  selectedStatus = '';
  selectedTimeRange = '';
  viewMode: 'list' | 'calendar' = 'list';
  list: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  displayedColumns = ['time', 'patient', 'doctor', 'reason', 'status', 'actions'];
  
  constructor(private svc: AppointmentsService) {}
  
  ngOnInit() {
    this.dayStr = new Date().toISOString().split('T')[0];
    // Set a default doctor ID or fetch from user context
    this.doctorId = 'admin'; // This should come from the authenticated user context
    this.load();
  }
  
  load() {
    if (!this.doctorId) {
      console.warn('No doctor ID available for loading appointments');
      return;
    }
    
    const d = this.dayStr ? new Date(this.dayStr) : undefined;
    this.svc.doctorSchedule(this.doctorId, d).subscribe({
      next: r => {
        this.list = r;
        this.applyFilters();
      },
      error: err => {
        console.warn('Failed to load appointments:', err);
        this.list = [];
        this.applyFilters();
      }
    });
  }
  
  applySearch() {
    this.applyFilters();
  }
  
  applyFilters() {
    let filtered = [...this.list];
    
    if (this.searchQuery) {
      filtered = filtered.filter(a => 
        a.patientId.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (a.reason && a.reason.toLowerCase().includes(this.searchQuery.toLowerCase()))
      );
    }
    
    if (this.selectedStatus) {
      filtered = filtered.filter(a => a.status === this.selectedStatus);
    }
    
    if (this.selectedTimeRange) {
      filtered = filtered.filter(a => {
        const hour = new Date(a.start).getHours();
        switch (this.selectedTimeRange) {
          case 'morning': return hour >= 8 && hour < 12;
          case 'afternoon': return hour >= 12 && hour < 17;
          case 'evening': return hour >= 17 && hour < 20;
          default: return true;
        }
      });
    }
    
    this.filteredAppointments = filtered;
  }
  
  clearFilters() {
    this.searchQuery = '';
    this.selectedStatus = '';
    this.selectedTimeRange = '';
    this.applyFilters();
  }
  
  setViewMode(mode: 'list' | 'calendar') {
    this.viewMode = mode;
  }
  
  getTodayAppointments(): number {
    return this.list.filter(a => a.status === 'scheduled' || a.status === 'confirmed').length;
  }
  
  getScheduledAppointments(): number {
    return this.list.filter(a => a.status === 'scheduled').length;
  }
  
  getCompletedAppointments(): number {
    return this.list.filter(a => a.status === 'completed').length;
  }
  
  getUrgentAppointments(): number {
    return this.list.filter(a => this.isUrgent(a)).length;
  }
  
  getFormattedDate(): string {
    if (!this.dayStr) return 'Today';
    return new Date(this.dayStr).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
  
  getDuration(start: Date, end: Date): string {
    const diffMs = new Date(end).getTime() - new Date(start).getTime();
    const diffMins = Math.round(diffMs / 60000);
    return `${diffMins} min`;
  }
  
  getStatusClass(status: string): string {
    return status.toLowerCase();
  }
  
  isUrgent(appointment: Appointment): boolean {
    return appointment.reason?.toLowerCase().includes('emergency') || false;
  }
  
  // Calendar view methods
  getTimeSlots(): string[] {
    const slots = [];
    for (let i = 8; i <= 18; i++) {
      slots.push(`${i.toString().padStart(2, '0')}:00`);
    }
    return slots;
  }
  
  hasAppointmentAtTime(time: string): boolean {
    const hour = parseInt(time.split(':')[0]);
    return this.filteredAppointments.some(a => new Date(a.start).getHours() === hour);
  }
  
  isUrgentAtTime(time: string): boolean {
    const hour = parseInt(time.split(':')[0]);
    const appointment = this.filteredAppointments.find(a => new Date(a.start).getHours() === hour);
    return appointment ? this.isUrgent(appointment) : false;
  }
  
  getAppointmentAtTime(time: string): any {
    const hour = parseInt(time.split(':')[0]);
    const appointment = this.filteredAppointments.find(a => new Date(a.start).getHours() === hour);
    if (appointment) {
      return {
        patientName: appointment.patientId,
        reason: appointment.reason
      };
    }
    return null;
  }
  
  previousDay() {
    const date = new Date(this.dayStr);
    date.setDate(date.getDate() - 1);
    this.dayStr = date.toISOString().split('T')[0];
    this.load();
  }
  
  nextDay() {
    const date = new Date(this.dayStr);
    date.setDate(date.getDate() + 1);
    this.dayStr = date.toISOString().split('T')[0];
    this.load();
  }
  
  goToToday() {
    this.dayStr = new Date().toISOString().split('T')[0];
    this.load();
  }
  
  // Action methods
  openNewAppointmentDialog() {
    console.log('Opening new appointment dialog...');
  }
  
  editAppointment(appointment: Appointment) {
    console.log('Editing appointment:', appointment);
  }
  
  confirmAppointment(appointment: Appointment) {
    appointment.status = 'confirmed';
    this.applyFilters();
  }
  
  completeAppointment(appointment: Appointment) {
    appointment.status = 'completed';
    this.applyFilters();
  }
  
  cancel(id: number) {
    this.svc.cancel(id).subscribe(() => {
      this.list = this.list.filter(x => x.id !== id);
      this.applyFilters();
    });
  }
  
  exportSchedule() {
    console.log('Exporting schedule...');
  }
  
  refreshData() {
    this.load();
  }
}


