namespace InvoiceMate.Application.Common;
public static class AllowedCurrencies
{
    public static readonly HashSet<string> Codes = new(
        new[] { "NZD", "AUD", "USD", "EUR", "GBP" },
        System.StringComparer.OrdinalIgnoreCase
    );
}
