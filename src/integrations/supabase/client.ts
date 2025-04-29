
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { toast } from "@/components/ui/use-toast";

const SUPABASE_URL = "https://yxdxwfzkqyovznqjffcm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4ZHh3ZnprcXlvdnpucWpmZmNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjAyOTQsImV4cCI6MjA1OTI5NjI5NH0.sjSfb1r83h7jN-gXfQCOamYmLI5Gxuf3iP6pLaedT-4";

// Explicitly define the configuration object to avoid spread argument issues
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: localStorage,
    detectSessionInUrl: true
  },
  global: {
    fetch: (url: RequestInfo | URL, init?: RequestInit) => {
      return fetch(url, init).catch(err => {
        console.error("Network error during Supabase request:", err);
        if (!navigator.onLine) {
          toast({
            title: "You're offline",
            description: "Some features may be limited until your connection is restored",
            variant: "destructive"
          });
        }
        throw err;
      })
    }
  }
});

// Check connection status
let isOnline = navigator.onLine;
window.addEventListener('online', () => {
  if (!isOnline) {
    isOnline = true;
    toast({
      title: "You're back online",
      description: "Your data will now sync with the server"
    });
    // Trigger any sync operations here
    syncOfflineData();
  }
});

window.addEventListener('offline', () => {
  isOnline = false;
  toast({
    title: "You're offline",
    description: "Some features may be limited until your connection is restored",
    variant: "destructive"
  });
});

// Initialize IndexedDB for offline storage
let offlineDB: IDBDatabase | null = null;
const DB_VERSION = 1;
const DB_NAME = "matchmeadows_offline";

initOfflineDB();

async function initOfflineDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      console.error("IndexedDB error:", event);
      reject("IndexedDB access denied");
    };
    
    request.onsuccess = (event) => {
      offlineDB = (event.target as IDBOpenDBRequest).result;
      console.log("IndexedDB initialized for offline storage");
      resolve(offlineDB);
    };
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create stores for offline data
      if (!db.objectStoreNames.contains("messages")) {
        db.createObjectStore("messages", { keyPath: "id" });
      }
      
      if (!db.objectStoreNames.contains("profile_updates")) {
        db.createObjectStore("profile_updates", { keyPath: "timestamp" });
      }
      
      if (!db.objectStoreNames.contains("reports")) {
        db.createObjectStore("reports", { keyPath: "id" });
      }
    };
  });
}

// Store data offline when needed
export async function storeOfflineData(storeName: string, data: any) {
  if (!offlineDB) await initOfflineDB();
  
  return new Promise((resolve, reject) => {
    try {
      const transaction = offlineDB!.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.put(data);
      
      request.onsuccess = () => resolve(true);
      request.onerror = (event) => {
        console.error(`Error storing offline data in ${storeName}:`, event);
        reject(event);
      };
    } catch (error) {
      console.error("Failed to store offline data:", error);
      reject(error);
    }
  });
}

// Retrieve offline data
export async function getOfflineData(storeName: string): Promise<any[]> {
  if (!offlineDB) await initOfflineDB();
  
  return new Promise((resolve, reject) => {
    try {
      const transaction = offlineDB!.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => {
        console.error(`Error retrieving offline data from ${storeName}:`, event);
        reject(event);
      };
    } catch (error) {
      console.error("Failed to retrieve offline data:", error);
      reject([]);
    }
  });
}

// Clear specific offline data
export async function clearOfflineData(storeName: string, key: string | number) {
  if (!offlineDB) await initOfflineDB();
  
  return new Promise((resolve, reject) => {
    try {
      const transaction = offlineDB!.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);
      
      request.onsuccess = () => resolve(true);
      request.onerror = (event) => {
        console.error(`Error clearing offline data from ${storeName}:`, event);
        reject(event);
      };
    } catch (error) {
      console.error("Failed to clear offline data:", error);
      reject(error);
    }
  });
}

// Sync offline data when connection is restored
async function syncOfflineData() {
  try {
    console.log("Started syncing offline data");
    
    // Sync profile updates
    const profileUpdates = await getOfflineData("profile_updates");
    for (const update of profileUpdates) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update(update.data)
          .eq('id', update.userId);
          
        if (!error) {
          await clearOfflineData("profile_updates", update.timestamp);
        }
      } catch (err) {
        console.error("Error syncing profile update:", err);
      }
    }
    
    console.log("Offline data sync completed");
  } catch (error) {
    console.error("Error during offline data sync:", error);
  }
}

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}
