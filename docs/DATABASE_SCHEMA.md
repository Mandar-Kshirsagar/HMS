# Database Schema Documentation

## Overview

The HMS database is designed using **SQL Server** with **Entity Framework Core 8** implementing a **Code-First** approach. The schema follows relational database principles with proper normalization and referential integrity.

## Database Configuration

### Connection String
```
Server=.\\SQLEXPRESS;Database=HmsDb;Trusted_Connection=True;TrustServerCertificate=True;
```

### Entity Framework Context
```csharp
public class AppDbContext : IdentityDbContext<ApplicationUser>
{
    public DbSet<Patient> Patients => Set<Patient>();
    public DbSet<DoctorProfile> DoctorProfiles => Set<DoctorProfile>();
    public DbSet<Appointment> Appointments => Set<Appointment>();
    public DbSet<MedicalRecord> MedicalRecords => Set<MedicalRecord>();
    public DbSet<Document> Documents => Set<Document>();
}
```

## Core Tables

### Patients Table

Stores patient demographic and contact information.

```sql
CREATE TABLE [Patients] (
    [Id] uniqueidentifier NOT NULL DEFAULT (newid()),
    [FullName] nvarchar(150) NOT NULL,
    [DateOfBirth] datetime2 NOT NULL,
    [Gender] nvarchar(20) NOT NULL,
    [Contact] nvarchar(50) NOT NULL,
    [Address] nvarchar(250) NOT NULL,
    [ApplicationUserId] nvarchar(max) NULL,
    CONSTRAINT [PK_Patients] PRIMARY KEY ([Id])
);

CREATE NONCLUSTERED INDEX [IX_Patients_FullName] ON [Patients] ([FullName]);
```

**Columns:**
- `Id` (uniqueidentifier, PK): Unique patient identifier
- `FullName` (nvarchar(150)): Patient's full name
- `DateOfBirth` (datetime2): Patient's date of birth
- `Gender` (nvarchar(20)): Patient's gender (Male/Female/Other)
- `Contact` (nvarchar(50)): Phone number or contact information
- `Address` (nvarchar(250)): Patient's residential address
- `ApplicationUserId` (nvarchar): Reference to user account (nullable)

**Indexes:**
- Primary key on `Id`
- Non-clustered index on `FullName` for search optimization

### Appointments Table

Manages appointment scheduling between patients and doctors.

```sql
CREATE TABLE [Appointments] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [PatientId] uniqueidentifier NOT NULL,
    [DoctorUserId] nvarchar(max) NOT NULL,
    [Start] datetime2 NOT NULL,
    [End] datetime2 NOT NULL,
    [Status] int NOT NULL,
    [Reason] nvarchar(max) NULL,
    CONSTRAINT [PK_Appointments] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Appointments_Patients_PatientId] 
        FOREIGN KEY ([PatientId]) REFERENCES [Patients] ([Id]) ON DELETE RESTRICT
);

CREATE NONCLUSTERED INDEX [IX_Appointments_PatientId] ON [Appointments] ([PatientId]);
```

**Columns:**
- `Id` (int, PK, Identity): Unique appointment identifier
- `PatientId` (uniqueidentifier, FK): Reference to Patients table
- `DoctorUserId` (nvarchar): Reference to doctor's user account
- `Start` (datetime2): Appointment start time
- `End` (datetime2): Appointment end time
- `Status` (int): Appointment status (enum values)
- `Reason` (nvarchar): Reason for appointment

**Status Enum Values:**
- 0: Scheduled
- 1: Confirmed
- 2: Completed
- 3: Cancelled
- 4: NoShow

**Relationships:**
- Many-to-One with Patients (RESTRICT delete)

### MedicalRecords Table

Stores patient medical history and visit records.

