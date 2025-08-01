namespace InvoiceMate.Application.Validators;
public sealed class InvoiceItemRequestValidator : AbstractValidator<InvoiceItemRequest>
{
    public InvoiceItemRequestValidator()
    {
        RuleFor(i => i.Description).NotEmpty().MaximumLength(250);

        // Valores não negativos
        RuleFor(i => i.Hours).GreaterThanOrEqualTo(0)
            .When(i => i.Hours.HasValue);

        RuleFor(i => i.HourlyRate).GreaterThanOrEqualTo(0)
            .When(i => i.HourlyRate.HasValue);

        RuleFor(i => i.Quantity).GreaterThanOrEqualTo(0)
            .When(i => i.Quantity.HasValue);

        RuleFor(i => i.UnitPrice).GreaterThanOrEqualTo(0)
            .When(i => i.UnitPrice.HasValue);
    }
}
