import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Layers, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  RotateCcw, 
  Sparkles,
  DollarSign,
  Tag
} from 'lucide-react';
import { MaterialItem, MaterialCategory, CompanyInfo } from '../types';
import { formatMoney } from '../utils/formatters';
import { INITIAL_MATERIALS } from '../data/initialData';

interface MaterialsCatalogViewProps {
  materials: MaterialItem[];
  company: CompanyInfo;
  onSaveMaterial: (material: MaterialItem) => void;
  onDeleteMaterial: (id: string) => void;
  onResetMaterials: () => void;
}

const CATEGORY_NAMES: Record<MaterialCategory, string> = {
  gros_oeuvre: "Gros Œuvre & Béton",
  maconnerie: "Maçonnerie & Blocs",
  quincaillerie_fer: "Armatures & Ferraillage",
  charpente_couverture: "Charpente & Toiture",
  plomberie_sanitaire: "Plomberie & Sanitaires",
  electricite: "Électricité & Câblage",
  peinture_revetement: "Peinture & Enduits",
  carrelage: "Carrelage & Revêtements",
  menuiserie: "Menuiserie & Portes",
  main_oeuvre: "Main d'œuvre & Pose",
  engins_location: "Engins & Location",
  divers: "Divers & Consommables"
};

export const MaterialsCatalogView: React.FC<MaterialsCatalogViewProps> = ({
  materials,
  company,
  onSaveMaterial,
  onDeleteMaterial,
  onResetMaterials
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form states for new/edit
  const [name, setName] = useState('');
  const [category, setCategory] = useState<MaterialCategory>('gros_oeuvre');
  const [unit, setUnit] = useState('m²');
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState('');

  const filteredMaterials = useMemo(() => {
    return materials.filter(m => {
      const matchesSearch = 
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.description && m.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        m.unit.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCat = selectedCategory === 'all' || m.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [materials, searchTerm, selectedCategory]);

  const handleStartEdit = (mat: MaterialItem) => {
    setEditingId(mat.id);
    setName(mat.name);
    setCategory(mat.category);
    setUnit(mat.unit);
    setPrice(mat.defaultPrice);
    setDescription(mat.description || '');
    setIsAddingNew(false);
  };

  const handleStartAdd = () => {
    setEditingId(null);
    setName('');
    setCategory('gros_oeuvre');
    setUnit('sac (50kg)');
    setPrice(0);
    setDescription('');
    setIsAddingNew(true);
  };

  const handleCancelForm = () => {
    setEditingId(null);
    setIsAddingNew(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const itemToSave: MaterialItem = {
      id: editingId || 'mat-custom-' + Date.now(),
      name: name.trim(),
      category,
      unit: unit.trim() || 'pièce',
      defaultPrice: Number(price) || 0,
      defaultTaxRate: company.defaultTaxRate,
      description: description.trim(),
      isCustom: true
    };

    onSaveMaterial(itemToSave);
    handleCancelForm();
  };

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-6 animate-fade-in pb-28">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
              Bibliothèque de Prix
            </span>
            <span className="text-xs text-slate-400">
              {materials.length} matériaux & prestations
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-display mt-1">
            Catalogue Matériaux & Tarifs BTP
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Gérez votre mercuriale de prix pour insérer vos matériaux en 1 clic dans vos devis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleStartAdd}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
          >
            <Plus size={16} />
            <span>+ Ajouter Matériau</span>
          </button>
        </div>
      </div>

      {/* Inline Add / Edit Form Modal/Card */}
      {(isAddingNew || editingId) && (
        <form 
          onSubmit={handleSubmit}
          className="bg-slate-900 border-2 border-amber-500/50 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4 animate-fade-in"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm sm:text-base font-bold text-white font-display flex items-center gap-2">
              <Layers size={18} className="text-amber-400" />
              <span>{isAddingNew ? "Nouveau Matériau ou Prestation" : `Modifier "${name}"`}</span>
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
                Désignation du Matériau / Prestation *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Ciment CPJ 42.5, Sable fin, Fer HA 12, etc."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Catégorie BTP
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MaterialCategory)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              >
                {Object.entries(CATEGORY_NAMES).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Unité de mesure *
              </label>
              <input
                type="text"
                required
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="sac, m², m³, tonne, pièce, ml, jour..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Prix Unitaire HT ({company.currency}) *
              </label>
              <input
                type="number"
                min="0"
                step="any"
                required
                value={price || ''}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm focus:ring-2 focus:ring-amber-500 outline-none font-bold"
              />
            </div>

            <div className="sm:col-span-8">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Description & Spécifications (optionnel)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Dosage, caractéristiques techniques, normes..."
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
              <span>Enregistrer le matériau</span>
            </button>
          </div>
        </form>
      )}

      {/* Search and Category Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 p-3 sm:p-4 rounded-2xl shadow-lg space-y-3">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par nom (ciment, fer, sable, parpaing...)"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <button
            onClick={() => {
              if (window.confirm("Restaurer les matériaux par défaut BTP ? Vos modifications personnalisées seront complétées.")) {
                onResetMaterials();
              }
            }}
            className="text-[11px] text-slate-400 hover:text-amber-400 flex items-center gap-1 shrink-0"
          >
            <RotateCcw size={12} />
            <span>Restaurer catalogue BTP par défaut</span>
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-lg shrink-0 transition-all ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Tous ({materials.length})
          </button>

          {Object.entries(CATEGORY_NAMES).map(([catKey, label]) => {
            const count = materials.filter(m => m.category === catKey).length;
            if (count === 0) return null;
            return (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                className={`px-3 py-1 rounded-lg shrink-0 transition-all ${
                  selectedCategory === catKey
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>

      </div>

      {/* Materials Grid / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filteredMaterials.map((mat) => (
          <div
            key={mat.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 shadow-lg flex flex-col justify-between space-y-3 transition-all hover:bg-slate-850/60"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-semibold border border-slate-700">
                  {CATEGORY_NAMES[mat.category] || mat.category}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  par {mat.unit}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white mt-2">
                {mat.name}
              </h3>

              {mat.description && (
                <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                  {mat.description}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div className="text-base font-black text-amber-400 font-mono">
                {formatMoney(mat.defaultPrice, company.currency, company.currencyPosition)}
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleStartEdit(mat)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
                  title="Modifier le prix / unité"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Supprimer "${mat.name}" du catalogue ?`)) {
                      onDeleteMaterial(mat.id);
                    }
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 text-rose-400 hover:text-rose-300 hover:bg-rose-950/80 transition-all"
                  title="Supprimer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
