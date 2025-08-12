using AutoMapper;
using Hms.Application.DTOs;
using Hms.Application.Interfaces;

namespace Hms.Application.Services;

public class PatientService : IPatientService
{
    private readonly IPatientRepository _repo;
    private readonly IMapper _mapper;
    public PatientService(IPatientRepository repo, IMapper mapper) { _repo = repo; _mapper = mapper; }

    public async Task<List<PatientDto>> SearchAsync(string? q) =>
        (await _repo.SearchAsync(q)).Select(_mapper.Map<PatientDto>).ToList();

    public async Task<PatientDto?> GetAsync(Guid id)
    {
        var p = await _repo.GetAsync(id);
        return p == null ? null : _mapper.Map<PatientDto>(p);
    }

    public async Task<PatientDto> CreateAsync(CreatePatientDto dto)
    {
        var entity = _mapper.Map<Hms.Domain.Entities.Patient>(dto);
        entity = await _repo.AddAsync(entity);
        return _mapper.Map<PatientDto>(entity);
    }

    public async Task UpdateAsync(Guid id, CreatePatientDto dto)
    {
        var entity = await _repo.GetAsync(id) ?? throw new KeyNotFoundException();
        entity.FullName = dto.FullName;
        entity.DateOfBirth = dto.DateOfBirth;
        entity.Gender = dto.Gender;
        entity.Contact = dto.Contact;
        entity.Address = dto.Address;
        await _repo.UpdateAsync(entity);
    }
}


