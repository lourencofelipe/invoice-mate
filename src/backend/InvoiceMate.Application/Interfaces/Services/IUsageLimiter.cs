namespace InvoiceMate.Application.Interfaces.Services;

public interface IUsageLimiter
{
    Task<bool> CanUseAsync(string senderEmail, CancellationToken ct = default);
    Task IncrementAsync(string senderEmail, CancellationToken ct = default);
}
