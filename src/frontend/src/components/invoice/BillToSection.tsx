"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { useLanguage } from "./LanguageProvider";
import { InvoiceFormData } from "@/lib/validation/invoiceSchema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface BillToSectionProps {
  register: UseFormRegister<InvoiceFormData>;
  errors: FieldErrors<InvoiceFormData>;
}

export function BillToSection({ register, errors }: BillToSectionProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 pt- p-2 border-[#DDDDDD]">
      <h2 className="text-lg font-bold text-[#333333] pb-4 mb-8 border-b border-[#DDDDDD]">
        {t("billto.title")}
      </h2>
      
      <div>
        <Label htmlFor="billToCompany" className="mb-2 block">
          {t("billto.company")}
        </Label>
        <Input
          id="billToCompany"
          className="input-base"
          type="text"
          placeholder="Billing Name"
          {...register("billToCompany")}
        />
        {errors.billToCompany && (
          <p className="mt-2 text-sm text-red-600">
            {errors.billToCompany.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="billToEmail" className="mb-2 block">
            {t("billto.email")}
          </Label>
          <Input
            id="billToEmail"
            className="input-base"
            type="email"
            placeholder="email@example.com"
            {...register("billToEmail")}
          />
          {errors.billToEmail && (
            <p className="mt-2 text-sm text-red-600">
              {errors.billToEmail.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="billToPhone" className="mb-2 block">
            {t("billto.phone")}
          </Label>
          <Input
            id="billToPhone"
            className="input-base"
            type="tel"
            placeholder="xx xxx xxx xxx"
            {...register("billToPhone")}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="billToAddress" className="mb-2 block">
          {t("billto.address")}
        </Label>
        <Input
          id="billToAddress"
          className="input-base"
          type="text"
          placeholder="Enter the billing address (e.g., 42 Sample Road)"
          {...register("billToAddress")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="billToCity" className="mb-2 block">
            {t("billto.city")}
          </Label>
          <Input
            id="billToCity"
            className="input-base"
            type="text"
            placeholder="City"
            {...register("billToCity")}
          />
        </div>

        <div>
          <Label htmlFor="billToRegion" className="mb-2 block">
            {t("billto.region")}
          </Label>
          <Input
            id="billToRegion"
            className="input-base"
            type="text"
            placeholder="State / Region"
            {...register("billToRegion")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="billToPostcode" className="mb-2 block">
            {t("billto.postcode")}
          </Label>
          <Input
            id="billToPostcode"
            className="input-base"
            type="text"
            placeholder="Postal code"
            {...register("billToPostcode")}
          />
        </div>

        <div>
          <Label htmlFor="billToCountry" className="mb-2 block">
            {t("billto.country")}
          </Label>
          <Input
            id="billToCountry"
            className="input-base"
            type="text"
            placeholder="Country"
            {...register("billToCountry")}
          />
        </div>
      </div>
    </div>
  );
}

