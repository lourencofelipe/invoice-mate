"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { useLanguage } from "./LanguageProvider";
import { InvoiceFormData } from "@/lib/validation/invoiceSchema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ReceiverSectionProps {
  register: UseFormRegister<InvoiceFormData>;
  errors: FieldErrors<InvoiceFormData>;
}

export function ReceiverSection({ register, errors }: ReceiverSectionProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 pt-8 p-2">
      <h2 className="text-lg font-bold text-[#333333] pb-4 mb-8 border-b border-[#DDDDDD]">
        {t("receiver.title")}
      </h2>

      <div className="space-y-5">
        {/* Company Name */}
        <div>
          <Label htmlFor="receiverCompany" className="label-base">
            Company name
          </Label>
          <Input
            id="receiverCompany"
            className="input-base"
            type="text"
            placeholder="Receiver company"
            {...register("receiverCompany")}
          />
          {errors.receiverCompany && (
            <p className="mt-2 text-sm text-red-600">
              {errors.receiverCompany.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="receiverEmail" className="label-base">
            Email
          </Label>
          <Input
            id="receiverEmail"
            className="input-base"
            type="email"
            placeholder="Contact email"
            {...register("receiverEmail")}
          />
          {errors.receiverEmail && (
            <p className="mt-2 text-sm text-red-600">
              {errors.receiverEmail.message}
            </p>
          )}
        </div>

        {/* Phone + Account */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="receiverPhone" className="label-base">
              Phone
            </Label>
            <Input
              id="receiverPhone"
              className="input-base"
              type="tel"
              placeholder="Contact phone"
              {...register("receiverPhone")}
            />
          </div>
          <div>
            <Label htmlFor="receiverAccNumber" className="label-base">
              Acc.
            </Label>
            <Input
              id="receiverAccNumber"
              className="input-base"
              type="text"
              placeholder="eg. 12-3456-7890123-00"
              {...register("receiverAccNumber")}
            />
          </div>
        </div>

        {/* Address Line 1 + Address Line 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="receiverAddress" className="label-base">
              Address Line 1
            </Label>
            <Input
              id="receiverAddress"
              className="input-base"
              type="text"
              placeholder="eg. 42 Example Road"
              {...register("receiverAddress")}
            />
          </div>
          <div>
            <Label htmlFor="receiverComplement" className="label-base">
              Address Line 2
            </Label>
            <Input
              id="receiverComplement"
              className="input-base"
              type="text"
              placeholder="Apartment, Unit"
              {...register("receiverComplement")}
            />
          </div>
        </div>

        {/* Postal Code + City + Country */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="receiverZip" className="label-base">
              Postal Code
            </Label>
            <Input
              id="receiverZip"
              className="input-base"
              type="text"
              placeholder="Postal code"
              {...register("receiverZip")}
            />
          </div>
          <div>
            <Label htmlFor="receiverCity" className="label-base">
              City
            </Label>
            <Input
              id="receiverCity"
              className="input-base"
              type="text"
              placeholder="City"
              {...register("receiverCity")}
            />
          </div>
          <div>
            <Label htmlFor="receiverCountry" className="label-base">
              Country
            </Label>
            <Input
              id="receiverCountry"
              className="input-base"
              type="text"
              placeholder="Country"
              {...register("receiverCountry")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
