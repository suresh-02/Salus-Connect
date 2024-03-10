using Microsoft.Extensions.Caching.Distributed;
using StackExchange.Redis;

namespace SalusConnect.Api.Helpers;

public static class RedisCacheExtensions
{
    public static async Task RemoveKeysAsync(this IDistributedCache cache,
        string pattern, IConnectionMultiplexer multiplexer, AppSettings settings)
    {
        var server = multiplexer.GetServer(settings.RedisCache.HostAndPort);
        foreach (RedisKey redisKey in server.Keys(pattern: $"{settings.RedisCache.InstanceName}{pattern}"))
        {
            string key = redisKey.ToString().TrimStart(settings.RedisCache.InstanceName);
            await cache.RemoveAsync(key);
        }
    }
}