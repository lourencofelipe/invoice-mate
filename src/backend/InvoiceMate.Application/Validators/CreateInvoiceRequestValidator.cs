namespace InvoiceMate.Application.Validators;
public sealed class CreateInvoiceRequestValidator : AbstractValidator<CreateInvoiceRequest>
{
    public CreateInvoiceRequestValidator()
    {
        RuleFor(x => x.InvoiceNumber)
            .NotEmpty()
            .Matches("^[A-Za-z0-9._/-]{1,32}$");

        RuleFor(x => x.Type)
            .Must(t => t is "time-based" or "product-based")
            .WithMessage("Type must be 'time-based' or 'product-based'.");

        RuleFor(x => x.SenderName).NotEmpty();
        RuleFor(x => x.SenderEmail).NotEmpty().EmailAddress();

        RuleFor(x => x.RecipientName).NotEmpty();
        RuleFor(x => x.RecipientEmail).NotEmpty().EmailAddress();

        RuleFor(x => x.Currency)
            .NotEmpty()
            .Must(c => AllowedCurrencies.Codes.Contains(c))
            .WithMessage("Unsupported currency.");

        RuleFor(x => x.InvoiceDate).NotEmpty();
        RuleFor(x => x.DueDate)
            .NotEmpty()
            .GreaterThanOrEqualTo(x => x.InvoiceDate);

        RuleFor(x => x.Items)
            .NotEmpty()
            .ForEach(f => f.SetValidator(new InvoiceItemRequestValidator()));

        // Regras condicionais por tipo
        When(x => x.Type == "time-based", () =>
        {
            RuleForEach(x => x.Items)
                .Must(i => i.Hours.HasValue && i.HourlyRate.HasValue)
                .WithMessage("For time-based invoices, each item must have Hours and HourlyRate.");
        });

        When(x => x.Type == "product-based", () =>
        {
            RuleForEach(x => x.Items)
                .Must(i => i.Quantity.HasValue && i.UnitPrice.HasValue)
                .WithMessage("For product-based invoices, each item must have Quantity and UnitPrice.");
        });

        // GST
        When(x => x.ApplyGst, () =>
        {
            RuleFor(x => x.GstRate)
                .NotNull()
                .InclusiveBetween(0m, 1m);
        });
    }
}
