import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfigBackoffice = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY_BACKOFFICE || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN_BACKOFFICE || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID_BACKOFFICE || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET_BACKOFFICE || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID_BACKOFFICE || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID_BACKOFFICE || '',
};

if (!firebaseConfigBackoffice.apiKey || !firebaseConfigBackoffice.projectId) {
  console.warn('[Firebase Backoffice] Configuração incompleta. Verifique as variáveis de ambiente.');
}

const BACKOFFICE_APP_NAME = 'backoffice';

function getBackofficeApp() {
  try {
    const existingApp = getApps().find(app => app.name === BACKOFFICE_APP_NAME);
    if (existingApp) {
      return existingApp;
    }
    return initializeApp(firebaseConfigBackoffice, BACKOFFICE_APP_NAME);
  } catch (error) {
    console.error('Erro ao inicializar Firebase Backoffice:', error);
    // Se falhar, tenta inicializar normalmente
    return initializeApp(firebaseConfigBackoffice, BACKOFFICE_APP_NAME);
  }
}

export const firebaseBackofficeApp = getBackofficeApp();
export const authBackoffice = getAuth(firebaseBackofficeApp);
export const dbBackoffice = getFirestore(firebaseBackofficeApp);

