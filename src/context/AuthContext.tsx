"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Loader } from '@/components/ui/loader'; // Usaremos seu loader!

// Define o tipo de dados que o contexto irá fornecer
interface AuthContextType {
  user: User | null;
}

// Cria o contexto
const AuthContext = createContext<AuthContextType>({ user: null });

// Cria o componente Provedor
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged é o observador que reage a mudanças de login/logout
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Limpa o observador quando o componente é desmontado
    return () => unsubscribe();
  }, []);

  // Enquanto verifica o usuário, mostra uma tela de carregamento global
  if (loading) {
    return (
      <div className="fixed inset-0 flex h-screen w-screen items-center justify-center bg-background">
        <Loader />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

// Cria um hook customizado para facilitar o uso do contexto
export const useAuth = () => {
  return useContext(AuthContext);
};
