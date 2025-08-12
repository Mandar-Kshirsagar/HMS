import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PatientsService, Patient } from '../../core/services/patients.service';

@Component({
  selector: 'app-patients-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
  <div class="card">
    <div class="card-header">
      <div class="title">Patients</div>
      <div class="spacer"></div>
      <a class="btn btn-primary" routerLink="/patients/new">+ New Patient</a>
    </div>
    <div class="toolbar">
      <input class="input" placeholder="Search patients..." [(ngModel)]="q" (keyup)="load()"/>
      <button class="btn btn-ghost" (click)="load()">Search</button>
    </div>
    <table>
      <thead>
        <tr><th>Name</th><th>DOB</th><th></th></tr>
      </thead>
      <tbody>
        <tr *ngFor="let p of patients">
          <td>{{p.fullName}}</td>
          <td>{{p.dateOfBirth | date}}</td>
          <td><a class="btn" [routerLink]="['/patients', p.id, 'edit']">Edit</a></td>
        </tr>
      </tbody>
    </table>
    <div class="hint" *ngIf="patients.length===0">No patients found.</div>
  </div>`
})
export class PatientsListComponent implements OnInit {
  patients: Patient[] = []; q = '';
  constructor(private svc: PatientsService) {}
  ngOnInit() { this.load(); }
  load() { this.svc.search(this.q).subscribe(d => this.patients = d); }
}


