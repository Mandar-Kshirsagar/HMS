# Backend Architecture Documentation

## Overview

The HMS backend is built using **.NET 8** with a **Clean Architecture** pattern, ensuring separation of concerns, testability, and maintainability. The architecture follows Domain-Driven Design (DDD) principles.

## Architecture Pattern

### Clean Architecture Layers

```
Backend/
├── Hms.Api/                # Presentation Layer
├── Hms.Application/        # Application Layer
├── Hms.Domain/            # Domain Layer
└── Hms.Infrastructure/    # Infrastructure Layer
```

## Domain Layer (`Hms.Domain`)

The core of the application containing business entities and domain logic.

### Entities

#### Patient Entity
```csharp
public class Patient
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [MaxLength(150)]
    public string FullName { get; set; } = string.Empty;
    
    public DateTime DateOfBirth { get; set; }
    
    [MaxLength(20)]
    public string Gender { get; set; } = string.Empty;
    
    [MaxLength(50)]
    public string Contact { get; set; } = string.Empty;
    
    [MaxLength(250)]
    public string Address { get; set; } = string.Empty;
    
    public string? ApplicationUserId { get; set; }
    
    // Navigation Properties
    public ICollection<MedicalRecord> MedicalRecords { get; set; } = new List<MedicalRecord>();
    public ICollection<Document> Documents { get; set; } = new List<Document>();
}
```

#### Appointment Entity
```csharp
public class Appointment
{
    public int Id { get; set; }
    public Guid PatientId { get; set; }
    public string DoctorUserId { get; set; } = string.Empty;
    public DateTime Start { get; set; }
    public DateTime End { get; set; }
    public AppointmentStatus Status { get; set; }
    public string? Reason { get; set; }
    
    // Navigation Properties
    public Patient Patient { get; set; } = null!;
}

public enum AppointmentStatus
{
    Scheduled,
    Confirmed,
    Completed,
    Cancelled,
    NoShow
}
```

#### MedicalRecord Entity
```csharp
public class MedicalRecord
{
    public int Id { get; set; }
    public Guid PatientId { get; set; }
    public string DoctorUserId { get; set; } = string.Empty;
    public DateTime VisitDate { get; set; }
    public string Diagnosis { get; set; } = string.Empty;
    public string Prescription { get; set; } = string.Empty;
    public string TreatmentPlan { get; set; } = string.Empty;
    public string? Notes { get; set; }
    
    // Navigation Properties
    public Patient Patient { get; set; } = null!;
}
```

#### Document Entity
```csharp
public class Document
{
    public int Id { get; set; }
    public Guid PatientId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public DateTime UploadedAt { get; set; }
    
    // Navigation Properties
    public Patient Patient { get; set; } = null!;
}
```

#### DoctorProfile Entity
```csharp
public class DoctorProfile
{
    public int Id { get; set; }
    public string ApplicationUserId { get; set; } = string.Empty;
    public string Specialization { get; set; } = string.Empty;
    public TimeOnly ShiftStart { get; set; }
    public TimeOnly ShiftEnd { get; set; }
}
```

## Application Layer (`Hms.Application`)

Contains business logic and application services.

### Interfaces

#### Repository Interfaces
```csharp
public interface IPatientRepository
{
    Task<List<Patient>> SearchAsync(string? query);
    Task<Patient?> GetAsync(Guid id);
    Task<Patient> AddAsync(Patient patient);
    Task UpdateAsync(Patient patient);
    Task DeleteAsync(Guid id);
}

public interface IAppointmentRepository
{
    Task<List<Appointment>> GetDoctorScheduleAsync(string doctorUserId, DateTime? day);
    Task<Appointment> AddAsync(Appointment appointment);
    Task UpdateAsync(Appointment appointment);
    Task DeleteAsync(int id);
}

public interface IMedicalRecordRepository
{
    Task<List<MedicalRecord>> GetPatientRecordsAsync(Guid patientId);
    Task<MedicalRecord> AddAsync(MedicalRecord record);
    Task UpdateAsync(MedicalRecord record);
    Task DeleteAsync(int id);
}

public interface IDocumentRepository
{
    Task<List<Document>> GetPatientDocumentsAsync(Guid patientId);
    Task<Document> AddAsync(Document document);
    Task DeleteAsync(int id);
}
```

