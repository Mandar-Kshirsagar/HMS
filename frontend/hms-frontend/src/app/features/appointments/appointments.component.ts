import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentsService, Appointment } from '../../core/services/appointments.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="card">
    <div class="card-header">
      <div class="title">Appointments</div>
    </div>
    <div class="toolbar">
      <input class="input" placeholder="Doctor User Id" [(ngModel)]="doctorId"/>
      <input class="input" type="date" [(ngModel)]="dayStr"/>
      <button class="btn" (click)="load()">Load Schedule</button>
    </div>
    <table>
      <thead><tr><th>Start</th><th>End</th><th>Status</th><th>Reason</th><th></th></tr></thead>
      <tbody>
        <tr *ngFor="let a of list">
          <td>{{a.start | date:'short'}}</td>
          <td>{{a.end | date:'short'}}</td>
          <td>{{a.status}}</td>
          <td>{{a.reason}}</td>
          <td><button class="btn" (click)="cancel(a.id)">Cancel</button></td>
        </tr>
      </tbody>
    </table>
  </div>`
})
export class AppointmentsComponent implements OnInit {
  doctorId = '';
  dayStr = '';
  list: Appointment[] = [];
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


