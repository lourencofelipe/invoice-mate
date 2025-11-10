"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { createInvoice } from "@/api/invoices/invoiceApi";
import { ReceiverSection } from "./ReceiverSection";
import { BillToSection } from "./BillToSection";
import { InvoiceDetailsSection } from "./InvoiceDetailsSection";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { invoiceSchema, InvoiceFormData } from "@/lib/validation/invoiceSchema";

interface InvoiceFormProps {
  invoiceType: string;
  setInvoiceType: (type: string) => void;
}

export function InvoiceForm({ invoiceType, setInvoiceType }: InvoiceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    setValue,
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoiceDate: new Date().toISOString().split("T")[0],
      currency: "",
      applyGst: false,
      type: invoiceType,
      items: [],
    },
    mode: "onSubmit",
  });

  const onSubmit = async (data: InvoiceFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const apiData = {
        InvoiceNumber: data.invoiceNumber,
        Type: data.type,
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
        DueDate: data.dueDate || null,
        ApplyGst: data.applyGst || false,
        GstRate: data.applyGst ? parseFloat(data.gstRate ?? "0.15") : 0,
        Notes: data.notes || null,
        Items:
          data.type === "time-based"
            ? [
                {
                  Description: data.description ?? "",
                  Hours: parseFloat(String(data.hours ?? "0")),
                  HourlyRate: parseFloat(String(data.hourRate ?? "0")),
                  Quantity: 1,
                  UnitPrice:
                    parseFloat(String(data.hourRate ?? "0")) *
                    parseFloat(String(data.hours ?? "0")),
                },
              ]
            : (data.items ?? []).map((item) => ({
                Description: item.description,
                Quantity: Number(item.quantity),
                UnitPrice: Number(item.unitPrice),
              })),
      };

      await createInvoice(apiData);

      setSubmitSuccess(true);
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      let errorMessage = "An error occurred while generating the invoice.";
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
            Invoice generated successfully!
          </AlertDescription>
        </Alert>
      )}

      {submitError && (
        <Alert className="bg-red-50 border-red-200">
          <AlertDescription className="text-red-800">{submitError}</AlertDescription>
        </Alert>
      )}

      <ReceiverSection register={register} errors={errors} />
      <BillToSection register={register} errors={errors} />
      <InvoiceDetailsSection
        register={register}
        errors={errors}
        watch={watch}
        control={control}
        setValue={setValue}
        invoiceType={invoiceType}
        setInvoiceType={setInvoiceType}
      />

      <div className="pt-10 mt-6 border-t border-[#DDDDDD] flex justify-center">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-w-48 h-11 bg-[#1f41ff] text-base"
        >
          {isSubmitting ? "Submitting..." : "Generate Invoice"}
        </Button>
      </div>
    </form>
  );
}
