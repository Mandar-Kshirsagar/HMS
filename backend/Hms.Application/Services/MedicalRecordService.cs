using AutoMapper;
using Hms.Application.DTOs;
using Hms.Application.Interfaces;
using Hms.Domain.Entities;

namespace Hms.Application.Services;

public class MedicalRecordService : IMedicalRecordService
{
    private readonly IMedicalRecordRepository _repo;
    private readonly IMapper _mapper;
    public MedicalRecordService(IMedicalRecordRepository repo, IMapper mapper) { _repo = repo; _mapper = mapper; }

    public async Task<List<MedicalRecordDto>> GetByPatientAsync(Guid patientId)
        => (await _repo.GetByPatientAsync(patientId)).Select(_mapper.Map<MedicalRecordDto>).ToList();

    public async Task<MedicalRecordDto> AddAsync(MedicalRecordDto dto)
    {
        var entity = _mapper.Map<MedicalRecord>(dto);
        entity = await _repo.AddAsync(entity);
        return _mapper.Map<MedicalRecordDto>(entity);
    }
}


