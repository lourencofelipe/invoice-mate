namespace InvoiceMate.Application.Records.Requests;
public sealed record AddressRequest(
 string? Line1,
 string? Line2,
 string? City,
 string? Region,
 string? Postcode,
 string? Country
);
