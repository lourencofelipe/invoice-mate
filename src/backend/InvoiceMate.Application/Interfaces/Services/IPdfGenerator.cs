namespace InvoiceMate.Application.Interfaces.Services;

public interface IPdfGenerator
{
    Task<byte[]> GenerateFromTemplateAsync(
        string templateKey,
        object model,
        CancellationToken ct = default);
}