#### Service Interfaces
```csharp
public interface IPatientService
{
    Task<List<PatientDto>> SearchAsync(string? query);
    Task<PatientDto?> GetAsync(Guid id);
    Task<PatientDto> CreateAsync(CreatePatientDto dto);
    Task UpdateAsync(Guid id, CreatePatientDto dto);
}

public interface IAppointmentService
{
    Task<List<AppointmentDto>> GetDoctorScheduleAsync(string doctorUserId, DateTime? day);
    Task<AppointmentDto> BookAsync(CreateAppointmentDto dto);
    Task RescheduleAsync(int id, DateTime newStart);
    Task CancelAsync(int id);
}

public interface IMedicalRecordService
{
    Task<List<MedicalRecordDto>> GetPatientRecordsAsync(Guid patientId);
    Task<MedicalRecordDto> AddAsync(CreateMedicalRecordDto dto);
}

public interface IDashboardService
{
    Task<DashboardSummaryDto> GetSummaryAsync();
    Task<List<MonthlyVisitsDto>> GetMonthlyVisitsAsync(int year);
}
```

### Services

#### PatientService
```csharp
public class PatientService : IPatientService
{
    private readonly IPatientRepository _repo;
    private readonly IMapper _mapper;
    
    public PatientService(IPatientRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<List<PatientDto>> SearchAsync(string? q) =>
        (await _repo.SearchAsync(q)).Select(_mapper.Map<PatientDto>).ToList();

    public async Task<PatientDto?> GetAsync(Guid id)
    {
        var patient = await _repo.GetAsync(id);
        return patient == null ? null : _mapper.Map<PatientDto>(patient);
    }

    public async Task<PatientDto> CreateAsync(CreatePatientDto dto)
    {
        var entity = _mapper.Map<Patient>(dto);
        entity = await _repo.AddAsync(entity);
        return _mapper.Map<PatientDto>(entity);
    }

    public async Task UpdateAsync(Guid id, CreatePatientDto dto)
    {
        var entity = await _repo.GetAsync(id) ?? throw new KeyNotFoundException();
        entity.FullName = dto.FullName;
        entity.DateOfBirth = dto.DateOfBirth;
        entity.Gender = dto.Gender;
        entity.Contact = dto.Contact;
        entity.Address = dto.Address;
        await _repo.UpdateAsync(entity);
    }
}
```

### DTOs (Data Transfer Objects)

#### Patient DTOs
```csharp
public class PatientDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public string Gender { get; set; } = string.Empty;
    public string Contact { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
}

public class CreatePatientDto
{
    [Required]
    [MaxLength(150)]
    public string FullName { get; set; } = string.Empty;
    
    [Required]
    public DateTime DateOfBirth { get; set; }
    
    [Required]
    [MaxLength(20)]
    public string Gender { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(50)]
    public string Contact { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(250)]
    public string Address { get; set; } = string.Empty;
}
```

## Infrastructure Layer (`Hms.Infrastructure`)

Contains implementations of repositories and external concerns.

### Database Context

#### AppDbContext
```csharp
public class AppDbContext : IdentityDbContext<ApplicationUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Patient> Patients => Set<Patient>();
    public DbSet<DoctorProfile> DoctorProfiles => Set<DoctorProfile>();
    public DbSet<Appointment> Appointments => Set<Appointment>();
    public DbSet<MedicalRecord> MedicalRecords => Set<MedicalRecord>();
    public DbSet<Document> Documents => Set<Document>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        
        // Patient entity configuration
        builder.Entity<Patient>(entity =>
        {
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.HasIndex(p => p.FullName);
            entity.HasMany(p => p.MedicalRecords)
                  .WithOne()
                  .HasForeignKey(r => r.PatientId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasMany(p => p.Documents)
                  .WithOne()
                  .HasForeignKey(d => d.PatientId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Appointment entity configuration
        builder.Entity<Appointment>(entity =>
        {
            entity.HasOne<Patient>()
                  .WithMany()
                  .HasForeignKey(a => a.PatientId)
                  .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
```

### Repository Implementations

