import React, { useState, useEffect } from 'react';
import { 
  Save, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Layers, 
  Printer, 
  UserPlus, 
  FolderPlus, 
  ArrowUp, 
  ArrowDown, 
  CheckCircle2,
  FileText,
  AlertCircle
} from 'lucide-react';
import { 
  BTPDocument, 
  DocumentType, 
  DocumentStatus, 
  QuoteItem, 
  Client, 
  CompanyInfo, 
  MaterialItem 
} from '../types';
import { 
  formatMoney, 
  calculateDocumentTotals, 
  getNextDocNumber, 
  calculateItemTotalHT 
} from '../utils/formatters';
import { MaterialPickerModal } from './MaterialPickerModal';

interface DocumentEditorViewProps {
  initialDocument?: BTPDocument | null;
  defaultType?: DocumentType;
  company: CompanyInfo;
  clients: Client[];
  materials: MaterialItem[];
  allDocuments: BTPDocument[];
  onSave: (doc: BTPDocument, andPrint?: boolean) => void;
  onCancel: () => void;
  onAddNewClient: (client: Client) => void;
  onAddNewMaterial: (material: MaterialItem) => void;
}

const COMMON_UNITS = [
  'sac (50kg)',
  'm²',
  'm³',
  'ml',
  'barre (12m)',
  'pièce',
  'tonne',
  'kg',
  'feuille (6m)',
  'palette',
  'voyage',
  'jour',
  'heure',
  'forfait',
  'pot (15L)',
  'rouleau',
  'couronne (100m)'
];

