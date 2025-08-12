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

        // MedicalRecord entity configuration
        builder.Entity<MedicalRecord>(entity =>
        {
            entity.Property(r => r.PatientId)
                  .IsRequired();
        });

        // Document entity configuration
        builder.Entity<Document>(entity =>
        {
            entity.Property(d => d.PatientId)
                  .IsRequired();
        });
    }
}


