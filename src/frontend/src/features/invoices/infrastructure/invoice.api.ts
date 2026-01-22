import axios, { AxiosResponse } from "axios";

export interface CreateInvoiceRequest {
  InvoiceNumber: string;
  Type: string;
  ProjectName: string;
  SenderName: string;
  SenderEmail: string;
  SenderWebSite: string;
  SenderPhoneNumber: string | null;
  SenderAddress: {
    Line1: string | null;
    Line2: string | null;
    City: string | null;
    Region: string | null;
    Postcode: string | null;
    Country: string | null;
  };
  RecipientName: string;
  RecipientEmail: string;
  RecipientPhoneNumber: string | null;
  RecipientAddress: {
    Line1: string | null;
    Line2: string | null;
    City: string | null;
    Region: string | null;
    Postcode: string | null;
    Country: string | null;
  };
  Currency: string;
  InvoiceDate: string;
  DueDate: string;
  ApplyGst: boolean;
  GstRate: number | null;
  Notes: string | null;
  Items: Array<{
    Description: string;
    Hours: number | null;
    HourlyRate: number | null;
    ProfessionalName: string;
    Quantity: number | null;
    UnitPrice: number | null;
  }>;
}

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001",
  responseType: "arraybuffer",
  headers: { "Content-Type": "application/json" },
});

export async function createInvoice(
  data: CreateInvoiceRequest
): Promise<void> {
  const response: AxiosResponse<ArrayBuffer> = await apiClient.post<ArrayBuffer>(
    "/api/invoice/generate-pdf",
    data
  );

  const blob = new Blob([response.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;


  link.download = `${data.InvoiceNumber || "invoice"}.pdf`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
}

