using System;

namespace Hms.Domain.Entities;

public enum AppointmentStatus { Booked, Rescheduled, Cancelled, Completed }

public class Appointment
{
    public int Id { get; set; }
    public Guid PatientId { get; set; }
    public string DoctorUserId { get; set; } = string.Empty;
    public DateTime Start { get; set; }
    public DateTime End { get; set; }
    public AppointmentStatus Status { get; set; } = AppointmentStatus.Booked;
    public string? Reason { get; set; }
}


