import React from 'react';
import { FileText, Layers, Users, Building, Cloud } from 'lucide-react';

interface MobileNavProps {
  currentTab: 'documents' | 'editor' | 'materials' | 'clients' | 'company' | 'sync';
  setCurrentTab: (tab: 'documents' | 'editor' | 'materials' | 'clients' | 'company' | 'sync') => void;
  pendingSyncCount: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTab,
  setCurrentTab,
  pendingSyncCount
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-2 py-1.5 no-print">
      <div className="grid grid-cols-5 gap-1 items-center">
        
        <button
          id="mobile-tab-documents"
          onClick={() => setCurrentTab('documents')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
            currentTab === 'documents' || currentTab === 'editor'
              ? 'text-amber-400 bg-amber-500/10 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText size={18} />
          <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-full">Devis/Fact.</span>
        </button>

        <button
          id="mobile-tab-materials"
          onClick={() => setCurrentTab('materials')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
            currentTab === 'materials'
              ? 'text-amber-400 bg-amber-500/10 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers size={18} />
          <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-full">Matériaux</span>
        </button>

        <button
          id="mobile-tab-clients"
          onClick={() => setCurrentTab('clients')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
            currentTab === 'clients'
              ? 'text-amber-400 bg-amber-500/10 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users size={18} />
          <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-full">Clients</span>
        </button>

        <button
          id="mobile-tab-company"
          onClick={() => setCurrentTab('company')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
            currentTab === 'company'
              ? 'text-amber-400 bg-amber-500/10 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building size={18} />
          <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-full">Entreprise</span>
        </button>

        <button
          id="mobile-tab-sync"
          onClick={() => setCurrentTab('sync')}
          className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
            currentTab === 'sync'
              ? 'text-amber-400 bg-amber-500/10 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cloud size={18} />
          <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-full">Synchro</span>
          {pendingSyncCount > 0 && (
            <span className="absolute top-1 right-2 w-4 h-4 bg-amber-500 text-slate-950 text-[9px] font-extrabold rounded-full flex items-center justify-center">
              {pendingSyncCount}
            </span>
          )}
        </button>

      </div>
    </div>
  );
};
