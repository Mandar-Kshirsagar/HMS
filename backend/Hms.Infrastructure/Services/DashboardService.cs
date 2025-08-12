using Hms.Application.Interfaces;
using Hms.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Hms.Infrastructure.Services;

public class DashboardService : IDashboardService
{
    private readonly AppDbContext _db;
    public DashboardService(AppDbContext db) { _db = db; }

    public async Task<object> GetSummaryAsync()
    {
        var today = DateTime.Today;
        var totalPatients = await _db.Patients.CountAsync();
        var totalDoctors = await _db.Users.CountAsync(); // simplified
        var appointmentsToday = await _db.Appointments.CountAsync(a => a.Start.Date == today);
        return new { totalPatients, totalDoctors, appointmentsToday };
    }

    public async Task<IEnumerable<object>> GetMonthlyVisitsAsync(int year)
    {
        var data = await _db.MedicalRecords
            .Where(r => r.VisitDate.Year == year)
            .GroupBy(r => r.VisitDate.Month)
            .Select(g => new { month = g.Key, visits = g.Count() })
            .OrderBy(x => x.month)
            .ToListAsync();
        return data;
    }
}


