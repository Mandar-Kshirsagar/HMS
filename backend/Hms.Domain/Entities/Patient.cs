using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Hms.Domain.Entities;

public class Patient
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [MaxLength(150)]
    public string FullName { get; set; } = string.Empty;

    public DateTime DateOfBirth { get; set; }

    [MaxLength(20)]
    public string Gender { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Contact { get; set; } = string.Empty;

    [MaxLength(250)]
    public string Address { get; set; } = string.Empty;

    public string? ApplicationUserId { get; set; }

    public ICollection<MedicalRecord> MedicalRecords { get; set; } = new List<MedicalRecord>();

    public ICollection<Document> Documents { get; set; } = new List<Document>();
}


