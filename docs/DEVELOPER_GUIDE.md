# Developer Guide - Hospital Management System (HMS)

## Table of Contents
1. [Development Environment Setup](#development-environment-setup)
2. [Project Structure](#project-structure)
3. [Backend Development](#backend-development)
4. [Frontend Development](#frontend-development)
5. [Database Development](#database-development)
6. [API Development](#api-development)
7. [Testing Guidelines](#testing-guidelines)
8. [Code Standards](#code-standards)
9. [Debugging and Troubleshooting](#debugging-and-troubleshooting)
10. [Contributing Guidelines](#contributing-guidelines)

## Development Environment Setup

### Prerequisites

#### Required Software
- **Visual Studio Code** or **Visual Studio 2022**
- **.NET 8 SDK** (latest version)
- **Node.js 18+** with npm
- **Angular CLI 20**
- **SQL Server Express** or **LocalDB**
- **Git** for version control

#### Recommended Extensions (VS Code)
```json
{
  "recommendations": [
    "ms-dotnettools.csharp",
    "angular.ng-template",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-mssql.mssql"
  ]
}
```

### Environment Setup

#### 1. Clone Repository
```bash
git clone <repository-url>
cd HMS
```

#### 2. Backend Setup
```bash
cd backend
dotnet restore
dotnet build
```

#### 3. Frontend Setup
```bash
cd frontend
npm install
```

#### 4. Database Setup
```bash
cd backend/Hms.Infrastructure
dotnet ef database update --startup-project ../Hms.Api
```

### Development Workflow

#### Daily Development Routine
1. **Pull latest changes**: `git pull origin main`
2. **Start backend**: `cd backend/Hms.Api && dotnet run`
3. **Start frontend**: `cd frontend && npm start`
4. **Run tests**: Ensure all tests pass before committing
5. **Commit changes**: Follow commit message conventions

## Project Structure

### Backend Architecture

```
backend/
├── Hms.Api/                    # Web API Layer
│   ├── Controllers/            # API Controllers
│   ├── DTOs/                  # API Data Transfer Objects
│   ├── Profiles/              # AutoMapper Profiles
│   ├── Middleware/            # Custom Middleware
│   └── Program.cs             # Application Entry Point
├── Hms.Application/           # Application Layer
│   ├── Services/              # Business Logic Services
│   ├── Interfaces/            # Service Contracts
│   ├── DTOs/                  # Application DTOs
│   └── Validators/            # Input Validation
├── Hms.Domain/               # Domain Layer
│   ├── Entities/             # Domain Entities
│   ├── Enums/                # Domain Enumerations
│   ├── ValueObjects/         # Value Objects
│   └── Interfaces/           # Domain Interfaces
└── Hms.Infrastructure/       # Infrastructure Layer
    ├── Data/                 # Database Context
    ├── Repositories/         # Data Access Layer
    ├── Services/             # Infrastructure Services
    ├── Identity/             # Identity Configuration
    └── Migrations/           # EF Migrations
```

### Frontend Architecture

```
frontend/src/
├── app/
│   ├── core/                 # Core Services & Guards
│   │   ├── guards/           # Route Guards
│   │   ├── interceptors/     # HTTP Interceptors
│   │   └── services/         # Singleton Services
│   ├── features/             # Feature Modules
│   │   ├── auth/            # Authentication
│   │   ├── dashboard/       # Dashboard
│   │   ├── patients/        # Patient Management
│   │   ├── appointments/    # Appointments
│   │   ├── records/         # Medical Records
│   │   └── staff/           # Staff Management
│   ├── shared/              # Shared Components
│   │   ├── components/      # Reusable Components
│   │   ├── pipes/           # Custom Pipes
│   │   └── material/        # Angular Material Module
│   └── app.component.ts     # Root Component
├── environments/            # Environment Configuration
├── assets/                  # Static Assets
└── styles.scss             # Global Styles
```

## Backend Development

### Entity Framework Development

#### Creating New Entities

```csharp
// Domain/Entities/Example.cs
using System.ComponentModel.DataAnnotations;

namespace Hms.Domain.Entities
{
    public class Example
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public virtual ICollection<RelatedEntity> RelatedEntities { get; set; } = new List<RelatedEntity>();
    }
}
```

#### Database Context Configuration

```csharp
// Infrastructure/Data/AppDbContext.cs
protected override void OnModelCreating(ModelBuilder builder)
{
    base.OnModelCreating(builder);
    
    builder.Entity<Example>(entity =>
    {
        entity.HasKey(e => e.Id);
        entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
        entity.HasIndex(e => e.Name);
        
        entity.HasMany(e => e.RelatedEntities)
              .WithOne()
              .HasForeignKey(r => r.ExampleId)
              .OnDelete(DeleteBehavior.Cascade);
    });
}
```

#### Creating Migrations

```bash
# Add new migration
dotnet ef migrations add AddExampleEntity --project Hms.Infrastructure --startup-project Hms.Api

# Update database
dotnet ef database update --project Hms.Infrastructure --startup-project Hms.Api

# Generate SQL script
dotnet ef migrations script --project Hms.Infrastructure --startup-project Hms.Api
```

### Repository Pattern Implementation

#### Repository Interface

```csharp
// Application/Interfaces/IExampleRepository.cs
public interface IExampleRepository
{
    Task<List<Example>> GetAllAsync();
    Task<Example?> GetByIdAsync(int id);
    Task<Example> AddAsync(Example entity);
    Task UpdateAsync(Example entity);
    Task DeleteAsync(int id);
    Task<List<Example>> SearchAsync(string query);
}
```

#### Repository Implementation

```csharp
// Infrastructure/Repositories/ExampleRepository.cs
public class ExampleRepository : IExampleRepository
{
    private readonly AppDbContext _context;

    public ExampleRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Example>> GetAllAsync()
    {
        return await _context.Examples
            .OrderBy(e => e.Name)
            .ToListAsync();
    }

    public async Task<Example?> GetByIdAsync(int id)
    {
        return await _context.Examples
            .Include(e => e.RelatedEntities)
            .FirstOrDefaultAsync(e => e.Id == id);
    }

    public async Task<Example> AddAsync(Example entity)
    {
        _context.Examples.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task UpdateAsync(Example entity)
    {
        _context.Examples.Update(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await _context.Examples.FindAsync(id);
        if (entity != null)
        {
            _context.Examples.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<List<Example>> SearchAsync(string query)
    {
        return await _context.Examples
            .Where(e => e.Name.Contains(query))
            .ToListAsync();
    }
}
```

### Service Layer Development

#### Service Interface

```csharp
// Application/Interfaces/IExampleService.cs
public interface IExampleService
{
    Task<List<ExampleDto>> GetAllAsync();
    Task<ExampleDto?> GetByIdAsync(int id);
    Task<ExampleDto> CreateAsync(CreateExampleDto dto);
    Task UpdateAsync(int id, CreateExampleDto dto);
    Task DeleteAsync(int id);
}
```

#### Service Implementation

```csharp
// Application/Services/ExampleService.cs
public class ExampleService : IExampleService
{
    private readonly IExampleRepository _repository;
    private readonly IMapper _mapper;
    private readonly ILogger<ExampleService> _logger;

    public ExampleService(
        IExampleRepository repository,
        IMapper mapper,
        ILogger<ExampleService> logger)
    {
        _repository = repository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<List<ExampleDto>> GetAllAsync()
    {
        try
        {
            var entities = await _repository.GetAllAsync();
            return entities.Select(_mapper.Map<ExampleDto>).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving examples");
            throw;
        }
    }

    public async Task<ExampleDto?> GetByIdAsync(int id)
    {
        var entity = await _repository.GetByIdAsync(id);
        return entity == null ? null : _mapper.Map<ExampleDto>(entity);
    }

    public async Task<ExampleDto> CreateAsync(CreateExampleDto dto)
    {
        var entity = _mapper.Map<Example>(dto);
        entity = await _repository.AddAsync(entity);
        
        _logger.LogInformation("Created example with ID {Id}", entity.Id);
        return _mapper.Map<ExampleDto>(entity);
    }

    public async Task UpdateAsync(int id, CreateExampleDto dto)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity == null)
            throw new NotFoundException($"Example with ID {id} not found");

        _mapper.Map(dto, entity);
        await _repository.UpdateAsync(entity);
        
        _logger.LogInformation("Updated example with ID {Id}", id);
    }

    public async Task DeleteAsync(int id)
    {
        await _repository.DeleteAsync(id);
        _logger.LogInformation("Deleted example with ID {Id}", id);
    }
}
```

### Controller Development

#### RESTful Controller

```csharp
// Api/Controllers/ExampleController.cs
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ExampleController : ControllerBase
{
    private readonly IExampleService _service;
    private readonly ILogger<ExampleController> _logger;

    public ExampleController(
        IExampleService service,
        ILogger<ExampleController> logger)
    {
        _service = service;
        _logger = logger;
    }

    /// <summary>
    /// Get all examples
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(List<ExampleDto>), 200)]
    public async Task<ActionResult<List<ExampleDto>>> GetAll()
    {
        var examples = await _service.GetAllAsync();
        return Ok(examples);
    }

    /// <summary>
    /// Get example by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ExampleDto), 200)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<ExampleDto>> GetById(int id)
    {
        var example = await _service.GetByIdAsync(id);
        if (example == null)
            return NotFound();

        return Ok(example);
    }

    /// <summary>
    /// Create new example
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(ExampleDto), 201)]
    [ProducesResponseType(400)]
    public async Task<ActionResult<ExampleDto>> Create(CreateExampleDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var example = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = example.Id }, example);
    }

    /// <summary>
    /// Update existing example
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> Update(int id, CreateExampleDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            await _service.UpdateAsync(id, dto);
            return NoContent();
        }
        catch (NotFoundException)
        {
            return NotFound();
        }
    }

    /// <summary>
    /// Delete example
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
        catch (NotFoundException)
        {
            return NotFound();
        }
    }
}
```

### Dependency Injection Configuration

```csharp
// Program.cs
// Register repositories
builder.Services.AddScoped<IExampleRepository, ExampleRepository>();

// Register services
builder.Services.AddScoped<IExampleService, ExampleService>();

// Register AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile));

// Register validation
builder.Services.AddScoped<IValidator<CreateExampleDto>, CreateExampleDtoValidator>();
```

## Frontend Development

### Angular Component Development

#### Component Structure

```typescript
// features/example/example.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../shared/material/material.module';
import { ExampleService, Example, CreateExample } from '../../core/services/example.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  examples: Example[] = [];
  exampleForm: FormGroup;
  loading = false;
  selectedExample?: Example;

  displayedColumns = ['id', 'name', 'createdAt', 'actions'];

  constructor(
    private exampleService: ExampleService,
    private fb: FormBuilder
  ) {
    this.exampleForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    this.loadExamples();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadExamples(): void {
    this.loading = true;
    this.exampleService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (examples) => {
          this.examples = examples;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading examples:', error);
          this.loading = false;
        }
      });
  }

  onSubmit(): void {
    if (this.exampleForm.valid) {
      const createDto: CreateExample = this.exampleForm.value;
      
      this.exampleService.create(createDto)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.exampleForm.reset();
            this.loadExamples();
          },
          error: (error) => {
            console.error('Error creating example:', error);
          }
        });
    }
  }

  editExample(example: Example): void {
    this.selectedExample = example;
    this.exampleForm.patchValue({
      name: example.name
    });
  }

  deleteExample(id: number): void {
    if (confirm('Are you sure you want to delete this example?')) {
      this.exampleService.delete(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => this.loadExamples(),
          error: (error) => console.error('Error deleting example:', error)
        });
    }
  }
}
```

#### Component Template

```html
<!-- features/example/example.component.html -->
<div class="example-container">
  <!-- Header Section -->
  <div class="page-header">
    <h1>Example Management</h1>
    <p>Manage example entities</p>
  </div>

  <!-- Form Section -->
  <mat-card class="form-card">
    <mat-card-header>
      <mat-card-title>
        {{ selectedExample ? 'Edit Example' : 'Create Example' }}
      </mat-card-title>
    </mat-card-header>
    
    <mat-card-content>
      <form [formGroup]="exampleForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" placeholder="Enter name">
          <mat-error *ngIf="exampleForm.get('name')?.hasError('required')">
            Name is required
          </mat-error>
          <mat-error *ngIf="exampleForm.get('name')?.hasError('maxlength')">
            Name cannot exceed 100 characters
          </mat-error>
        </mat-form-field>
        
        <div class="form-actions">
          <button mat-raised-button color="primary" type="submit" [disabled]="exampleForm.invalid">
            {{ selectedExample ? 'Update' : 'Create' }}
          </button>
          <button mat-button type="button" (click)="exampleForm.reset(); selectedExample = undefined">
            Cancel
          </button>
        </div>
      </form>
    </mat-card-content>
  </mat-card>

  <!-- Table Section -->
  <mat-card class="table-card">
    <mat-card-header>
      <mat-card-title>Examples</mat-card-title>
    </mat-card-header>
    
    <mat-card-content>
      <div class="table-container">
        <table mat-table [dataSource]="examples" class="full-width">
          <!-- ID Column -->
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>ID</th>
            <td mat-cell *matCellDef="let example">{{ example.id }}</td>
          </ng-container>

          <!-- Name Column -->
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let example">{{ example.name }}</td>
          </ng-container>

          <!-- Created At Column -->
          <ng-container matColumnDef="createdAt">
            <th mat-header-cell *matHeaderCellDef>Created</th>
            <td mat-cell *matCellDef="let example">{{ example.createdAt | date:'short' }}</td>
          </ng-container>

          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let example">
              <button mat-icon-button (click)="editExample(example)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteExample(example.id)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>
      
      <!-- Loading Indicator -->
      <div *ngIf="loading" class="loading-container">
        <mat-spinner></mat-spinner>
      </div>
    </mat-card-content>
  </mat-card>
</div>
```

### Service Development

#### HTTP Service

```typescript
// core/services/example.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Example {
  id: number;
  name: string;
  createdAt: Date;
}

export interface CreateExample {
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExampleService {
  private readonly apiUrl = `${environment.apiUrl}/examples`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Example[]> {
    return this.http.get<Example[]>(this.apiUrl);
  }

  getById(id: number): Observable<Example> {
    return this.http.get<Example>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateExample): Observable<Example> {
    return this.http.post<Example>(this.apiUrl, dto);
  }

  update(id: number, dto: CreateExample): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

### Custom Pipes

```typescript
// shared/pipes/age.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'age',
  standalone: true
})
export class AgePipe implements PipeTransform {
  transform(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
}
```

### Guard Implementation

```typescript
// core/guards/role.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = route.data['roles'] as string[];
    
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    if (requiredRoles && !this.authService.hasRole(requiredRoles)) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }
}
```

## Database Development

### Migration Best Practices

#### Creating Migrations

```bash
# Descriptive migration names
dotnet ef migrations add AddPatientMedicalHistoryTable
dotnet ef migrations add UpdateAppointmentStatusEnum
dotnet ef migrations add CreateIndexOnPatientFullName
```

#### Migration Naming Conventions
- **Add**: Creating new tables/columns
- **Update**: Modifying existing structures
- **Remove**: Deleting tables/columns
- **Create**: Adding indexes/constraints
- **Modify**: Altering data types/constraints

#### Data Migrations

```csharp
// Infrastructure/Migrations/20240101000000_SeedInitialData.cs
public partial class SeedInitialData : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        // Create tables first
        migrationBuilder.CreateTable(
            name: "Examples",
            columns: table => new
            {
                Id = table.Column<int>(nullable: false)
                    .Annotation("SqlServer:Identity", "1, 1"),
                Name = table.Column<string>(maxLength: 100, nullable: false)
            });

        // Insert seed data
        migrationBuilder.InsertData(
            table: "Examples",
            columns: new[] { "Name" },
            values: new object[,]
            {
                { "Sample Example 1" },
                { "Sample Example 2" }
            });
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "Examples");
    }
}
```

### Performance Optimization

#### Query Optimization

```csharp
// Good: Use projection for large datasets
public async Task<List<PatientSummaryDto>> GetPatientSummariesAsync()
{
    return await _context.Patients
        .Select(p => new PatientSummaryDto
        {
            Id = p.Id,
            FullName = p.FullName,
            Age = DateTime.Today.Year - p.DateOfBirth.Year
        })
        .ToListAsync();
}

// Good: Use Include for related data
public async Task<Patient?> GetPatientWithRecordsAsync(Guid id)
{
    return await _context.Patients
        .Include(p => p.MedicalRecords.OrderByDescending(r => r.VisitDate).Take(5))
        .Include(p => p.Documents.OrderByDescending(d => d.UploadedAt).Take(10))
        .FirstOrDefaultAsync(p => p.Id == id);
}

// Good: Use pagination for large result sets
public async Task<PagedResult<Patient>> GetPatientsPagedAsync(int page, int pageSize, string? search)
{
    var query = _context.Patients.AsQueryable();
    
    if (!string.IsNullOrEmpty(search))
    {
        query = query.Where(p => p.FullName.Contains(search));
    }
    
    var totalCount = await query.CountAsync();
    
    var patients = await query
        .OrderBy(p => p.FullName)
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();
    
    return new PagedResult<Patient>
    {
        Items = patients,
        TotalCount = totalCount,
        Page = page,
        PageSize = pageSize
    };
}
```

## API Development

### OpenAPI/Swagger Configuration

```csharp
// Program.cs
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "HMS API",
        Version = "v1",
        Description = "Hospital Management System API",
        Contact = new OpenApiContact
        {
            Name = "Development Team",
            Email = "dev@hospital.com"
        }
    });

    // Add JWT authentication
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });

    // Include XML comments
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    c.IncludeXmlComments(xmlPath);
});
```

### API Versioning

```csharp
// Program.cs
builder.Services.AddApiVersioning(opt =>
{
    opt.DefaultApiVersion = new ApiVersion(1, 0);
    opt.AssumeDefaultVersionWhenUnspecified = true;
    opt.ApiVersionReader = ApiVersionReader.Combine(
        new UrlSegmentApiVersionReader(),
        new QueryStringApiVersionReader("version"),
        new HeaderApiVersionReader("X-Version"),
        new MediaTypeApiVersionReader("ver")
    );
});

