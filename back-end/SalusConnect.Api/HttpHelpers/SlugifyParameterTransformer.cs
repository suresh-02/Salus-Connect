using Microsoft.AspNetCore.Routing;
using System.Text.RegularExpressions;

namespace SalusConnect.Api.HttpHelpers;

public class SlugifyParameterTransformer : IOutboundParameterTransformer
{
    public string TransformOutbound(object value)
    {
        // Slugify value
        return value == null ? null : Regex.Replace(value.ToString() ?? string.Empty, "([a-z])([A-Z])", "$1-$2").ToLower();
    }
}