"use client";

import { InvoiceForm } from "@/components/invoice/InvoiceForm";
import { LanguageProvider } from "@/components/invoice/LanguageProvider";

export default function InvoicePage() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 md:p-12">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Free Invoice Generator
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                 that simplifies billing for your international payments
              </p>
            </div>
            <InvoiceForm />
          </div>
        </div>
      </div>
    </LanguageProvider>
  );
}

