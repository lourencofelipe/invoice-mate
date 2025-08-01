namespace InvoiceMate.Application.Common.Mapping;
public sealed class InvoiceMappingProfile : Profile
{
    public InvoiceMappingProfile()
    {
        CreateMap<AddressRequest, Address>();

        CreateMap<InvoiceItemRequest, LineItem>()
            .ConstructUsing(src =>
                src.Hours.HasValue && src.HourlyRate.HasValue
                    ? LineItem.ForTimeBased(src.Description, src.Hours.Value, src.HourlyRate.Value)
                    : LineItem.ForProductBased(src.Description, src.Quantity!.Value, src.UnitPrice!.Value));

        CreateMap<Invoice, CreateInvoiceResponse>()
            .ForMember(d => d.InvoiceId, o => o.MapFrom(s => s.Id))
            .ForMember(d => d.Status, o => o.MapFrom(_ => "Generated"))
            .ForMember(d => d.PdfPreviewUrl, o => o.Ignore());
    }
}
