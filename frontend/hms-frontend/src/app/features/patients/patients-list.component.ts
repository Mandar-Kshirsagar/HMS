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
  <mat-card>
    <div class="card-header">
      <div class="title">Patients</div>
      <div class="spacer"></div>
      <a mat-raised-button color="primary" routerLink="/patients/new">+ New Patient</a>
    </div>
    <div class="toolbar">
      <mat-form-field appearance="outline">
        <mat-label>Search</mat-label>
        <input matInput placeholder="Search patients..." [(ngModel)]="q" (keyup)="load()"/>
      </mat-form-field>
      <button mat-stroked-button (click)="load()">Search</button>
    </div>
    <table mat-table [dataSource]="patients" class="mat-elevation-z1">
      <ng-container matColumnDef="fullName">
        <th mat-header-cell *matHeaderCellDef>Name</th>
        <td mat-cell *matCellDef="let p">{{p.fullName}}</td>
      </ng-container>
      <ng-container matColumnDef="dob">
        <th mat-header-cell *matHeaderCellDef>DOB</th>
        <td mat-cell *matCellDef="let p">{{p.dateOfBirth | date}}</td>
      </ng-container>
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let p"><a mat-button [routerLink]="['/patients', p.id, 'edit']">Edit</a></td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
    <div class="hint" *ngIf="patients.length===0">No patients found.</div>
  </mat-card>`
})
export class PatientsListComponent implements OnInit {
  patients: Patient[] = []; q = ''; displayedColumns = ['fullName','dob','actions'];
  constructor(private svc: PatientsService) {}
  ngOnInit() { this.load(); }
  load() { this.svc.search(this.q).subscribe(d => this.patients = d); }
}


