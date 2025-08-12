import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('hms-frontend');
  protected sidebarOpen = signal(true);
  protected patientCount = signal(24);
  protected appointmentCount = signal(8);
  
  constructor(private auth: AuthService, private router: Router) {}
  
  isAuthed() { return this.auth.isAuthenticated(); }
  userName() { return this.auth.getUser()?.fullName || this.auth.getUser()?.unique_name || 'User'; }
  onLogout() { this.auth.logout(); this.router.navigate(['/login']); }
  
  toggleSidebar() {
    this.sidebarOpen.update(open => !open);
  }
}
