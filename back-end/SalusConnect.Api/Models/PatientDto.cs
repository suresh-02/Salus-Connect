namespace SalusConnect.Api.Models;

public class PatientDto : UserDto
{
    public PatientDto()
    {
        RoleId = RoleEnum.Patient;
        Status = UserStatus.Inactive;
    }

    public DateTime DateCreated { get; set; }

    [JsonIgnore]
    public int? AddressId { get; set; }

    public AddressDto Address { get; set; }
}

public class PatientsDto
{
    public List<PatientDto> Data { get; set; }
    public int Rows { get; set; }
}