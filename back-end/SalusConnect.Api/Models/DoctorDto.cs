namespace SalusConnect.Api.Models;

public class BaseDoctorDto : UserDto
{
    public BaseDoctorDto()
    {
        RoleId = RoleEnum.Doctor;
        Status = UserStatus.Inactive;
    }

    [Required]
    [StringLength(8000, MinimumLength = 5, ErrorMessage = "{0} can have minimum of {2} and maximum of {1} characters")]
    public string Biography { get; set; }

    [JsonIgnore]
    public int SpecialtyId { get; set; }

    public SpecialtyDto Specialty { get; set; }

    [JsonIgnore]
    public string TagsString { get; set; }

    public string[] Tags { get; set; }
}

public class IndividualDoctorDto : BaseDoctorDto
{
    [JsonIgnore]
    public int AddressId { get; set; }

    public AddressDto Address { get; set; }
}

public class FacilityDoctorDto : BaseDoctorDto
{
    public int FacilityId { get; set; }
    public string FacilityName { get; set; }
}

public class DefaultDoctorDto : BaseDoctorDto
{
    [JsonIgnore]
    public int AddressId { get; set; }

    public AddressDto Address { get; set; }
    public int FacilityId { get; set; }
    public string FacilityName { get; set; }
}

public class DoctorProfileDto : UserProfileDto
{
    [Required]
    [StringLength(4000, MinimumLength = 5, ErrorMessage = "{0} can have minimum of {2} and maximum of {1} characters")]
    public string Biography { get; set; }
}
