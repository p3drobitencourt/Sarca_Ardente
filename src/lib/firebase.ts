// lib/firebase.ts

// Importe as funções que você precisa dos SDKs
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Importe o Firestore

// TODO: Adicione os SDKs para os produtos do Firebase que você quer usar
// https://firebase.google.com/docs/web/setup#available-libraries

// A configuração do Firebase do seu app web (COPIE DO SEU CONSOLE DO FIREBASE)
const firebaseConfig = {
  apiKey: "AIzaSyA3BA1XCTjk3gPFP9xgUk14ke8UMc0Rn9s",
  authDomain: "sarca-ardente.firebaseapp.com",
  projectId: "sarca-ardente",
  storageBucket: "sarca-ardente.firebasestorage.app",
  messagingSenderId: "540488094736",
  appId: "1:540488094736:web:4e124ebf75c22ff2732695"
};

// Inicialize o Firebase de forma segura (evita reinicializar no Next.js)
// Se nenhum app foi inicializado, inicialize um. Senão, pegue o app já existente.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inicialize o Cloud Firestore e exporte-o
const db = getFirestore(app);

// Exporte as instâncias que você vai precisar em outras partes do seu app
export { app, db };