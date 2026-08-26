import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { DocumentListView } from './components/DocumentListView';
import { DocumentEditorView } from './components/DocumentEditorView';
import { DocumentPrintView } from './components/DocumentPrintView';
import { MaterialsCatalogView } from './components/MaterialsCatalogView';
import { ClientsView } from './components/ClientsView';
import { CompanySettingsView } from './components/CompanySettingsView';
import { SyncBackupView } from './components/SyncBackupView';

import { 
  BTPDocument, 
  CompanyInfo, 
  MaterialItem, 
  Client, 
  DocumentType 
} from './types';
import { 
  getStorageCompany, 
  setStorageCompany, 
  getStorageDocuments, 
  setStorageDocuments, 
  getStorageMaterials, 
  setStorageMaterials, 
  getStorageClients, 
  setStorageClients,
  getSyncQueue,
  clearSyncQueue,
  getLastSyncTime,
  trackChange
} from './utils/storage';
import { INITIAL_MATERIALS } from './data/initialData';
import { getNextDocNumber } from './utils/formatters';

type TabType = 'documents' | 'editor' | 'preview' | 'materials' | 'clients' | 'company' | 'sync';

export function App() {
  // App State Hydration
  const [company, setCompany] = useState<CompanyInfo>(getStorageCompany);
  const [documents, setDocuments] = useState<BTPDocument[]>(getStorageDocuments);
  const [materials, setMaterials] = useState<MaterialItem[]>(getStorageMaterials);
  const [clients, setClients] = useState<Client[]>(getStorageClients);

  // Navigation & View States
  const [currentTab, setCurrentTab] = useState<TabType>('documents');
  const [editingDocument, setEditingDocument] = useState<BTPDocument | null>(null);
  const [selectedDocumentForPrint, setSelectedDocumentForPrint] = useState<BTPDocument | null>(null);
  const [defaultEditorType, setDefaultEditorType] = useState<DocumentType>('quote');

  // Network & Sync States
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(() => getSyncQueue().length);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(getLastSyncTime);

  // Refresh pending count
  const refreshPendingCount = useCallback(() => {
    setPendingSyncCount(getSyncQueue().length);
  }, []);

  // Server Sync Function
  const syncWithServer = useCallback(async () => {
    if (!navigator.onLine) {
      setIsOnline(false);
      return;
    }

    setIsSyncing(true);
    try {
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company,
          documents,
          materials,
          clients,
          syncQueue: getSyncQueue(),
          clientLastSync: lastSyncTime
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          clearSyncQueue();
          setLastSyncTime(data.syncedAt);
          refreshPendingCount();

          // If server had records, we can keep them in sync
          if (data.serverData?.documents && data.serverData.documents.length > 0) {
            // Update syncStatus of docs
            const syncedDocs = documents.map(d => ({ ...d, syncStatus: 'synced' as const }));
            setDocuments(syncedDocs);
            setStorageDocuments(syncedDocs);
          }
        }
      }
    } catch (e) {
      console.warn("Backend sync offline or unavailable", e);
    } finally {
      setIsSyncing(false);
    }
  }, [company, documents, materials, clients, lastSyncTime, refreshPendingCount]);

  // Online / Offline Listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncWithServer();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial background sync check
    if (navigator.onLine) {
      syncWithServer();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncWithServer]);

  // Document Handlers
  const handleNewDocument = (type: DocumentType = 'quote') => {
    setDefaultEditorType(type);
    setEditingDocument(null);
    setCurrentTab('editor');
  };

  const handleEditDocument = (doc: BTPDocument) => {
    setEditingDocument(doc);
    setDefaultEditorType(doc.type);
    setCurrentTab('editor');
  };

  const handleSelectDocumentForPrint = (doc: BTPDocument) => {
    setSelectedDocumentForPrint(doc);
    setCurrentTab('preview');
  };

  const handleSaveDocument = (docToSave: BTPDocument, andPrint: boolean = false) => {
    const existingIdx = documents.findIndex(d => d.id === docToSave.id);
    let updatedDocs: BTPDocument[];

    if (existingIdx >= 0) {
      updatedDocs = [...documents];
      updatedDocs[existingIdx] = docToSave;
      trackChange('document', 'update', docToSave);
    } else {
      updatedDocs = [docToSave, ...documents];
      trackChange('document', 'create', docToSave);
    }

    setDocuments(updatedDocs);
    setStorageDocuments(updatedDocs);
    refreshPendingCount();

    if (andPrint) {
      setSelectedDocumentForPrint(docToSave);
      setCurrentTab('preview');
    } else {
      setCurrentTab('documents');
    }

    if (navigator.onLine) {
      syncWithServer();
    }
  };

  const handleDeleteDocument = (id: string) => {
    const updatedDocs = documents.filter(d => d.id !== id);
    setDocuments(updatedDocs);
    setStorageDocuments(updatedDocs);
    trackChange('document', 'delete', { id });
    refreshPendingCount();
    if (navigator.onLine) syncWithServer();
  };

  const handleDuplicateDocument = (doc: BTPDocument) => {
    const nextDocNum = getNextDocNumber(doc.type, documents);
    const duplicated: BTPDocument = {
      ...doc,
      id: 'doc-' + Date.now(),
      docNumber: nextDocNum,
      title: `${doc.title} (Copie)`,
      date: new Date().toISOString().split('T')[0],
      status: 'draft',
      signatureClient: undefined,
      signatureDate: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      syncStatus: 'pending'
    };

    const updatedDocs = [duplicated, ...documents];
    setDocuments(updatedDocs);
    setStorageDocuments(updatedDocs);
    trackChange('document', 'create', duplicated);
    refreshPendingCount();
    setEditingDocument(duplicated);
    setCurrentTab('editor');
  };

  const handleConvertToInvoice = (quoteDoc: BTPDocument) => {
    const nextInvoiceNum = getNextDocNumber('invoice', documents);
    const invoiceDoc: BTPDocument = {
      ...quoteDoc,
      id: 'doc-' + Date.now(),
      type: 'invoice',
      docNumber: nextInvoiceNum,
      title: `Facture — ${quoteDoc.title}`,
      date: new Date().toISOString().split('T')[0],
      validityDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      status: 'sent',
      convertedFromQuoteId: quoteDoc.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      syncStatus: 'pending'
    };

    // Mark original quote as accepted
    const updatedDocs = documents.map(d => {
      if (d.id === quoteDoc.id) {
        return { ...d, status: 'accepted' as const, convertedToInvoiceId: invoiceDoc.id };
      }
      return d;
    });

    const finalDocs = [invoiceDoc, ...updatedDocs];
    setDocuments(finalDocs);
    setStorageDocuments(finalDocs);
    trackChange('document', 'create', invoiceDoc);
    refreshPendingCount();
    
    setSelectedDocumentForPrint(invoiceDoc);
    setCurrentTab('preview');
  };

  // Company Settings Handlers
  const handleSaveCompany = (updated: CompanyInfo) => {
    setCompany(updated);
    setStorageCompany(updated);
    refreshPendingCount();
    if (navigator.onLine) syncWithServer();
  };

  // Material Catalog Handlers
  const handleSaveMaterial = (material: MaterialItem) => {
    const existingIdx = materials.findIndex(m => m.id === material.id);
    let updatedMaterials: MaterialItem[];
    if (existingIdx >= 0) {
      updatedMaterials = [...materials];
      updatedMaterials[existingIdx] = material;
      trackChange('material', 'update', material);
    } else {
      updatedMaterials = [material, ...materials];
      trackChange('material', 'create', material);
    }
    setMaterials(updatedMaterials);
    setStorageMaterials(updatedMaterials);
    refreshPendingCount();
    if (navigator.onLine) syncWithServer();
  };

  const handleDeleteMaterial = (id: string) => {
    const updated = materials.filter(m => m.id !== id);
    setMaterials(updated);
    setStorageMaterials(updated);
    trackChange('material', 'delete', { id });
    refreshPendingCount();
    if (navigator.onLine) syncWithServer();
  };

  const handleResetMaterials = () => {
    setMaterials(INITIAL_MATERIALS);
    setStorageMaterials(INITIAL_MATERIALS);
    trackChange('material', 'update', INITIAL_MATERIALS);
    refreshPendingCount();
    if (navigator.onLine) syncWithServer();
  };

  // Client Handlers
  const handleSaveClient = (client: Client) => {
    const existingIdx = clients.findIndex(c => c.id === client.id);
    let updatedClients: Client[];
    if (existingIdx >= 0) {
      updatedClients = [...clients];
      updatedClients[existingIdx] = client;
      trackChange('client', 'update', client);
    } else {
      updatedClients = [client, ...clients];
      trackChange('client', 'create', client);
    }
    setClients(updatedClients);
    setStorageClients(updatedClients);
    refreshPendingCount();
    if (navigator.onLine) syncWithServer();
  };

  const handleDeleteClient = (id: string) => {
    const updated = clients.filter(c => c.id !== id);
    setClients(updated);
    setStorageClients(updated);
    trackChange('client', 'delete', { id });
    refreshPendingCount();
    if (navigator.onLine) syncWithServer();
  };

  const handleNewQuoteForClient = (client: Client) => {
    const newDoc: BTPDocument = {
      id: 'doc-' + Date.now(),
      type: 'quote',
      docNumber: getNextDocNumber('quote', documents),
      title: `Fourniture matériaux & travaux — ${client.name}`,
      date: new Date().toISOString().split('T')[0],
      validityDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      clientId: client.id,
      client,
      siteLocation: client.siteAddress || '',
      items: [
        {
          id: 'sec-1',
          type: 'section',
          title: 'I. FOURNITURE MATÉRIAUX & TRAVAUX',
          quantity: 1,
          unitPrice: 0,
          taxRate: 0,
          discountPercent: 0,
          totalHT: 0
        }
      ],
      globalDiscountPercent: 0,
      totalHT: 0,
      totalDiscount: 0,
      totalTax: 0,
      totalTTC: 0,
      advancePercent: company.defaultAdvancePercentage,
      advanceAmount: 0,
      amountPaid: 0,
      balanceDue: 0,
      status: 'draft',
      notes: 'Conditions standard de chantier.',
      paymentTerms: company.paymentTerms,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      syncStatus: 'pending'
    };

    setEditingDocument(newDoc);
    setDefaultEditorType('quote');
    setCurrentTab('editor');
  };

  // Restore Backup
  const handleRestoreBackup = (data: {
    company?: CompanyInfo;
    documents?: BTPDocument[];
    materials?: MaterialItem[];
    clients?: Client[];
  }) => {
    if (data.company) setCompany(data.company);
    if (data.documents) setDocuments(data.documents);
    if (data.materials) setMaterials(data.materials);
    if (data.clients) setClients(data.clients);
    refreshPendingCount();
    if (navigator.onLine) syncWithServer();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        company={company}
        isOnline={isOnline}
        isSyncing={isSyncing}
        pendingSyncCount={pendingSyncCount}
        onManualSync={syncWithServer}
        onNewDocument={handleNewDocument}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full">
        {currentTab === 'documents' && (
          <DocumentListView
            documents={documents}
            company={company}
            onNewDocument={handleNewDocument}
            onSelectDocumentForPrint={handleSelectDocumentForPrint}
            onEditDocument={handleEditDocument}
            onDeleteDocument={handleDeleteDocument}
            onDuplicateDocument={handleDuplicateDocument}
            onConvertToInvoice={handleConvertToInvoice}
          />
        )}

        {currentTab === 'editor' && (
          <DocumentEditorView
            initialDocument={editingDocument}
            defaultType={defaultEditorType}
            company={company}
            clients={clients}
            materials={materials}
            allDocuments={documents}
            onSave={handleSaveDocument}
            onCancel={() => setCurrentTab('documents')}
            onAddNewClient={handleSaveClient}
            onAddNewMaterial={handleSaveMaterial}
          />
        )}

        {currentTab === 'preview' && selectedDocumentForPrint && (
          <DocumentPrintView
            document={selectedDocumentForPrint}
            company={company}
            onBack={() => setCurrentTab('documents')}
            onEdit={handleEditDocument}
            onConvertToInvoice={handleConvertToInvoice}
            onSaveDocument={(updated) => {
              handleSaveDocument(updated, false);
              setSelectedDocumentForPrint(updated);
            }}
          />
        )}

        {currentTab === 'materials' && (
          <MaterialsCatalogView
            materials={materials}
            company={company}
            onSaveMaterial={handleSaveMaterial}
            onDeleteMaterial={handleDeleteMaterial}
            onResetMaterials={handleResetMaterials}
          />
        )}

        {currentTab === 'clients' && (
          <ClientsView
            clients={clients}
            documents={documents}
            company={company}
            onSaveClient={handleSaveClient}
            onDeleteClient={handleDeleteClient}
            onSelectDocumentForPrint={handleSelectDocumentForPrint}
            onNewQuoteForClient={handleNewQuoteForClient}
          />
        )}

        {currentTab === 'company' && (
          <CompanySettingsView
            company={company}
            onSaveCompany={handleSaveCompany}
          />
        )}

        {currentTab === 'sync' && (
          <SyncBackupView
            isOnline={isOnline}
            isSyncing={isSyncing}
            pendingSyncCount={pendingSyncCount}
            lastSyncTime={lastSyncTime}
            company={company}
            documents={documents}
            materials={materials}
            clients={clients}
            onManualSync={syncWithServer}
            onRestoreBackup={handleRestoreBackup}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        pendingSyncCount={pendingSyncCount}
      />

    </div>
  );
}

export default App;
