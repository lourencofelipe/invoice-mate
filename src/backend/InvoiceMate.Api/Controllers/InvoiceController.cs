namespace InvoiceMate.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InvoiceController : ControllerBase
{
    private readonly IValidator<CreateInvoiceRequest> _validator;
    private readonly IPdfGenerator _pdfGenerator;
    private readonly IMapper _mapper;
    private readonly CreateInvoiceUseCase _createInvoiceUseCase;

    public InvoiceController(
        IValidator<CreateInvoiceRequest> validator,
        IPdfGenerator pdfGenerator,
        IMapper mapper,
        CreateInvoiceUseCase createInvoiceUseCase)
    {
        _validator = validator;
        _pdfGenerator = pdfGenerator;
        _mapper = mapper;
        _createInvoiceUseCase = createInvoiceUseCase;
    }


    [HttpPost("generate-pdf")]
    public async Task<IActionResult> GenerateInvoicePdf([FromBody] CreateInvoiceRequest request, CancellationToken ct)
    {
        var response = await _createInvoiceUseCase.ExecuteAsync(request, ct);

        return File(response.PdfBytes, "application/pdf", $"Invoice_{response.InvoiceNumber}.pdf");
    }

    /// <summary>Placeholder para preview do PDF.</summary>
    [HttpGet("{id:guid}/preview")]
    public IActionResult GetPreview(Guid id) => NotFound();
}
