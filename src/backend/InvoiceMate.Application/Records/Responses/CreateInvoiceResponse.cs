namespace InvoiceMate.Application.Records.Responses;

public sealed record CreateInvoiceResponse(
    Guid InvoiceId,
    string InvoiceNumber,
    string Type,
    string Currency,
    DateTime InvoiceDate,
    DateTime DueDate,
    decimal Subtotal,
    decimal Tax,
    decimal Total,
    string Status,               // e.g., "Generated"
    string? PdfPreviewUrl        // null on MVP
);
