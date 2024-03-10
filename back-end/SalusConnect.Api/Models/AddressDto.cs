namespace SalusConnect.Api.Models;

public class AddressDto
{
    public int? AddressId { get; set; }

    [Required]
    public string AddressLine1 { get; set; }

    public string AddressLine2 { get; set; }

    [Required]
    public string City { get; set; }

    public string StateAbbr { get; set; }

    public string PostalCode { get; set; }

    public bool IsEmpty()
    {
        return string.IsNullOrEmpty(AddressLine1) || string.IsNullOrEmpty(City);
    }
}