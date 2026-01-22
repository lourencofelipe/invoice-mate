"use client";

import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { createInvoice } from "@/features/invoices/infrastructure/invoice.api";
import { ReceiverSection } from "./ReceiverSection";
import { BillToSection } from "./BillToSection";
import { InvoiceDetailsSection } from "./InvoiceDetailsSection";
import { Button } from "@/shared/ui/button";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import { invoiceSchema, InvoiceFormData } from "@/features/invoices/domain/invoice.schema";

type InvoiceType = "time-based" | "product-based"

interface InvoiceFormProps {
  invoiceType: InvoiceType;
  setInvoiceType: (type: InvoiceType) => void;
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
    resolver: zodResolver(invoiceSchema) as Resolver<InvoiceFormData>,
    defaultValues: {
      invoiceDate: new Date().toISOString().split("T")[0],
      currency: "",
      applyGst: false,
      type: invoiceType,
      items: [],
      professionals: [],
      hasMultipleProfessionals: false,
      description: "",
      hours: 0,
      hourRate: 0,
    },
    mode: "onSubmit",
  });

  const onSubmit = async (data: InvoiceFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      let itemsPayload;

      if (data.type === "time-based") {
        const professionals = data.professionals || [];

        if (data.hasMultipleProfessionals && professionals.length > 0) {
          itemsPayload = professionals.map((pro) => ({
            Description: data.description || "Service provided",
            Hours: Number(pro.hours ?? 0),
            HourlyRate: Number(pro.hourlyRate ?? 0),
            ProfessionalName: pro.name,
            Quantity: 1,
            UnitPrice: Number(pro.hours ?? 0) * Number(pro.hourlyRate ?? 0),
          }));
        } else {
          itemsPayload = [
            {
              Description: data.description || "Service provided",
              Hours: Number(data.hours ?? 0),
              HourlyRate: Number(data.hourRate ?? 0),
              Quantity: 1,
              UnitPrice: Number(data.hours ?? 0) * Number(data.hourRate ?? 0),
              ProfessionalName: "",
            },
          ];
        }
      } else {
        itemsPayload = (data.items ?? []).map((item) => ({
          Description: item.description,
          Quantity: Number(item.quantity),
          UnitPrice: Number(item.unitPrice),
          Hours: null,
          HourlyRate: null,
          ProfessionalName: "",
        }));
      }

      const apiData = {
        InvoiceNumber: data.invoiceNumber,
        Type: data.type,
        ProjectName: data.projectName || "",
        SenderName: data.receiverCompany,
        SenderEmail: data.receiverEmail,
        SenderWebSite: data.senderWebSite || "",
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
        DueDate: data.dueDate || "",
        ApplyGst: data.applyGst || false,
        GstRate: data.applyGst ? parseFloat(data.gstRate ?? "0.15") : 0,
        Notes: data.notes || null,
        Items: itemsPayload,
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
    <form
      onSubmit={handleSubmit(onSubmit, () => {
        const firstError = Object.keys(errors)[0];
        if (firstError) {
          const el = document.getElementById(firstError);
          if (el) el.focus();
        }
      })}
      className="space-y-0"
    >
      {submitSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            Invoice generated successfully!
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
