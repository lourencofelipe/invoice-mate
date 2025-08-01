namespace InvoiceMate.Api.Infra.Errors;

public sealed class ProblemDetailsMiddleware
{
    private readonly RequestDelegate _next;

    public ProblemDetailsMiddleware(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(HttpContext ctx)
    {
        try
        {
            await _next(ctx);
        }
        catch (Exception ex)
        {
            var pd = new ProblemDetails
            {
                Status = StatusCodes.Status500InternalServerError,
                Title = "Unexpected error",
                Detail = ex.Message
            };

            ctx.Response.StatusCode = pd.Status!.Value;
            ctx.Response.ContentType = "application/problem+json";

            var json = JsonSerializer.Serialize(pd);
            await ctx.Response.WriteAsync(json);
        }
    }
}