// Controller versioning
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class PatientsV1Controller : ControllerBase
{
    // V1 implementation
}

[ApiController]
[ApiVersion("2.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class PatientsV2Controller : ControllerBase
{
    // V2 implementation with breaking changes
}
```

### Rate Limiting

```csharp
// Program.cs
builder.Services.AddRateLimiter(options =>
{
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(
        httpContext => RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.User?.Identity?.Name ?? httpContext.Request.Headers.Host.ToString(),
            factory: partition => new FixedWindowRateLimiterOptions
            {
                AutoReplenishment = true,
                PermitLimit = 100,
                Window = TimeSpan.FromMinutes(1)
            }));
});

// Apply to specific endpoints
[EnableRateLimiting("ApiPolicy")]
[HttpGet]
public async Task<ActionResult<List<Patient>>> GetPatients()
{
    // Implementation
}
```

## Testing Guidelines

### Unit Testing Backend

#### Service Testing

```csharp
// Tests/Services/ExampleServiceTests.cs
public class ExampleServiceTests
{
    private readonly Mock<IExampleRepository> _mockRepository;
    private readonly Mock<IMapper> _mockMapper;
    private readonly Mock<ILogger<ExampleService>> _mockLogger;
    private readonly ExampleService _service;

    public ExampleServiceTests()
    {
        _mockRepository = new Mock<IExampleRepository>();
        _mockMapper = new Mock<IMapper>();
        _mockLogger = new Mock<ILogger<ExampleService>>();
        _service = new ExampleService(_mockRepository.Object, _mockMapper.Object, _mockLogger.Object);
    }

    [Fact]
    public async Task GetAllAsync_ShouldReturnMappedDtos()
    {
        // Arrange
        var entities = new List<Example>
        {
            new Example { Id = 1, Name = "Test 1" },
            new Example { Id = 2, Name = "Test 2" }
        };
        var dtos = new List<ExampleDto>
        {
            new ExampleDto { Id = 1, Name = "Test 1" },
            new ExampleDto { Id = 2, Name = "Test 2" }
        };

        _mockRepository.Setup(r => r.GetAllAsync()).ReturnsAsync(entities);
        _mockMapper.Setup(m => m.Map<ExampleDto>(It.IsAny<Example>()))
                  .Returns((Example e) => dtos.First(d => d.Id == e.Id));

        // Act
        var result = await _service.GetAllAsync();

        // Assert
        Assert.Equal(2, result.Count);
        Assert.Equal("Test 1", result[0].Name);
        Assert.Equal("Test 2", result[1].Name);
        _mockRepository.Verify(r => r.GetAllAsync(), Times.Once);
    }

    [Theory]
    [InlineData(1)]
    [InlineData(999)]
    public async Task GetByIdAsync_ShouldReturnCorrectResult(int id)
    {
        // Arrange
        var entity = id == 1 ? new Example { Id = 1, Name = "Test" } : null;
        var dto = id == 1 ? new ExampleDto { Id = 1, Name = "Test" } : null;

        _mockRepository.Setup(r => r.GetByIdAsync(id)).ReturnsAsync(entity);
        if (entity != null)
        {
            _mockMapper.Setup(m => m.Map<ExampleDto>(entity)).Returns(dto!);
        }

        // Act
        var result = await _service.GetByIdAsync(id);

        // Assert
        if (id == 1)
        {
            Assert.NotNull(result);
            Assert.Equal("Test", result.Name);
        }
        else
        {
            Assert.Null(result);
        }
    }
}
```

#### Integration Testing

```csharp
// Tests/Integration/ExampleControllerTests.cs
public class ExampleControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public ExampleControllerTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                // Replace database with in-memory database
                var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));
                if (descriptor != null)
                    services.Remove(descriptor);

                services.AddDbContext<AppDbContext>(options =>
                {
                    options.UseInMemoryDatabase("TestDb");
                });
            });
        });

        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task GetExamples_ShouldReturnOkResult()
    {
        // Arrange
        await SeedTestData();

        // Act
        var response = await _client.GetAsync("/api/examples");

        // Assert
        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadAsStringAsync();
        var examples = JsonSerializer.Deserialize<List<ExampleDto>>(content, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        Assert.NotNull(examples);
        Assert.NotEmpty(examples);
    }

    private async Task SeedTestData()
    {
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await context.Database.EnsureCreatedAsync();

        if (!context.Examples.Any())
        {
            context.Examples.AddRange(
                new Example { Name = "Test Example 1" },
                new Example { Name = "Test Example 2" }
            );
            await context.SaveChangesAsync();
        }
    }
}
```

### Frontend Testing

#### Component Testing

```typescript
// features/example/example.component.spec.ts
describe('ExampleComponent', () => {
  let component: ExampleComponent;
  let fixture: ComponentFixture<ExampleComponent>;
  let mockExampleService: jasmine.SpyObj<ExampleService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ExampleService', ['getAll', 'create', 'delete']);

    await TestBed.configureTestingModule({
      imports: [
        ExampleComponent,
        NoopAnimationsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: ExampleService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ExampleComponent);
    component = fixture.componentInstance;
    mockExampleService = TestBed.inject(ExampleService) as jasmine.SpyObj<ExampleService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load examples on init', () => {
    const mockExamples: Example[] = [
      { id: 1, name: 'Test 1', createdAt: new Date() },
      { id: 2, name: 'Test 2', createdAt: new Date() }
    ];

    mockExampleService.getAll.and.returnValue(of(mockExamples));

    component.ngOnInit();

    expect(mockExampleService.getAll).toHaveBeenCalled();
    expect(component.examples).toEqual(mockExamples);
  });

  it('should create example when form is valid', () => {
    const newExample: Example = { id: 3, name: 'New Test', createdAt: new Date() };
    mockExampleService.create.and.returnValue(of(newExample));
    mockExampleService.getAll.and.returnValue(of([newExample]));

    component.exampleForm.patchValue({ name: 'New Test' });
    component.onSubmit();

    expect(mockExampleService.create).toHaveBeenCalledWith({ name: 'New Test' });
  });
});
```

#### Service Testing

```typescript
// core/services/example.service.spec.ts
describe('ExampleService', () => {
  let service: ExampleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExampleService]
    });

    service = TestBed.inject(ExampleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch examples', () => {
    const mockExamples: Example[] = [
      { id: 1, name: 'Test 1', createdAt: new Date() },
      { id: 2, name: 'Test 2', createdAt: new Date() }
    ];

    service.getAll().subscribe(examples => {
      expect(examples).toEqual(mockExamples);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/examples`);
    expect(req.request.method).toBe('GET');
    req.flush(mockExamples);
  });

  it('should create example', () => {
    const newExample: CreateExample = { name: 'New Test' };
    const createdExample: Example = { id: 1, name: 'New Test', createdAt: new Date() };

    service.create(newExample).subscribe(example => {
      expect(example).toEqual(createdExample);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/examples`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newExample);
    req.flush(createdExample);
  });
});
```

## Code Standards

### Naming Conventions

#### C# Backend
- **Classes**: PascalCase (`PatientService`, `AppDbContext`)
- **Methods**: PascalCase (`GetAllAsync`, `CreatePatient`)
- **Properties**: PascalCase (`FullName`, `DateOfBirth`)
- **Fields**: camelCase with underscore (`_repository`, `_logger`)
- **Interfaces**: PascalCase with 'I' prefix (`IPatientService`)

#### TypeScript Frontend
- **Classes**: PascalCase (`PatientComponent`, `AuthService`)
- **Methods**: camelCase (`loadPatients`, `onSubmit`)
- **Properties**: camelCase (`fullName`, `dateOfBirth`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Interfaces**: PascalCase (`Patient`, `CreatePatient`)

### Code Organization

#### File Structure
```
feature/
├── feature.component.ts       # Main component
├── feature.component.html     # Template
├── feature.component.scss     # Styles
├── feature.component.spec.ts  # Tests
├── feature.service.ts         # Service
├── feature.service.spec.ts    # Service tests
└── feature.models.ts          # Type definitions
```

#### Import Organization
```typescript
// Angular imports
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Third-party imports
import { Observable } from 'rxjs';

