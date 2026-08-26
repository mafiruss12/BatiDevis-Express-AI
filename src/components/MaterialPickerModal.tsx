import React, { useState, useMemo } from 'react';
import { X, Search, Plus, Check, Filter } from 'lucide-react';
import { MaterialItem, MaterialCategory, CompanyInfo } from '../types';
import { formatMoney } from '../utils/formatters';

interface MaterialPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  materials: MaterialItem[];
  company: CompanyInfo;
  onSelectMaterial: (material: MaterialItem) => void;
  onAddNewCustomMaterial: (material: MaterialItem) => void;
}

const CATEGORY_LABELS: Record<MaterialCategory, string> = {
  gros_oeuvre: "Gros Œuvre",
  maconnerie: "Maçonnerie",
  charpente_couverture: "Charpente & Toiture",
  plomberie_sanitaire: "Plomberie",
  electricite: "Électricité",
  peinture_revetement: "Peinture",
  carrelage: "Carrelage",
  menuiserie: "Menuiserie",
  quincaillerie_fer: "Ferraillage & Acier",
  main_oeuvre: "Main d'œuvre",
  engins_location: "Engins & Location",
  divers: "Divers"
};

export const MaterialPickerModal: React.FC<MaterialPickerModalProps> = ({
  isOpen,
  onClose,
  materials,
  company,
  onSelectMaterial,
  onAddNewCustomMaterial
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // New item draft state
  const [newMatName, setNewMatName] = useState('');
  const [newMatCategory, setNewMatCategory] = useState<MaterialCategory>('gros_oeuvre');
  const [newMatUnit, setNewMatUnit] = useState('sac');
  const [newMatPrice, setNewMatPrice] = useState<number>(0);
  const [newMatDesc, setNewMatDesc] = useState('');

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

  if (!isOpen) return null;

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatName.trim()) return;

    const newItem: MaterialItem = {
      id: 'mat-custom-' + Date.now(),
      name: newMatName.trim(),
      category: newMatCategory,
      unit: newMatUnit.trim() || 'pièce',
      defaultPrice: Number(newMatPrice) || 0,
      defaultTaxRate: company.defaultTaxRate,
      description: newMatDesc.trim(),
      isCustom: true
    };

    onAddNewCustomMaterial(newItem);
    onSelectMaterial(newItem);
    setIsCreatingNew(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white font-display">
              {isCreatingNew ? "Créer un nouveau matériau" : "Sélectionner depuis la bibliothèque"}
            </h3>
            <p className="text-xs text-slate-400">
              {isCreatingNew 
                ? "Ajoutez un matériau ou une prestation qui sera enregistrée dans votre catalogue" 
                : "Cliquez pour insérer instantanément dans le devis"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {isCreatingNew ? (
          /* Create New Material Form */
          <form onSubmit={handleCreateCustom} className="p-4 sm:p-6 overflow-y-auto space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Désignation du matériau / Prestation *
              </label>
              <input
                type="text"
                required
                value={newMatName}
                onChange={(e) => setNewMatName(e.target.value)}
                placeholder="Ex: Ciment CPJ 42.5, Sable de rivière, Bétonnière 350L..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Catégorie
                </label>
                <select
                  value={newMatCategory}
                  onChange={(e) => setNewMatCategory(e.target.value as MaterialCategory)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  {Object.entries(CATEGORY_LABELS).map(([catKey, label]) => (
                    <option key={catKey} value={catKey}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Unité de mesure *
                </label>
                <input
                  type="text"
                  required
                  value={newMatUnit}
                  onChange={(e) => setNewMatUnit(e.target.value)}
                  placeholder="sac, m², m³, tonne, pièce, jour, ml..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Prix Unitaire HT ({company.currency})
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={newMatPrice || ''}
                  onChange={(e) => setNewMatPrice(parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Description / Spécifications techniques (optionnel)
              </label>
              <textarea
                rows={2}
                value={newMatDesc}
                onChange={(e) => setNewMatDesc(e.target.value)}
                placeholder="Précisions de dosage, dimensions, caractéristiques..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white"
              >
                Retour à la liste
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md"
              >
                <Check size={16} />
                <span>Enregistrer & Insérer</span>
              </button>
            </div>
          </form>
        ) : (
          /* Search & Select List */
          <div className="flex flex-col flex-1 min-h-0">
            
            {/* Search and Category Filter Bar */}
            <div className="p-3 bg-slate-900/60 border-b border-slate-800 space-y-2 shrink-0">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher un matériau (ciment, fer, sable, parpaing, tuyau...)"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-sm text-white focus:ring-2 focus:ring-amber-500 outline-none"
                    autoFocus
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 text-xs font-bold shrink-0 transition-all"
                >
                  <Plus size={15} />
                  <span>Nouveau</span>
                </button>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`px-2.5 py-1 rounded-lg shrink-0 transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  Tous ({materials.length})
                </button>
                {Object.entries(CATEGORY_LABELS).map(([catKey, label]) => {
                  const count = materials.filter(m => m.category === catKey).length;
                  if (count === 0) return null;
                  return (
                    <button
                      key={catKey}
                      type="button"
                      onClick={() => setSelectedCategory(catKey)}
                      className={`px-2.5 py-1 rounded-lg shrink-0 transition-all ${
                        selectedCategory === catKey
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-800/80 text-slate-400 hover:text-white'
                      }`}
                    >
                      {label} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* List of materials */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5 divide-y divide-slate-800/40">
              {filteredMaterials.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <p className="text-sm">Aucun matériau trouvé pour cette recherche.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setNewMatName(searchTerm);
                      setIsCreatingNew(true);
                    }}
                    className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold"
                  >
                    <Plus size={14} />
                    <span>Créer "{searchTerm || 'Nouveau matériau'}"</span>
                  </button>
                </div>
              ) : (
                filteredMaterials.map((mat) => (
                  <div
                    key={mat.id}
                    onClick={() => {
                      onSelectMaterial(mat);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 border border-transparent hover:border-slate-700 cursor-pointer transition-all group"
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors truncate">
                          {mat.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
                          {CATEGORY_LABELS[mat.category] || mat.category}
                        </span>
                      </div>
                      {mat.description && (
                        <p className="text-xs text-slate-400 truncate mt-0.5">{mat.description}</p>
                      )}
                    </div>

                    <div className="text-right shrink-0 flex items-center gap-3">
                      <div>
                        <div className="text-sm font-bold text-amber-400 font-mono">
                          {formatMoney(mat.defaultPrice, company.currency, company.currencyPosition)}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          par {mat.unit}
                        </div>
                      </div>
                      <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                        <Plus size={16} />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
