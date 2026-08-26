import { CompanyInfo, MaterialItem, Client, BTPDocument, SyncRecord } from '../types';
import { INITIAL_COMPANY, INITIAL_MATERIALS, INITIAL_CLIENTS, INITIAL_DOCUMENTS } from '../data/initialData';

const KEYS = {
  COMPANY: 'batidevis_company_v1',
  DOCUMENTS: 'batidevis_documents_v1',
  MATERIALS: 'batidevis_materials_v1',
  CLIENTS: 'batidevis_clients_v1',
  SYNC_QUEUE: 'batidevis_sync_queue_v1',
  LAST_SYNC: 'batidevis_last_sync_v1'
};

export const getStorageCompany = (): CompanyInfo => {
  try {
    const saved = localStorage.getItem(KEYS.COMPANY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error loading company from storage', e);
  }
  return INITIAL_COMPANY;
};

export const setStorageCompany = (company: CompanyInfo) => {
  try {
    localStorage.setItem(KEYS.COMPANY, JSON.stringify(company));
    trackChange('company', 'update', company);
  } catch (e) {
    console.error('Error saving company', e);
  }
};

export const getStorageDocuments = (): BTPDocument[] => {
  try {
    const saved = localStorage.getItem(KEYS.DOCUMENTS);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error loading documents from storage', e);
  }
  return INITIAL_DOCUMENTS;
};

export const setStorageDocuments = (docs: BTPDocument[]) => {
  try {
    localStorage.setItem(KEYS.DOCUMENTS, JSON.stringify(docs));
  } catch (e) {
    console.error('Error saving documents', e);
  }
};

export const getStorageMaterials = (): MaterialItem[] => {
  try {
    const saved = localStorage.getItem(KEYS.MATERIALS);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error loading materials', e);
  }
  return INITIAL_MATERIALS;
};

export const setStorageMaterials = (materials: MaterialItem[]) => {
  try {
    localStorage.setItem(KEYS.MATERIALS, JSON.stringify(materials));
  } catch (e) {
    console.error('Error saving materials', e);
  }
};

export const getStorageClients = (): Client[] => {
  try {
    const saved = localStorage.getItem(KEYS.CLIENTS);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error loading clients', e);
  }
  return INITIAL_CLIENTS;
};

export const setStorageClients = (clients: Client[]) => {
  try {
    localStorage.setItem(KEYS.CLIENTS, JSON.stringify(clients));
  } catch (e) {
    console.error('Error saving clients', e);
  }
};

// Sync queue tracking
export const getSyncQueue = (): SyncRecord[] => {
  try {
    const saved = localStorage.getItem(KEYS.SYNC_QUEUE);
    if (saved) return JSON.parse(saved);
  } catch {
    return [];
  }
  return [];
};

export const clearSyncQueue = () => {
  localStorage.setItem(KEYS.SYNC_QUEUE, JSON.stringify([]));
  localStorage.setItem(KEYS.LAST_SYNC, new Date().toISOString());
};

export const getLastSyncTime = (): string | null => {
  return localStorage.getItem(KEYS.LAST_SYNC);
};

export const trackChange = (
  entityType: 'document' | 'client' | 'material' | 'company',
  action: 'create' | 'update' | 'delete',
  data: any
) => {
  const queue = getSyncQueue();
  const record: SyncRecord = {
    id: 'sync-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    action,
    entityType,
    data,
    timestamp: new Date().toISOString()
  };
  queue.push(record);
  localStorage.setItem(KEYS.SYNC_QUEUE, JSON.stringify(queue));
};

// Backup Export & Import
export const exportBackupJSON = (
  company: CompanyInfo,
  documents: BTPDocument[],
  materials: MaterialItem[],
  clients: Client[]
) => {
  const backupData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    appName: 'BatiDevis Express',
    company,
    documents,
    materials,
    clients
  };

  const jsonStr = JSON.stringify(backupData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateFormatted = new Date().toISOString().split('T')[0];
  a.href = url;
  a.download = `Sauvegarde_BatiDevis_${company.name.replace(/[^a-zA-Z0-9]/g, '_')}_${dateFormatted}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importBackupJSON = (jsonString: string): {
  success: boolean;
  company?: CompanyInfo;
  documents?: BTPDocument[];
  materials?: MaterialItem[];
  clients?: Client[];
  error?: string;
} => {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || (!parsed.documents && !parsed.company)) {
      return { success: false, error: 'Fichier de sauvegarde non valide ou corrompu.' };
    }

    const company = parsed.company || getStorageCompany();
    const documents = Array.isArray(parsed.documents) ? parsed.documents : getStorageDocuments();
    const materials = Array.isArray(parsed.materials) ? parsed.materials : getStorageMaterials();
    const clients = Array.isArray(parsed.clients) ? parsed.clients : getStorageClients();

    setStorageCompany(company);
    setStorageDocuments(documents);
    setStorageMaterials(materials);
    setStorageClients(clients);

    return {
      success: true,
      company,
      documents,
      materials,
      clients
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Erreur lors du décodage du fichier JSON' };
  }
};
