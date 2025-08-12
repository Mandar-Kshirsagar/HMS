using Hms.Domain.Entities;

namespace Hms.Application.Interfaces;

public interface IAppointmentRepository
{
    Task<List<Appointment>> GetDoctorScheduleAsync(string doctorUserId, DateTime? day);
    Task<Appointment> AddAsync(Appointment appointment);
    Task<Appointment?> GetAsync(int id);
    Task UpdateAsync(Appointment appointment);
}


