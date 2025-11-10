"use client";

import { useEffect } from "react";
import {
  UseFormRegister,
  FieldErrors,
  UseFormWatch,
  Controller,
  Control,
  useFieldArray,
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
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface InvoiceDetailsSectionProps {
  register: UseFormRegister<InvoiceFormData>;
  errors: FieldErrors<InvoiceFormData>;
  watch: UseFormWatch<InvoiceFormData>;
  control: Control<InvoiceFormData>;
  setValue: (field: string, value: any) => void;
  invoiceType: string;
  setInvoiceType: (type: string) => void;
}

export function InvoiceDetailsSection({
  register,
  errors,
  control,
  watch,
  setValue,
  invoiceType,
  setInvoiceType,
}: InvoiceDetailsSectionProps) {
  const { t } = useLanguage();
  const applyGst = watch("applyGst");
  const type = watch("type");
  const hasMultipleProfessionals = watch("hasMultipleProfessionals");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const {
    fields: professionalFields,
    append: appendProfessional,
    remove: removeProfessional,
  } = useFieldArray({
    control,
    name: "professionals",
  });

  const handleAddItem = () => append({ description: "", quantity: 1, unitPrice: 0 });

  const handleAddProfessional = () =>
    appendProfessional({ name: "", hours: "", hourlyRate: "" });

  useEffect(() => {
    setValue("invoiceDate", new Date().toISOString());
  }, [setValue]);

  return (
    <div className="space-y-6 pt-8 p-2 border-[#DDDDDD]">
      <h2 className="text-lg font-bold text-[#333333] pb-4 mb-8 border-b border-[#DDDDDD]">
        {t("invoice.title")}
      </h2>

      {/* Invoice Type */}
      <div>
        <Label htmlFor="type" className="mb-2 block">
          Invoice Type
        </Label>
        <Controller
          name="type"
          control={control}
          defaultValue={invoiceType}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(val) => {
                field.onChange(val);
                setInvoiceType(val);
              }}
            >
              <SelectTrigger id="type" className="input-base">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="time-based">Service provision</SelectItem>
                <SelectItem value="product-based">Deliverables</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Invoice Number */}
        <div>
          <Label htmlFor="invoiceNumber" className="mb-2 block">
            {t("invoice.number")}
          </Label>
          <Input
            id="invoiceNumber"
            className="input-base"
            type="text"
            placeholder="e.g. INV-0001"
            {...register("invoiceNumber")}
          />
          {errors.invoiceNumber && (
            <p className="mt-2 text-sm text-red-600">{errors.invoiceNumber.message}</p>
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
                    <Button variant="outline" className="justify-start text-left font-normal input-base">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {value ? format(value, "dd/MM/yyyy") : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="z-50 !bg-white rounded-xl shadow-md p-2">
                    <Calendar
                      className="w-auto !bg-white rounded-md"
                      mode="single"
                      selected={value}
                      onSelect={(date) => field.onChange(date ? date.toISOString() : "")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              );
            }}
          />
        </div>

        {/* Due Date */}
        <div className="relative flex flex-col space-y-2 !bg-white">
          <Label htmlFor="dueDate">{t("invoice.dueDate")}</Label>
          <Controller
            name="dueDate"
            control={control}
            defaultValue=""
            render={({ field }) => {
              const value = field.value ? new Date(field.value) : null;
              return (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start text-left font-normal input-base">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {value ? format(value, "dd/MM/yyyy") : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="z-50 !bg-white rounded-xl shadow-md p-2">
                    <Calendar
                      className="w-auto !bg-white rounded-md"
                      mode="single"
                      selected={value || undefined}
                      onSelect={(date) => field.onChange(date ? date.toISOString() : "")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              );
            }}
          />
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
        </div>
      </div>

      {/* --- Time-based Fields --- */}
      {type === "time-based" && (
        <div className="space-y-4 border-t pt-6 mt-4">
          <Label className="font-semibold text-gray-700">Time-based Details</Label>

          {/* Option to add multiple professionals */}
          <div className="flex items-center space-x-2 mt-2">
            <Controller
              name="hasMultipleProfessionals"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="hasMultipleProfessionals"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="hasMultipleProfessionals" className="cursor-pointer">
              Include multiple professionals
            </Label>
          </div>

          {/* Professionals Section */}
          {hasMultipleProfessionals &&
            professionalFields.map((pro, index) => (
              <div
                key={pro.id}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end border p-3 rounded-md bg-gray-50"
              >
                <div>
                  <Label>Professional Name</Label>
                  <Input
                    {...register(`professionals.${index}.name` as const)}
                    placeholder="e.g. John Smith"
                  />
                </div>
                <div>
                  <Label>Hours</Label>
                  <Input
                    type="number"
                    step="0.1"
                    {...register(`professionals.${index}.hours`, { valueAsNumber: true })}
                    placeholder="10"
                  />
                </div>
                <div>
                  <Label>Hourly Rate</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register(`professionals.${index}.hourlyRate`, { valueAsNumber: true })}
                    placeholder="80"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => removeProfessional(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}

          {hasMultipleProfessionals && (
            <Button
              type="button"
              variant="outline"
              onClick={handleAddProfessional}
              className="flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" /> Add Professional
            </Button>
          )}

          {/* Description Field */}
          <div className="mt-4">
            <Label htmlFor="description" className="mb-2 block">
              Description
            </Label>
            <Textarea
              id="description"
              rows={3}
              {...register("description")}
              placeholder="e.g. Description of services provided"
              className="border-2 border-gray-300 rounded-sm"
            />
          </div>

          {/* Default fields for single professional */}
          {!hasMultipleProfessionals && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor="hours">Hours</Label>
                <Input id="hours" type="number" step="0.1" placeholder="e.g. 10" {...register("hours")} />
              </div>

              <div>
                <Label htmlFor="hourRate">Hourly Rate</Label>
                <Input id="hourRate" type="number" step="0.01" placeholder="e.g. 80" {...register("hourRate")} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- Product-based Fields --- */}
      {type === "product-based" && (
        <div className="space-y-4 border-t pt-6 mt-4">
          <Label className="font-semibold text-gray-700">Deliverable Details</Label>

          {fields.map((item, index) => (
            <div
              key={item.id}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end border p-3 rounded-md bg-gray-50"
            >
              <div className="md:col-span-2">
                <Label>Description</Label>
                <Input
                  {...register(`items.${index}.description` as const)}
                  placeholder="Product description"
                />
              </div>

              <div>
                <Label>Qty</Label>
                <Input
                  type="number"
                  step="1"
                  min={1}
                  {...register(`items.${index}.quantity` as const)}
                  placeholder="1"
                />
              </div>

              <div>
                <Label>Unit Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  min={0}
                  {...register(`items.${index}.unitPrice` as const)}
                  placeholder="0.00"
                />
              </div>

              <Button
                type="button"
                variant="ghost"
                onClick={() => remove(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={handleAddItem}
            className="flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Add Product
          </Button>
        </div>
      )}

      {/* GST */}
      <div className="flex items-center space-x-2">
        <Controller
          name="applyGst"
          control={control}
          render={({ field }) => (
            <Checkbox id="applyGst" className="border-2" checked={field.value} onCheckedChange={field.onChange} />
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
          <Input
            id="gstRate"
            type="number"
            step="0.01"
            min={0}
            placeholder="0.15"
            defaultValue={0.15}
            className="input-base"
            {...register("gstRate")}
          />
        </div>
      )}

      {/* Notes */}
      <div>
        <Label htmlFor="notes" className="mb-2 block">
          {t("invoice.notes")}
        </Label>
        <Textarea
          id="notes"
          rows={4}
          {...register("notes")}
          placeholder="e.g. Additional notes or instructions for this invoice"
          className="border-2 border-gray-300 rounded-sm font-semibold"
        />
      </div>
    </div>
  );
}
