namespace InvoiceMate.Application.Records.Requests;
public sealed record CreateInvoiceRequest(
    string InvoiceNumber,          // user-provided
    string Type,                   // "time-based" | "product-based"
    string SenderName,
    string SenderEmail,
    string? SenderPhoneNumber, // optional
    AddressRequest? SenderAddress,
    string? SenderAccNumber,     // optional, e.g., bank account number
    string RecipientName,
    string RecipientEmail,
    string? RecipientPhoneNumber, // optional
    AddressRequest? RecipientAddress,
    string Currency,               // ISO-4217 (e.g., "NZD")
    DateTime InvoiceDate,
    DateTime DueDate,
    bool ApplyGst,
    decimal? GstRate,              // e.g., 0.15
    string? Notes,
    List<InvoiceItemRequest> Items
);
