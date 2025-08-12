namespace Hms.Application.DTOs;

public record PatientDto(Guid Id, string FullName, DateTime DateOfBirth, string Gender, string Contact, string Address);
public record CreatePatientDto(string FullName, DateTime DateOfBirth, string Gender, string Contact, string Address);


