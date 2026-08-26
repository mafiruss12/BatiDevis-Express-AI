import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  Edit3, 
  Trash2, 
  MessageSquare, 
  Check, 
  X,
  Building2
} from 'lucide-react';
import { Client, BTPDocument, CompanyInfo } from '../types';
import { formatMoney } from '../utils/formatters';

interface ClientsViewProps {
  clients: Client[];
  documents: BTPDocument[];
  company: CompanyInfo;
  onSaveClient: (client: Client) => void;
  onDeleteClient: (id: string) => void;
  onSelectDocumentForPrint: (doc: BTPDocument) => void;
  onNewQuoteForClient: (client: Client) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  clients,
  documents,
  company,
  onSaveClient,
  onDeleteClient,
  onSelectDocumentForPrint,
  onNewQuoteForClient
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [siteAddress, setSiteAddress] = useState('');
  const [notes, setNotes] = useState('');

  const filteredClients = useMemo(() => {
    return clients.filter(c => {
      const s = searchTerm.toLowerCase();
      return (
        c.name.toLowerCase().includes(s) ||
        (c.company && c.company.toLowerCase().includes(s)) ||
        c.phone.toLowerCase().includes(s) ||
        (c.siteAddress && c.siteAddress.toLowerCase().includes(s))
      );
    });
  }, [clients, searchTerm]);

  const handleStartAdd = () => {
    setEditingClientId(null);
    setName('');
    setCompanyName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setSiteAddress('');
    setNotes('');
    setIsAddingNew(true);
  };

  const handleStartEdit = (client: Client) => {
    setEditingClientId(client.id);
    setName(client.name);
    setCompanyName(client.company || '');
    setPhone(client.phone || '');
    setEmail(client.email || '');
    setAddress(client.address || '');
    setSiteAddress(client.siteAddress || '');
    setNotes(client.notes || '');
    setIsAddingNew(false);
  };

  const handleCancelForm = () => {
    setIsAddingNew(false);
    setEditingClientId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const clientToSave: Client = {
      id: editingClientId || 'cli-' + Date.now(),
      name: name.trim(),
      company: companyName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      siteAddress: siteAddress.trim(),
      notes: notes.trim(),
      createdAt: editingClientId 
        ? (clients.find(c => c.id === editingClientId)?.createdAt || new Date().toISOString())
        : new Date().toISOString()
    };

    onSaveClient(clientToSave);
    handleCancelForm();
  };

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-6 animate-fade-in pb-28">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
              Répertoire & Chantiers
            </span>
            <span className="text-xs text-slate-400">
              {clients.length} client{clients.length > 1 ? 's' : ''}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-display mt-1">
            Clients & Adresses de Chantiers
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Gérez vos clients, lancez des appels ou WhatsApp directs et suivez l'historique des travaux.
          </p>
        </div>

        <button
          onClick={handleStartAdd}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
        >
          <Plus size={16} />
          <span>+ Nouveau Client</span>
        </button>
      </div>

      {/* Add / Edit Form Card */}
      {(isAddingNew || editingClientId) && (
        <form 
          onSubmit={handleSubmit}
          className="bg-slate-900 border-2 border-amber-500/50 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4 animate-fade-in"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm sm:text-base font-bold text-white font-display flex items-center gap-2">
              <Users size={18} className="text-amber-400" />
              <span>{isAddingNew ? "Ajouter un nouveau client" : `Modifier fiche client "${name}"`}</span>
            </h3>
            <button
              type="button"
              onClick={handleCancelForm}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            
            <div className="sm:col-span-6">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nom & Prénom du Client *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: M. Jean-Marc Kouassi, Mme Dubois..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div className="sm:col-span-6">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Société / SCI / Résidence (optionnel)
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Ex: SCI Les Palmiers, Entreprise Horizon..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div className="sm:col-span-6">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Téléphone (Appel / WhatsApp) *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: +225 07 12 34 56 78 / 06 12 34 56 78"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none font-mono"
              />
            </div>

            <div className="sm:col-span-6">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@email.com"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div className="sm:col-span-6">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Adresse personnelle / Facturation
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Adresse du domicile ou siège"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div className="sm:col-span-6">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Adresse principale du Chantier
              </label>
              <input
                type="text"
                value={siteAddress}
                onChange={(e) => setSiteAddress(e.target.value)}
                placeholder="Ex: Lot 45, Bingerville Palmeraie / 14 Rue Jean Jaurès..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div className="sm:col-span-12">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Notes & Remarques sur le client / chantier
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Accès camion, particularités de sol, clés de chantier..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={handleCancelForm}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Check size={16} />
              <span>Enregistrer Client</span>
            </button>
          </div>
        </form>
      )}

      {/* Search Toolbar */}
      <div className="bg-slate-900 border border-slate-800 p-3 sm:p-4 rounded-2xl shadow-lg">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un client ou chantier..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>
      </div>

      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => {
          const clientDocs = documents.filter(d => d.clientId === client.id);
          const totalClientBilled = clientDocs.reduce((acc, d) => acc + d.totalTTC, 0);

          return (
            <div
              key={client.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {client.name}
                    </h3>
                    {client.company && (
                      <p className="text-xs font-semibold text-amber-400">
                        {client.company}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStartEdit(client)}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-all"
                      title="Modifier fiche client"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Supprimer le client "${client.name}" ?`)) {
                          onDeleteClient(client.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 text-rose-400 hover:text-rose-300 hover:bg-rose-950/80 transition-all"
                      title="Supprimer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Contacts & Site Address */}
                <div className="text-xs text-slate-400 space-y-1.5 pt-1">
                  {client.phone && (
                    <div className="flex items-center justify-between gap-2">
                      <a 
                        href={`tel:${client.phone}`}
                        className="flex items-center gap-1.5 text-slate-300 hover:text-amber-400 font-mono"
                      >
                        <Phone size={13} className="text-emerald-400" />
                        <span>{client.phone}</span>
                      </a>
                      <a
                        href={`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 rounded-md bg-emerald-950/80 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all text-[11px] font-bold flex items-center gap-1 px-2"
                      >
                        <MessageSquare size={12} />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  )}

                  {client.email && (
                    <div className="flex items-center gap-1.5 text-slate-400 truncate">
                      <Mail size={13} className="text-slate-500 shrink-0" />
                      <span className="truncate">{client.email}</span>
                    </div>
                  )}

                  {client.siteAddress && (
                    <div className="flex items-start gap-1.5 text-slate-300 bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                      <MapPin size={13} className="text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Chantier habituel :</span>
                        <span className="text-xs">{client.siteAddress}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Associated documents summary */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    {clientDocs.length} devis & facture{clientDocs.length > 1 ? 's' : ''}
                  </span>
                  <span className="font-bold text-amber-400 font-mono">
                    {formatMoney(totalClientBilled, company.currency, company.currencyPosition)}
                  </span>
                </div>
              </div>

              {/* Action: Create Quote for this client */}
              <button
                type="button"
                onClick={() => onNewQuoteForClient(client)}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/30 text-amber-400 text-xs font-bold transition-all"
              >
                <Plus size={14} />
                <span>Nouveau Devis pour {client.name.split(' ')[0]}</span>
              </button>

            </div>
          );
        })}
      </div>

    </div>
  );
};
