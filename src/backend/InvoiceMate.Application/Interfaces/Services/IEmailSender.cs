namespace InvoiceMate.Application.Interfaces.Services;
public interface IEmailSender
{
    Task SendAsync(
        string to,
        string subject,
        string htmlBody,
        byte[]? attachment = null,
        string? attachmentName = null,
        string? cc = null,
        CancellationToken ct = default);
}
