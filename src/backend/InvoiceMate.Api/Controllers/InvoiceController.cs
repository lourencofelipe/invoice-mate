namespace InvoiceMate.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class InvoiceController(CreateInvoiceUseCase createInvoiceUseCase) : ControllerBase
{
    [HttpPost("generate-pdf")]
    [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(string), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GenerateInvoicePdf([FromBody] CreateInvoiceRequest request, CancellationToken ct)
    {
        var response = await createInvoiceUseCase.ExecuteAsync(request, ct);

        return File(response.PdfBytes, "application/pdf", $"Invoice_{response.InvoiceNumber}.pdf");
    }

    [HttpGet("{id:guid}/preview")]
    public IActionResult GetPreview(Guid id) => NotFound();
}