// Application imports
import { PatientService } from '../../core/services/patient.service';
import { MaterialModule } from '../../shared/material/material.module';
```

### Documentation Standards

#### Code Comments
```csharp
/// <summary>
/// Retrieves a patient by their unique identifier
/// </summary>
/// <param name="id">The unique patient identifier</param>
/// <returns>The patient if found, null otherwise</returns>
/// <exception cref="ArgumentException">Thrown when id is empty</exception>
public async Task<Patient?> GetByIdAsync(Guid id)
{
    if (id == Guid.Empty)
        throw new ArgumentException("Patient ID cannot be empty", nameof(id));
        
    return await _context.Patients
        .Include(p => p.MedicalRecords)
        .FirstOrDefaultAsync(p => p.Id == id);
}
```

#### JSDoc Comments
```typescript
/**
 * Loads all patients from the server
 * @returns Observable containing array of patients
 * @throws {HttpErrorResponse} When server request fails
 */
loadPatients(): Observable<Patient[]> {
  return this.http.get<Patient[]>(`${this.apiUrl}/patients`);
}
```

## Debugging and Troubleshooting

### Backend Debugging

#### Logging Configuration
```csharp
// Program.cs
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

if (builder.Environment.IsDevelopment())
{
    builder.Logging.AddFilter("Microsoft", LogLevel.Warning);
    builder.Logging.AddFilter("System", LogLevel.Warning);
}
```

#### Debug Techniques
```csharp
// Use structured logging
_logger.LogInformation("Processing patient {PatientId} with name {PatientName}", 
    patient.Id, patient.FullName);

