export type DocumentType = 'quote' | 'invoice' | 'situation';

export type DocumentStatus = 
  | 'draft'      // Brouillon
  | 'sent'       // Envoyé
  | 'accepted'   // Accepté / Validé
  | 'rejected'   // Refusé
  | 'paid'       // Payé
  | 'partial'    // Acompte versé / Partiel
  | 'overdue';   // En retard

export type MaterialCategory = 
  | 'gros_oeuvre' 
  | 'maconnerie' 
  | 'charpente_couverture' 
  | 'plomberie_sanitaire' 
  | 'electricite' 
  | 'peinture_revetement' 
  | 'carrelage'
  | 'menuiserie' 
  | 'quincaillerie_fer' 
  | 'main_oeuvre' 
  | 'engins_location' 
  | 'divers';

export interface CompanyInfo {
  name: string;
  activity: string;
  slogan: string;
  logoUrl: string;
  logoPreset?: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  phoneSecondary?: string;
  email: string;
  website?: string;
  siret: string;
  rccm: string;
  tvaNumber: string;
  defaultTaxRate: number;
  currency: string;
  currencyPosition: 'after' | 'before';
  bankName: string;
  iban: string;
  bic: string;
  mobileMoney?: string;
  defaultValidityDays: number;
  defaultAdvancePercentage: number;
  legalNotice: string;
  paymentTerms: string;
  stampOrSignatureUrl?: string;
}

export interface MaterialItem {
  id: string;
  category: MaterialCategory;
  name: string;
  description?: string;
  unit: string;
  defaultPrice: number;
  defaultTaxRate: number;
  isCustom?: boolean;
}

export interface Client {
  id: string;
  name: string;
  company?: string;
  phone: string;
  email?: string;
  address?: string;
  siteAddress?: string;
  notes?: string;
  createdAt: string;
}

export interface QuoteItem {
  id: string;
  type: 'item' | 'section';
  title: string;
  description?: string;
  category?: string;
  unit?: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  discountPercent: number;
  totalHT: number;
}

export interface BTPDocument {
  id: string;
  type: DocumentType;
  docNumber: string;
  title: string;
  date: string;
  validityDate: string;
  clientId: string;
  client: Client;
  siteLocation: string;
  items: QuoteItem[];
  globalDiscountPercent: number;
  totalHT: number;
  totalDiscount: number;
  totalTax: number;
  totalTTC: number;
  advancePercent: number;
  advanceAmount: number;
  amountPaid: number;
  balanceDue: number;
  status: DocumentStatus;
  notes: string;
  paymentTerms: string;
  signatureClient?: string;
  signatureDate?: string;
  convertedFromQuoteId?: string;
  convertedToInvoiceId?: string;
  createdAt: string;
  updatedAt: string;
  syncStatus: 'synced' | 'pending' | 'offline';
}

export interface SyncRecord {
  id: string;
  action: 'create' | 'update' | 'delete';
  entityType: 'document' | 'client' | 'material' | 'company';
  data: any;
  timestamp: string;
}
