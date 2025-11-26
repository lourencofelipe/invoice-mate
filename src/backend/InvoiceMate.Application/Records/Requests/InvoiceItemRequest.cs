namespace InvoiceMate.Application.Records.Requests;
public sealed record InvoiceItemRequest(
    string Description,
    decimal? Hours,        
    decimal? HourlyRate,   
    string? ProfessionalName, 
    int? Quantity,         
    decimal? UnitPrice     
);
