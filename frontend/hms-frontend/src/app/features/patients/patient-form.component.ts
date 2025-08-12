import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../shared/material/material.module';
import { PatientsService } from '../../core/services/patients.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MaterialModule],
  template: `
  <mat-card>
    <div class="card-header">
      <div class="title">{{ id ? 'Edit Patient' : 'New Patient' }}</div>
      <div class="spacer"></div>
      <a mat-button routerLink="/patients">Back</a>
    </div>
    <form [formGroup]="form" (ngSubmit)="submit()" class="grid cols-2">
      <mat-form-field appearance="outline">
        <mat-label>Full name</mat-label>
        <input matInput formControlName="fullName">
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>DOB</mat-label>
        <input matInput type="date" formControlName="dateOfBirth">
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Gender</mat-label>
        <mat-select formControlName="gender">
          <mat-option value="Male">Male</mat-option>
          <mat-option value="Female">Female</mat-option>
          <mat-option value="Other">Other</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Contact</mat-label>
        <input matInput formControlName="contact">
      </mat-form-field>
      <mat-form-field appearance="outline" class="col-span-2">
        <mat-label>Address</mat-label>
        <input matInput formControlName="address">
      </mat-form-field>
      <div class="form-actions">
        <button mat-raised-button color="primary" type="submit">Save</button>
      </div>
    </form>
  </mat-card>`
})
export class PatientFormComponent implements OnInit {
  id?: string;
  form: FormGroup;
  constructor(private fb: FormBuilder, private svc: PatientsService, private router: Router, route: ActivatedRoute) {
    this.id = route.snapshot.paramMap.get('id') ?? undefined;
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: [''],
      contact: [''],
      address: ['']
    });
  }
  ngOnInit() {
    if (this.id) {
      this.svc.get(this.id).subscribe(p => {
        this.form.patchValue({
          fullName: p.fullName,
          dateOfBirth: p.dateOfBirth.substring(0,10),
          gender: p.gender,
          contact: p.contact,
          address: p.address
        });
      });
    }
  }
  submit() {
    const v = { ...this.form.value } as any;
    if (this.id) this.svc.update(this.id, v).subscribe(() => this.router.navigate(['/patients']));
    else this.svc.create(v).subscribe(() => this.router.navigate(['/patients']));
  }
}


