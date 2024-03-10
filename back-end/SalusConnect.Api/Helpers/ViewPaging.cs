namespace SalusConnect.Api.Helpers;

public class ViewPaging
{
    public int PageIndex { get; set; }
    public int PageSize { get; set; }
    public bool IsEmpty => PageIndex <= 0 && PageSize <= 0;
}