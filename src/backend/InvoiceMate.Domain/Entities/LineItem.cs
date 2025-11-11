namespace InvoiceMate.Domain.Entities;
public class LineItem
{
    public string Description { get; private set; }

    // Time-based (services)
    public decimal? Hours { get; private set; }
    public decimal? HourlyRate { get; private set; }
    public string? ProfessionalName { get; private set; }

    // Product-based (fixed items)
    public int? Quantity { get; private set; }
    public decimal? UnitPrice { get; private set; }

    public decimal Total { get; private set; }

    private LineItem() { }

    private LineItem(
       string description,
       decimal? hours,
       decimal? hourlyRate,
       string? professionalName,
       int? quantity,
       decimal? unitPrice)
    {
        Description = description;
        Hours = hours;
        HourlyRate = hourlyRate;
        ProfessionalName = professionalName;
        Quantity = quantity;
        UnitPrice = unitPrice;

        Total = CalculateTotal();
    }

    public static LineItem ForTimeBased(string description, decimal hours, decimal hourlyRate, string professionalName)
        => new(description, hours, hourlyRate, professionalName, null, null);

    public static LineItem ForProductBased(string description, int quantity, decimal unitPrice)
        => new(description, null, null, null, quantity, unitPrice);

    private decimal CalculateTotal()
    {
        if (Hours.HasValue && HourlyRate.HasValue)
            return Hours.Value * HourlyRate.Value;

        if (Quantity.HasValue && UnitPrice.HasValue)
            return Quantity.Value * UnitPrice.Value;

        return 0;
    }
}
