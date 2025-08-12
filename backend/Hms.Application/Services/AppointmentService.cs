using AutoMapper;
using Hms.Application.DTOs;
using Hms.Application.Interfaces;
using Hms.Domain.Entities;

namespace Hms.Application.Services;

public class AppointmentService : IAppointmentService
{
    private readonly IAppointmentRepository _repo;
    private readonly IMapper _mapper;
    public AppointmentService(IAppointmentRepository repo, IMapper mapper) { _repo = repo; _mapper = mapper; }

    public async Task<List<AppointmentDto>> GetDoctorScheduleAsync(string doctorUserId, DateTime? day)
        => (await _repo.GetDoctorScheduleAsync(doctorUserId, day)).Select(a =>
            new AppointmentDto(a.Id, a.PatientId, a.DoctorUserId, a.Start, a.End, a.Status.ToString(), a.Reason)).ToList();

    public async Task<AppointmentDto> BookAsync(AppointmentDto dto)
    {
        var entity = new Appointment
        {
            PatientId = dto.PatientId,
            DoctorUserId = dto.DoctorUserId,
            Start = dto.Start,
            End = dto.End,
            Status = AppointmentStatus.Booked,
            Reason = dto.Reason
        };
        entity = await _repo.AddAsync(entity);
        return new AppointmentDto(entity.Id, entity.PatientId, entity.DoctorUserId, entity.Start, entity.End, entity.Status.ToString(), entity.Reason);
    }

    public async Task RescheduleAsync(int id, DateTime newStart)
    {
        var entity = await _repo.GetAsync(id) ?? throw new KeyNotFoundException();
        var duration = entity.End - entity.Start;
        entity.Start = newStart;
        entity.End = newStart + duration;
        entity.Status = AppointmentStatus.Rescheduled;
        await _repo.UpdateAsync(entity);
    }

    public async Task CancelAsync(int id)
    {
        var entity = await _repo.GetAsync(id) ?? throw new KeyNotFoundException();
        entity.Status = AppointmentStatus.Cancelled;
        await _repo.UpdateAsync(entity);
    }
}


