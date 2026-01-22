"use client";

import { useState } from "react";
import { InvoiceForm } from "@/features/invoices/ui/InvoiceForm";
import { LanguageProvider } from "@/shared/providers/LanguageProvider";

function InvoiceHeader({ invoiceType }: { invoiceType: string }) {

  const typeLabel = invoiceType === "product-based" ? "Deliverables" : "Service provision";

  return (
    <div className="mb-7">
      <div className="flex justify-between items-baseline">
        <h1 className="text-5xl leading-[64px] font-normal text-indigo-600">
          Invoice
        </h1>
        <h5 className="text-lg font-semibold text-[#1e3a8a]">
          {typeLabel}
        </h5>
      </div>
    </div>
  );
}

export default function Home() {
  type InvoiceType = "time-based" | "product-based"
  const [invoiceType, setInvoiceType] = useState<InvoiceType>("time-based");

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#F7F7F9] py-8 px-4 sm:px-6 lg:px-8 2xl:px-20">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-2xl p-8 sm:p-8 md:p-10 lg:p-14">
            <InvoiceHeader invoiceType={invoiceType} />
            <InvoiceForm invoiceType={invoiceType} setInvoiceType={setInvoiceType} />
          </div>
        </div>
      </div>
    </LanguageProvider>
  );
}
