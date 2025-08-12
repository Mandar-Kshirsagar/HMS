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
  <mat-card>
    <div class="card-header">
      <div class="title">Appointments</div>
    </div>
    <div class="toolbar">
      <mat-form-field appearance="outline">
        <mat-label>Doctor User ID</mat-label>
        <input matInput placeholder="Doctor User Id" [(ngModel)]="doctorId"/>
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Date</mat-label>
        <input matInput type="date" [(ngModel)]="dayStr"/>
      </mat-form-field>
      <button mat-raised-button color="primary" (click)="load()">Load Schedule</button>
    </div>
    <table mat-table [dataSource]="list" class="mat-elevation-z1">
      <ng-container matColumnDef="start">
        <th mat-header-cell *matHeaderCellDef>Start</th>
        <td mat-cell *matCellDef="let a">{{a.start | date:'short'}}</td>
      </ng-container>
      <ng-container matColumnDef="end">
        <th mat-header-cell *matHeaderCellDef>End</th>
        <td mat-cell *matCellDef="let a">{{a.end | date:'short'}}</td>
      </ng-container>
      <ng-container matColumnDef="status">
        <th mat-header-cell *matHeaderCellDef>Status</th>
        <td mat-cell *matCellDef="let a">{{a.status}}</td>
      </ng-container>
      <ng-container matColumnDef="reason">
        <th mat-header-cell *matHeaderCellDef>Reason</th>
        <td mat-cell *matCellDef="let a">{{a.reason}}</td>
      </ng-container>
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let a"><button mat-button color="warn" (click)="cancel(a.id)">Cancel</button></td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
  </mat-card>`
})
export class AppointmentsComponent implements OnInit {
  doctorId = '';
  dayStr = '';
  list: Appointment[] = [];
  displayedColumns = ['start', 'end', 'status', 'reason', 'actions'];
  constructor(private svc: AppointmentsService) {}
  ngOnInit() {}
  load() {
    const d = this.dayStr ? new Date(this.dayStr) : undefined;
    if (!this.doctorId) return;
    this.svc.doctorSchedule(this.doctorId, d).subscribe(r => this.list = r);
  }
  cancel(id: number) {
    this.svc.cancel(id).subscribe(() => this.list = this.list.filter(x => x.id !== id));
  }
}


