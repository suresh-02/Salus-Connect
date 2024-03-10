namespace SalusConnect.Api.Models;

public class SpecialtyDto
{
    public int SpecialtyId { get; set; }
    public string SpecialtyName { get; set; }
    public int CategoryId { get; set; }
    public string CategoryName { get; set; }
}

public class SpecialtyAloneDto
{
    public int SpecialtyId { get; set; }
    public string SpecialtyName { get; set; }
}

public class SpecialtyByCategoryDto
{
    public int CategoryId { get; set; }
    public string CategoryName { get; set; }
    public List<SpecialtyAloneDto> Specialties { get; set; }
}