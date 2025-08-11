namespace InvoiceMate.Application.Interfaces.Services;

public interface IPdfGenerator
{
    Task<byte[]> GenerateAsync(Invoice invoice, CancellationToken ct = default);

}
