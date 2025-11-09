import { z } from "zod";

// Schema de cada item para modo "item-based"
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

// Schema principal
export const invoiceSchema = z
  .object({
    // Sender (receiver)
    receiverCompany: z.string().min(1, "Company name is required"),
    receiverEmail: z.string().email("Invalid email address"),
    receiverPhone: z.string().optional(),
    receiverAccNumber: z.string().optional(),
    receiverZip: z.string().optional(),
    receiverCity: z.string().optional(),
    receiverAddress: z.string().optional(),
    receiverComplement: z.string().optional(),
    receiverCountry: z.string().optional(),

    // Recipient (bill to)
    billToCompany: z.string().min(1, "Company name is required"),
    billToEmail: z.string().email("Invalid email address"),
    billToPhone: z.string().optional(),
    billToAddress: z.string().optional(),
    billToAddressLine2: z.string().optional(),
    billToCity: z.string().optional(),
    billToRegion: z.string().optional(),
    billToPostcode: z.string().optional(),
    billToCountry: z.string().optional(),

    // Invoice details
    invoiceNumber: z.string().min(1, "Invoice number is required"),
    invoiceDate: z.string().min(1, "Date is required"),
    dueDate: z.string().optional(),
    type: z.enum(["time-based", "product-based"]),
    currency: z.string().min(1, "Currency is required"),
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

    // Item-based fields
    items: z.array(invoiceItemSchema).optional(),
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

    // Validação condicional por tipo de invoice
    if (data.type === "time-based") {
      if (!data.description || !data.hours || !data.hourRate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Description, hours and hourly rate are required for time-based invoices",
          path: ["description"],
        });
      }
    }

    if (data.type === "product-based") {
      if (!data.items || data.items.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "At least one item is required for item-based invoices",
          path: ["items"],
        });
      }
    }
  });

// Tipo inferido
export type InvoiceFormData = z.infer<typeof invoiceSchema>;
