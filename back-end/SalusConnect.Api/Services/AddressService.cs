namespace SalusConnect.Api.Services;

public interface IAddressService
{
    Task<AddressDto> Save(IDbConnection conn, AddressDto address);
}

public class AddressService : IAddressService
{
    public async Task<AddressDto> Save(IDbConnection conn, AddressDto address)
    {
        if (address == null)
        {
            return null;
        }
        if (address.IsEmpty())
        {
            throw new BadRequestException("Address should not be empty");
        }

        if (address.AddressId is null or 0)
        {
            // create
            return await Create(conn, address);
        }

        // update
        await Update(conn, address);
        return address;
    }

    #region Private methods

    private static async Task<AddressDto> Create(IDbConnection conn, AddressDto address)
    {
        int id = await conn.ExecuteScalarAsync<int>(AddressQueries.AddressCreate, address);
        address.AddressId = id;
        return address;
    }

    private static async Task Update(IDbConnection conn, AddressDto address)
    {
        await conn.ExecuteAsync(AddressQueries.AddressUpdate, address);
    }

    #endregion Private methods
}

internal class AddressQueries
{
    internal const string AddressCreate =
        @"INSERT INTO addresses (address_line1, address_line2, city, state_abbr, postal_code) 
        VALUES (@AddressLine1, @AddressLine2, @City, @StateAbbr, @PostalCode) RETURNING id;";

    internal const string AddressUpdate =
        @"UPDATE addresses SET address_line1 = @AddressLine1, address_line2 = @AddressLine2, 
        city = @City, state_abbr = @StateAbbr, postal_code = @PostalCode 
        WHERE id = @AddressId;";
}