namespace InvoiceMate.Infrastructure.Pdf;

public class InvoicePdfGenerator : IPdfGenerator
{
    private readonly RazorLightEngine _razorEngine;

    public InvoicePdfGenerator()
    {
        var basePath = AppContext.BaseDirectory;
        _razorEngine = new RazorLightEngineBuilder()
            .UseFileSystemProject(Path.Combine(basePath, "Templates"))
            .UseMemoryCachingProvider()
            .Build();
    }

    public async Task<byte[]> GenerateAsync(Invoice invoice, CancellationToken ct = default)
    {
        string htmlContent = await _razorEngine.CompileRenderAsync("InvoiceTemplate.cshtml", invoice);

        using var playwright = await Playwright.CreateAsync();
        var browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions { Headless = true });
        var page = await browser.NewPageAsync();

        await page.SetContentAsync(htmlContent);
        var pdfBytes = await page.PdfAsync();

        await browser.CloseAsync();
        return pdfBytes;
    }
}
