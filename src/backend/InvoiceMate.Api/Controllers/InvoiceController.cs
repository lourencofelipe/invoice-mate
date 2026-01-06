namespace InvoiceMate.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InvoiceController(CreateInvoiceUseCase createInvoiceUseCase) : ControllerBase
{
    [HttpPost("generate-pdf")]
    public async Task<IActionResult> GenerateInvoicePdf([FromBody] CreateInvoiceRequest request, CancellationToken ct)
    {
        var response = await createInvoiceUseCase.ExecuteAsync(request, ct);

        return File(response.PdfBytes, "application/pdf", $"Invoice_{response.InvoiceNumber}.pdf");
    }

    [HttpGet("{id:guid}/preview")]
    public IActionResult GetPreview(Guid id) => NotFound();
}
