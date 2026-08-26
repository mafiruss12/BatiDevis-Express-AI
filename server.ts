import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Server-side database directory
const DATA_DIR = path.join(process.cwd(), ".data");
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) {
    console.error("Could not create data dir", e);
  }
}

const SERVER_STORE_FILE = path.join(DATA_DIR, "batidevis_store.json");

// Helper to read server data
function readServerStore() {
  try {
    if (fs.existsSync(SERVER_STORE_FILE)) {
      const data = fs.readFileSync(SERVER_STORE_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error reading server store", e);
  }
  return {
    company: null,
    documents: [],
    materials: [],
    clients: [],
    lastSyncTimestamp: new Date().toISOString(),
  };
}

// Helper to write server data
function writeServerStore(data: any) {
  try {
    fs.writeFileSync(SERVER_STORE_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing server store", e);
  }
}

// ================= API ROUTES =================

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Full Cloud Sync (Push & Pull)
app.post("/api/sync", (req, res) => {
  try {
    const { company, documents, materials, clients, syncQueue, clientLastSync } = req.body;
    const serverStore = readServerStore();

    // If client provided data, update server store
    if (company) serverStore.company = company;
    if (Array.isArray(documents) && documents.length > 0) {
      serverStore.documents = documents;
    }
    if (Array.isArray(materials) && materials.length > 0) {
      serverStore.materials = materials;
    }
    if (Array.isArray(clients) && clients.length > 0) {
      serverStore.clients = clients;
    }

    serverStore.lastSyncTimestamp = new Date().toISOString();
    writeServerStore(serverStore);

    res.json({
      success: true,
      syncedAt: serverStore.lastSyncTimestamp,
      serverData: {
        company: serverStore.company,
        documents: serverStore.documents,
        materials: serverStore.materials,
        clients: serverStore.clients,
      },
      message: "Synchronisation réussie avec le serveur cloud.",
    });
  } catch (error: any) {
    console.error("Sync API error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get Server Snapshot
app.get("/api/sync/snapshot", (req, res) => {
  try {
    const serverStore = readServerStore();
    res.json({
      success: true,
      data: serverStore,
      lastSyncTimestamp: serverStore.lastSyncTimestamp,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start Server with Vite Middleware
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`BatiDevis Express running on http://0.0.0.0:${PORT}`);
  });
}

start();
