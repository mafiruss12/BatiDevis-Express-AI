import { CompanyInfo, BTPDocument, QuoteItem } from '../types';

export const formatMoney = (
  amount: number | undefined | null,
  currency: string = 'FCFA',
  position: 'after' | 'before' = 'after'
): string => {
  const safeAmount = amount ?? 0;
  // Format with French thousands separator
  const formattedNumber = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(safeAmount);

  if (position === 'before') {
    return `${currency} ${formattedNumber}`;
  }
  return `${formattedNumber} ${currency}`;
};

export const formatDateFr = (dateString?: string): string => {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(d);
  } catch {
    return dateString;
  }
};

export const calculateItemTotalHT = (quantity: number, unitPrice: number, discountPercent: number = 0): number => {
  const q = Number(quantity) || 0;
  const p = Number(unitPrice) || 0;
  const d = Number(discountPercent) || 0;
  const gross = q * p;
  const discountAmount = gross * (d / 100);
  return Math.max(0, gross - discountAmount);
};

export const calculateDocumentTotals = (
  items: QuoteItem[],
  globalDiscountPercent: number = 0,
  advancePercent: number = 0,
  amountPaid: number = 0
) => {
  let subtotalHT = 0;
  let totalLineDiscounts = 0;
  let totalTax = 0;

  // Breakdown of taxes by rate
  const taxBreakdown: Record<number, { baseHT: number; taxAmount: number }> = {};

  items.forEach((item) => {
    if (item.type === 'section') return;

    const q = Number(item.quantity) || 0;
    const p = Number(item.unitPrice) || 0;
    const lineDiscount = Number(item.discountPercent) || 0;
    const lineGross = q * p;
    const lineDiscountVal = lineGross * (lineDiscount / 100);
    const lineHT = lineGross - lineDiscountVal;

    subtotalHT += lineHT;
    totalLineDiscounts += lineDiscountVal;

    const taxRate = Number(item.taxRate) || 0;
    const itemTax = lineHT * (taxRate / 100);
    totalTax += itemTax;

    if (taxRate > 0) {
      if (!taxBreakdown[taxRate]) {
        taxBreakdown[taxRate] = { baseHT: 0, taxAmount: 0 };
      }
      taxBreakdown[taxRate].baseHT += lineHT;
      taxBreakdown[taxRate].taxAmount += itemTax;
    }
  });

  // Apply global discount if any
  const gDiscount = Number(globalDiscountPercent) || 0;
  const globalDiscountVal = subtotalHT * (gDiscount / 100);
  const finalHT = Math.max(0, subtotalHT - globalDiscountVal);
  
  // Recalculate tax if global discount was applied
  if (gDiscount > 0 && subtotalHT > 0) {
    const factor = finalHT / subtotalHT;
    totalTax = totalTax * factor;
    Object.keys(taxBreakdown).forEach((rate) => {
      const r = Number(rate);
      taxBreakdown[r].baseHT *= factor;
      taxBreakdown[r].taxAmount *= factor;
    });
  }

  const totalDiscount = totalLineDiscounts + globalDiscountVal;
  const totalTTC = Math.round((finalHT + totalTax) * 100) / 100;

  const advPercent = Math.min(100, Math.max(0, Number(advancePercent) || 0));
  const advanceAmount = Math.round((totalTTC * (advPercent / 100)) * 100) / 100;
  const safeAmountPaid = Number(amountPaid) || 0;
  const balanceDue = Math.max(0, Math.round((totalTTC - safeAmountPaid) * 100) / 100);

  return {
    totalHT: Math.round(finalHT * 100) / 100,
    totalDiscount: Math.round(totalDiscount * 100) / 100,
    totalTax: Math.round(totalTax * 100) / 100,
    totalTTC,
    advanceAmount,
    balanceDue,
    taxBreakdown
  };
};

export const getNextDocNumber = (type: 'quote' | 'invoice' | 'situation', existingDocs: BTPDocument[]): string => {
  const currentYear = new Date().getFullYear();
  const prefix = type === 'quote' ? 'DEV' : type === 'invoice' ? 'FAC' : 'SIT';
  
  const relevantDocs = existingDocs.filter(d => d.type === type && d.docNumber?.startsWith(`${prefix}-${currentYear}`));
  
  let maxSeq = 0;
  relevantDocs.forEach(d => {
    const parts = d.docNumber.split('-');
    if (parts.length >= 3) {
      const seq = parseInt(parts[2], 10);
      if (!isNaN(seq) && seq > maxSeq) {
        maxSeq = seq;
      }
    }
  });

  const nextSeq = (maxSeq + 1).toString().padStart(4, '0');
  return `${prefix}-${currentYear}-${nextSeq}`;
};

export const generateWhatsAppShareText = (doc: BTPDocument, company: CompanyInfo): string => {
  const isQuote = doc.type === 'quote';
  const typeLabel = isQuote ? 'DEVIS' : 'FACTURE';
  
  let text = `🏗️ *${company.name}*\n`;
  text += `📋 *${typeLabel} N° ${doc.docNumber}*\n`;
  text += `🗓️ Date: ${formatDateFr(doc.date)}\n`;
  if (doc.siteLocation) {
    text += `📍 Chantier: ${doc.siteLocation}\n`;
  }
  text += `👤 Client: ${doc.client?.name || 'Client'}\n\n`;
  
  text += `*Objet:* ${doc.title}\n`;
  text += `--------------------------------\n`;
  
  doc.items.forEach(item => {
    if (item.type === 'section') {
      text += `\n📌 *${item.title}*\n`;
    } else {
      text += `• ${item.title}: ${item.quantity} ${item.unit} x ${formatMoney(item.unitPrice, company.currency, company.currencyPosition)} = *${formatMoney(item.totalHT, company.currency, company.currencyPosition)}*\n`;
    }
  });
  
  text += `--------------------------------\n`;
  text += `💰 *TOTAL HT:* ${formatMoney(doc.totalHT, company.currency, company.currencyPosition)}\n`;
  if (doc.totalTax > 0) {
    text += `🏛️ TVA: ${formatMoney(doc.totalTax, company.currency, company.currencyPosition)}\n`;
  }
  text += `✅ *TOTAL TTC:* ${formatMoney(doc.totalTTC, company.currency, company.currencyPosition)}\n`;
  
  if (isQuote && doc.advancePercent > 0) {
    text += `💵 Acompte demandé (${doc.advancePercent}%): ${formatMoney(doc.advanceAmount, company.currency, company.currencyPosition)}\n`;
  } else if (!isQuote) {
    text += `💳 Déjà payé: ${formatMoney(doc.amountPaid, company.currency, company.currencyPosition)}\n`;
    text += `⏳ Reste à payer: ${formatMoney(doc.balanceDue, company.currency, company.currencyPosition)}\n`;
  }
  
  if (company.phone) {
    text += `\n📞 Contact: ${company.phone}`;
  }
  if (company.mobileMoney) {
    text += `\n📱 Paiement: ${company.mobileMoney}`;
  }

  return encodeURIComponent(text);
};
