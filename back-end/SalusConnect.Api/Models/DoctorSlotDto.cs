// ReSharper disable InterpolatedStringExpressionIsNotIFormattable

namespace SalusConnect.Api.Models;

public class DoctorSlotDto
{
    public int DoctorId { get; set; }
    public int CancellationPolicyDays { get; set; } = 1;

    private string[] _dateRange;

    public string[] DateRange                   // NULLABLE
    {
        get => _dateRange;

        set
        {
            if (value != null)
            {
                if (value.Length != 2)
                {
                    throw new ArgumentOutOfRangeException(nameof(DateRange), "DateRange: Date range should have two elements");
                }
                if (!DateTime.TryParse(value[0], out DateTime _) ||
                    !DateTime.TryParse(value[1], out DateTime _))
                {
                    throw new ArgumentOutOfRangeException(nameof(DateRange), "DateRange: Not a valid dates");
                }
            }
            _dateRange = value;
        }
    }

    [JsonIgnore]
    public string DateRangeString               // "2021-09-01,2021-10-30" OR Null
    {
        get => _dateRange == null ? null :
            $"[{Convert.ToDateTime(_dateRange[0]):yyyy-MM-dd},{Convert.ToDateTime(_dateRange[1]):yyyy-MM-dd}]";

        set
        {
            if (value == null)
            {
                _dateRange = null;
                return;
            }

            var dates = value.Split(',');
            if (dates.Length != 2)
            {
                throw new ArgumentOutOfRangeException(nameof(value), "DateRange: Date range should have two elements");
            }

            _dateRange = new[] {
                dates[0][1..],
                $"{Convert.ToDateTime(dates[1][..^1]).AddDays(-1):yyyy-MM-dd}"
            };
        }
    }

    public List<DoctorTreatmentDto> Treatments { get; set; }

    //public List<DateSlotDto> DateSlots { get; set; }
    public List<SlotExceptionDto> SlotExceptions { get; set; }
}

public class SlotExceptionDto
{
    private string _exceptionDate;
    public int ExceptionId { get; set; }

    [JsonIgnore]
    public int DoctorId { get; set; }

    [Required]
    public string ExceptionDate
    {
        get => $"{Convert.ToDateTime(_exceptionDate):yyyy-MM-dd}";
        set
        {
            if (!DateTime.TryParse(value, out DateTime _))
            {
                throw new ArgumentException("Date is not valid one", nameof(ExceptionDate));
            }
            _exceptionDate = $"{Convert.ToDateTime(value):yyyy-MM-dd}";
        }
    }

    private string[] _exceptionTimeRange;

    public string[] ExceptionTimeRange                   // NULLABLE
    {
        get
        {
            return _exceptionTimeRange?.Select(timeString => timeString[..5]).ToArray();
        }

        set
        {
            if (value != null)
            {
                if (value.Length != 2)
                {
                    throw new ArgumentOutOfRangeException(nameof(ExceptionTimeRange), "TimeRange: Time range should have two elements");
                }
            }

            _exceptionTimeRange = value;
        }
    }

    [JsonIgnore]
    public string ExceptionTimeRangeString
    {
        get => _exceptionTimeRange == null ? null :
            $"[{_exceptionTimeRange[0]:HH:mm},{_exceptionTimeRange[1]:HH:mm})"; // exclude end time

        set
        {
            if (value == null)
            {
                _exceptionTimeRange = null;
                return;
            }

            var times = value.Split(',');
            if (times.Length != 2)
            {
                throw new ArgumentOutOfRangeException(nameof(value), "TimeRange: Time range should have two elements");
            }

            _exceptionTimeRange = new[] {
                times[0][1..],
                times[1][..^1]
            };
        }
    }

    public bool? NotAvailable { get; set; }
}

public class DoctorTreatmentDto
{
    public int TreatmentId { get; set; }

    [JsonIgnore]
    public int DoctorId { get; set; }

    [Required]
    [StringLength(15, MinimumLength = 2, ErrorMessage = "{0} can have minimum of {2} and maximum of {1} characters")]
    public string Nickname { get; set; }

    [Required]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "{0} can have minimum of {2} and maximum of {1} characters")]
    public string TreatmentType { get; set; }

    [Required]
    [StringLength(300, MinimumLength = 2, ErrorMessage = "{0} can have minimum of {2} and maximum of {1} characters")]
    public string Description { get; set; }

    public int DurationMinutes { get; set; }
    private string[] _timeRange;

    public string[] TimeRange       // NULLABLE
    {
        get
        {
            return _timeRange?.Select(timeString => timeString[..5]).ToArray();
        }

        set
        {
            if (value != null)
            {
                if (value.Length != 2)
                {
                    throw new ArgumentOutOfRangeException(nameof(TimeRange), "TimeRange: Time range should have two elements");
                }
            }

            _timeRange = value;
        }
    }

    [JsonIgnore]
    public string TimeRangeString
    {
        get => _timeRange == null ? null :
            $"[{_timeRange[0]:HH:mm},{_timeRange[1]:HH:mm})"; // exclude end time

        set
        {
            if (value == null)
            {
                _timeRange = null;
                return;
            }

            var times = value.Split(',');
            if (times.Length != 2)
            {
                throw new ArgumentOutOfRangeException(nameof(value), "TimeRange: Time range should have two elements");
            }

            _timeRange = new[] {
                times[0][1..],
                times[1][..^1]
            };
        }
    }

    public int? BreakMinutes { get; set; } = null;      // NULLABLE
    public int[] TreatmentDays { get; set; } = { 1, 2, 3, 4, 5 };

    [JsonIgnore]
    public string TreatmentDaysString
    {
        get => string.Join(",", TreatmentDays);
        set => TreatmentDays = value.Split(',').Select(a => Convert.ToInt32(a)).ToArray();
    }

    public bool? ExcludeHolidays { get; set; }
    public InsuranceCoverage InsuranceCoverage { get; set; } = InsuranceCoverage.None;

    [JsonIgnore]
    public string InsuranceCoverageString
    {
        get => InsuranceCoverage.ToString();
        set => InsuranceCoverage = (InsuranceCoverage)Enum.Parse(typeof(InsuranceCoverage), value, true);
    }

    public decimal? FeePerVisit { get; set; } = null;   // NULLABLE
    public bool IsDefault { get; set; } = false;
}

public enum InsuranceCoverage
{
    None = 0,
    Partial,
    Full
}