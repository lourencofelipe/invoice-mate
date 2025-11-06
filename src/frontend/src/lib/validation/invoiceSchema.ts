import { z } from "zod";

export const invoiceSchema = z
  .object({
    receiverCompany: z.string().min(1, "Company name is required"),
    receiverEmail: z.string().email("Invalid email address"),
    receiverPhone: z.string().optional(),
    receiverAccNumber: z.string().optional(),
    receiverZip: z.string().optional(),
    receiverCity: z.string().optional(),
    receiverAddress: z.string().optional(),
    receiverComplement: z.string().optional(),
    receiverCountry: z.string().optional(),

    billToCompany: z.string().min(1, "Company name is required"),
    billToEmail: z.string().email("Invalid email address").min(1, "Email is required"),
    billToPhone: z.string().optional(),
    billToAddress: z.string().optional(),
    billToAddressLine2: z.string().optional(),
    billToCity: z.string().optional(),
    billToRegion: z.string().optional(),
    billToPostcode: z.string().optional(),
    billToCountry: z.string().optional(),

    invoiceNumber: z.string().min(1, "Invoice number is required"),
    invoiceDate: z.string().min(1, "Date is required"),
    dueDate: z.string().min(1, "Due date is required"),
    description: z.string().min(1, "Description is required"),
    currency: z.string().min(1, "Currency is required"),
    amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid amount format"),
    notes: z.string().optional(),
    applyGst: z.boolean().default(false),
    gstRate: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.applyGst) {
      if (!data.gstRate || data.gstRate.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "GST rate is required when GST is applied",
          path: ["gstRate"],
        });
      } else {
        const num = parseFloat(data.gstRate);
        if (isNaN(num) || num < 0 || num > 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "GST rate must be a number between 0 and 1",
            path: ["gstRate"],
          });
        }
      }
    }
  });

export type InvoiceFormData = z.infer<typeof invoiceSchema>;
