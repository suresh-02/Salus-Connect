namespace SalusConnect.Api.Models;

public class FacilityDto
{
    public FacilityDto()
    {
        Status = UserStatus.Inactive;
    }

    public int FacilityId { get; set; }
    public string FacilityName { get; set; }
    public FacilityType FacilityType { get; set; }

    [JsonIgnore]
    public string FacilityTypeString
    {
        get => FacilityType.ToString();
        set => FacilityType = value == null ? FacilityType.Hospital : (FacilityType)Enum.Parse(typeof(FacilityType), value, true);
    }

    public UserStatus Status { get; set; }

    [JsonIgnore]
    public string StatusString
    {
        get => Status.ToString();
        set => Status = (UserStatus)Enum.Parse(typeof(UserStatus), value, true);
    }

    [JsonIgnore]
    public int AddressId { get; set; }

    public AddressDto Address { get; set; }
    public List<FacilityDoctorDto> Doctors { get; set; }
}

public class FacilityInfoDto
{
    public int FacilityId { get; set; }
    public string FacilityName { get; set; }
    public FacilityType FacilityType { get; set; }
}

public enum FacilityType
{
    Hospital = 1,
    Clinic
}

public enum ProviderType
{
    Individual = 1,
    Hospital,
    Clinic
}