```sql
CREATE TABLE [MedicalRecords] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [PatientId] uniqueidentifier NOT NULL,
    [DoctorUserId] nvarchar(max) NOT NULL,
    [VisitDate] datetime2 NOT NULL,
    [Diagnosis] nvarchar(max) NOT NULL,
    [Prescription] nvarchar(max) NOT NULL,
    [TreatmentPlan] nvarchar(max) NOT NULL,
    [Notes] nvarchar(max) NULL,
    CONSTRAINT [PK_MedicalRecords] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_MedicalRecords_Patients_PatientId] 
        FOREIGN KEY ([PatientId]) REFERENCES [Patients] ([Id]) ON DELETE CASCADE
);

CREATE NONCLUSTERED INDEX [IX_MedicalRecords_PatientId] ON [MedicalRecords] ([PatientId]);
```

**Columns:**
- `Id` (int, PK, Identity): Unique record identifier
- `PatientId` (uniqueidentifier, FK): Reference to Patients table
- `DoctorUserId` (nvarchar): Reference to doctor's user account
- `VisitDate` (datetime2): Date and time of medical visit
- `Diagnosis` (nvarchar): Medical diagnosis
- `Prescription` (nvarchar): Prescribed medications
- `TreatmentPlan` (nvarchar): Recommended treatment plan
- `Notes` (nvarchar): Additional notes (optional)

**Relationships:**
- Many-to-One with Patients (CASCADE delete)

### Documents Table

Manages patient document storage and metadata.

```sql
CREATE TABLE [Documents] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [PatientId] uniqueidentifier NOT NULL,
    [FileName] nvarchar(max) NOT NULL,
    [FilePath] nvarchar(max) NOT NULL,
    [ContentType] nvarchar(max) NOT NULL,
    [UploadedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_Documents] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Documents_Patients_PatientId] 
        FOREIGN KEY ([PatientId]) REFERENCES [Patients] ([Id]) ON DELETE CASCADE
);

CREATE NONCLUSTERED INDEX [IX_Documents_PatientId] ON [Documents] ([PatientId]);
```

**Columns:**
- `Id` (int, PK, Identity): Unique document identifier
- `PatientId` (uniqueidentifier, FK): Reference to Patients table
- `FileName` (nvarchar): Original filename
- `FilePath` (nvarchar): Server file storage path
- `ContentType` (nvarchar): MIME type of the file
- `UploadedAt` (datetime2): Upload timestamp

**Relationships:**
- Many-to-One with Patients (CASCADE delete)

### DoctorProfiles Table

Stores doctor-specific information and schedules.

```sql
CREATE TABLE [DoctorProfiles] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [ApplicationUserId] nvarchar(max) NOT NULL,
    [Specialization] nvarchar(max) NOT NULL,
    [ShiftStart] time NOT NULL,
    [ShiftEnd] time NOT NULL,
    CONSTRAINT [PK_DoctorProfiles] PRIMARY KEY ([Id])
);
```

**Columns:**
- `Id` (int, PK, Identity): Unique profile identifier
- `ApplicationUserId` (nvarchar): Reference to user account
- `Specialization` (nvarchar): Doctor's medical specialization
- `ShiftStart` (time): Daily shift start time
- `ShiftEnd` (time): Daily shift end time

## Identity Tables

### AspNetUsers Table

Core user authentication and profile information.

```sql
CREATE TABLE [AspNetUsers] (
    [Id] nvarchar(450) NOT NULL,
    [FullName] nvarchar(max) NOT NULL,
    [UserName] nvarchar(256) NULL,
    [NormalizedUserName] nvarchar(256) NULL,
    [Email] nvarchar(256) NULL,
    [NormalizedEmail] nvarchar(256) NULL,
    [EmailConfirmed] bit NOT NULL,
    [PasswordHash] nvarchar(max) NULL,
    [SecurityStamp] nvarchar(max) NULL,
    [ConcurrencyStamp] nvarchar(max) NULL,
    [PhoneNumber] nvarchar(max) NULL,
    [PhoneNumberConfirmed] bit NOT NULL,
    [TwoFactorEnabled] bit NOT NULL,
    [LockoutEnd] datetimeoffset NULL,
    [LockoutEnabled] bit NOT NULL,
    [AccessFailedCount] int NOT NULL,
    CONSTRAINT [PK_AspNetUsers] PRIMARY KEY ([Id])
);
```

