# Frontend Architecture Documentation

## Overview

The HMS frontend is built with **Angular 20** using a modern, feature-based architecture that emphasizes maintainability, scalability, and developer experience.

## Architecture Pattern

### Feature-Based Architecture

The application follows a feature-based architecture where code is organized by business features rather than technical layers:

```
src/app/
├── core/                    # Singleton services, guards, interceptors
├── features/               # Feature modules
│   ├── auth/              # Authentication feature
│   ├── dashboard/         # Dashboard feature
│   ├── patients/          # Patient management
│   ├── appointments/      # Appointment scheduling
│   ├── records/          # Medical records
│   └── staff/            # Staff management
├── shared/               # Shared components and utilities
└── app.component.ts      # Root component
```

## Core Module

### Services

#### AuthService
Handles user authentication and session management.

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'hms_token';
  
  login(username: string, password: string): Observable<LoginResponse>
  storeToken(token: string): void
  getToken(): string | null
  logout(): void
  getUser(): UserClaims | null
  hasRole(required: string[]): boolean
  isAuthenticated(): boolean
}
```

**Key Features:**
- JWT token storage in localStorage
- Role-based authorization checks
- User claims extraction from JWT
- Session management

#### HTTP Interceptors

**JWT Interceptor**
Automatically adds JWT tokens to outgoing requests.

```typescript
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
}
```

**Error Interceptor**
Handles global error responses and authentication failures.

```typescript
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
}
```

#### Guards

**Auth Guard**
Protects routes that require authentication.

```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean
}
```

## Feature Modules

### Dashboard Feature

**Components:**
- `DashboardComponent` - Main dashboard with statistics and charts

**Services:**
- `DashboardService` - API calls for dashboard data

**Features:**
- Real-time statistics display
- Interactive charts using Canvas API
- Recent activity feed
- Quick action buttons

### Patient Management Feature

**Components:**
- `PatientsListComponent` - Patient listing with search and filters
- `PatientFormComponent` - Patient registration and editing

**Services:**
- `PatientsService` - Patient CRUD operations

**Features:**
- Advanced search and filtering
- Paginated data tables
- Form validation
- Patient profile management

### Appointment Scheduling Feature

**Components:**
- `AppointmentsComponent` - Appointment management interface

**Services:**
- `AppointmentsService` - Appointment operations

**Features:**
- Calendar view and list view
- Appointment booking and rescheduling
- Status management
- Doctor schedule viewing

### Medical Records Feature

**Components:**
- `RecordsComponent` - Medical records management

**Services:**
- `RecordsService` - Medical record operations
- `DocumentsService` - Document upload and management

**Features:**
- Medical history tracking
- Document upload with drag-and-drop
- Record creation and editing
- File type validation

### Staff Management Feature

**Components:**
- `StaffComponent` - Staff member management

**Services:**
- `StaffService` - Staff operations

**Features:**
- User account creation
- Role assignment
- Staff listing
- Form validation with password confirmation

## Shared Module

### Material Module

Centralizes Angular Material imports:

```typescript
@NgModule({
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    // ... other Material modules
  ],
  exports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    // ... re-exported modules
  ]
})
export class MaterialModule { }
```

## Component Architecture

### Standalone Components

All components use Angular's standalone component architecture:

```typescript
@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  template: `...`,
  styles: [`...`]
})
export class ExampleComponent implements OnInit {
  // Component logic
}
```

### Component Structure

**Typical component structure:**
1. **Imports** - Angular modules and dependencies
2. **Template** - HTML template with Angular directives
3. **Styles** - Component-specific SCSS styles
4. **Component Class** - TypeScript logic

**Best Practices:**
- Use reactive forms for complex forms
- Implement OnInit for initialization logic
- Use OnDestroy for cleanup (subscriptions)
- Keep templates clean with computed properties
- Use trackBy functions for ngFor loops

## State Management

### Service-Based State

The application uses services for state management with RxJS:

```typescript
@Injectable({ providedIn: 'root' })
export class DataService {
  private dataSubject = new BehaviorSubject<Data[]>([]);
  public data$ = this.dataSubject.asObservable();
  
  loadData(): Observable<Data[]> {
    return this.http.get<Data[]>('/api/data').pipe(
      tap(data => this.dataSubject.next(data))
    );
  }
}
```

**Key Patterns:**
- BehaviorSubject for current state
- Observable streams for reactive updates
- Service layer for business logic
- HTTP client for API communication

## Styling Architecture

### SCSS Structure

```scss
// Component-specific styles
.component-container {
  padding: 0;
  
  .header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 32px;
    border-radius: 16px;
    margin-bottom: 24px;
  }
  
  // Responsive design
  @media (max-width: 768px) {
    .header {
      padding: 16px;
    }
  }
}
```

### Design System

**Color Palette:**
- Primary: `#667eea` (Blue gradient)
- Secondary: `#764ba2` (Purple gradient)
- Success: `#10b981` (Green)
- Warning: `#f59e0b` (Orange)
- Error: `#ef4444` (Red)

