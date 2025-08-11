namespace InvoiceMate.Infrastructure.Pdf.Templates;

using System.Collections.Generic;
using System.Globalization;
using InvoiceMate.Domain.Entities;

public class InvoiceViewModel
{
    public string InvoiceNumber { get; set; }
    public string SenderName { get; set; }
    public string SenderAddress { get; set; }
    public string RecipientName { get; set; }
    public string RecipientAddress { get; set; }
    public List<Item> Items { get; set; }
    public decimal Subtotal { get; set; }
    public decimal Tax { get; set; }
    public decimal Total { get; set; }
    public CultureInfo CurrencyFormat { get; set; }

    public static InvoiceViewModel FromEntity(Invoice invoice)
    {
        return new InvoiceViewModel
        {
            InvoiceNumber = invoice.InvoiceNumber,
            SenderName = invoice.SenderName,
            SenderAddress = invoice.SenderAddress?.ToString(),
            RecipientName = invoice.RecipientName,
            RecipientAddress = invoice.RecipientAddress?.ToString(),
            Items = invoice.Items.Select(i => new Item
            {
                Description = i.Description,
                Quantity = i.Quantity ?? 0, 
                UnitPrice = i.UnitPrice ?? 0m 
            }).ToList(),
            Subtotal = invoice.Subtotal, 
            Tax = invoice.Tax, 
            Total = invoice.Total, 
            CurrencyFormat = CultureInfo.InvariantCulture 
        };
    }

    public class Item
    {
        public string Description { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}
