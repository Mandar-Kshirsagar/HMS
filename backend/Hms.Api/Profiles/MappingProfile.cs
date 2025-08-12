using AutoMapper;
using Hms.Application.DTOs;
using Hms.Domain.Entities;

namespace Hms.Api.Profiles;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Patient, PatientDto>();
        CreateMap<CreatePatientDto, Patient>();
        CreateMap<Appointment, AppointmentDto>()
            .ForMember(d => d.Status, o => o.MapFrom(s => s.Status.ToString()));
        CreateMap<AppointmentDto, Appointment>()
            .ForMember(d => d.Status, o => o.Ignore());
        CreateMap<MedicalRecord, MedicalRecordDto>().ReverseMap();
    }
}


