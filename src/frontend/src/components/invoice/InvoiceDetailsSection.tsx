"use client";

import { useState } from "react";
import {
  UseFormRegister,
  FieldErrors,
  UseFormWatch,
  Controller,
  Control,
} from "react-hook-form";
import { useLanguage } from "./LanguageProvider";
import { InvoiceFormData } from "@/lib/validation/invoiceSchema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { currencies } from "@/utils/currencies";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface InvoiceDetailsSectionProps {
  register: UseFormRegister<InvoiceFormData>;
  errors: FieldErrors<InvoiceFormData>;
  watch: UseFormWatch<InvoiceFormData>;
  control: Control<InvoiceFormData>;
}

export function InvoiceDetailsSection({
  register,
  errors,
  control,
  watch,
}: InvoiceDetailsSectionProps) {
  const { t } = useLanguage();
  const applyGst = watch("applyGst");

  return (
    <div className="space-y-6 pt-8 p-2 border-[#DDDDDD]">
      <h2 className="text-lg font-bold text-[#333333] pb-4 mb-8 border-b border-[#DDDDDD]">
        {t("invoice.title")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Invoice Number */}
        <div>
          <Label htmlFor="invoiceNumber" className="mb-2 block">
            {t("invoice.number")}
          </Label>
          <Input id="invoiceNumber" className="input-base" type="text" {...register("invoiceNumber")} />
          {errors.invoiceNumber && (
            <p className="mt-2 text-sm text-red-600">
              {errors.invoiceNumber.message}
            </p>
          )}
        </div>

        {/* Invoice Date */}
        <div className="relative flex flex-col space-y-2 !bg-white">
          <Label htmlFor="invoiceDate">{t("invoice.date")}</Label>
          <Controller
            name="invoiceDate"
            control={control}
            defaultValue={new Date().toISOString()}
            render={({ field }) => {
              const value = field.value ? new Date(field.value) : new Date();
              return (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start text-left font-normal input-base"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {value ? format(value, "dd/MM/yyyy") : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="z-50 !bg-white rounded-xl shadow-md p-2">
                    <Calendar
                      className="w-auto !bg-white rounded-md"
                      mode="single"
                      selected={value}
                      onSelect={(date) =>
                        field.onChange(date ? date.toISOString() : "")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              );
            }}
          />
          {errors.invoiceDate && (
            <p className="mt-1 text-sm text-red-600">{errors.invoiceDate.message}</p>
          )}
        </div>

        {/* Due Date */}
        <div className="relative flex flex-col space-y-2 !bg-white">
          <Label htmlFor="dueDate">{t("invoice.dueDate")}</Label>
          <Controller
            name="dueDate"
            control={control}
            defaultValue={new Date().toISOString()}
            render={({ field }) => {
              const value = field.value ? new Date(field.value) : new Date();
              return (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start text-left font-normal input-base"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {value ? format(value, "dd/MM/yyyy") : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="z-50 !bg-white rounded-xl shadow-md p-2">
                    <Calendar
                      className="w-auto !bg-white rounded-md"
                      mode="single"
                      selected={value}
                      onSelect={(date) =>
                        field.onChange(date ? date.toISOString() : "")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              );
            }}
          />
          {errors.dueDate && (
            <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
          )}
        </div>

        {/* Currency */}
        <div>
          <Label htmlFor="currency" className="mb-2 block">
            {t("invoice.currency")}
          </Label>
          <Controller
            name="currency"
            control={control}
            render={({ field }) => (
              <Select value={field.value || ""} onValueChange={field.onChange}>
                <SelectTrigger id="currency" className="input-base">
                  <SelectValue placeholder={t("select.currency")} />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.labelEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.currency && (
            <p className="mt-2 text-sm text-red-600">{errors.currency.message}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description" className="mb-2 block">
          {t("invoice.description")}
        </Label>
        <Textarea id="description" rows={4} {...register("description")} 
        className="border-2 border-gray-300 rounded-sm font-semibold h-auto overflow-hidden" />
        {errors.description && (
          <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* Amount */}
      <div>
        <Label htmlFor="amount" className="mb-2 block">
          {t("invoice.amount")}
        </Label>
        <Input id="amount" type="text" placeholder="0.00" {...register("amount")} className="input-base" />
        {errors.amount && (
          <p className="mt-2 text-sm text-red-600">{errors.amount.message}</p>
        )}
      </div>

      {/* GST */}
      <div className="flex items-center space-x-2">
        <Controller
          name="applyGst"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="applyGst"
              className="border-2 "
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label htmlFor="applyGst" className="mb-0 cursor-pointer">
          {t("invoice.applyGst")}
        </Label>
      </div>

      {applyGst && (
        <div>
          <Label htmlFor="gstRate" className="mb-2 block">
            {t("invoice.gstRate")}
          </Label>
          <Input id="gstRate" type="text" placeholder="0.15" {...register("gstRate")} className="input-base" />
          {errors.gstRate && (
            <p className="mt-2 text-sm text-red-600">{errors.gstRate.message}</p>
          )}
        </div>
      )}

      {/* Notes */}
      <div>
        <Label htmlFor="notes" className="mb-2 block">
          {t("invoice.notes")}
        </Label>
        <Textarea id="notes" rows={4} {...register("notes")} className="border-2 border-gray-300 rounded-sm font-semibold" />
      </div>
    </div>
  );
}