#### PatientRepository
```csharp
public class PatientRepository : IPatientRepository
{
    private readonly AppDbContext _context;

    public PatientRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Patient>> SearchAsync(string? query)
    {
        var patients = _context.Patients.AsQueryable();
        
        if (!string.IsNullOrEmpty(query))
        {
            patients = patients.Where(p => 
                p.FullName.Contains(query) || 
                p.Contact.Contains(query) ||
                p.Id.ToString().Contains(query));
        }
        
        return await patients.OrderBy(p => p.FullName).ToListAsync();
    }

    public async Task<Patient?> GetAsync(Guid id)
    {
        return await _context.Patients
            .Include(p => p.MedicalRecords)
            .Include(p => p.Documents)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<Patient> AddAsync(Patient patient)
    {
        _context.Patients.Add(patient);
        await _context.SaveChangesAsync();
        return patient;
    }

    public async Task UpdateAsync(Patient patient)
    {
        _context.Patients.Update(patient);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var patient = await _context.Patients.FindAsync(id);
        if (patient != null)
        {
            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync();
        }
    }
}
```

### Identity Configuration

#### ApplicationUser
```csharp
public class ApplicationUser : IdentityUser
{
    public string FullName { get; set; } = string.Empty;
}
```

### Data Seeding

#### SeedData
```csharp
public static class SeedData
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        var roleMgr = services.GetRequiredService<RoleManager<IdentityRole>>();
        var userMgr = services.GetRequiredService<UserManager<ApplicationUser>>();
        var db = services.GetRequiredService<AppDbContext>();

        // Seed roles
        var roles = new[] { "Admin", "Doctor", "Nurse", "Receptionist", "Patient" };
        foreach (var role in roles)
        {
            if (!await roleMgr.RoleExistsAsync(role))
            {
                await roleMgr.CreateAsync(new IdentityRole(role));
            }
        }

        // Seed users
        async Task<ApplicationUser> EnsureUser(string userName, string fullName, string role)
        {
            var user = await userMgr.Users.FirstOrDefaultAsync(x => x.UserName == userName);
            if (user == null)
            {
                user = new ApplicationUser 
                { 
                    UserName = userName, 
                    Email = $"{userName}@hms.local", 
                    FullName = fullName, 
                    EmailConfirmed = true 
                };
                await userMgr.CreateAsync(user, "Passw0rd!");
                await userMgr.AddToRoleAsync(user, role);
            }
            return user;
        }

        var admin = await EnsureUser("admin", "System Admin", "Admin");
        var doctor = await EnsureUser("drsmith", "Dr. John Smith", "Doctor");

        // Seed sample data
        if (!await db.Patients.AnyAsync())
        {
            var patient1 = new Patient 
            { 
                FullName = "Jane Doe", 
                DateOfBirth = new DateTime(1990, 1, 1), 
                Gender = "Female", 
                Contact = "555-0001", 
                Address = "123 Main St" 
            };
            
            db.Patients.Add(patient1);
            await db.SaveChangesAsync();

            db.Appointments.Add(new Appointment 
            { 
                PatientId = patient1.Id, 
                DoctorUserId = doctor.Id, 
                Start = DateTime.Today.AddHours(10), 
                End = DateTime.Today.AddHours(10.5), 
                Reason = "Checkup",
                Status = AppointmentStatus.Scheduled
            });

            db.MedicalRecords.Add(new MedicalRecord 
            { 
                PatientId = patient1.Id, 
                DoctorUserId = doctor.Id, 
                VisitDate = DateTime.Now,
                Diagnosis = "Hypertension", 
                Prescription = "Medication A", 
                TreatmentPlan = "Monitor BP" 
            });

            await db.SaveChangesAsync();
        }
    }
}
```

## Presentation Layer (`Hms.Api`)

Contains controllers and configuration.

### Controllers

