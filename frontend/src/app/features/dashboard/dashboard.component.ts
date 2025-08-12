import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../shared/material/material.module';
import { DashboardService } from '../../core/services/dashboard.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  template: `
    <div class="dashboard-container">
      <!-- Welcome Section -->
      <div class="welcome-section">
        <div class="welcome-content">
          <h1 class="welcome-title">Welcome back, Doctor!</h1>
          <p class="welcome-subtitle">Here's what's happening at your hospital today</p>
        </div>
        <div class="welcome-actions">
          <button mat-raised-button color="primary" routerLink="/appointments">
            <mat-icon>add</mat-icon>
            New Appointment
          </button>
          <button mat-stroked-button color="primary" routerLink="/patients/new">
            <mat-icon>person_add</mat-icon>
            Add Patient
          </button>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="stats-grid">
        <mat-card class="stat-card patients">
          <div class="stat-content">
            <div class="stat-icon">
              <mat-icon>people</mat-icon>
            </div>
            <div class="stat-details">
              <div class="stat-number">{{summary?.totalPatients || 0}}</div>
              <div class="stat-label">Total Patients</div>
              <div class="stat-change positive">
                <mat-icon>trending_up</mat-icon>
                +12% this month
              </div>
            </div>
          </div>
        </mat-card>

        <mat-card class="stat-card appointments">
          <div class="stat-content">
            <div class="stat-icon">
              <mat-icon>event</mat-icon>
            </div>
            <div class="stat-details">
              <div class="stat-number">{{summary?.appointmentsToday || 0}}</div>
              <div class="stat-label">Today's Appointments</div>
              <div class="stat-change urgent">
                <mat-icon>schedule</mat-icon>
                {{getNextAppointmentTime()}}
              </div>
            </div>
          </div>
        </mat-card>

        <mat-card class="stat-card doctors">
          <div class="stat-content">
            <div class="stat-icon">
              <mat-icon>medical_services</mat-icon>
            </div>
            <div class="stat-details">
              <div class="stat-number">{{summary?.totalDoctors || 0}}</div>
              <div class="stat-label">Active Doctors</div>
              <div class="stat-change">
                <mat-icon>check_circle</mat-icon>
                All available
              </div>
            </div>
          </div>
        </mat-card>

        <mat-card class="stat-card revenue">
          <div class="stat-content">
            <div class="stat-icon">
              <mat-icon>attach_money</mat-icon>
            </div>
            <div class="stat-details">
              <div class="stat-number">{{getMonthlyRevenue()}}</div>
              <div class="stat-label">Monthly Revenue</div>
              <div class="stat-change positive">
                <mat-icon>trending_up</mat-icon>
                +8.2% vs last month
              </div>
            </div>
          </div>
        </mat-card>
      </div>

      <!-- Charts and Analytics -->
      <div class="charts-section">
        <div class="chart-container">
          <mat-card class="chart-card">
            <div class="card-header">
              <h3>Patient Visits by Month ({{year}})</h3>
              <button mat-icon-button [matMenuTriggerFor]="chartMenu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #chartMenu="matMenu">
                <button mat-menu-item>
                  <mat-icon>download</mat-icon>
                  <span>Export Data</span>
                </button>
                <button mat-menu-item>
                  <mat-icon>refresh</mat-icon>
                  <span>Refresh</span>
                </button>
              </mat-menu>
            </div>
            <div class="chart-content">
              <canvas #chart width="600" height="300"></canvas>
            </div>
          </mat-card>
        </div>

        <div class="chart-container">
          <mat-card class="chart-card">
            <div class="card-header">
              <h3>Department Distribution</h3>
            </div>
            <div class="chart-content">
              <div class="department-stats">
                <div class="dept-item" *ngFor="let dept of getDepartmentStats()">
                  <div class="dept-color" [style.background-color]="dept.color"></div>
                  <div class="dept-info">
                    <div class="dept-name">{{dept.name}}</div>
                    <div class="dept-count">{{dept.count}} patients</div>
                  </div>
                  <div class="dept-percentage">{{dept.percentage}}%</div>
                </div>
              </div>
            </div>
          </mat-card>
        </div>
      </div>

      <!-- Recent Activity and Quick Actions -->
      <div class="activity-section">
        <div class="activity-container">
          <mat-card class="activity-card">
            <div class="card-header">
              <h3>Recent Activity</h3>
              <button mat-button color="primary">View All</button>
            </div>
            <div class="activity-list">
              <div class="activity-item" *ngFor="let activity of getRecentActivity()">
                <div class="activity-icon" [class]="activity.type">
                  <mat-icon>{{activity.icon}}</mat-icon>
                </div>
                <div class="activity-details">
                  <div class="activity-title">{{activity.title}}</div>
                  <div class="activity-time">{{activity.time}}</div>
                </div>
                <div class="activity-status" [class]="activity.status">
                  {{activity.status}}
                </div>
              </div>
            </div>
          </mat-card>
        </div>

        <div class="quick-actions-container">
          <mat-card class="quick-actions-card">
            <div class="card-header">
              <h3>Quick Actions</h3>
            </div>
            <div class="actions-grid">
              <button mat-stroked-button class="action-btn" routerLink="/patients">
                <mat-icon>search</mat-icon>
                Search Patients
              </button>
              <button mat-stroked-button class="action-btn" routerLink="/appointments">
                <mat-icon>calendar_today</mat-icon>
                View Schedule
              </button>
              <button mat-stroked-button class="action-btn" routerLink="/records">
                <mat-icon>description</mat-icon>
                Medical Records
              </button>
              <button mat-stroked-button class="action-btn" routerLink="/staff">
                <mat-icon>group</mat-icon>
                Manage Staff
              </button>
            </div>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 0;
    }

    .welcome-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 32px;
      border-radius: 16px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .welcome-title {
      font-size: 2rem;
      font-weight: 600;
      margin: 0 0 8px 0;
    }

    .welcome-subtitle {
      font-size: 1.1rem;
      opacity: 0.9;
      margin: 0;
    }

    .welcome-actions {
      display: flex;
      gap: 12px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }

    .stat-card {
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
      }
      
      &.patients .stat-icon { background: linear-gradient(135deg, #667eea, #764ba2); }
      &.appointments .stat-icon { background: linear-gradient(135deg, #f093fb, #f5576c); }
      &.doctors .stat-icon { background: linear-gradient(135deg, #4facfe, #00f2fe); }
      &.revenue .stat-icon { background: linear-gradient(135deg, #43e97b, #38f9d7); }
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 8px;
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      
      mat-icon {
        color: white;
        font-size: 28px;
        width: 28px;
        height: 28px;
      }
    }

    .stat-details {
      flex: 1;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
      line-height: 1;
    }

    .stat-label {
      color: #6b7280;
      font-size: 0.875rem;
      margin-top: 4px;
    }

    .stat-change {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.75rem;
      margin-top: 8px;
      
      &.positive {
        color: #10b981;
      }
      
      &.urgent {
        color: #ef4444;
      }
      
      mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }
    }

    .charts-section {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 20px;
      margin-bottom: 24px;
    }

    .chart-card {
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 20px 0;
      margin-bottom: 16px;
      
      h3 {
        margin: 0;
        color: #1f2937;
        font-weight: 600;
      }
    }

    .chart-content {
      padding: 0 20px 20px;
    }

    .department-stats {
      .dept-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 0;
        border-bottom: 1px solid #f3f4f6;
        
        &:last-child {
          border-bottom: none;
        }
      }

      .dept-color {
        width: 12px;
        height: 12px;
        border-radius: 50%;
      }

      .dept-info {
        flex: 1;
      }

      .dept-name {
        font-weight: 500;
        color: #1f2937;
      }

      .dept-count {
        font-size: 0.875rem;
        color: #6b7280;
      }

      .dept-percentage {
        font-weight: 600;
        color: #1f2937;
      }
    }

    .activity-section {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 20px;
    }

    .activity-card, .quick-actions-card {
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .activity-list {
      .activity-item {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px 0;
        border-bottom: 1px solid #f3f4f6;
        
        &:last-child {
          border-bottom: none;
        }
      }

      .activity-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &.appointment { background: #dbeafe; }
        &.patient { background: #dcfce7; }
        &.record { background: #fef3c7; }
        &.staff { background: #f3e8ff; }
        
        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
          
          &.appointment { color: #2563eb; }
          &.patient { color: #16a34a; }
          &.record { color: #d97706; }
          &.staff { color: #9333ea; }
        }
      }

      .activity-details {
        flex: 1;
      }

      .activity-title {
        font-weight: 500;
        color: #1f2937;
      }

      .activity-time {
        font-size: 0.875rem;
        color: #6b7280;
        margin-top: 2px;
      }

      .activity-status {
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 500;
        
        &.completed { background: #dcfce7; color: #16a34a; }
        &.pending { background: #fef3c7; color: #d97706; }
        &.urgent { background: #fee2e2; color: #dc2626; }
      }
    }

    .actions-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      padding: 0 20px 20px;
    }

    .action-btn {
      height: 80px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      border-radius: 12px;
      border: 2px solid #e5e7eb;
      transition: all 0.3s ease;
      
      &:hover {
        border-color: #667eea;
        background: #f8fafc;
        transform: translateY(-2px);
      }
      
      mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
        color: #667eea;
      }
    }

    @media (max-width: 1024px) {
      .charts-section,
      .activity-section {
        grid-template-columns: 1fr;
      }
      
      .welcome-section {
        flex-direction: column;
        gap: 20px;
        text-align: center;
      }
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .actions-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  @ViewChild('chart', { static: false }) chartRef?: ElementRef<HTMLCanvasElement>;
  summary?: { totalPatients: number; totalDoctors: number; appointmentsToday: number };
  year = new Date().getFullYear();
  
  constructor(private svc: DashboardService) {}
  
  ngOnInit() {
    this.svc.summary().subscribe(s => this.summary = s);
    this.svc.monthly(this.year).subscribe(data => setTimeout(() => this.draw(data), 0));
  }
  
  draw(data: { month: number; visits: number }[]) {
    const canvas = this.chartRef?.nativeElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Enhanced chart with better styling
    const max = Math.max(...data.map(d => d.visits), 10);
    const barW = 40;
    const gap = 20;
    const base = 250;
    
    // Draw bars with gradient
    data.forEach((d, i) => {
      const h = (d.visits / max) * 200;
      const x = 30 + i * (barW + gap);
      
      // Create gradient
      const gradient = ctx.createLinearGradient(x, base - h, x, base);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, base - h, barW, h);
      
      // Add shadow effect
      ctx.shadowColor = 'rgba(102, 126, 234, 0.3)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 4;
      ctx.fillRect(x, base - h, barW, h);
      ctx.shadowColor = 'transparent';
    });
    
    // Draw labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    data.forEach((d, i) => {
      const h = (d.visits / max) * 200;
      const x = 30 + i * (barW + gap) + barW / 2;
      ctx.fillText(String(d.month), x, base + 20);
      ctx.fillText(String(d.visits), x, base - h - 10);
    });
  }
  
  getMonthlyRevenue(): string {
    return '124,580';
  }
  
  getNextAppointmentTime(): string {
    return 'Next: 2:30 PM';
  }
  
  getDepartmentStats() {
    return [
      { name: 'Cardiology', count: 45, percentage: 25, color: '#667eea' },
      { name: 'Orthopedics', count: 38, percentage: 21, color: '#f093fb' },
      { name: 'Neurology', count: 32, percentage: 18, color: '#4facfe' },
      { name: 'Pediatrics', count: 28, percentage: 16, color: '#43e97b' },
      { name: 'Emergency', count: 22, percentage: 12, color: '#f5576c' },
      { name: 'Others', count: 15, percentage: 8, color: '#764ba2' }
    ];
  }
  
  getRecentActivity() {
    return [
      {
        type: 'appointment',
        icon: 'event',
        title: 'New appointment scheduled for John Doe',
        time: '2 minutes ago',
        status: 'scheduled'
      },
      {
        type: 'patient',
        icon: 'person_add',
        title: 'New patient registration: Sarah Wilson',
        time: '15 minutes ago',
        status: 'completed'
      },
      {
        type: 'record',
        icon: 'description',
        title: 'Medical record updated for Mike Johnson',
        time: '1 hour ago',
        status: 'completed'
      },
      {
        type: 'staff',
        icon: 'group',
        title: 'Dr. Smith completed shift handover',
        time: '2 hours ago',
        status: 'completed'
      },
      {
        type: 'appointment',
        icon: 'schedule',
        title: 'Urgent appointment request from ER',
        time: '3 hours ago',
        status: 'urgent'
      }
    ];
  }
}


