import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
  <div class="card" style="max-width:420px;margin:64px auto;">
    <div class="card-header"><div class="title">Sign in</div></div>
    <form [formGroup]="form" (ngSubmit)="login()" class="grid">
      <input class="input" placeholder="Username" formControlName="username">
      <input class="input" type="password" placeholder="Password" formControlName="password">
      <div class="form-actions"><button class="btn btn-primary">Login</button></div>
    </form>
  </div>`
})
export class LoginComponent {
  form: FormGroup;
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({ username: ['admin'], password: ['Passw0rd!'] });
  }
  login() {
    const { username, password } = this.form.value;
    this.auth.login(username!, password!).subscribe(res => {
      this.auth.storeToken(res.token);
      this.router.navigate(['/patients']);
    });
  }
}


