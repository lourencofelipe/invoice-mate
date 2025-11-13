namespace InvoiceMate.Infrastructure.Pdf
{
    public class InvoicePdfGenerator : IPdfGenerator
    {
        private readonly RazorLightEngine _razorEngine;

        public InvoicePdfGenerator()
        {
            var basePath = AppContext.BaseDirectory;
            _razorEngine = new RazorLightEngineBuilder()
                .UseFileSystemProject(Path.Combine(basePath, "Templates"))
                .UseCachingProvider(new NullCachingProvider()) 
                .Build();
        }

        public async Task<byte[]> GenerateAsync(Invoice invoice, CancellationToken ct = default)
        {
            string templateName = invoice.Type?.ToLower() == "product-based"
                ? "DeliverableTemplate.cshtml"
                : "ServiceInvoiceTemplate.cshtml";

            string htmlContent = await _razorEngine.CompileRenderAsync(templateName, invoice);

            using var playwright = await Playwright.CreateAsync();
            var browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
            {
                Headless = true
            });

            var page = await browser.NewPageAsync();

            await page.SetContentAsync(htmlContent);
           
            var pdfBytes = await page.PdfAsync(new PagePdfOptions
            {
                PrintBackground = true, 
                Format = "A4",
            });

            await browser.CloseAsync();
            return pdfBytes;
        }
    }

}
