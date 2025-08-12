import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent) },
  { path: 'patients', canActivate: [AuthGuard], loadComponent: () => import('./features/patients/patients-list.component').then(m => m.PatientsListComponent) },
  { path: 'patients/new', canActivate: [AuthGuard], loadComponent: () => import('./features/patients/patient-form.component').then(m => m.PatientFormComponent) },
  { path: 'patients/:id/edit', canActivate: [AuthGuard], loadComponent: () => import('./features/patients/patient-form.component').then(m => m.PatientFormComponent) },
  { path: 'appointments', canActivate: [AuthGuard], loadComponent: () => import('./features/appointments/appointments.component').then(m => m.AppointmentsComponent) },
  { path: 'records', canActivate: [AuthGuard], loadComponent: () => import('./features/records/records.component').then(m => m.RecordsComponent) },
  { path: 'dashboard', canActivate: [AuthGuard], loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: '', pathMatch: 'full', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