export const DocumentEditorView: React.FC<DocumentEditorViewProps> = ({
  initialDocument,
  defaultType = 'quote',
  company,
  clients,
  materials,
  allDocuments,
  onSave,
  onCancel,
  onAddNewClient,
  onAddNewMaterial
}) => {
  const [docType, setDocType] = useState<DocumentType>(initialDocument?.type || defaultType || 'quote');
  const [docNumber, setDocNumber] = useState<string>(
    initialDocument?.docNumber || getNextDocNumber(initialDocument?.type || defaultType || 'quote', allDocuments)
  );
  const [title, setTitle] = useState<string>(
    initialDocument?.title || 'Fourniture de matériaux et travaux de construction'
  );
  const [date, setDate] = useState<string>(
    initialDocument?.date || new Date().toISOString().split('T')[0]
  );
  
  // Default validity date (+30 days)
  const defaultValDate = new Date();
  defaultValDate.setDate(defaultValDate.getDate() + (company.defaultValidityDays || 30));
  const [validityDate, setValidityDate] = useState<string>(
    initialDocument?.validityDate || defaultValDate.toISOString().split('T')[0]
  );

  const [selectedClientId, setSelectedClientId] = useState<string>(
    initialDocument?.clientId || (clients.length > 0 ? clients[0].id : '')
  );
  const [siteLocation, setSiteLocation] = useState<string>(
    initialDocument?.siteLocation || ''
  );
  const [status, setStatus] = useState<DocumentStatus>(
    initialDocument?.status || 'draft'
  );
  const [notes, setNotes] = useState<string>(
    initialDocument?.notes || 'Eau et électricité de chantier à la charge du client. Accès dégagé pour livraison des matériaux.'
  );
  const [paymentTerms, setPaymentTerms] = useState<string>(
    initialDocument?.paymentTerms || company.paymentTerms || ''
  );
  const [globalDiscountPercent, setGlobalDiscountPercent] = useState<number>(
    initialDocument?.globalDiscountPercent || 0
  );
  const [advancePercent, setAdvancePercent] = useState<number>(
    initialDocument?.advancePercent ?? company.defaultAdvancePercentage ?? 40
  );
  const [amountPaid, setAmountPaid] = useState<number>(
    initialDocument?.amountPaid || 0
  );

  // Items
  const [items, setItems] = useState<QuoteItem[]>(
    initialDocument?.items || [
      {
        id: 'sec-' + Date.now(),
        type: 'section',
        title: 'I. FOURNITURE MATÉRIAUX & GROS ŒUVRE',
        quantity: 1,
        unitPrice: 0,
        taxRate: 0,
        discountPercent: 0,
        totalHT: 0
      },
      {
        id: 'item-' + Date.now(),
        type: 'item',
        title: 'Ciment CPJ 42.5 (Haute Résistance)',
        description: 'Pour béton armé et semelles filantes',
        unit: 'sac (50kg)',
        quantity: 50,
        unitPrice: 4800,
        taxRate: company.defaultTaxRate,
        discountPercent: 0,
        totalHT: 240000
      }
    ]
  );

  // Modals
  const [isMaterialPickerOpen, setIsMaterialPickerOpen] = useState(false);
  const [isQuickClientOpen, setIsQuickClientOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientSite, setNewClientSite] = useState('');

  // Update site location when client changes if siteLocation was empty
  useEffect(() => {
    if (!siteLocation && selectedClientId) {
      const foundClient = clients.find(c => c.id === selectedClientId);
      if (foundClient?.siteAddress) {
        setSiteLocation(foundClient.siteAddress);
      }
    }
  }, [selectedClientId, clients, siteLocation]);

  // When docType changes, recalculate docNumber if creating new
  const handleTypeChange = (newType: DocumentType) => {
    setDocType(newType);
    if (!initialDocument) {
      setDocNumber(getNextDocNumber(newType, allDocuments));
    }
  };

  // Recalculate financial totals
  const totals = calculateDocumentTotals(
    items,
    globalDiscountPercent,
    advancePercent,
    amountPaid
  );

  // Quick Client Creation
  const handleQuickAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim()) return;

    const newClient: Client = {
      id: 'cli-' + Date.now(),
      name: newClientName.trim(),
      phone: newClientPhone.trim(),
      siteAddress: newClientSite.trim(),
      createdAt: new Date().toISOString()
    };

    onAddNewClient(newClient);
    setSelectedClientId(newClient.id);
    if (newClientSite) {
      setSiteLocation(newClientSite);
    }
    setNewClientName('');
    setNewClientPhone('');
    setNewClientSite('');
    setIsQuickClientOpen(false);
  };

  // Line operations
  const handleAddItemFromCatalog = (mat: MaterialItem) => {
    const newItem: QuoteItem = {
      id: 'item-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
      type: 'item',
      title: mat.name,
      description: mat.description || '',
      category: mat.category,
      unit: mat.unit || 'pièce',
      quantity: 1,
      unitPrice: mat.defaultPrice || 0,
      taxRate: mat.defaultTaxRate ?? company.defaultTaxRate,
      discountPercent: 0,
      totalHT: mat.defaultPrice || 0
    };
    setItems([...items, newItem]);
  };

  const handleAddCustomLine = () => {
    const newItem: QuoteItem = {
      id: 'item-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
      type: 'item',
      title: '',
      description: '',
      unit: 'm²',
      quantity: 1,
      unitPrice: 0,
      taxRate: company.defaultTaxRate,
      discountPercent: 0,
      totalHT: 0
    };
    setItems([...items, newItem]);
  };

  const handleAddSectionLine = () => {
    const newSection: QuoteItem = {
      id: 'sec-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
      type: 'section',
      title: 'NOUVEAU CHAPITRE / LOT DE TRAVAUX',
      quantity: 1,
      unitPrice: 0,
      taxRate: 0,
      discountPercent: 0,
      totalHT: 0
    };
    setItems([...items, newSection]);
  };

  const handleUpdateItem = (index: number, field: keyof QuoteItem, value: any) => {
    const updated = [...items];
    const item = { ...updated[index], [field]: value };
    
    // Auto recalculate totalHT for this item
    if (item.type === 'item') {
      item.totalHT = calculateItemTotalHT(item.quantity, item.unitPrice, item.discountPercent);
    }
    
    updated[index] = item;
    setItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === items.length - 1)
    ) return;

    const updated = [...items];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setItems(updated);
  };

  // Submit and Save
  const handleSave = (andPrint: boolean = false) => {
    const client = clients.find(c => c.id === selectedClientId) || {
      id: 'cli-guest',
      name: 'Client Divers',
      phone: '',
      createdAt: new Date().toISOString()
    };

    const docToSave: BTPDocument = {
      id: initialDocument?.id || 'doc-' + Date.now(),
      type: docType,
      docNumber: docNumber.trim() || getNextDocNumber(docType, allDocuments),
      title: title.trim() || 'Fourniture de matériaux & travaux',
      date,
      validityDate,
      clientId: selectedClientId,
      client,
      siteLocation: siteLocation.trim(),
      items,
      globalDiscountPercent,
      totalHT: totals.totalHT,
      totalDiscount: totals.totalDiscount,
      totalTax: totals.totalTax,
      totalTTC: totals.totalTTC,
      advancePercent,
      advanceAmount: totals.advanceAmount,
      amountPaid,
      balanceDue: totals.balanceDue,
      status,
      notes: notes.trim(),
      paymentTerms: paymentTerms.trim(),
      signatureClient: initialDocument?.signatureClient,
      signatureDate: initialDocument?.signatureDate,
      convertedFromQuoteId: initialDocument?.convertedFromQuoteId,
      convertedToInvoiceId: initialDocument?.convertedToInvoiceId,
      createdAt: initialDocument?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      syncStatus: 'pending'
    };

    onSave(docToSave, andPrint);
  };

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6 space-y-6 animate-fade-in pb-28">
      
      {/* Top Header & Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white font-display">
              {initialDocument ? `Modifier ${docNumber}` : `Nouveau ${docType === 'quote' ? 'Devis' : 'Facture'}`}
            </h2>
            <p className="text-xs text-slate-400">
              Saisie rapide de matériaux, fournitures & main d'œuvre BTP
            </p>
          </div>
        </div>

        {/* Type Selector (Devis vs Facture) */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => handleTypeChange('quote')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              docType === 'quote'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📋 Devis
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('invoice')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              docType === 'invoice'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🧾 Facture
          </button>
        </div>
      </div>

      {/* Main Form Fields Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
        
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          
          {/* Doc Number */}
          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Numéro du document *
            </label>
            <input
              type="text"
              required
              value={docNumber}
              onChange={(e) => setDocNumber(e.target.value)}
              placeholder="DEV-2026-0001"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          {/* Date d'émission */}
          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Date d'émission
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          {/* Validity / Due Date */}
          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {docType === 'quote' ? "Validité de l'offre" : "Date d'échéance"}
            </label>
            <input
              type="date"
              value={validityDate}
              onChange={(e) => setValidityDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

        </div>

        {/* Project Title / Objet des travaux */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Objet / Titre des travaux *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Fourniture matériaux et construction clôture villa R+1, Dallage cour, etc."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none font-medium"
          />
        </div>

        {/* Client & Site Location Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
          
          {/* Client Selection */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-300">
                Client / Destinataire *
              </label>
              <button
                type="button"
                onClick={() => setIsQuickClientOpen(!isQuickClientOpen)}
                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <UserPlus size={13} />
                <span>+ Nouveau Client</span>
              </button>
            </div>

            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            >
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.company ? `(${c.company})` : ''} - {c.phone}
                </option>
              ))}
            </select>

            {/* Quick Add Client Inline Drawer */}
            {isQuickClientOpen && (
              <div className="mt-2 p-3 bg-slate-950 border border-amber-500/40 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-amber-400">Ajout rapide de client</div>
                <input
                  type="text"
                  placeholder="Nom & Prénom du client *"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Téléphone"
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Adresse Chantier"
                    value={newClientSite}
                    onChange={(e) => setNewClientSite(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsQuickClientOpen(false)}
                    className="px-2 py-1 text-slate-400 hover:text-white"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={handleQuickAddClient}
                    className="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg"
                  >
                    Enregistrer Client
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Site Location */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Lieu d'exécution / Adresse du Chantier
            </label>
            <input
              type="text"
              value={siteLocation}
              onChange={(e) => setSiteLocation(e.target.value)}
              placeholder="Ex: Lot 45, Bingerville Palmeraie / 14 Rue Jean Jaurès..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

        </div>

      </div>

      {/* ===================================================================== */}
      {/* ITEMS & MATERIALS TABLE SECTION */}
      {/* ===================================================================== */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
        
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Layers size={18} className="text-amber-400" />
              <span>Matériaux, Fournitures & Prestations ({items.filter(i => i.type === 'item').length})</span>
            </h3>
            <p className="text-xs text-slate-400">
              Ajoutez des éléments depuis votre catalogue BTP ou saisissez directement vos lignes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMaterialPickerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 shadow-md active:scale-95 transition-all"
            >
              <Plus size={15} />
              <span>+ Du Catalogue</span>
            </button>

            <button
              type="button"
              onClick={handleAddCustomLine}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition-all"
            >
              <Plus size={14} />
              <span>+ Ligne libre</span>
            </button>

            <button
              type="button"
              onClick={handleAddSectionLine}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-amber-400 text-xs font-semibold hover:bg-slate-700 transition-all"
              title="Ajouter un titre de section (ex: I. GROS ŒUVRE, II. ÉLECTRICITÉ)"
            >
              <FolderPlus size={14} />
              <span>+ Titre Section</span>
            </button>
          </div>
        </div>

        {/* Lines List */}
        <div className="space-y-3">
          {items.length === 0 ? (
            <div className="py-8 text-center border-2 border-dashed border-slate-800 rounded-2xl">
              <AlertCircle size={28} className="mx-auto text-slate-500 mb-2" />
              <p className="text-sm text-slate-400">Aucune ligne de matériel ou prestation ajoutée.</p>
              <button
                type="button"
                onClick={() => setIsMaterialPickerOpen(true)}
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold"
              >
                <Plus size={15} />
                <span>Ouvrir la bibliothèque de matériaux</span>
              </button>
            </div>
          ) : (
            items.map((item, index) => {
              if (item.type === 'section') {
                return (
                  /* Section Header Row */
                  <div 
                    key={item.id || index}
                    className="flex items-center gap-2 bg-slate-800/90 border-l-4 border-amber-500 p-2.5 rounded-r-xl"
                  >
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleUpdateItem(index, 'title', e.target.value)}
                      placeholder="Titre de chapitre (ex: I. FONDATIONS & GROS ŒUVRE)"
                      className="flex-1 bg-transparent text-white font-bold text-xs sm:text-sm font-display outline-none uppercase tracking-wide"
                    />

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMoveItem(index, 'up')}
                        disabled={index === 0}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveItem(index, 'down')}
                        disabled={index === items.length - 1}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="p-1 text-rose-400 hover:text-rose-300"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              }

              /* Standard Item Row */
              return (
                <div 
                  key={item.id || index}
                  className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-2.5 transition-all hover:border-slate-700"
                >
                  {/* Top row: Title and remove/reorder actions */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 space-y-1">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleUpdateItem(index, 'title', e.target.value)}
                        placeholder="Désignation du matériau / Fourniture / Prestation *"
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-white text-xs sm:text-sm font-semibold focus:ring-1 focus:ring-amber-500 outline-none"
                      />
                      <input
                        type="text"
                        value={item.description || ''}
                        onChange={(e) => handleUpdateItem(index, 'description', e.target.value)}
                        placeholder="Détail technique (dosage, marque, dimensions... optionnel)"
                        className="w-full bg-transparent text-slate-400 text-xs px-1 outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMoveItem(index, 'up')}
                        disabled={index === 0}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveItem(index, 'down')}
                        disabled={index === items.length - 1}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="p-1 text-rose-400 hover:text-rose-300"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Quantity, Unit, Price, Discount and Line Total */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs items-center">
                    
                    {/* Unit selection */}
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5">Unité</span>
                      <input
                        type="text"
                        list={`units-list-${index}`}
                        value={item.unit || ''}
                        onChange={(e) => handleUpdateItem(index, 'unit', e.target.value)}
                        placeholder="sac, m², m³, pièce..."
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2 py-1.5 text-white text-xs outline-none"
                      />
                      <datalist id={`units-list-${index}`}>
                        {COMMON_UNITS.map(u => (
                          <option key={u} value={u} />
                        ))}
                      </datalist>
                    </div>

                    {/* Quantity */}
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5">Quantité</span>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.quantity || ''}
                        onChange={(e) => handleUpdateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                        placeholder="1"
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2 py-1.5 text-white font-mono text-xs outline-none font-bold"
                      />
                    </div>

                    {/* Unit Price */}
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5">P.U. HT ({company.currency})</span>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.unitPrice || ''}
                        onChange={(e) => handleUpdateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2 py-1.5 text-white font-mono text-xs outline-none"
                      />
                    </div>

                    {/* Discount % */}
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5">Remise %</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={item.discountPercent || ''}
                        onChange={(e) => handleUpdateItem(index, 'discountPercent', parseFloat(e.target.value) || 0)}
                        placeholder="0%"
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2 py-1.5 text-amber-300 font-mono text-xs outline-none"
                      />
                    </div>

                    {/* Line Total HT */}
                    <div className="col-span-2 sm:col-span-1 text-right">
                      <span className="text-[10px] text-slate-400 block mb-0.5">Total HT</span>
                      <div className="text-sm font-bold text-amber-400 font-mono py-1">
                        {formatMoney(item.totalHT, company.currency, company.currencyPosition)}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* ===================================================================== */}
      {/* FINANCIAL SUMMARY & SETTINGS */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Payment Terms & Notes */}
        <div className="md:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white font-display">
            Conditions & Modalités de Chantier
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Modalités de paiement
            </label>
            <textarea
              rows={2}
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              placeholder="Ex: 40% à la commande pour approvisionnement matériaux, 40% à mi-parcours, 20% solde."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white text-xs focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Notes & Observations (délais, accès, eau/élec...)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Précisions de chantier..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white text-xs focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Statut du document
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as DocumentStatus)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:ring-2 focus:ring-amber-500 outline-none"
            >
              <option value="draft">Brouillon</option>
              <option value="sent">Envoyé au client</option>
              <option value="accepted">Validé / Accepté</option>
              <option value="rejected">Refusé</option>
              <option value="partial">Acompte versé / Partiel</option>
              <option value="paid">Payé Intégral</option>
            </select>
          </div>
        </div>

        {/* Totals Calculation Card */}
        <div className="md:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-white font-display border-b border-slate-800 pb-2">
            Récapitulatif Financier
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Total Brut HT :</span>
              <span className="font-mono font-semibold">
                {formatMoney(totals.totalHT + totals.totalDiscount, company.currency, company.currencyPosition)}
              </span>
            </div>

            {/* Global discount */}
            <div className="flex items-center justify-between text-amber-400">
              <span className="flex items-center gap-1">
                Remise globale (%) :
              </span>
              <div className="w-20">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={globalDiscountPercent || ''}
                  onChange={(e) => setGlobalDiscountPercent(parseFloat(e.target.value) || 0)}
                  placeholder="0%"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-right text-amber-300 font-mono text-xs outline-none"
                />
              </div>
            </div>

            <div className="flex justify-between text-white font-bold border-t border-slate-800 pt-1.5">
              <span>Total Net HT :</span>
              <span className="font-mono">
                {formatMoney(totals.totalHT, company.currency, company.currencyPosition)}
              </span>
            </div>

            <div className="flex justify-between text-slate-300">
              <span>TVA ({company.defaultTaxRate}%) :</span>
              <span className="font-mono">
                {formatMoney(totals.totalTax, company.currency, company.currencyPosition)}
              </span>
            </div>

            {/* Grand Total TTC */}
            <div className="bg-slate-950 border border-amber-500/40 p-3 rounded-xl flex justify-between items-center text-sm font-black text-white font-display">
              <span>TOTAL TTC :</span>
              <span className="text-base font-mono text-amber-400">
                {formatMoney(totals.totalTTC, company.currency, company.currencyPosition)}
              </span>
            </div>

            {/* Advance / Deposit percentage */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-amber-300">
                <span>Acompte demandé (%) :</span>
                <div className="w-20">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={advancePercent || ''}
                    onChange={(e) => setAdvancePercent(parseFloat(e.target.value) || 0)}
                    placeholder="40%"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-right text-amber-300 font-mono text-xs outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-between text-slate-300">
                <span>Montant acompte :</span>
                <span className="font-mono font-bold text-amber-400">
                  {formatMoney(totals.advanceAmount, company.currency, company.currencyPosition)}
                </span>
              </div>
            </div>

            {/* If invoice: Amount paid input */}
            {docType === 'invoice' && (
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-emerald-400">
                  <span>Déjà encaissé :</span>
                  <div className="w-32">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={amountPaid || ''}
                      onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-right text-emerald-300 font-mono text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-between text-rose-400 font-bold bg-rose-950/40 border border-rose-800/50 p-2 rounded-lg">
                  <span>Solde restant dû :</span>
                  <span className="font-mono">
                    {formatMoney(totals.balanceDue, company.currency, company.currencyPosition)}
                  </span>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-3 sm:p-4 shadow-2xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-all"
          >
            Annuler
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSave(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 text-xs sm:text-sm font-bold transition-all"
            >
              <Printer size={16} />
              <span className="hidden sm:inline">Enregistrer &</span>
              <span>Imprimer A4</span>
            </button>

            <button
              type="button"
              onClick={() => handleSave(false)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Save size={16} />
              <span>Enregistrer</span>
            </button>
          </div>

        </div>
      </div>

      {/* Material Picker Modal */}
      <MaterialPickerModal
        isOpen={isMaterialPickerOpen}
        onClose={() => setIsMaterialPickerOpen(false)}
        materials={materials}
        company={company}
        onSelectMaterial={handleAddItemFromCatalog}
        onAddNewCustomMaterial={onAddNewMaterial}
      />

    </div>
  );
};
