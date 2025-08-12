import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material/material.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MaterialModule],
  template: `
  <mat-card style="max-width:420px;margin:64px auto;">
    <h2>Sign in</h2>
    <form [formGroup]="form" (ngSubmit)="login()" class="grid">
      <mat-form-field appearance="outline">
        <mat-label>Username</mat-label>
        <input matInput placeholder="Username" formControlName="username">
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Password</mat-label>
        <input matInput type="password" placeholder="Password" formControlName="password">
      </mat-form-field>
      <div class="hint" *ngIf="error">{{error}}</div>
      <div class="form-actions"><button mat-raised-button color="primary" [disabled]="form.invalid || loading">{{ loading ? 'Signing in…' : 'Login' }}</button></div>
    </form>
  </mat-card>`
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  error = '';
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({ username: ['admin', Validators.required], password: ['Passw0rd!', Validators.required] });
  }
  login() {
    if (this.form.invalid) return;
    this.loading = true; this.error = '';
    const { username, password } = this.form.value;
    this.auth.login(username!, password!).subscribe({
      next: res => { this.auth.storeToken(res.token); this.router.navigate(['/dashboard']); },
      error: _ => { this.error = 'Invalid username or password'; this.loading = false; }
    });
  }
}


