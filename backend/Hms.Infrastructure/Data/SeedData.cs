using Hms.Domain.Entities;
using Hms.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Hms.Infrastructure.Data;

public static class SeedData
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        var roleMgr = services.GetRequiredService<RoleManager<IdentityRole>>();
        var userMgr = services.GetRequiredService<UserManager<ApplicationUser>>();
        var db = services.GetRequiredService<AppDbContext>();

        var roles = new[] { "Admin", "Doctor", "Nurse", "Receptionist", "Patient" };
        foreach (var r in roles)
            if (!await roleMgr.RoleExistsAsync(r)) await roleMgr.CreateAsync(new IdentityRole(r));

        async Task<ApplicationUser> EnsureUser(string userName, string fullName, string role)
        {
            var u = await userMgr.Users.FirstOrDefaultAsync(x => x.UserName == userName);
            if (u == null)
            {
                u = new ApplicationUser { UserName = userName, Email = $"{userName}@hms.local", FullName = fullName, EmailConfirmed = true };
                await userMgr.CreateAsync(u, "Passw0rd!");
                await userMgr.AddToRoleAsync(u, role);
            }
            return u;
        }

        var admin = await EnsureUser("admin", "System Admin", "Admin");
        var doc = await EnsureUser("drsmith", "Dr. John Smith", "Doctor");
        var nurse = await EnsureUser("nurseamy", "Nurse Amy", "Nurse");
        var recep = await EnsureUser("reception1", "Reception One", "Receptionist");

        if (!await db.Patients.AnyAsync())
        {
            var p1 = new Patient { FullName = "Jane Doe", DateOfBirth = new DateTime(1990,1,1), Gender="Female", Contact="555-0001", Address="123 Main St" };
            var p2 = new Patient { FullName = "Mark Lee", DateOfBirth = new DateTime(1985,7,20), Gender="Male", Contact="555-0002", Address="456 Park Ave" };
            db.Patients.AddRange(p1, p2);
            await db.SaveChangesAsync();

            db.Appointments.Add(new Appointment { PatientId = p1.Id, DoctorUserId = doc.Id, Start = DateTime.Today.AddHours(10), End = DateTime.Today.AddHours(10.5), Reason="Checkup" });
            db.MedicalRecords.Add(new MedicalRecord { PatientId = p1.Id, DoctorUserId = doc.Id, Diagnosis="Hypertension", Prescription="Medication A", TreatmentPlan="Monitor BP" });
            await db.SaveChangesAsync();
        }
    }
}


