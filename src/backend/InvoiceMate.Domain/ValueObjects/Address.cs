namespace InvoiceMate.Domain.ValueObjects;
public sealed class Address
{
    public string? Line1 { get; }
    public string? Line2 { get; }
    public string? City { get; }
    public string? Region { get; }     // State/Province
    public string? Postcode { get; }
    public string? Country { get; }

    private Address() { }

    public Address(string? line1, string? line2, string? city, string? region, string? postcode, string? country)
    {
        Line1 = line1; 
        Line2 = line2; 
        City = city; 
        Region = region; 
        Postcode = postcode; 
        Country = country;
    }
}
