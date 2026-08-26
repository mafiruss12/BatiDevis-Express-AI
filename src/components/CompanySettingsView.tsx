import React, { useState } from 'react';
import { 
  Building, 
  Upload, 
  Trash2, 
  Save, 
  CheckCircle2, 
  Building2, 
  Hammer, 
  HardHat, 
  Paintbrush, 
  Ruler, 
  Truck,
  Image as ImageIcon,
  DollarSign,
  ShieldCheck,
  CreditCard,
  Phone
} from 'lucide-react';
import { CompanyInfo } from '../types';
import { CompanyLogo } from './CompanyLogo';

interface CompanySettingsViewProps {
  company: CompanyInfo;
  onSaveCompany: (updated: CompanyInfo) => void;
}

const LOGO_PRESETS = [
  { id: 'crane', label: 'Bâtiment / Grue', icon: Building2 },
  { id: 'hammer', label: 'Maçonnerie / Marteau', icon: Hammer },
  { id: 'brick', label: 'Chantier / Casque', icon: HardHat },
  { id: 'ruler', label: 'Architecture / Mètre', icon: Ruler },
  { id: 'paint', label: 'Peinture / Rénovation', icon: Paintbrush },
  { id: 'truck', label: 'Matériaux / Logistique', icon: Truck },
];

const CURRENCIES = [
  { code: 'FCFA', label: 'FCFA (Franc CFA)' },
  { code: '€', label: 'EUR (€ Euro)' },
  { code: '$', label: 'USD ($ Dollar)' },
  { code: 'CAD $', label: 'CAD ($ Dollar Canadien)' },
  { code: 'MAD', label: 'MAD (Dirham Marocain)' },
  { code: 'DZD', label: 'DZD (Dinar Algérien)' },
  { code: 'TND', label: 'TND (Dinar Tunisien)' },
  { code: 'GNF', label: 'GNF (Franc Guinéen)' },
  { code: 'CDF', label: 'CDF (Franc Congolais)' },
  { code: 'CHF', label: 'CHF (Franc Suisse)' },
];

