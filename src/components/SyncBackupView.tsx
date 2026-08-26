import React, { useState } from 'react';
import { 
  Cloud, 
  CloudOff, 
  RefreshCw, 
  Download, 
  Upload, 
  ShieldCheck, 
  Smartphone, 
  Wifi, 
  WifiOff, 
  CheckCircle2, 
  AlertTriangle,
  History,
  FileSpreadsheet
} from 'lucide-react';
import { CompanyInfo, BTPDocument, MaterialItem, Client } from '../types';
import { exportBackupJSON, importBackupJSON } from '../utils/storage';
import { formatDateFr } from '../utils/formatters';

interface SyncBackupViewProps {
  isOnline: boolean;
  isSyncing: boolean;
  pendingSyncCount: number;
  lastSyncTime: string | null;
  company: CompanyInfo;
  documents: BTPDocument[];
  materials: MaterialItem[];
  clients: Client[];
  onManualSync: () => void;
  onRestoreBackup: (data: {
    company?: CompanyInfo;
    documents?: BTPDocument[];
    materials?: MaterialItem[];
    clients?: Client[];
  }) => void;
}

export const SyncBackupView: React.FC<SyncBackupViewProps> = ({
  isOnline,
  isSyncing,
  pendingSyncCount,
  lastSyncTime,
  company,
  documents,
  materials,
  clients,
  onManualSync,
  onRestoreBackup
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleExportBackup = () => {
    exportBackupJSON(company, documents, materials, clients);
    showToast("Sauvegarde complète téléchargée !");
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const result = importBackupJSON(text);
        if (result.success) {
          onRestoreBackup({
            company: result.company,
            documents: result.documents,
            materials: result.materials,
            clients: result.clients
          });
          showToast("Données restaurées avec succès depuis le fichier !");
        } else {
          alert(`Erreur d'importation : ${result.error}`);
        }
      } catch (err: any) {
        alert(`Erreur lors de la lecture du fichier : ${err.message}`);
      } finally {
        setIsImporting(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6 space-y-6 animate-fade-in pb-28">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
              Continuité Hors-Ligne & Cloud
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-display mt-1">
            Mode Hors-Ligne & Synchronisation
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Travaillez sur vos chantiers même sans réseau. L'application synchronise vos modifications dès qu'internet est disponible.
          </p>
        </div>

        <button
          onClick={onManualSync}
          disabled={isSyncing}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-lg transition-all active:scale-95 ${
            isOnline 
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20' 
              : 'bg-slate-800 text-slate-400 border border-slate-700'
          }`}
        >
          <RefreshCw size={16} className={isSyncing ? "animate-spin text-slate-950" : ""} />
          <span>{isSyncing ? "Synchronisation en cours..." : "Synchroniser maintenant"}</span>
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-sm font-bold animate-bounce">
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Network Status & Cloud Sync Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Network Status Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                État de la Connexion
              </span>
              {isOnline ? (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold">
                  <Wifi size={14} />
                  <span>En Ligne (Connecté)</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950 text-amber-400 border border-amber-800 text-xs font-bold">
                  <WifiOff size={14} />
                  <span>Mode Hors-Ligne</span>
                </span>
              )}
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Modifications en attente de synchronisation :</span>
                <span className="font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-slate-800">
                  {pendingSyncCount} élément{pendingSyncCount > 1 ? 's' : ''}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Dernière synchronisation cloud réussie :</span>
                <span className="font-mono text-slate-200">
                  {lastSyncTime ? new Date(lastSyncTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Jamais'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-start gap-2">
            <ShieldCheck size={16} className="text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Sauvegarde locale active :</strong> Toutes vos saisies de devis, factures et catalogue sont instantanément enregistrées sur cet appareil.
            </span>
          </div>
        </div>

        {/* Cloud Mirror Sync Info */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-sm font-display">
              <Cloud size={18} className="text-amber-400" />
              <span>Synchronisation Automatique</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Dès qu'une connexion internet (Wi-Fi ou 4G/5G mobile) est détectée, vos modifications (nouveaux devis, factures validées, modifications de prix de matériaux) sont automatiquement synchronisées avec le serveur sécurisé.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onManualSync}
              disabled={isSyncing}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md"
            >
              <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
              <span>{isSyncing ? "Envoi des données..." : "Forcer la synchronisation"}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Manual Backup & Restore System */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <History size={18} className="text-amber-400" />
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Sauvegarde & Restauration Complète (Export / Import)
            </h3>
            <p className="text-xs text-slate-400">
              Exportez un fichier de sauvegarde pour sécuriser vos données ou les transférer vers un autre smartphone/ordinateur.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          
          {/* Export Button Card */}
          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2 text-white text-sm font-bold">
                <Download size={16} className="text-emerald-400" />
                <span>Télécharger la Sauvegarde Complète</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Génère un fichier JSON sécurisé contenant votre profil entreprise, vos logos, les {documents.length} devis & factures, les {materials.length} matériaux et les {clients.length} clients.
              </p>
            </div>

            <button
              type="button"
              onClick={handleExportBackup}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all active:scale-95"
            >
              <Download size={15} />
              <span>Exporter Fichier de Sauvegarde (.json)</span>
            </button>
          </div>

          {/* Import Button Card */}
          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2 text-white text-sm font-bold">
                <Upload size={16} className="text-amber-400" />
                <span>Restaurer depuis un Fichier</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Importez un fichier de sauvegarde préalablement exporté pour rétablir instantanément toutes vos données sur cet appareil.
              </p>
            </div>

            <label className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 text-xs font-bold cursor-pointer transition-all active:scale-95">
              <Upload size={15} />
              <span>{isImporting ? "Restauration en cours..." : "Importer un Fichier Sauvegarde (.json)"}</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                disabled={isImporting}
                className="hidden"
              />
            </label>
          </div>

        </div>
      </div>

      {/* Practical BTP Mobile Tips Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm font-display">
          <Smartphone size={18} />
          <span>Astuces pour une utilisation optimale sur Chantier</span>
        </div>

        <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside leading-relaxed">
          <li>
            <strong>Mode Hors-ligne total :</strong> Vous pouvez créer des devis, ajouter des matériaux, modifier vos prix et signer même en zone blanche sans aucun réseau.
          </li>
          <li>
            <strong>Impression directe depuis Smartphone :</strong> Cliquez sur <em>"Imprimer / PDF A4"</em> pour générer un PDF propre ou imprimer via une imprimante Wi-Fi / Bluetooth de chantier.
          </li>
          <li>
            <strong>Partage WhatsApp immédiat :</strong> Le bouton WhatsApp formate automatiquement un récapitulatif clair du devis et l'envoie en 1 clic au numéro du client.
          </li>
        </ul>
      </div>

    </div>
  );
};
