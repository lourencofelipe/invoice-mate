namespace InvoiceMate.Application.Records.Requests;
public sealed record CreateInvoiceRequest(
    string InvoiceNumber,          
    string Type,                   
    string? ProjectName,
    string SenderName,
    string SenderEmail,
    string SenderWebSite,
    string? SenderPhoneNumber, 
    AddressRequest? SenderAddress,
    string? SenderAccNumber,     
    string RecipientName,
    string RecipientEmail,
    string? RecipientPhoneNumber, 
    AddressRequest? RecipientAddress,
    string Currency,               
    DateTime InvoiceDate,
    DateTime DueDate,
    bool ApplyGst,
    decimal? GstRate,              
    string? Notes,
    List<InvoiceItemRequest> Items
);
