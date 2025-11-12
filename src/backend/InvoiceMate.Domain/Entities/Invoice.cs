using InvoiceMate.Domain.ValueObjects;

namespace InvoiceMate.Domain.Entities;

public class Invoice
{
    public Guid Id { get; private set; }
    public string InvoiceNumber { get; private set; }
    public string Type { get; private set; } // "time-based" | "product-based"
    public string ProjectName { get; set; }

    public string SenderName { get; private set; }
    public string SenderEmail { get; private set; }
    public string? SenderWebsite { get; private set; }
    public string? SenderPhoneNumber { get; private set; }
    public Address? SenderAddress { get; private set; }
    public string? SenderAccNumber { get; private set; }


    public string RecipientName { get; private set; }
    public string RecipientEmail { get; private set; }
    public string? RecipientPhoneNumber { get; private set; }
    public Address? RecipientAddress { get; private set; }

    public string Currency { get; private set; }
    public DateTime InvoiceDate { get; private set; }
    public DateTime DueDate { get; private set; }

    public List<LineItem> Items { get; private set; } = new();

    public decimal Subtotal { get; private set; }
    public decimal Tax { get; private set; }
    public decimal Total { get; private set; }
    public string? Notes { get; private set; }

    private Invoice() { }

    private Invoice(
        Guid id,
        string invoiceNumber,
        string type,
        string projectName,
        string senderName,
        string senderEmail,
        string? senderWebSite,
        string? senderPhoneNumber,
        Address? senderAddress,
        string? senderAccNumber,
        string recipientName,
        string recipientEmail,
        string? recipientPhoneNumber,
        Address? recipientAddress,
        string currency,
        DateTime invoiceDate,
        DateTime dueDate,
        List<LineItem> items,
        string? notes)
    {
        Id = id;
        InvoiceNumber = invoiceNumber;
        Type = type;
        ProjectName = projectName;
        SenderName = senderName;
        SenderEmail = senderEmail;
        SenderWebsite = senderWebSite;
        SenderPhoneNumber = senderPhoneNumber;
        SenderAddress = senderAddress;
        SenderAccNumber = senderAccNumber;
        RecipientName = recipientName;
        RecipientEmail = recipientEmail;
        RecipientPhoneNumber = recipientPhoneNumber;
        RecipientAddress = recipientAddress;
        Currency = currency;
        InvoiceDate = invoiceDate;
        DueDate = dueDate;
        Items = items;
        Notes = notes;
    }

    public static Invoice Create(
        string invoiceNumber,
        string type,
        string projectName,
        string senderName,
        string senderEmail,
        string? senderWebSite,
        string? senderPhoneNumber,
        Address? senderAddress,
        string? senderAccNumber,
        string recipientName,
        string recipientEmail,
        string? recipientPhoneNumber,
        Address? recipientAddress,
        string currency,
        DateTime invoiceDate,
        DateTime dueDate,
        List<LineItem> items,
        string? notes,
        bool applyGst,
        decimal gstRate)
    {
        var invoice = new Invoice(
            Guid.NewGuid(), invoiceNumber, type, projectName,
            senderName, senderEmail,senderWebSite, senderPhoneNumber, senderAddress, senderAccNumber,
            recipientName, recipientEmail, recipientPhoneNumber, recipientAddress,
            currency, invoiceDate, dueDate,
            items, notes);

        invoice.CalculateTotals(applyGst, gstRate);
        return invoice;
    }

    public void CalculateTotals(bool applyGst, decimal gstRate)
    {
        Subtotal = Items.Sum(i => i.Total);
        Tax = applyGst ? Math.Round(Subtotal * gstRate, 2, MidpointRounding.AwayFromZero) : 0;
        Total = Subtotal + Tax;
    }
}
