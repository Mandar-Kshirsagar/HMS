using Hms.Application.DTOs;

namespace Hms.Application.Interfaces;

public interface IAppointmentService
{
    Task<List<AppointmentDto>> GetDoctorScheduleAsync(string doctorUserId, DateTime? day);
    Task<AppointmentDto> BookAsync(AppointmentDto dto);
    Task RescheduleAsync(int id, DateTime newStart);
    Task CancelAsync(int id);
}