export const CompanySettingsView: React.FC<CompanySettingsViewProps> = ({
  company,
  onSaveCompany
}) => {
  const [formData, setFormData] = useState<CompanyInfo>({ ...company });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 4MB)
    if (file.size > 4 * 1024 * 1024) {
      alert("L'image est trop volumineuse (maximum 4 Mo).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setFormData(prev => ({
        ...prev,
        logoUrl: base64
      }));
      showToast("Logo importé avec succès !");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCustomLogo = () => {
    setFormData(prev => ({
      ...prev,
      logoUrl: ''
    }));
  };

  const handleStampUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setFormData(prev => ({
        ...prev,
        stampOrSignatureUrl: base64
      }));
      showToast("Cachet d'entreprise importé !");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCompany(formData);
    showToast("Profil entreprise & informations de facturation enregistrés !");
  };

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6 space-y-6 animate-fade-in pb-28">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
              En-tête & Personnalisation
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-display mt-1">
            Entreprise, Artisan & Logo
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Configurez votre logo, vos coordonnées et mentions légales pour vos devis et factures imprimables.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
        >
          <Save size={16} />
          <span>Enregistrer les modifications</span>
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-sm font-bold animate-bounce">
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* ================================================================= */}
        {/* 1. LOGO & VISUAL IDENTITY */}
        {/* ================================================================= */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <ImageIcon size={18} className="text-amber-400" />
            <h3 className="text-base font-bold text-white font-display">
              Logo de l'Entreprise / Artisan
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            
            {/* Logo Preview */}
            <div className="flex flex-col items-center gap-2">
              <CompanyLogo company={formData} size="xl" className="shadow-lg" />
              <span className="text-[11px] text-slate-400 font-medium">Aperçu en-tête</span>
            </div>

            {/* Upload or Preset Choice */}
            <div className="flex-1 space-y-4 w-full">
              
              {/* File Upload Button */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Téléverser votre propre logo (PNG, JPG, SVG) :
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold cursor-pointer transition-all">
                    <Upload size={15} />
                    <span>Choisir une image...</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>

                  {formData.logoUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveCustomLogo}
                      className="flex items-center gap-1 px-3 py-2 rounded-xl bg-rose-950/60 text-rose-400 hover:bg-rose-900 text-xs font-semibold transition-all"
                    >
                      <Trash2 size={14} />
                      <span>Supprimer le logo importé</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Or Select Preset Vector Icon */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="block text-xs font-semibold text-slate-300">
                  Ou choisir un logo prédéfini du BTP :
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {LOGO_PRESETS.map(preset => {
                    const IconComponent = preset.icon;
                    const isSelected = formData.logoPreset === preset.id && !formData.logoUrl;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            logoPreset: preset.id,
                            logoUrl: ''
                          }));
                        }}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500 text-amber-400'
                            : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <IconComponent size={16} />
                        <span className="truncate">{preset.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* ================================================================= */}
        {/* 2. GENERAL COMPANY INFORMATION */}
        {/* ================================================================= */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Building size={18} className="text-amber-400" />
            <h3 className="text-base font-bold text-white font-display">
              Informations Générales & Coordonnées
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            
            <div className="sm:col-span-6">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Raison Sociale / Nom de l'Artisan ou Entreprise *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: BATI-PLUS CONSTRUCTIONS"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none font-bold"
              />
            </div>

            <div className="sm:col-span-6">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Activité / Métier principal
              </label>
              <input
                type="text"
                value={formData.activity}
                onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                placeholder="Ex: Entreprise Générale de Bâtiment, Gros Œuvre, Maçonnerie..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div className="sm:col-span-12">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Slogan commercial (optionnel)
              </label>
              <input
                type="text"
                value={formData.slogan}
                onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                placeholder="Ex: L'art de bâtir en toute solidité"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div className="sm:col-span-6">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Adresse physique du siège / Dépôt
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="14 Boulevard des Artisans"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Ville / Commune
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Abidjan / Paris / Dakar..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Pays
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="Côte d'Ivoire / France..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div className="sm:col-span-6">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Téléphone principal (Appels / Devis) *
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+225 07 48 92 10 33"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none font-mono"
              />
            </div>

            <div className="sm:col-span-6">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Téléphone secondaire / Chantier
              </label>
              <input
                type="text"
                value={formData.phoneSecondary || ''}
                onChange={(e) => setFormData({ ...formData, phoneSecondary: e.target.value })}
                placeholder="+225 01 02 03 04 05"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none font-mono"
              />
            </div>

            <div className="sm:col-span-6">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email professionnel
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@batiplus-construction.com"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div className="sm:col-span-6">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Site Web (optionnel)
              </label>
              <input
                type="text"
                value={formData.website || ''}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="www.mon-entreprise-btp.com"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            {/* Legal identifiers */}
            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                N° SIRET / N° Entreprise
              </label>
              <input
                type="text"
                value={formData.siret || ''}
                onChange={(e) => setFormData({ ...formData, siret: e.target.value })}
                placeholder="849 201 938 00012"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none font-mono"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                N° RCCM / Registre du Commerce
              </label>
              <input
                type="text"
                value={formData.rccm || ''}
                onChange={(e) => setFormData({ ...formData, rccm: e.target.value })}
                placeholder="CI-ABJ-2023-B-14902"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none font-mono"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                N° TVA Intracommunautaire
              </label>
              <input
                type="text"
                value={formData.tvaNumber || ''}
                onChange={(e) => setFormData({ ...formData, tvaNumber: e.target.value })}
                placeholder="FR82849201938"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none font-mono"
              />
            </div>

          </div>
        </div>

        {/* ================================================================= */}
        {/* 3. FINANCIAL, CURRENCY & PAYMENT SETTINGS */}
        {/* ================================================================= */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <CreditCard size={18} className="text-amber-400" />
            <h3 className="text-base font-bold text-white font-display">
              Paramètres Financiers & Coordonnées de Paiement
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            
            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Devise Monétaire
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none font-bold"
              >
                {CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Taux de TVA par défaut (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="any"
                value={formData.defaultTaxRate}
                onChange={(e) => setFormData({ ...formData, defaultTaxRate: parseFloat(e.target.value) || 0 })}
                placeholder="18"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none font-mono"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Acompte standard par défaut (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.defaultAdvancePercentage}
                onChange={(e) => setFormData({ ...formData, defaultAdvancePercentage: parseFloat(e.target.value) || 0 })}
                placeholder="40"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none font-mono"
              />
            </div>

            {/* Bank details */}
            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nom de la Banque
              </label>
              <input
                type="text"
                value={formData.bankName || ''}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                placeholder="Société Générale / Banque Atlantique..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div className="sm:col-span-8">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                IBAN / Numéro de Compte Bancaire
              </label>
              <input
                type="text"
                value={formData.iban || ''}
                onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
                placeholder="CI93 CI00 2019 3800 0012 3456 7890"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none font-mono"
              />
            </div>

            {/* Mobile Money */}
            <div className="sm:col-span-12">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                📱 Comptes Mobile Money (Wave, Orange Money, MTN, Moov)
              </label>
              <input
                type="text"
                value={formData.mobileMoney || ''}
                onChange={(e) => setFormData({ ...formData, mobileMoney: e.target.value })}
                placeholder="Wave / Orange Money : +225 07 48 92 10 33"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            {/* Default payment terms */}
            <div className="sm:col-span-12">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Modalités de paiement par défaut
              </label>
              <textarea
                rows={2}
                value={formData.paymentTerms || ''}
                onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                placeholder="Ex: 40% à la commande pour approvisionnement matériaux, 40% à mi-parcours, 20% solde à la réception."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

          </div>
        </div>

        {/* ================================================================= */}
        {/* 4. LEGAL NOTICE & INSURANCE */}
        {/* ================================================================= */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <ShieldCheck size={18} className="text-amber-400" />
            <h3 className="text-base font-bold text-white font-display">
              Mentions Légales, Assurance Décennale & Cachet
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Mentions Légales (Pied de page des documents)
              </label>
              <textarea
                rows={2}
                value={formData.legalNotice || ''}
                onChange={(e) => setFormData({ ...formData, legalNotice: e.target.value })}
                placeholder="Assurance Décennale et Responsabilité Civile Professionnelle souscrites auprès de... TVA non applicable..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            {/* Stamp upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Cachet officiel ou signature scannée de l'artisan (optionnel) :
              </label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold cursor-pointer transition-all">
                  <Upload size={15} />
                  <span>Importer un cachet / tampon (PNG)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleStampUpload}
                    className="hidden"
                  />
                </label>

                {formData.stampOrSignatureUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, stampOrSignatureUrl: '' })}
                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                  >
                    <Trash2 size={13} />
                    <span>Supprimer le cachet</span>
                  </button>
                )}
              </div>
              {formData.stampOrSignatureUrl && (
                <div className="mt-2 p-2 bg-white rounded-xl inline-block border border-slate-300">
                  <img src={formData.stampOrSignatureUrl} alt="Cachet" className="max-h-16 object-contain" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Bottom Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-black shadow-xl shadow-amber-500/20 active:scale-95 transition-all"
          >
            <Save size={18} />
            <span>Enregistrer toutes les informations</span>
          </button>
        </div>

      </form>

    </div>
  );
};