**Typography:**
- Font Family: Inter, system fonts
- Heading sizes: 2rem, 1.5rem, 1.25rem
- Body text: 1rem, 0.875rem

**Spacing Scale:**
- Base unit: 8px
- Scale: 8px, 16px, 24px, 32px, 48px, 64px

## Routing Architecture

### Route Configuration

```typescript
const routes: Routes = [
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'patients',
    loadComponent: () => import('./features/patients/patients-list.component'),
    canActivate: [AuthGuard]
  },
  // ... other routes
];
```

**Features:**
- Lazy loading for performance
- Route guards for authentication
- Nested routing for complex features
- Preloading strategies

## HTTP Client Architecture

### Service Pattern

```typescript
@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}
  
  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${environment.apiUrl}${endpoint}`);
  }
  
  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${environment.apiUrl}${endpoint}`, data);
  }
}
```

**Error Handling:**
```typescript
getData(): Observable<Data[]> {
  return this.http.get<Data[]>('/api/data').pipe(
    catchError(error => {
      console.error('API Error:', error);
      return of([]); // Return empty array as fallback
    })
  );
}
```

## Form Architecture

### Reactive Forms

```typescript
export class FormComponent implements OnInit {
  form: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.pattern(/^\d{10}$/)]
    });
  }
  
  onSubmit(): void {
    if (this.form.valid) {
      // Process form data
    }
  }
}
```

**Validation Strategy:**
- Built-in Angular validators
- Custom validators for business rules
- Real-time validation feedback
- Accessible error messages

## Performance Optimization

### Lazy Loading

```typescript
const routes: Routes = [
  {
    path: 'feature',
    loadComponent: () => import('./feature/feature.component')
  }
];
```

### OnPush Change Detection

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptimizedComponent {
  // Component uses OnPush for better performance
}
```

### TrackBy Functions

```typescript
trackByFn(index: number, item: any): any {
  return item.id;
}
```

```html
<div *ngFor="let item of items; trackBy: trackByFn">
  {{ item.name }}
</div>
```

## Testing Strategy

### Unit Testing

```typescript
describe('ComponentName', () => {
  let component: ComponentName;
  let fixture: ComponentFixture<ComponentName>;
  let service: ServiceName;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ComponentName],
      providers: [ServiceName]
    });
    
    fixture = TestBed.createComponent(ComponentName);
    component = fixture.componentInstance;
    service = TestBed.inject(ServiceName);
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

### Service Testing

```typescript
describe('ServiceName', () => {
  let service: ServiceName;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ServiceName]
    });
    
    service = TestBed.inject(ServiceName);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  it('should fetch data', () => {
    const mockData = [{ id: 1, name: 'Test' }];
    
    service.getData().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    
    const req = httpMock.expectOne('/api/data');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});
```

## Build and Deployment

### Development Build

```bash
ng serve                    # Development server
ng build                   # Development build
ng test                    # Unit tests
ng e2e                     # End-to-end tests
```

### Production Build

```bash
ng build --configuration production
```

**Production Optimizations:**
- Ahead-of-Time (AOT) compilation
- Tree shaking
- Minification
- Code splitting
- Service worker for caching

## Environment Configuration

### Environment Files

```typescript
// environment.ts (development)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'
};

// environment.prod.ts (production)
export const environment = {
  production: true,
  apiUrl: 'https://api.yourcompany.com/api'
};
```

## Accessibility

### WCAG 2.1 Compliance

- **Semantic HTML**: Proper use of HTML elements
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: Meets AA standards
- **Focus Management**: Proper focus handling

### Angular CDK A11y

```typescript
import { A11yModule } from '@angular/cdk/a11y';

// Focus trap for modals
<div cdkTrapFocus>
  <!-- Modal content -->
</div>

// Live announcer for screen readers
constructor(private liveAnnouncer: LiveAnnouncer) {}

announce(message: string): void {
  this.liveAnnouncer.announce(message);
}
```

## Progressive Web App (PWA)

### Service Worker

The application is PWA-ready with service worker support:

```bash
ng add @angular/pwa
```

**Features:**
- Offline functionality
- App shell caching
- Background sync
- Push notifications (future)

## Best Practices

### Code Organization
- Feature-based structure
- Single responsibility principle
- Consistent naming conventions
- Clear folder hierarchy

### Performance
- Lazy loading for routes
- OnPush change detection
- TrackBy functions for lists
- Avoiding memory leaks

### Maintainability
- TypeScript strict mode
- Comprehensive testing
- Clear documentation
- Code reviews

### Security
- XSS protection
- CSRF protection
- Content Security Policy
- Secure authentication flow