#### PatientsController
```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PatientsController : ControllerBase
{
    private readonly IPatientService _service;

    public PatientsController(IPatientService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<PatientDto>>> Search([FromQuery] string? q)
    {
        var patients = await _service.SearchAsync(q);
        return Ok(patients);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PatientDto>> Get(Guid id)
    {
        var patient = await _service.GetAsync(id);
        if (patient == null)
            return NotFound();
        
        return Ok(patient);
    }

    [HttpPost]
    public async Task<ActionResult<PatientDto>> Create(CreatePatientDto dto)
    {
        var patient = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(Get), new { id = patient.Id }, patient);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, CreatePatientDto dto)
    {
        try
        {
            await _service.UpdateAsync(id, dto);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }
}
```

#### AuthController
```csharp
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IConfiguration _config;

    public AuthController(UserManager<ApplicationUser> userManager, IConfiguration config)
    {
        _userManager = userManager;
        _config = config;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var user = await _userManager.FindByNameAsync(request.Username);
        if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
        {
            return Unauthorized();
        }

        var roles = await _userManager.GetRolesAsync(user);
        var token = GenerateJwtToken(user, roles);

        return Ok(new { token, roles });
    }

    private string GenerateJwtToken(ApplicationUser user, IList<string> roles)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.UniqueName, user.UserName!),
            new("fullName", user.FullName)
        };

        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(24),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
```

### Program.cs Configuration

```csharp
var builder = WebApplication.CreateBuilder(args);

// Database
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Identity
builder.Services.AddIdentityCore<ApplicationUser>(opt =>
{
    opt.User.RequireUniqueEmail = true;
})
.AddRoles<IdentityRole>()
.AddEntityFrameworkStores<AppDbContext>();

// JWT Authentication
var jwtSection = builder.Configuration.GetSection("Jwt");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidIssuer = jwtSection["Issuer"],
            ValidAudience = jwtSection["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSection["Key"]!))
        };
    });

// CORS
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("AllowAngular", policy =>
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());
});

// AutoMapper
builder.Services.AddAutoMapper(cfg => cfg.AddProfile<MappingProfile>());

// Services
builder.Services.AddScoped<IPatientRepository, PatientRepository>();
builder.Services.AddScoped<IPatientService, PatientService>();
// ... other services

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure pipeline
app.UseSwagger();
app.UseSwaggerUI();
app.UseStaticFiles();
app.UseCors("AllowAngular");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Seed data
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var db = services.GetRequiredService<AppDbContext>();
    await db.Database.EnsureCreatedAsync();
    await SeedData.SeedAsync(services);
}

app.Run();
```

### AutoMapper Configuration

#### MappingProfile
```csharp
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Patient, PatientDto>();
        CreateMap<CreatePatientDto, Patient>();
        
        CreateMap<Appointment, AppointmentDto>();
        CreateMap<CreateAppointmentDto, Appointment>();
        
        CreateMap<MedicalRecord, MedicalRecordDto>();
        CreateMap<CreateMedicalRecordDto, MedicalRecord>();
        
        CreateMap<Document, DocumentDto>();
    }
}
```

## Database Design

### Entity Relationships

```
Patient (1) ──── (Many) MedicalRecord
Patient (1) ──── (Many) Document
Patient (1) ──── (Many) Appointment
DoctorProfile (1) ──── (1) ApplicationUser
```

### Database Tables

- **AspNetUsers** - Identity users
- **AspNetRoles** - Identity roles
- **AspNetUserRoles** - User-role relationships
- **Patients** - Patient information
- **DoctorProfiles** - Doctor-specific information
- **Appointments** - Appointment scheduling
- **MedicalRecords** - Patient medical history
- **Documents** - Patient document storage

## Security Implementation

### JWT Authentication

```csharp
[Authorize]
[ApiController]
public class SecureController : ControllerBase
{
    // All actions require authentication
}

[Authorize(Roles = "Admin,Doctor")]
public IActionResult AdminOrDoctorOnly()
{
    // Only Admin or Doctor roles can access
}
```

### Input Validation

```csharp
public class CreatePatientDto
{
    [Required]
    [StringLength(150, MinimumLength = 2)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [DataType(DataType.Date)]
    public DateTime DateOfBirth { get; set; }

    [Required]
    [RegularExpression(@"^(Male|Female|Other)$")]
    public string Gender { get; set; } = string.Empty;

    [Required]
    [Phone]
    public string Contact { get; set; } = string.Empty;
}
```

## Error Handling

### Global Exception Handling

