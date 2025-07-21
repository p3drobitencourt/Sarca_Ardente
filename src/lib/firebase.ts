// lib/firebase.ts

// Importe as funções que você precisa dos SDKs
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Importe o Firestore
import { getAuth } from "firebase/auth"; // Importe o Auth

// TODO: Adicione os SDKs para os produtos do Firebase que você quer usar
// https://firebase.google.com/docs/web/setup#available-libraries

// ADICIONE ESTA LINHA PARA TESTE
console.log("Variável de Ambiente API Key:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

// A configuração do Firebase do seu app web (COPIE DO SEU CONSOLE DO FIREBASE)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Inicialize o Firebase de forma segura (evita reinicializar no Next.js)
// Se nenhum app foi inicializado, inicialize um. Senão, pegue o app já existente.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inicialize o Cloud Firestore e exporte-o
const db = getFirestore(app);

const auth = getAuth(app); // Inicialize o Auth

// Exporte as instâncias que você vai precisar em outras partes do seu app
export { app, db , auth};