// Add debug breakpoints strategically
public async Task<Patient> CreatePatientAsync(CreatePatientDto dto)
{
    var patient = _mapper.Map<Patient>(dto); // Breakpoint here
    
    patient = await _repository.AddAsync(patient); // And here
    
    _logger.LogInformation("Created patient with ID {PatientId}", patient.Id);
    return patient;
}
```

### Frontend Debugging

#### Browser DevTools
```typescript
// Console debugging
console.log('Patient data:', patient);
console.table(patients);
console.group('Form Validation');
console.log('Form valid:', this.form.valid);
console.log('Form errors:', this.form.errors);
console.groupEnd();

// Network debugging
this.http.get<Patient[]>('/api/patients').pipe(
  tap(patients => console.log('Received patients:', patients)),
  catchError(error => {
    console.error('API Error:', error);
    return throwError(error);
  })
).subscribe();
```

#### Angular DevTools
- Install Angular DevTools browser extension
- Use component inspector for state debugging
- Monitor change detection cycles
- Analyze performance with profiler

### Common Issues and Solutions

#### CORS Issues
```csharp
// Ensure CORS is properly configured
app.UseCors("AllowAngular");

// Check that the policy allows the correct origin
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("AllowAngular", policy =>
        policy.WithOrigins("http://localhost:4200") // Exact match required
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());
});
```

#### Entity Framework Issues
```csharp
// Enable sensitive data logging in development
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseSqlServer(connectionString)
               .EnableSensitiveDataLogging()
               .EnableDetailedErrors());
}
```

## Contributing Guidelines

### Git Workflow

#### Branch Naming
- **Feature**: `feature/patient-management`
- **Bug Fix**: `bugfix/appointment-validation`
- **Hotfix**: `hotfix/security-patch`
- **Release**: `release/v1.2.0`

#### Commit Messages
```
feat(patients): add patient search functionality

