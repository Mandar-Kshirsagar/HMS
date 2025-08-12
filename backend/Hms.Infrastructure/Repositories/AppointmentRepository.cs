using Hms.Application.Interfaces;
using Hms.Domain.Entities;
using Hms.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Hms.Infrastructure.Repositories;

public class AppointmentRepository : IAppointmentRepository
{
    private readonly AppDbContext _db;
    public AppointmentRepository(AppDbContext db) { _db = db; }

    public Task<List<Appointment>> GetDoctorScheduleAsync(string doctorUserId, DateTime? day)
    {
        var query = _db.Appointments.AsNoTracking().Where(a => a.DoctorUserId == doctorUserId);
        if (day.HasValue)
        {
            var d = day.Value.Date;
            query = query.Where(a => a.Start.Date == d);
        }
        return query.OrderBy(a => a.Start).ToListAsync();
    }

    public async Task<Appointment> AddAsync(Appointment appointment)
    {
        _db.Appointments.Add(appointment);
        await _db.SaveChangesAsync();
        return appointment;
    }

    public Task<Appointment?> GetAsync(int id) =>
        _db.Appointments.FirstOrDefaultAsync(a => a.Id == id);

    public async Task UpdateAsync(Appointment appointment)
    {
        _db.Appointments.Update(appointment);
        await _db.SaveChangesAsync();
    }
}


