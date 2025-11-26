namespace InvoiceMate.Application.Records.Responses;

public sealed record CreateInvoiceResponse(
    Guid InvoiceId,
    string InvoiceNumber,
    string Type,
    string? ProjectName,
    string Currency,
    DateTime InvoiceDate,
    DateTime DueDate,
    decimal Subtotal,
    decimal Tax,
    decimal Total,
    string Status,               
    string? PdfPreviewUrl,        // null on MVP
    byte[] PdfBytes
);
