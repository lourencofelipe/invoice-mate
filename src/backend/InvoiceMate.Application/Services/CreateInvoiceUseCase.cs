namespace InvoiceMate.Application.Services;
public class CreateInvoiceUseCase
{
    private readonly IPdfGenerator _pdfGenerator;
    private readonly IMapper _mapper;

    public CreateInvoiceUseCase(IPdfGenerator pdfGenerator, IMapper mapper)
    {
        _pdfGenerator = pdfGenerator;
        _mapper = mapper;
    }

    public async Task<CreateInvoiceResponse> ExecuteAsync(CreateInvoiceRequest request, CancellationToken ct)
    {
        var senderAddress = _mapper.Map<Address>(request.SenderAddress);
        var recipientAddress = _mapper.Map<Address>(request.RecipientAddress);
        var items = request.Items.Select(item => _mapper.Map<LineItem>(item)).ToList();

        var invoice = Invoice.Create(
            request.InvoiceNumber,
            request.Type,
             request.ProjectName ?? string.Empty, // Use the non-nullable projectName variable
            request.SenderName,
            request.SenderEmail,
            request.SenderPhoneNumber,
            senderAddress,
            request.SenderAccNumber,
            request.RecipientName,
            request.RecipientEmail,
            request.RecipientPhoneNumber,
            recipientAddress,
            request.Currency,
            request.InvoiceDate,
            request.DueDate,
            items,
            request.Notes,
            applyGst: request.ApplyGst,
            gstRate: request.GstRate ?? 0.15m);

        var pdfBytes = await _pdfGenerator.GenerateAsync(invoice, ct);

        return new CreateInvoiceResponse(
            InvoiceId: invoice.Id,
            InvoiceNumber: invoice.InvoiceNumber,
            Type: invoice.Type,
            ProjectName: invoice.ProjectName,
            Currency: invoice.Currency,
            InvoiceDate: invoice.InvoiceDate,
            DueDate: invoice.DueDate,
            Subtotal: invoice.Subtotal,
            Tax: invoice.Tax,
            Total: invoice.Total,
            Status: "Generated",
            PdfPreviewUrl: null, // To be added in future when you implement storage/CDN
            PdfBytes: pdfBytes
        );
    }
}
