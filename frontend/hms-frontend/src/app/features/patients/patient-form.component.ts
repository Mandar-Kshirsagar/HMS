import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PatientsService } from '../../core/services/patients.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div class="card">
    <div class="card-header">
      <div class="title">{{ id ? 'Edit Patient' : 'New Patient' }}</div>
      <div class="spacer"></div>
      <a class="btn" routerLink="/patients">Back</a>
    </div>
    <form [formGroup]="form" (ngSubmit)="submit()" class="grid cols-2">
      <input class="input" placeholder="Full name" formControlName="fullName">
      <input class="input" placeholder="DOB" type="date" formControlName="dateOfBirth">
      <select class="input" formControlName="gender">
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
      <input class="input" placeholder="Contact" formControlName="contact">
      <input class="input" placeholder="Address" formControlName="address">
      <div class="form-actions">
        <button class="btn btn-primary" type="submit">Save</button>
      </div>
    </form>
  </div>`
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


