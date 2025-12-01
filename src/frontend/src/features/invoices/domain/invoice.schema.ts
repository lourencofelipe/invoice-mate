import { z } from "zod";


export const invoiceItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z
    .union([z.string(), z.number()])
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Quantity must be a positive number",
    }),
  unitPrice: z
    .union([z.string(), z.number()])
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Unit price must be a valid number",
    }),
});


export const professionalSchema = z.object({
  name: z.string().min(1, "Professional name is required"),
  hours: z
    .union([z.string(), z.number()])
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Hours must be a valid number",
    }),
  hourlyRate: z
    .union([z.string(), z.number()])
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Hourly rate must be a valid number",
    }),
});


export const invoiceSchema = z
  .object({
    // Sender (receiver)
    receiverCompany: z.string().min(1, "Company name is required"),
    receiverEmail: z.string().email("Invalid email address"),
    senderWebSite: z.string().optional(),
    receiverPhone: z.string().optional(),
    receiverAccNumber: z.string().optional(),
    receiverZip: z.string().optional(),
    receiverCity: z.string().min(1, "City is required"),
    receiverAddress: z.string().min(1, "Address is required"),
    receiverComplement: z.string().optional(),
    receiverCountry: z.string().min(1, "Country name is required"),

    // Recipient (bill to)
    billToCompany: z.string().min(1, "Company name is required"),
    billToEmail: z.string().email("Invalid email address"),
    billToPhone: z.string().optional(),
    billToAddress: z.string().min(1, "Address is required"),
    billToAddressLine2: z.string().optional(),
    billToCity: z.string().min(1, "City is required"),
    billToRegion: z.string().optional(),
    billToPostcode: z.string().optional(),
    billToCountry: z.string().min(1, "Country name is required"),

    // Invoice details
    invoiceNumber: z.string().min(1, "Invoice number is required"),
    invoiceDate: z.string().min(1, "Date is required"),
    dueDate: z.string().min(1, "Due date is required"),
    type: z.enum(["time-based", "product-based"]),
    projectName: z.string().optional(),
    currency: z
      .string()
      .refine((val) => val.trim() !== "", {
        message: "Currency is required",
      }),
    applyGst: z.boolean().default(false),
    gstRate: z.string().optional(),
    notes: z.string().optional(),

    // Time-based fields
    description: z.string().optional(),
    hours: z
      .union([z.string(), z.number()])
      .optional()
      .refine(
        (val) => val === undefined || (!isNaN(Number(val)) && Number(val) >= 0),
        { message: "Hours must be a valid number" }
      ),
    hourRate: z
      .union([z.string(), z.number()])
      .optional()
      .refine(
        (val) => val === undefined || (!isNaN(Number(val)) && Number(val) >= 0),
        { message: "Hourly rate must be a valid number" }
      ),

    // Professionals (time-based)
    professionals: z.array(professionalSchema).optional().default([]),
    hasMultipleProfessionals: z.boolean().optional().default(false),

    // Item-based fields
    items: z.array(invoiceItemSchema).optional().default([]),
  })
  .superRefine((data, ctx) => {
    // GST validation
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

    // Time-based invoice validation
    if (data.type === "time-based") {
      if (!data.description && (!data.hasMultipleProfessionals || data.professionals.length === 0)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Description or at least one professional is required for time-based invoices",
          path: ["description"],
        });
      }


      if (data.hasMultipleProfessionals) {
        data.professionals.forEach((pro, index) => {
          if (!pro.name || pro.hours === undefined || pro.hourlyRate === undefined) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Each professional must have name, hours, and hourly rate",
              path: [`professionals.${index}`],
            });
          }
        });
      }
    }

    // Product-based invoice validation
    if (data.type === "product-based") {
      if (!data.items || data.items.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "At least one item is required for product-based invoices",
          path: ["items"],
        });
      }
    }
  });


export type InvoiceFormData = z.infer<typeof invoiceSchema>;