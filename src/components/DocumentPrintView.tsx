import React, { useState } from 'react';
import { 
  Printer, 
  Share2, 
  ArrowLeft, 
  Edit3, 
  FileCheck, 
  PenTool, 
  CheckCircle2, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Sparkles
} from 'lucide-react';
import { BTPDocument, CompanyInfo } from '../types';
import { formatMoney, formatDateFr, generateWhatsAppShareText } from '../utils/formatters';
import { CompanyLogo } from './CompanyLogo';
import { SignatureModal } from './SignatureModal';

interface DocumentPrintViewProps {
  document: BTPDocument;
  company: CompanyInfo;
  onBack: () => void;
  onEdit: (doc: BTPDocument) => void;
  onConvertToInvoice: (doc: BTPDocument) => void;
  onSaveDocument: (doc: BTPDocument) => void;
}

export const DocumentPrintView: React.FC<DocumentPrintViewProps> = ({
  document: doc,
  company,
  onBack,
  onEdit,
  onConvertToInvoice,
  onSaveDocument
}) => {
  const [showSignModal, setShowSignModal] = useState(false);
  const [signType, setSignType] = useState<'client' | 'company'>('client');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isQuote = doc.type === 'quote';
  const isInvoice = doc.type === 'invoice';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const text = generateWhatsAppShareText(doc, company);
    const clientPhoneClean = doc.client?.phone ? doc.client.phone.replace(/[^0-9]/g, '') : '';
    const url = clientPhoneClean 
      ? `https://wa.me/${clientPhoneClean}?text=${text}`
      : `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  };

  const handleSaveSignature = (dataUrl: string) => {
    const updated = {
      ...doc,
      signatureClient: signType === 'client' ? dataUrl : doc.signatureClient,
      signatureDate: signType === 'client' ? new Date().toISOString() : doc.signatureDate,
      status: signType === 'client' && isQuote ? ('accepted' as const) : doc.status,
      updatedAt: new Date().toISOString()
    };
    onSaveDocument(updated);
    showToast(signType === 'client' ? 'Signature du client enregistrée avec succès !' : 'Signature entreprise enregistrée !');
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-24 text-slate-100 animate-fade-in">
      
      {/* Sticky Action Bar (Hidden when printing) */}
      <div className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 p-3 sm:p-4 no-print shadow-xl">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          <button
            id="btn-print-back"
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-all"
          >
            <ArrowLeft size={16} />
            <span>Retour</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden md:inline">
              Document : <strong className="text-white">{doc.docNumber}</strong>
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Signature Button */}
            <button
              id="btn-sign-document"
              onClick={() => {
                setSignType('client');
                setShowSignModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-amber-300 bg-amber-950/70 border border-amber-800/60 hover:bg-amber-900/60 transition-all"
            >
              <PenTool size={15} />
              <span>{doc.signatureClient ? 'Modifier Signature' : 'Signer (Tactile)'}</span>
            </button>

            {/* Convert to Invoice if Quote */}
            {isQuote && (
              <button
                id="btn-convert-to-invoice"
                onClick={() => onConvertToInvoice(doc)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-emerald-300 bg-emerald-950/70 border border-emerald-800/60 hover:bg-emerald-900/60 transition-all"
              >
                <FileCheck size={15} />
                <span>Facturer</span>
              </button>
            )}

            {/* Edit Button */}
            <button
              id="btn-edit-current-doc"
              onClick={() => onEdit(doc)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 transition-all"
            >
              <Edit3 size={15} />
              <span>Modifier</span>
            </button>

            {/* WhatsApp Share */}
            <button
              id="btn-share-whatsapp"
              onClick={handleWhatsAppShare}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md transition-all active:scale-95"
            >
              <Share2 size={15} />
              <span>WhatsApp</span>
            </button>

            {/* Primary Print Button */}
            <button
              id="btn-print-action"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-lg shadow-amber-400/20 active:scale-95 transition-all"
            >
              <Printer size={16} />
              <span>Imprimer / PDF A4</span>
            </button>

          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-sm font-bold no-print animate-bounce">
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Signature Modal */}
      <SignatureModal
        isOpen={showSignModal}
        onClose={() => setShowSignModal(false)}
        onSave={handleSaveSignature}
        title={signType === 'client' ? "Signature du Client (Bon pour accord)" : "Signature / Cachet Entreprise"}
        subtitle="Signez directement avec votre doigt ou un stylet sur l'écran."
      />

      {/* ========================================================================= */}
      {/* PRINTABLE A4 DOCUMENT SHEET */}
      {/* ========================================================================= */}
      <div className="max-w-4xl mx-auto p-2 sm:p-6 md:p-8">
        <div 
          id="printable-document"
          className="bg-white text-slate-900 p-6 sm:p-10 md:p-12 rounded-2xl sm:shadow-2xl border border-slate-200 min-h-[297mm] flex flex-col justify-between"
        >
          
          <div>
            {/* Top Header Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 border-b-2 border-slate-900 pb-6 items-start">
              
              {/* Company Info & Logo */}
              <div className="sm:col-span-7 flex items-start gap-4">
                <CompanyLogo company={company} size="lg" className="shrink-0" />
                <div className="space-y-1">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-display tracking-tight uppercase">
                    {company.name}
                  </h1>
                  <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                    {company.activity}
                  </p>
                  {company.slogan && (
                    <p className="text-xs italic text-slate-500">"{company.slogan}"</p>
                  )}
                  <div className="text-xs text-slate-600 pt-1 space-y-0.5">
                    <p className="flex items-center gap-1.5">
                      <MapPin size={12} className="text-slate-400 shrink-0" />
                      <span>{company.address} - {company.city} ({company.country})</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone size={12} className="text-slate-400 shrink-0" />
                      <span>{company.phone} {company.phoneSecondary ? ` / ${company.phoneSecondary}` : ''}</span>
                    </p>
                    {company.email && (
                      <p className="flex items-center gap-1.5">
                        <Mail size={12} className="text-slate-400 shrink-0" />
                        <span>{company.email}</span>
                      </p>
                    )}
                    {(company.siret || company.rccm) && (
                      <p className="text-[11px] text-slate-500 font-mono">
                        {company.siret ? `SIRET: ${company.siret}` : ''} {company.rccm ? ` | RCCM: ${company.rccm}` : ''}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Document Banner & Details */}
              <div className="sm:col-span-5 flex flex-col sm:items-end justify-between space-y-3">
                <div className="text-left sm:text-right">
                  <div className="inline-block bg-slate-900 text-white px-4 py-1.5 rounded-lg font-black text-lg sm:text-xl uppercase tracking-wider font-display">
                    {isQuote ? 'DEVIS' : isInvoice ? 'FACTURE' : 'SITUATION'}
                  </div>
                  <div className="text-sm sm:text-base font-bold text-slate-900 font-mono mt-1">
                    N° {doc.docNumber}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs w-full space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Date d'émission :</span>
                    <span className="font-bold text-slate-800">{formatDateFr(doc.date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">
                      {isQuote ? 'Validité de l\'offre :' : 'Date d\'échéance :'}
                    </span>
                    <span className="font-bold text-slate-800">{formatDateFr(doc.validityDate)}</span>
                  </div>
                  {doc.status && (
                    <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                      <span className="text-slate-500 font-medium">Statut :</span>
                      <span className="font-bold uppercase text-[11px] px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                        {doc.status === 'accepted' ? 'Validé / Accepté' :
                         doc.status === 'paid' ? 'Payé Intégral' :
                         doc.status === 'partial' ? 'Acompte Versé' :
                         doc.status === 'sent' ? 'Envoyé' : 'Brouillon'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Client & Site Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
              {/* Client Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider mb-1">
                  Destinataire / Client :
                </div>
                <div className="text-sm font-bold text-slate-900">
                  {doc.client?.name || 'Client Divers'}
                </div>
                {doc.client?.company && (
                  <div className="text-xs font-semibold text-slate-700">
                    {doc.client.company}
                  </div>
                )}
                {doc.client?.address && (
                  <div className="text-xs text-slate-600 mt-1">
                    {doc.client.address}
                  </div>
                )}
                {doc.client?.phone && (
                  <div className="text-xs text-slate-600 mt-0.5">
                    Tél : {doc.client.phone}
                  </div>
                )}
                {doc.client?.email && (
                  <div className="text-xs text-slate-600">
                    Email : {doc.client.email}
                  </div>
                )}
              </div>

              {/* Site Location Box */}
              <div className="bg-amber-50/50 border border-amber-200/80 rounded-xl p-4">
                <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1">
                  Lieu d'exécution / Chantier :
                </div>
                <div className="text-xs font-bold text-slate-900">
                  {doc.siteLocation || doc.client?.siteAddress || 'Adresse du client'}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Projet / Objet des travaux :
                </div>
                <div className="text-xs font-semibold text-slate-800 italic">
                  {doc.title || 'Fourniture de matériaux et travaux de construction'}
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto my-6">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white font-display">
                    <th className="py-2.5 px-3 rounded-l-lg w-8 text-center">N°</th>
                    <th className="py-2.5 px-3">Désignation des Matériaux & Travaux</th>
                    <th className="py-2.5 px-2 text-center w-20">Unité</th>
                    <th className="py-2.5 px-2 text-right w-16">Qté</th>
                    <th className="py-2.5 px-3 text-right w-24">Prix U. HT</th>
                    {doc.totalDiscount > 0 && (
                      <th className="py-2.5 px-2 text-right w-14">Rem.</th>
                    )}
                    <th className="py-2.5 px-3 rounded-r-lg text-right w-28">Total HT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {doc.items.map((item, index) => {
                    if (item.type === 'section') {
                      return (
                        <tr key={item.id || index} className="bg-slate-100 font-bold text-slate-900">
                          <td colSpan={doc.totalDiscount > 0 ? 7 : 6} className="py-2 px-3 text-xs uppercase tracking-wider text-slate-900 border-y border-slate-300 font-display">
                            {item.title}
                          </td>
                        </tr>
                      );
                    }

                    return (
                      <tr key={item.id || index} className="hover:bg-slate-50/80 page-break-inside-avoid">
                        <td className="py-2.5 px-3 text-center text-slate-400 font-mono">
                          {index + 1}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-slate-900">{item.title}</div>
                          {item.description && (
                            <div className="text-[11px] text-slate-500 font-normal mt-0.5 leading-relaxed">
                              {item.description}
                            </div>
                          )}
                        </td>
                        <td className="py-2.5 px-2 text-center text-slate-600 font-medium">
                          {item.unit || 'u'}
                        </td>
                        <td className="py-2.5 px-2 text-right font-bold text-slate-800 font-mono">
                          {item.quantity}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-700 font-mono">
                          {formatMoney(item.unitPrice, company.currency, company.currencyPosition)}
                        </td>
                        {doc.totalDiscount > 0 && (
                          <td className="py-2.5 px-2 text-right text-amber-700 font-mono">
                            {item.discountPercent ? `${item.discountPercent}%` : '-'}
                          </td>
                        )}
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900 font-mono">
                          {formatMoney(item.totalHT, company.currency, company.currencyPosition)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Financial Summary & Payment Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 my-6 page-break-inside-avoid">
              
              {/* Payment details & Bank */}
              <div className="sm:col-span-7 space-y-3">
                
                {/* Notes & Payment terms */}
                {(doc.paymentTerms || company.paymentTerms) && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs">
                    <span className="font-bold text-slate-900 block mb-1">
                      Modalités de règlement :
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      {doc.paymentTerms || company.paymentTerms}
                    </p>
                  </div>
                )}

                {doc.notes && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs">
                    <span className="font-bold text-slate-900 block mb-1">
                      Observations & Conditions de chantier :
                    </span>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                      {doc.notes}
                    </p>
                  </div>
                )}

                {/* Bank / Mobile money details */}
                <div className="border border-slate-200 rounded-xl p-3 text-xs space-y-1 text-slate-600">
                  <span className="font-bold text-slate-900 block">
                    Coordonnées de règlement :
                  </span>
                  {company.bankName && (
                    <p><strong className="text-slate-700">Banque :</strong> {company.bankName}</p>
                  )}
                  {company.iban && (
                    <p className="font-mono text-[11px]"><strong className="text-slate-700">IBAN / Compte :</strong> {company.iban}</p>
                  )}
                  {company.mobileMoney && (
                    <p className="text-amber-800 font-semibold">
                      📱 <strong>Mobile Money :</strong> {company.mobileMoney}
                    </p>
                  )}
                </div>

              </div>

              {/* Total Calculation Card */}
              <div className="sm:col-span-5">
                <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 text-xs space-y-2">
                  <div className="flex justify-between text-slate-700">
                    <span>Total Brut HT :</span>
                    <span className="font-mono font-semibold">
                      {formatMoney(doc.totalHT + (doc.totalDiscount || 0), company.currency, company.currencyPosition)}
                    </span>
                  </div>

                  {doc.totalDiscount > 0 && (
                    <div className="flex justify-between text-amber-700">
                      <span>Remise accordée :</span>
                      <span className="font-mono font-semibold">
                        -{formatMoney(doc.totalDiscount, company.currency, company.currencyPosition)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-900 font-bold border-t border-slate-200 pt-1">
                    <span>Total Net HT :</span>
                    <span className="font-mono">
                      {formatMoney(doc.totalHT, company.currency, company.currencyPosition)}
                    </span>
                  </div>

                  {doc.totalTax > 0 ? (
                    <div className="flex justify-between text-slate-700">
                      <span>TVA ({company.defaultTaxRate}%) :</span>
                      <span className="font-mono">
                        {formatMoney(doc.totalTax, company.currency, company.currencyPosition)}
                      </span>
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-500 italic">
                      TVA non applicable (art. 293 B ou exonéré)
                    </div>
                  )}

                  {/* Grand Total TTC */}
                  <div className="bg-slate-900 text-white p-3 rounded-lg flex justify-between items-center text-sm font-black mt-2 font-display">
                    <span>TOTAL TTC :</span>
                    <span className="text-base font-mono text-amber-400">
                      {formatMoney(doc.totalTTC, company.currency, company.currencyPosition)}
                    </span>
                  </div>

                  {/* Advance / Balance info */}
                  {isQuote && doc.advancePercent > 0 && (
                    <div className="bg-amber-50 border border-amber-200 p-2 rounded-lg text-amber-900 flex justify-between font-semibold mt-1">
                      <span>Acompte exigible ({doc.advancePercent}%) :</span>
                      <span className="font-mono font-bold">
                        {formatMoney(doc.advanceAmount, company.currency, company.currencyPosition)}
                      </span>
                    </div>
                  )}

                  {!isQuote && (
                    <div className="space-y-1 pt-1 border-t border-slate-200">
                      <div className="flex justify-between text-emerald-700">
                        <span>Montant déjà payé :</span>
                        <span className="font-mono font-bold">
                          {formatMoney(doc.amountPaid, company.currency, company.currencyPosition)}
                        </span>
                      </div>
                      <div className="flex justify-between text-rose-700 font-bold text-sm bg-rose-50 p-2 rounded-lg">
                        <span>Solde restant à payer :</span>
                        <span className="font-mono">
                          {formatMoney(doc.balanceDue, company.currency, company.currencyPosition)}
                        </span>
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>

            {/* Signature Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 pt-4 border-t border-slate-200 page-break-inside-avoid">
              
              {/* Company Signature / Stamp */}
              <div className="border border-slate-200 rounded-xl p-4 flex flex-col justify-between min-h-[130px] bg-slate-50/50">
                <div>
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
                    Pour l'Entreprise :
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Cachet et signature
                  </span>
                </div>
                <div className="h-16 flex items-center justify-center">
                  {company.stampOrSignatureUrl ? (
                    <img src={company.stampOrSignatureUrl} alt="Cachet" className="max-h-14 object-contain" />
                  ) : (
                    <div className="text-[10px] text-slate-400 italic">
                      [ Cachet & Signature de l'artisan ]
                    </div>
                  )}
                </div>
              </div>

              {/* Client Signature */}
              <div className="border border-slate-200 rounded-xl p-4 flex flex-col justify-between min-h-[130px] bg-slate-50/50">
                <div>
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
                    Pour le Client :
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Mention manuscrite "Bon pour accord" + Date et signature
                  </span>
                </div>
                <div className="h-16 flex items-center justify-center">
                  {doc.signatureClient ? (
                    <div className="text-center">
                      <img src={doc.signatureClient} alt="Signature client" className="max-h-12 object-contain mx-auto" />
                      {doc.signatureDate && (
                        <span className="text-[9px] text-slate-400 font-mono">
                          Signé le {formatDateFr(doc.signatureDate)}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-400 italic">
                      [ Signature du client précédée de "Bon pour accord" ]
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Legal Footer */}
          <div className="border-t border-slate-200 pt-4 text-center text-[10px] text-slate-500 space-y-1 mt-auto page-break-inside-avoid">
            <p className="font-semibold text-slate-700">
              {company.name} — {company.address}, {company.city} — Tél : {company.phone} {company.email ? `— ${company.email}` : ''}
            </p>
            {company.legalNotice && (
              <p className="text-slate-500 leading-tight">
                {company.legalNotice}
              </p>
            )}
            <p className="text-slate-400">
              Document généré avec BatiDevis Express • Valable comme pièce justificative
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
