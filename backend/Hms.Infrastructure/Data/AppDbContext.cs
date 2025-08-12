using Hms.Domain.Entities;
using Hms.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Hms.Infrastructure.Data;

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
        builder.Entity<Patient>().HasIndex(p => p.FullName);
        builder.Entity<Appointment>()
               .HasOne<Patient>()
               .WithMany()
               .HasForeignKey(a => a.PatientId);
        builder.Entity<MedicalRecord>()
               .HasOne<Patient>()
               .WithMany()
               .HasForeignKey(r => r.PatientId);
        builder.Entity<Document>()
               .HasOne<Patient>()
               .WithMany()
               .HasForeignKey(d => d.PatientId);
    }
}


