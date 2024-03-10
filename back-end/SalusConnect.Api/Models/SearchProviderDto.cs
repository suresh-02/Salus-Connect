namespace SalusConnect.Api.Models;

public class SearchSpecialtyDto
{
    public int? Id { get; set; }
    public string SpecialtyName { get; set; }
}

public class SearchSpecialtyOrProviderDto
{
    public string Value { get; set; }
    public string Label { get; set; }
    //public SearchType SearchType { get; set; }
}

public class SearchLocationDto
{
    public string City { get; set; }
    public string StateAbbr { get; set; }
    public string PostalCode { get; set; }
}

public class SearchProviderDto
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Biography { get; set; }
    public string SpecialtyName { get; set; }

    [JsonIgnore]
    public string TagsString { get; set; }

    public string[] Tags => TagsString.Split(',');

    //public int FacilityId { get; set; }

    public string FacilityName { get; set; }

    //public int AddressId { get; set; }
    //public int PostalCodeId { get; set; }

    public string City { get; set; }

    public string StateAbbr { get; set; }
    public int CancellationPolicyDays { get; set; }
    public string Status { get; set; }                      // for Sorting (key:1)
    public string ImageUrl { get; set; }
    public int? SlotDoctorId { get; set; }                  // for Sorting (key:2)
    public List<DoctorTreatmentDto> Treatments { get; set; }
    public List<SearchProviderSlotDto> Slots { get; set; }  // for Sorting (key:3)
}

public class SearchProviderSlotDto
{
    [JsonIgnore]
    public int DoctorId { get; set; }

    [JsonIgnore]
    public DateTime SlotDate { get; set; }

    public string Date => SlotDate.ToString("yyyy-MM-dd");

    [JsonIgnore]
    public string SlotTimes { get; set; }

    public string[] Times => SlotTimes.Split(',');

    public int DurationMinutes { get; set; }
}

public enum LocationType
{
    City,
    PostalCode
}
