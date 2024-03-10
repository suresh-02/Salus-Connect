namespace SalusConnect.Api.Models;

public class ProviderDto
{
    public int ProviderId { get; set; }
    public string ProviderName { get; set; }
    public string PostalCode { get; set; }
    public string City { get; set; }
    public string ProvinceAbbr { get; set; }
    public string ProvinceName { get; set; }
    public ProviderType ProviderType { get; set; }
    public string SpecialtyName { get; set; }
    public UserStatus Status { get; set; }
    public int? Doctors { get; set; }
    public int? ActiveDoctors { get; set; }
    public DateTime DateCreated { get; set; }
    public string PaymentType { get; set; }
}

public class ProvidersDto
{
    public List<ProviderDto> Data { get; set; }
    public int Rows { get; set; }
}