**Key Columns:**
- `Id` (nvarchar(450), PK): Unique user identifier
- `FullName` (nvarchar): User's full name (custom field)
- `UserName` (nvarchar(256)): Login username
- `Email` (nvarchar(256)): User's email address
- `PasswordHash` (nvarchar): Hashed password
- `EmailConfirmed` (bit): Email verification status

### AspNetRoles Table

System roles for authorization.

```sql
CREATE TABLE [AspNetRoles] (
    [Id] nvarchar(450) NOT NULL,
    [Name] nvarchar(256) NULL,
    [NormalizedName] nvarchar(256) NULL,
    [ConcurrencyStamp] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetRoles] PRIMARY KEY ([Id])
);
```

**Default Roles:**
- Admin
- Doctor
- Nurse
- Receptionist
- Patient

### AspNetUserRoles Table

Many-to-many relationship between users and roles.

```sql
CREATE TABLE [AspNetUserRoles] (
    [UserId] nvarchar(450) NOT NULL,
    [RoleId] nvarchar(450) NOT NULL,
    CONSTRAINT [PK_AspNetUserRoles] PRIMARY KEY ([UserId], [RoleId]),
    CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId] 
        FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId] 
        FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);
```

## Entity Relationships

### Relationship Diagram

```
ApplicationUser (1) ──── (0..1) DoctorProfile
ApplicationUser (1) ──── (0..1) Patient
Patient (1) ──── (Many) Appointment
Patient (1) ──── (Many) MedicalRecord
Patient (1) ──── (Many) Document
```

### Foreign Key Constraints

#### Patient Relationships
```sql
-- Appointments reference Patients (RESTRICT)
ALTER TABLE [Appointments] 
ADD CONSTRAINT [FK_Appointments_Patients_PatientId] 
FOREIGN KEY ([PatientId]) REFERENCES [Patients] ([Id]) ON DELETE RESTRICT;

-- MedicalRecords reference Patients (CASCADE)
ALTER TABLE [MedicalRecords] 
ADD CONSTRAINT [FK_MedicalRecords_Patients_PatientId] 
FOREIGN KEY ([PatientId]) REFERENCES [Patients] ([Id]) ON DELETE CASCADE;

-- Documents reference Patients (CASCADE)
ALTER TABLE [Documents] 
ADD CONSTRAINT [FK_Documents_Patients_PatientId] 
FOREIGN KEY ([PatientId]) REFERENCES [Patients] ([Id]) ON DELETE CASCADE;
```

### Delete Behavior

- **Patient → MedicalRecord**: CASCADE (deleting patient removes all medical records)
- **Patient → Document**: CASCADE (deleting patient removes all documents)
- **Patient → Appointment**: RESTRICT (cannot delete patient with active appointments)

## Indexes and Performance

### Primary Indexes
- All tables have clustered primary key indexes
- Identity columns use IDENTITY(1,1) for auto-increment

### Secondary Indexes
```sql
-- Optimize patient name searches
CREATE NONCLUSTERED INDEX [IX_Patients_FullName] ON [Patients] ([FullName]);

-- Optimize patient-related queries
CREATE NONCLUSTERED INDEX [IX_Appointments_PatientId] ON [Appointments] ([PatientId]);
CREATE NONCLUSTERED INDEX [IX_MedicalRecords_PatientId] ON [MedicalRecords] ([PatientId]);
CREATE NONCLUSTERED INDEX [IX_Documents_PatientId] ON [Documents] ([PatientId]);

-- Identity framework indexes
CREATE UNIQUE NONCLUSTERED INDEX [UserNameIndex] ON [AspNetUsers] ([NormalizedUserName]);
CREATE NONCLUSTERED INDEX [EmailIndex] ON [AspNetUsers] ([NormalizedEmail]);
CREATE UNIQUE NONCLUSTERED INDEX [RoleNameIndex] ON [AspNetRoles] ([NormalizedName]);
```

