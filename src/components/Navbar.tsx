import React from 'react';
import { 
  FileText, 
  Layers, 
  Users, 
  Building, 
  Cloud, 
  CloudOff, 
  RefreshCw, 
  PlusCircle,
  HardHat
} from 'lucide-react';
import { CompanyInfo } from '../types';
import { CompanyLogo } from './CompanyLogo';

interface NavbarProps {
  currentTab: 'documents' | 'editor' | 'materials' | 'clients' | 'company' | 'sync';
  setCurrentTab: (tab: 'documents' | 'editor' | 'materials' | 'clients' | 'company' | 'sync') => void;
  company: CompanyInfo;
  isOnline: boolean;
  isSyncing: boolean;
  pendingSyncCount: number;
  onManualSync: () => void;
  onNewDocument: (type: 'quote' | 'invoice') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  company,
  isOnline,
  isSyncing,
  pendingSyncCount,
  onManualSync,
  onNewDocument
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 no-print">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Logo & Company title */}
          <div 
            id="brand-header-btn"
            onClick={() => setCurrentTab('documents')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="relative">
              <CompanyLogo company={company} size="sm" />
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-slate-950">
                <HardHat size={9} />
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold tracking-tight text-white font-display truncate">
                  {company.name || 'BatiDevis Express'}
                </span>
              </div>
              <span className="text-xs text-slate-400 truncate hidden sm:inline">
                Devis & Factures Matériaux BTP
              </span>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              id="nav-tab-documents"
              onClick={() => setCurrentTab('documents')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'documents' || currentTab === 'editor'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <FileText size={16} />
              <span>Devis & Factures</span>
            </button>

            <button
              id="nav-tab-materials"
              onClick={() => setCurrentTab('materials')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'materials'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Layers size={16} />
              <span>Catalogue Matériaux</span>
            </button>

            <button
              id="nav-tab-clients"
              onClick={() => setCurrentTab('clients')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'clients'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Users size={16} />
              <span>Clients & Chantiers</span>
            </button>

            <button
              id="nav-tab-company"
              onClick={() => setCurrentTab('company')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'company'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Building size={16} />
              <span>Entreprise & Logo</span>
            </button>

            <button
              id="nav-tab-sync"
              onClick={() => setCurrentTab('sync')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'sync'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Cloud size={16} />
              <span>Synchro</span>
              {pendingSyncCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px]">
                  {pendingSyncCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Action Tools & Network Status */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Sync & Online Status Pill */}
            <button
              id="btn-network-sync-status"
              onClick={onManualSync}
              title={isOnline ? "En ligne - Cliquez pour synchroniser" : "Mode Hors-ligne (Données sauvegardées en local)"}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                isOnline 
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/60' 
                  : 'bg-amber-950/60 text-amber-300 border-amber-800/60 hover:bg-amber-900/60'
              }`}
            >
              {isSyncing ? (
                <RefreshCw size={13} className="animate-spin text-amber-400" />
              ) : isOnline ? (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              ) : (
                <CloudOff size={13} className="text-amber-400" />
              )}
              <span className="hidden sm:inline">
                {isSyncing ? 'Synchro...' : isOnline ? 'En ligne' : 'Hors-ligne'}
              </span>
              {pendingSyncCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold">
                  {pendingSyncCount}
                </span>
              )}
            </button>

            {/* Quick Create Button */}
            <button
              id="btn-quick-create-doc"
              onClick={() => onNewDocument('quote')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold shadow-md hover:shadow-amber-500/20 active:scale-95 transition-all"
            >
              <PlusCircle size={16} />
              <span>Nouveau Devis</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
