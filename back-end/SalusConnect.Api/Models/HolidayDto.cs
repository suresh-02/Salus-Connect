namespace SalusConnect.Api.Models;

public class HolidayDto
{
    public int HolidayId { get; set; }

    [Required]
    public string Date { get; set; }

    // [JsonIgnore]
    // public string DateString => $"{Date: yyyy-MM-dd}";

    [Required]
    [StringLength(100, MinimumLength = 5, ErrorMessage = "{0} can have minimum of {2} and maximum of {1} characters")]
    public string Name { get; set; }
}