## Data Types and Constraints

### GUID vs Identity

**GUID (uniqueidentifier):**
- Used for: Patient IDs
- Benefits: Global uniqueness, security through obscurity
- Drawbacks: Larger storage, potential fragmentation

**Identity (int):**
- Used for: Appointment, MedicalRecord, Document IDs
- Benefits: Smaller storage, better performance
- Drawbacks: Sequential, potentially predictable

### String Length Constraints

```sql
FullName: nvarchar(150)      -- Patient names
Gender: nvarchar(20)         -- Gender values
Contact: nvarchar(50)        -- Phone numbers
Address: nvarchar(250)       -- Addresses
```

### Date and Time Handling

```sql
datetime2                    -- Standard date/time storage
time                        -- Time-only for shift schedules
datetimeoffset              -- Time zone aware timestamps
```

## Seed Data

### Default Users
```sql
INSERT INTO AspNetUsers (Id, UserName, Email, FullName, EmailConfirmed, PasswordHash)
VALUES 
('admin-guid', 'admin', 'admin@hms.local', 'System Admin', 1, 'hashed-password'),
('doctor-guid', 'drsmith', 'drsmith@hms.local', 'Dr. John Smith', 1, 'hashed-password'),
('nurse-guid', 'nurseamy', 'nurseamy@hms.local', 'Nurse Amy', 1, 'hashed-password');
```

### Default Roles
```sql
INSERT INTO AspNetRoles (Id, Name, NormalizedName)
VALUES 
('role1', 'Admin', 'ADMIN'),
('role2', 'Doctor', 'DOCTOR'),
('role3', 'Nurse', 'NURSE'),
('role4', 'Receptionist', 'RECEPTIONIST'),
('role5', 'Patient', 'PATIENT');
```

### Sample Patients
```sql
INSERT INTO Patients (Id, FullName, DateOfBirth, Gender, Contact, Address)
VALUES 
('patient1-guid', 'Jane Doe', '1990-01-01', 'Female', '555-0001', '123 Main St'),
('patient2-guid', 'Mark Lee', '1985-07-20', 'Male', '555-0002', '456 Park Ave');
```

## Migration Commands

### Create Migration
```bash
dotnet ef migrations add InitialCreate --project Hms.Infrastructure --startup-project Hms.Api
```

### Update Database
```bash
dotnet ef database update --project Hms.Infrastructure --startup-project Hms.Api
```

### Drop Database
```bash
dotnet ef database drop --force --project Hms.Infrastructure --startup-project Hms.Api
```

### Generate SQL Script
```bash
dotnet ef migrations script --project Hms.Infrastructure --startup-project Hms.Api
```

## Backup and Recovery

### Backup Strategy
```sql
-- Full backup
BACKUP DATABASE HmsDb 
TO DISK = 'C:\Backups\HmsDb_Full.bak'
WITH FORMAT, INIT;

-- Differential backup
BACKUP DATABASE HmsDb 
TO DISK = 'C:\Backups\HmsDb_Diff.bak'
WITH DIFFERENTIAL, FORMAT, INIT;

-- Transaction log backup
BACKUP LOG HmsDb 
TO DISK = 'C:\Backups\HmsDb_Log.trn';
```

### Recovery Strategy
```sql
-- Point-in-time recovery
RESTORE DATABASE HmsDb 
FROM DISK = 'C:\Backups\HmsDb_Full.bak'
WITH NORECOVERY;

RESTORE DATABASE HmsDb 
FROM DISK = 'C:\Backups\HmsDb_Diff.bak'
WITH NORECOVERY;

RESTORE LOG HmsDb 
FROM DISK = 'C:\Backups\HmsDb_Log.trn'
WITH STOPAT = '2024-01-15 14:30:00';
```

## Security Considerations

### Column-Level Security
- Password hashes stored securely using ASP.NET Core Identity
- Sensitive medical data encrypted at rest (recommended)
- Personal information access logged (recommended)

