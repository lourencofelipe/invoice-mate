namespace InvoiceMate.Tests.API;
public class InvoiceControllerTests
{
    [Fact]
    public async Task GenerateInvoicePdf_ReturnsPdfFileResult()
    {
        // Arrange
        var expectedPdf = new byte[] { 0x01, 0x02, 0x03 };

        var mockPdfGenerator = new Mock<IPdfGenerator>();
        mockPdfGenerator
            .Setup(g => g.GenerateAsync(It.IsAny<Invoice>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(expectedPdf);

        var mockMapper = new Mock<AutoMapper.IMapper>();

        // Map AddressRequest -> Address (nullable)
        mockMapper
            .Setup(m => m.Map<Address>(It.IsAny<object>()))
            .Returns((object src) =>
            {
                if (src is null) return null;
                var ar = (AddressRequest)src;
                return new Address(ar.Line1, ar.Line2, ar.City, ar.Region, ar.Postcode, ar.Country);
            });

        // Map InvoiceItemRequest -> LineItem
        mockMapper
            .Setup(m => m.Map<LineItem>(It.IsAny<object>()))
            .Returns((object src) =>
            {
                var it = (InvoiceItemRequest)src;
                // Use product-based mapping (test uses product-based item)
                return LineItem.ForProductBased(it.Description, it.Quantity!.Value, it.UnitPrice!.Value);
            });

        var useCase = new CreateInvoiceUseCase(mockPdfGenerator.Object, mockMapper.Object);

        var controller = new InvoiceController(useCase);

        var now = DateTime.UtcNow;
        var request = new CreateInvoiceRequest(
            InvoiceNumber: "INV-001",
            Type: "product-based",
            ProjectName: null,
            SenderName: "Sender Co",
            SenderEmail: "sender@example.com",
            SenderWebSite: string.Empty,
            SenderPhoneNumber: null,
            SenderAddress: null,
            SenderAccNumber: null,
            RecipientName: "Recipient Co",
            RecipientEmail: "recipient@example.com",
            RecipientPhoneNumber: null,
            RecipientAddress: null,
            Currency: "NZD",
            InvoiceDate: now,
            DueDate: now.AddDays(30),
            ApplyGst: false,
            GstRate: null,
            Notes: null,
            Items: new List<InvoiceItemRequest>
            {
                new InvoiceItemRequest(
                    Description: "Test product",
                    Hours: null,
                    HourlyRate: null,
                    ProfessionalName: null,
                    Quantity: 2,
                    UnitPrice: 10m)
            }
        );

        // Act
        var result = await controller.GenerateInvoicePdf(request, CancellationToken.None);

        // Assert
        var fileResult = Assert.IsType<FileContentResult>(result);
        Assert.Equal("application/pdf", fileResult.ContentType);
        Assert.Equal($"Invoice_{request.InvoiceNumber}.pdf", fileResult.FileDownloadName);
        Assert.Equal(expectedPdf, fileResult.FileContents);
    }
}
