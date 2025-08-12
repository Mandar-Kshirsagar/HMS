import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
  <div class="card" style="max-width:420px;margin:64px auto;">
    <div class="card-header"><div class="title">Sign in</div></div>
    <form [formGroup]="form" (ngSubmit)="login()" class="grid">
      <input class="input" placeholder="Username" formControlName="username">
      <input class="input" type="password" placeholder="Password" formControlName="password">
      <div class="hint" *ngIf="error">{{error}}</div>
      <div class="form-actions"><button class="btn btn-primary" [disabled]="form.invalid || loading">{{ loading ? 'Signing in…' : 'Login' }}</button></div>
    </form>
  </div>`
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


