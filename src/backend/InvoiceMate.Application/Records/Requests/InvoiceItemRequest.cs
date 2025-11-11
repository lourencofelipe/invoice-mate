namespace InvoiceMate.Application.Records.Requests;
public sealed record InvoiceItemRequest(
    string Description,
    decimal? Hours,        // time-based
    decimal? HourlyRate,   // time-based
    string? ProfessionalName, // time-based
    int? Quantity,         // product-based
    decimal? UnitPrice     // product-based
);
