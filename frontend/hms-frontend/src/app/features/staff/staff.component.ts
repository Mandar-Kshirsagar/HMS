import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaterialModule } from '../../shared/material/material.module';
import { StaffService, User, CreateUserRequest } from '../../core/services/staff.service';

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  template: `
    <mat-card>
      <div class="card-header">
        <div class="title">Staff Management</div>
      </div>
      
      <!-- Add User Form -->
      <mat-card class="add-user-card">
        <div class="title" style="margin-bottom: 16px;">Add New User</div>
        <form [formGroup]="userForm" (ngSubmit)="addUser()" class="grid cols-2">
          <mat-form-field appearance="outline">
            <mat-label>Username</mat-label>
            <input matInput formControlName="username" placeholder="Enter username">
            <mat-error *ngIf="userForm.get('username')?.hasError('required')">
              Username is required
            </mat-error>
          </mat-form-field>
          
          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" placeholder="Enter email">
            <mat-error *ngIf="userForm.get('email')?.hasError('required')">
              Email is required
            </mat-error>
            <mat-error *ngIf="userForm.get('email')?.hasError('email')">
              Enter a valid email
            </mat-error>
          </mat-form-field>
          
          <mat-form-field appearance="outline">
            <mat-label>Full Name</mat-label>
            <input matInput formControlName="fullName" placeholder="Enter full name">
            <mat-error *ngIf="userForm.get('fullName')?.hasError('required')">
              Full name is required
            </mat-error>
          </mat-form-field>
          
          <mat-form-field appearance="outline">
            <mat-label>Role</mat-label>
            <mat-select formControlName="role">
              <mat-option *ngFor="let role of roles" [value]="role">{{role}}</mat-option>
            </mat-select>
            <mat-error *ngIf="userForm.get('role')?.hasError('required')">
              Role is required
            </mat-error>
          </mat-form-field>
          
          <mat-form-field appearance="outline">
            <mat-label>Password</mat-label>
            <input matInput type="password" formControlName="password" placeholder="Enter password">
            <mat-error *ngIf="userForm.get('password')?.hasError('required')">
              Password is required
            </mat-error>
            <mat-error *ngIf="userForm.get('password')?.hasError('minlength')">
              Password must be at least 6 characters
            </mat-error>
          </mat-form-field>
          
          <mat-form-field appearance="outline">
            <mat-label>Confirm Password</mat-label>
            <input matInput type="password" formControlName="confirmPassword" placeholder="Confirm password">
            <mat-error *ngIf="userForm.get('confirmPassword')?.hasError('required')">
              Confirm password is required
            </mat-error>
            <mat-error *ngIf="userForm.hasError('passwordMismatch')">
              Passwords don't match
            </mat-error>
          </mat-form-field>
          
          <div class="form-actions col-span-2">
            <button mat-raised-button color="primary" type="submit" [disabled]="userForm.invalid || loading">
              <mat-icon>person_add</mat-icon>
              {{ loading ? 'Adding...' : 'Add User' }}
            </button>
            <button mat-stroked-button type="button" (click)="resetForm()">
              <mat-icon>refresh</mat-icon>
              Reset
            </button>
          </div>
        </form>
        
        <div *ngIf="message" class="message" [ngClass]="{'success': !isError, 'error': isError}">
          {{ message }}
        </div>
      </mat-card>
      
      <!-- Users List -->
      <div class="title" style="margin: 24px 0 16px;">Existing Users</div>
      <table mat-table [dataSource]="users" class="mat-elevation-z1">
        <ng-container matColumnDef="fullName">
          <th mat-header-cell *matHeaderCellDef>Full Name</th>
          <td mat-cell *matCellDef="let user">{{user.fullName}}</td>
        </ng-container>
        
        <ng-container matColumnDef="userName">
          <th mat-header-cell *matHeaderCellDef>Username</th>
          <td mat-cell *matCellDef="let user">{{user.userName}}</td>
        </ng-container>
        
        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef>Email</th>
          <td mat-cell *matCellDef="let user">{{user.email}}</td>
        </ng-container>
        
        <ng-container matColumnDef="roles">
          <th mat-header-cell *matHeaderCellDef>Roles</th>
          <td mat-cell *matCellDef="let user">
            <span *ngFor="let role of user.roles; let last = last">
              {{role}}<span *ngIf="!last">, </span>
            </span>
          </td>
        </ng-container>
        
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </mat-card>
  `,
  styles: [`
    .add-user-card {
      margin-bottom: 24px;
      background-color: #f8f9fa;
    }
    
    .message {
      margin-top: 16px;
      padding: 12px;
      border-radius: 4px;
      
      &.success {
        background-color: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
      }
      
      &.error {
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
      }
    }
    
    .mat-mdc-table {
      width: 100%;
    }
  `]
})
export class StaffComponent implements OnInit {
  userForm: FormGroup;
  users: User[] = [];
  roles: string[] = [];
  loading = false;
  message = '';
  isError = false;
  displayedColumns = ['fullName', 'userName', 'email', 'roles'];

  constructor(
    private fb: FormBuilder,
    private staffService: StaffService
  ) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', Validators.required],
      role: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.loadUsers();
    this.loadRoles();
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  loadUsers() {
    this.staffService.getUsers().subscribe({
      next: (users) => this.users = users,
      error: (error) => {
        this.showMessage('Failed to load users', true);
        console.error('Error loading users:', error);
      }
    });
  }

  loadRoles() {
    this.staffService.getRoles().subscribe({
      next: (roles) => this.roles = roles,
      error: (error) => {
        this.showMessage('Failed to load roles', true);
        console.error('Error loading roles:', error);
      }
    });
  }

  addUser() {
    if (this.userForm.invalid) return;

    this.loading = true;
    const formValue = this.userForm.value;
    
    const createUserRequest: CreateUserRequest = {
      username: formValue.username,
      email: formValue.email,
      fullName: formValue.fullName,
      password: formValue.password,
      role: formValue.role
    };

    this.staffService.createUser(createUserRequest).subscribe({
      next: (response) => {
        this.showMessage('User created successfully!', false);
        this.resetForm();
        this.loadUsers();
        this.loading = false;
      },
      error: (error) => {
        this.showMessage(error.error || 'Failed to create user', true);
        this.loading = false;
      }
    });
  }

  resetForm() {
    this.userForm.reset();
    this.message = '';
  }

  showMessage(msg: string, isError: boolean) {
    this.message = msg;
    this.isError = isError;
    setTimeout(() => this.message = '', 5000);
  }
}
