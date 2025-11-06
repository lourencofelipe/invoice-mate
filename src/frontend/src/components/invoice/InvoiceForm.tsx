"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { createInvoice } from "@/api/invoices/invoiceApi";
//import { LanguageToggle } from "./LanguageToggle";
import { ReceiverSection } from "./ReceiverSection";
import { BillToSection } from "./BillToSection";
import { InvoiceDetailsSection } from "./InvoiceDetailsSection";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { invoiceSchema, InvoiceFormData } from "@/lib/validation/invoiceSchema";

export function InvoiceForm() {
  //const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoiceDate: new Date().toISOString().split("T")[0],
      currency: "",
      applyGst: false,
    },
  });

  const onSubmit = async (data: InvoiceFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const apiData = {
        InvoiceNumber: data.invoiceNumber,
        Type: "product-based",
        SenderName: data.receiverCompany,
        SenderEmail: data.receiverEmail,
        SenderPhoneNumber: data.receiverPhone || null,
        SenderAddress: {
          Line1: data.receiverAddress || null,
          Line2: data.receiverComplement || null,
          City: data.receiverCity?.split(",")[0]?.trim() || null,
          Region: data.receiverCity?.split(",")[1]?.trim() || null,
          Postcode: data.receiverZip || null,
          Country: data.receiverCountry || null,
        },
        SenderAccNumber: data.receiverAccNumber || null,
        RecipientName: data.billToCompany,
        RecipientEmail: data.billToEmail,
        RecipientPhoneNumber: data.billToPhone || null,
        RecipientAddress: {
          Line1: data.billToAddress || null,
          Line2: data.billToAddressLine2 || null,
          City: data.billToCity || null,
          Region: data.billToRegion || null,
          Postcode: data.billToPostcode || null,
          Country: data.billToCountry || null,
        },
        Currency: data.currency,
        InvoiceDate: data.invoiceDate,
        DueDate: data.dueDate,
        ApplyGst: data.applyGst || false,
        GstRate: data.applyGst && data.gstRate ? parseFloat(data.gstRate) : null,
        Notes: data.notes || null,
        Items: [
          {
            Description: data.description,
            Hours: null,
            HourlyRate: null,
            Quantity: 1,
            UnitPrice: parseFloat(data.amount),
          },
        ],
      };

      const response = await createInvoice(apiData);

      // Gera e baixa o PDF
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Invoice_${data.invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSubmitSuccess(true);
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      let errorMessage = "An error occurred while generating the invoice";

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        errorMessage =
          (axiosError.response?.data as { message?: string })?.message ||
          axiosError.message ||
          errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-0">
      

      {submitSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            {"Invoice generated successfully!"}
          </AlertDescription>
        </Alert>
      )}

      {submitError && (
        <Alert className="bg-red-50 border-red-200">
          <AlertDescription className="text-red-800">
            {submitError}
          </AlertDescription>
        </Alert>
      )}

      <ReceiverSection register={register} errors={errors} />
      <BillToSection register={register} errors={errors} />
      <InvoiceDetailsSection register={register} errors={errors} watch={watch} control={control} />

      <div className="pt-10 mt-6 border-t border-[#DDDDDD] flex justify-center">
        <Button type="submit" disabled={isSubmitting} className="min-w-48 h-11 bg-[#1f41ff] text-base">
          {isSubmitting ? "submitting" : "Generate Invoice"}
        </Button>
      </div>
    </form>
  );
}
