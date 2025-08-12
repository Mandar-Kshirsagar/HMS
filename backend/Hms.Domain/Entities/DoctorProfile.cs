using System;

namespace Hms.Domain.Entities;

public class DoctorProfile
{
    public int Id { get; set; }
    public string ApplicationUserId { get; set; } = string.Empty;
    public string Specialization { get; set; } = string.Empty;
    public TimeOnly ShiftStart { get; set; }
    public TimeOnly ShiftEnd { get; set; }
}


