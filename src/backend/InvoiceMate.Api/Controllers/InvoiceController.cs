namespace InvoiceMate.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InvoiceController : ControllerBase
{
    private readonly IValidator<CreateInvoiceRequest> _validator;

    public InvoiceController(IValidator<CreateInvoiceRequest> validator)
        => _validator = validator;

    /// <summary>Cria um invoice (somente cálculo/eco no MVP de teste).</summary>
    [HttpPost]
    [ProducesResponseType(typeof(CreateInvoiceResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateInvoiceRequest req, CancellationToken ct)
    {
        var v = await _validator.ValidateAsync(req, ct);
        if (!v.IsValid)
        {
            var ms = new ModelStateDictionary();
            foreach (var e in v.Errors)
                ms.AddModelError(e.PropertyName ?? string.Empty, e.ErrorMessage);

            return ValidationProblem(ms);
        }

        // Cálculo simples aqui mesmo para teste (sem UseCase/infra)
        decimal subtotal = req.Type == "time-based"
            ? req.Items.Sum(i => (i.Hours ?? 0) * (i.HourlyRate ?? 0))
            : req.Items.Sum(i => (i.Quantity ?? 0) * (i.UnitPrice ?? 0));

        var rate = req.ApplyGst ? (req.GstRate ?? 0) : 0;
        var tax = Math.Round(subtotal * rate, 2, MidpointRounding.AwayFromZero);
        var total = subtotal + tax;

        var resp = new CreateInvoiceResponse(
            InvoiceId: Guid.NewGuid(),
            InvoiceNumber: req.InvoiceNumber,
            Type: req.Type,
            Currency: req.Currency,
            InvoiceDate: req.InvoiceDate,
            DueDate: req.DueDate,
            Subtotal: subtotal,
            Tax: tax,
            Total: total,
            Status: "Generated",
            PdfPreviewUrl: null
        );

        return CreatedAtAction(nameof(GetPreview), new { id = resp.InvoiceId }, resp);
    }

    /// <summary>Placeholder para preview do PDF.</summary>
    [HttpGet("{id:guid}/preview")]
    public IActionResult GetPreview(Guid id) => NotFound();
}
