"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  //pt: {
    // Header
    //"title": "Gerador de invoice gratuito",
   // "subtitle": "Que facilita a cobrança dos seus pagamentos internacionais",
  //  "language": "Qual o idioma da sua invoice?",
    
    // Receiver section
   // "receiver.title": "Informações do recebedor",
   // "receiver.company": "Nome da empresa",
   // "receiver.email": "Email",
   // "receiver.phone": "Telefone",
   // "receiver.accNumber": "Número da conta",
   // "receiver.zip": "CEP",
   // "receiver.city": "Cidade e estado",
   // "receiver.address": "Endereço",
   // "receiver.complement": "Complemento",
   // "receiver.country": "País",
    
    // Bill to section
   // "billto.title": "Cobrar a",
   // "billto.company": "Nome da empresa",
   // "billto.email": "Email",
  //"billto.phone": "Telefone",
   // "billto.address": "Endereço linha 1",
   // "billto.addressLine2": "Endereço linha 2",
   // "billto.city": "Cidade",
   // "billto.region": "Estado/Região",
   // "billto.postcode": "CEP",
   // "billto.country": "País",
    
    // Invoice section
   // "invoice.title": "Sobre a invoice",
   // "invoice.number": "Número da invoice",
   // "invoice.date": "Data de Emissão",
   // "invoice.dueDate": "Data de validade",
   // "invoice.description": "Descrição do serviço",
   // "invoice.currency": "Moeda do recebimento",
   // "invoice.amount": "Valor",
   // "invoice.notes": "Observações",
   // "invoice.applyGst": "Aplicar GST",
   // "invoice.gstRate": "Taxa de GST",
    
    // Actions
    //"submit": "Gerar Invoice",
    //"submitting": "Gerando...",
    
    // Placeholders
    //"select.currency": "Selecione",
    //"currency.usd": "Dólar americano",
    //"currency.eur": "Euro",
    //"currency.gbp": "Libra esterlina",
    //"currency.aud": "Dólar australiano",
    //"currency.cad": "Dólar canadense",
    //"currency.chf": "Franco suíço",
    //"currency.jpy": "Iene japonês",
 // },
  en: {
    // Header
    "title": "Free invoice generator",
    "subtitle": "That facilitates billing for your international payments",
    "language": "What language is your invoice?",
    
    // Receiver section
    "receiver.title": "Receiver information",
    "receiver.company": "Company name",
    "receiver.email": "Email",
    "receiver.phone": "Phone",
    "receiver.accNumber": "Account number",
    "receiver.zip": "Post code",
    "receiver.city": "City and state",
    "receiver.address": "Address line 1",
    "receiver.complement": "Address line 2",
    "receiver.country": "Country",
    
    // Bill to section
    "billto.title": "Bill to",
    "billto.company": "Company name",
    "billto.email": "Email",
    "billto.phone": "Phone",
    "billto.address": "Address line 1",
    "billto.addressLine2": "Address line 2",
    "billto.city": "City",
    "billto.region": "State/Region",
    "billto.postcode": "Postcode",
    "billto.country": "Country",
    
    // Invoice section
    "invoice.title": "Invoice",
    "invoice.number": "Invoice number",
    "invoice.date": "Date",
    "invoice.dueDate": "Due date",
    "invoice.description": "Description",
    "invoice.currency": "Currency",
    "invoice.amount": "Amount",
    "invoice.notes": "Notes",
    "invoice.applyGst": "Apply GST",
    "invoice.gstRate": "GST Rate",
    
    // Actions
    "submit": "Generate Invoice",
    "submitting": "Generating...",
    
    // Placeholders
    "select.currency": "Select",
    "currency.usd": "American dollar",
    "currency.eur": "Euro",
    "currency.gbp": "English pound",
    "currency.aud": "Australian dollar",
    "currency.cad": "Canadian dollar",
    "currency.chf": "Swiss franc",
    "currency.jpy": "Japanese yen",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

