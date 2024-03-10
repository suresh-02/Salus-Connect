namespace SalusConnect.Api.Helpers;

public class DatabasePaging
{
    public int? Limit { get; set; }
    public int? Offset { get; set; }
    public bool IsEmpty => Limit <= 0 && Offset <= 0 || !Limit.HasValue && !Offset.HasValue;
}