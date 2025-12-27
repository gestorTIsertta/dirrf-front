import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.warn('[Firebase] Configuração incompleta. Verifique as variáveis de ambiente.');
}

function getFirebaseApp() {
  try {
    const existingApp = getApps().find(app => app.name === '[DEFAULT]' || !app.name);
    if (existingApp) {
      return existingApp;
    }
    return initializeApp(firebaseConfig);
  } catch (error) {
    console.error('Erro ao inicializar Firebase:', error);
    return initializeApp(firebaseConfig);
  }
}

export const firebaseApp = getFirebaseApp();
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