```csharp
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        var response = exception switch
        {
            KeyNotFoundException => new { error = "Resource not found", status = 404 },
            UnauthorizedAccessException => new { error = "Unauthorized", status = 401 },
            ArgumentException => new { error = "Invalid argument", status = 400 },
            _ => new { error = "Internal server error", status = 500 }
        };

        context.Response.StatusCode = response.status;
        await context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
}
```

## Performance Considerations

### Entity Framework Optimizations

```csharp
// Async operations
public async Task<List<Patient>> GetPatientsAsync()
{
    return await _context.Patients.ToListAsync();
}

// Projection for performance
public async Task<List<PatientSummaryDto>> GetPatientSummariesAsync()
{
    return await _context.Patients
        .Select(p => new PatientSummaryDto
        {
            Id = p.Id,
            FullName = p.FullName,
            Contact = p.Contact
        })
        .ToListAsync();
}

// Include related data efficiently
public async Task<Patient?> GetPatientWithRecordsAsync(Guid id)
{
    return await _context.Patients
        .Include(p => p.MedicalRecords.Take(10)) // Limit related data
        .FirstOrDefaultAsync(p => p.Id == id);
}
```

### Caching Strategy

```csharp
public class CachedPatientService : IPatientService
{
    private readonly IPatientService _inner;
    private readonly IMemoryCache _cache;

    public CachedPatientService(IPatientService inner, IMemoryCache cache)
    {
        _inner = inner;
        _cache = cache;
    }

    public async Task<PatientDto?> GetAsync(Guid id)
    {
        var cacheKey = $"patient_{id}";
        
        if (_cache.TryGetValue(cacheKey, out PatientDto? cached))
        {
            return cached;
        }

        var patient = await _inner.GetAsync(id);
        if (patient != null)
        {
            _cache.Set(cacheKey, patient, TimeSpan.FromMinutes(10));
        }

        return patient;
    }
}
```

## Testing Strategy

### Unit Testing

```csharp
public class PatientServiceTests
{
    private readonly Mock<IPatientRepository> _mockRepo;
    private readonly Mock<IMapper> _mockMapper;
    private readonly PatientService _service;

    public PatientServiceTests()
    {
        _mockRepo = new Mock<IPatientRepository>();
        _mockMapper = new Mock<IMapper>();
        _service = new PatientService(_mockRepo.Object, _mockMapper.Object);
    }

    [Fact]
    public async Task GetAsync_ExistingId_ReturnsPatient()
    {
        // Arrange
        var patientId = Guid.NewGuid();
        var patient = new Patient { Id = patientId, FullName = "Test Patient" };
        var patientDto = new PatientDto { Id = patientId, FullName = "Test Patient" };

        _mockRepo.Setup(r => r.GetAsync(patientId)).ReturnsAsync(patient);
        _mockMapper.Setup(m => m.Map<PatientDto>(patient)).Returns(patientDto);

        // Act
        var result = await _service.GetAsync(patientId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(patientId, result.Id);
        Assert.Equal("Test Patient", result.FullName);
    }
}
```

### Integration Testing

```csharp
public class PatientsControllerIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public PatientsControllerIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task GetPatients_ReturnsSuccessAndCorrectContentType()
    {
        // Act
        var response = await _client.GetAsync("/api/patients");

        // Assert
        response.EnsureSuccessStatusCode();
        Assert.Equal("application/json; charset=utf-8", response.Content.Headers.ContentType?.ToString());
    }
}
```

## Deployment Configuration

### Production Settings

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=prod-server;Database=HmsDb;User Id=hms_user;Password=secure_password;TrustServerCertificate=true;"
  },
  "Jwt": {
    "Key": "production-secure-256-bit-key",
    "Issuer": "HmsApi",
    "Audience": "HmsClient"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Warning",
      "Microsoft": "Warning"
    }
  }
}
```

### Docker Configuration

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["Hms.Api/Hms.Api.csproj", "Hms.Api/"]
RUN dotnet restore "Hms.Api/Hms.Api.csproj"
COPY . .
WORKDIR "/src/Hms.Api"
RUN dotnet build "Hms.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Hms.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Hms.Api.dll"]
```