### Row-Level Security
```sql
-- Example: Restrict patients to see only their own records
CREATE SECURITY POLICY PatientPolicy
ADD FILTER PREDICATE CURRENT_USER = 'patient_' + CAST(PatientId AS NVARCHAR(36))
ON MedicalRecords;
```

### Audit Trail
```sql
-- Audit table for tracking changes
CREATE TABLE AuditLog (
    Id int IDENTITY(1,1) PRIMARY KEY,
    TableName nvarchar(50),
    RecordId nvarchar(50),
    Action nvarchar(10), -- INSERT, UPDATE, DELETE
    UserId nvarchar(450),
    Timestamp datetime2 DEFAULT GETUTCDATE(),
    OldValues nvarchar(max),
    NewValues nvarchar(max)
);
```

## Performance Monitoring

### Useful Queries

#### Find Missing Indexes
```sql
SELECT 
    migs.avg_total_user_cost * (migs.avg_user_impact / 100.0) * (migs.user_seeks + migs.user_scans) AS improvement_measure,
    'CREATE INDEX [missing_index_' + CONVERT(varchar, mig.index_group_handle) + '_' + CONVERT(varchar, mid.index_handle)
    + '_' + LEFT(PARSENAME(mid.statement, 1), 20) + ']'
    + ' ON ' + mid.statement
    + ' (' + ISNULL(mid.equality_columns,'')
    + CASE WHEN mid.equality_columns IS NOT NULL AND mid.inequality_columns IS NOT NULL THEN ',' ELSE '' END
    + ISNULL(mid.inequality_columns, '')
    + ')'
    + ISNULL(' INCLUDE (' + mid.included_columns + ')', '') AS create_index_statement
FROM sys.dm_db_missing_index_groups mig
INNER JOIN sys.dm_db_missing_index_group_stats migs ON migs.group_handle = mig.index_group_handle
INNER JOIN sys.dm_db_missing_index_details mid ON mig.index_handle = mid.index_handle
WHERE migs.avg_total_user_cost * (migs.avg_user_impact / 100.0) * (migs.user_seeks + migs.user_scans) > 10
ORDER BY migs.avg_total_user_cost * migs.avg_user_impact * (migs.user_seeks + migs.user_scans) DESC;
```

#### Monitor Query Performance
```sql
SELECT TOP 10
    qs.execution_count,
    qs.total_worker_time / qs.execution_count AS avg_cpu_time,
    qs.total_elapsed_time / qs.execution_count AS avg_elapsed_time,
    SUBSTRING(qt.text, (qs.statement_start_offset/2)+1,
        ((CASE qs.statement_end_offset
            WHEN -1 THEN DATALENGTH(qt.text)
            ELSE qs.statement_end_offset
        END - qs.statement_start_offset)/2)+1) AS statement_text
FROM sys.dm_exec_query_stats qs
CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) qt
WHERE qt.text LIKE '%Patients%' OR qt.text LIKE '%Appointments%'
ORDER BY qs.total_worker_time / qs.execution_count DESC;
```

## Database Maintenance

### Regular Maintenance Tasks

#### Update Statistics
```sql
-- Update all statistics
EXEC sp_updatestats;

-- Update specific table statistics
UPDATE STATISTICS Patients;
UPDATE STATISTICS Appointments;
```

#### Rebuild Indexes
```sql
-- Rebuild all indexes for a table
ALTER INDEX ALL ON Patients REBUILD;

-- Reorganize fragmented indexes
ALTER INDEX IX_Patients_FullName ON Patients REORGANIZE;
```

#### Check Database Integrity
```sql
DBCC CHECKDB('HmsDb') WITH NO_INFOMSGS;
```

### Automated Maintenance Plan
1. **Daily**: Transaction log backup
2. **Weekly**: Differential backup, Update statistics
3. **Monthly**: Full backup, Rebuild indexes
4. **Quarterly**: Database integrity check
