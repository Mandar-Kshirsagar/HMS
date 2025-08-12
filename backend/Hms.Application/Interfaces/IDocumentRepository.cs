using Hms.Domain.Entities;

namespace Hms.Application.Interfaces;

public interface IDocumentRepository
{
    Task<Document> AddAsync(Document document);
    Task<List<Document>> GetByPatientAsync(Guid patientId);
}