- Implement search by name and phone number
- Add filtering by registration date
- Include pagination for large result sets

Closes #123
```

#### Pull Request Process
1. **Create Feature Branch**: `git checkout -b feature/new-feature`
2. **Make Changes**: Implement feature with tests
3. **Run Tests**: Ensure all tests pass
4. **Update Documentation**: Update relevant docs
5. **Create PR**: Submit for code review
6. **Address Feedback**: Make requested changes
7. **Merge**: Squash and merge to main

### Code Review Checklist

#### Backend Review
- [ ] Follows SOLID principles
- [ ] Includes appropriate error handling
- [ ] Has unit tests with good coverage
- [ ] Uses async/await properly
- [ ] Includes proper logging
- [ ] Follows security best practices

#### Frontend Review
- [ ] Components are properly isolated
- [ ] Uses OnPush change detection where appropriate
- [ ] Includes proper error handling
- [ ] Has unit tests for components and services
- [ ] Follows accessibility guidelines
- [ ] Uses reactive patterns correctly

### Documentation Requirements

#### Code Documentation
- Public APIs must have XML documentation
- Complex business logic requires inline comments
- TypeScript interfaces should include property descriptions
- All public methods should document parameters and return values

#### Feature Documentation
- Update user guide for new features
- Add API documentation for new endpoints
- Include deployment notes for infrastructure changes
- Update developer guide for new development patterns

---

This developer guide provides comprehensive information for developing and maintaining the HMS application. For specific questions or clarifications, please refer to the team lead or create an issue in the project repository.
