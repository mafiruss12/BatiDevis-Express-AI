import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Printer, 
  Edit3, 
  Share2, 
  Trash2, 
  Copy, 
  FileCheck, 
  Building2, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  HardHat,
  TrendingUp,
  Receipt,
  Eye
} from 'lucide-react';
import { BTPDocument, DocumentType, DocumentStatus, CompanyInfo } from '../types';
import { formatMoney, formatDateFr, generateWhatsAppShareText } from '../utils/formatters';

interface DocumentListViewProps {
  documents: BTPDocument[];
  company: CompanyInfo;
  onNewDocument: (type: 'quote' | 'invoice') => void;
  onSelectDocumentForPrint: (doc: BTPDocument) => void;
  onEditDocument: (doc: BTPDocument) => void;
  onDeleteDocument: (id: string) => void;
  onDuplicateDocument: (doc: BTPDocument) => void;
  onConvertToInvoice: (doc: BTPDocument) => void;
}

export const DocumentListView: React.FC<DocumentListViewProps> = ({
  documents,
  company,
  onNewDocument,
  onSelectDocumentForPrint,
  onEditDocument,
  onDeleteDocument,
  onDuplicateDocument,
  onConvertToInvoice
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'quote' | 'invoice'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Metrics calculation
  const metrics = useMemo(() => {
    let totalQuotesValue = 0;
    let pendingQuotesCount = 0;
    let totalInvoicedValue = 0;
    let totalCollectedValue = 0;
    let totalDueValue = 0;

    documents.forEach(d => {
      if (d.type === 'quote') {
        totalQuotesValue += d.totalTTC;
        if (d.status === 'draft' || d.status === 'sent') {
          pendingQuotesCount++;
        }
      } else {
        totalInvoicedValue += d.totalTTC;
        totalCollectedValue += (d.amountPaid || 0);
        totalDueValue += (d.balanceDue || 0);
      }
    });

    return {
      totalQuotesValue,
      pendingQuotesCount,
      totalInvoicedValue,
      totalCollectedValue,
      totalDueValue
    };
  }, [documents]);

  // Filtered documents
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const matchesType = activeTab === 'all' || doc.type === activeTab;
      const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus;
      
      const search = searchQuery.toLowerCase();
      const matchesSearch = 
        doc.docNumber.toLowerCase().includes(search) ||
        doc.title.toLowerCase().includes(search) ||
        (doc.client?.name && doc.client.name.toLowerCase().includes(search)) ||
        (doc.client?.company && doc.client.company.toLowerCase().includes(search)) ||
        (doc.siteLocation && doc.siteLocation.toLowerCase().includes(search));

      return matchesType && matchesStatus && matchesSearch;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [documents, activeTab, selectedStatus, searchQuery]);

  const getStatusBadge = (status: DocumentStatus, type: DocumentType) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
            <CheckCircle2 size={12} />
            <span>Validé</span>
          </span>
        );
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
            <CheckCircle2 size={12} />
            <span>Payé</span>
          </span>
        );
      case 'partial':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-950/80 text-amber-300 border border-amber-800/60">
            <Clock size={12} />
            <span>Acompte versé</span>
          </span>
        );
      case 'sent':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-950/80 text-blue-300 border border-blue-800/60">
            <Clock size={12} />
            <span>Envoyé</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-950/80 text-rose-300 border border-rose-800/60">
            <AlertCircle size={12} />
            <span>Refusé</span>
          </span>
        );
      case 'draft':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700">
            <span>Brouillon</span>
          </span>
        );
    }
  };

  const handleShareWhatsApp = (doc: BTPDocument, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = generateWhatsAppShareText(doc, company);
    const clientPhoneClean = doc.client?.phone ? doc.client.phone.replace(/[^0-9]/g, '') : '';
    const url = clientPhoneClean 
      ? `https://wa.me/${clientPhoneClean}?text=${text}`
      : `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-6 animate-fade-in pb-28">
      
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
              Chantiers & Facturation
            </span>
            <span className="text-xs text-slate-400">
              {documents.length} document{documents.length > 1 ? 's' : ''}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-display mt-1">
            Devis & Factures BTP
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Générez des devis professionnels, imprimez en A4 avec votre logo et suivez vos chantiers.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            id="btn-list-new-quote"
            onClick={() => onNewDocument('quote')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
          >
            <Plus size={16} />
            <span>+ Nouveau Devis</span>
          </button>

          <button
            id="btn-list-new-invoice"
            onClick={() => onNewDocument('invoice')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs sm:text-sm font-bold active:scale-95 transition-all"
          >
            <Receipt size={16} />
            <span>+ Facture</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Devis */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Devis en cours</span>
            <FileText size={16} className="text-amber-400" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-white font-mono">
            {formatMoney(metrics.totalQuotesValue, company.currency, company.currencyPosition)}
          </div>
          <div className="text-[11px] text-amber-400">
            {metrics.pendingQuotesCount} devis en attente
          </div>
        </div>

        {/* Facturation Totale */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Chiffre Facturé</span>
            <TrendingUp size={16} className="text-blue-400" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-white font-mono">
            {formatMoney(metrics.totalInvoicedValue, company.currency, company.currencyPosition)}
          </div>
          <div className="text-[11px] text-blue-400">
            Factures émises
          </div>
        </div>

        {/* Total Encaissé */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Total Encaissé</span>
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-emerald-400 font-mono">
            {formatMoney(metrics.totalCollectedValue, company.currency, company.currencyPosition)}
          </div>
          <div className="text-[11px] text-emerald-500">
            Règlements & acomptes
          </div>
        </div>

        {/* Reste à Recouvrer */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Reste à Encaisser</span>
            <AlertCircle size={16} className="text-rose-400" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-rose-400 font-mono">
            {formatMoney(metrics.totalDueValue, company.currency, company.currencyPosition)}
          </div>
          <div className="text-[11px] text-rose-400">
            Soldes de factures
          </div>
        </div>

      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-slate-900 border border-slate-800 p-3 sm:p-4 rounded-2xl shadow-lg space-y-3">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Type Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tous ({documents.length})
            </button>

            <button
              onClick={() => setActiveTab('quote')}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'quote'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📋 Devis ({documents.filter(d => d.type === 'quote').length})
            </button>

            <button
              onClick={() => setActiveTab('invoice')}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'invoice'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🧾 Factures ({documents.filter(d => d.type === 'invoice').length})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher N°, Client, Chantier..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 text-[11px] font-semibold mr-1 shrink-0">Statut :</span>
          {['all', 'draft', 'sent', 'accepted', 'partial', 'paid', 'rejected'].map(st => {
            const labelMap: Record<string, string> = {
              all: 'Tous les statuts',
              draft: 'Brouillons',
              sent: 'Envoyés',
              accepted: 'Validés',
              partial: 'Acomptes',
              paid: 'Payés',
              rejected: 'Refusés'
            };
            return (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-1 rounded-lg shrink-0 transition-all ${
                  selectedStatus === st
                    ? 'bg-slate-700 text-white font-bold border border-slate-600'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {labelMap[st] || st}
              </button>
            );
          })}
        </div>

      </div>

      {/* Documents List View */}
      {filteredDocuments.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center shadow-xl">
          <FileText size={40} className="mx-auto text-slate-600 mb-3" />
          <h3 className="text-base font-bold text-white">Aucun document trouvé</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            {searchQuery 
              ? "Aucun devis ou facture ne correspond à votre recherche."
              : "Créez votre premier devis de matériaux pour commencer à facturer vos chantiers."}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={() => onNewDocument('quote')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold"
            >
              <Plus size={15} />
              <span>Créer un devis</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDocuments.map((doc) => {
            const isQuote = doc.type === 'quote';
            return (
              <div
                key={doc.id}
                onClick={() => onSelectDocumentForPrint(doc)}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 shadow-lg transition-all cursor-pointer group hover:bg-slate-850/80"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Left Column: Number, Title, Client, Location */}
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider font-mono ${
                        isQuote 
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                      }`}>
                        {isQuote ? 'DEVIS' : 'FACTURE'}
                      </span>
                      <span className="font-mono text-sm font-bold text-white">
                        {doc.docNumber}
                      </span>
                      {getStatusBadge(doc.status, doc.type)}
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDateFr(doc.date)}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-100 group-hover:text-amber-400 transition-colors truncate">
                      {doc.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                      <div className="flex items-center gap-1 text-slate-300 font-semibold">
                        <Building2 size={13} className="text-slate-400" />
                        <span>{doc.client?.name || 'Client Divers'}</span>
                        {doc.client?.company && (
                          <span className="text-slate-400 font-normal">({doc.client.company})</span>
                        )}
                      </div>

                      {doc.siteLocation && (
                        <div className="flex items-center gap-1 text-slate-400 truncate">
                          <MapPin size={13} className="text-amber-500/80 shrink-0" />
                          <span className="truncate">{doc.siteLocation}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Totals & Action Buttons */}
                  <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                    
                    {/* Financial Amount */}
                    <div className="text-left md:text-right">
                      <div className="text-base sm:text-lg font-black text-amber-400 font-mono">
                        {formatMoney(doc.totalTTC, company.currency, company.currencyPosition)}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {isQuote ? (
                          <span>Acompte {doc.advancePercent}% : {formatMoney(doc.advanceAmount, company.currency, company.currencyPosition)}</span>
                        ) : (
                          <span>Reste dû : {formatMoney(doc.balanceDue, company.currency, company.currencyPosition)}</span>
                        )}
                      </div>
                    </div>

                    {/* Quick Action Icons */}
                    <div className="flex items-center gap-1">
                      
                      {/* View / Print button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDocumentForPrint(doc);
                        }}
                        className="p-2 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition-all"
                        title="Imprimer / Voir PDF A4"
                      >
                        <Printer size={16} />
                      </button>

                      {/* WhatsApp share */}
                      <button
                        type="button"
                        onClick={(e) => handleShareWhatsApp(doc, e)}
                        className="p-2 rounded-xl bg-emerald-950/60 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all"
                        title="Partager par WhatsApp"
                      >
                        <Share2 size={16} />
                      </button>

                      {/* Convert to Invoice if Quote */}
                      {isQuote && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onConvertToInvoice(doc);
                          }}
                          className="p-2 rounded-xl bg-slate-800 text-blue-400 hover:bg-blue-600 hover:text-white transition-all hidden sm:inline-flex"
                          title="Convertir en Facture"
                        >
                          <FileCheck size={16} />
                        </button>
                      )}

                      {/* Edit button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditDocument(doc);
                        }}
                        className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
                        title="Modifier"
                      >
                        <Edit3 size={16} />
                      </button>

                      {/* Duplicate */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDuplicateDocument(doc);
                        }}
                        className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all hidden sm:inline-flex"
                        title="Dupliquer le devis"
                      >
                        <Copy size={16} />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Supprimer définitivement le document ${doc.docNumber} ?`)) {
                            onDeleteDocument(doc.id);
                          }
                        }}
                        className="p-2 rounded-xl bg-slate-800 text-rose-400 hover:bg-rose-950/80 hover:text-rose-300 transition-all"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
