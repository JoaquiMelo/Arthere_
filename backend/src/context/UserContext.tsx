import React, { createContext, useContext, useState } from 'react';

// ─── Tipo do usuário logado ───────────────────────────────────────────────────
export interface UsuarioLogado {
  nome: string;
  especialidade: string;
  bio: string;
  cidade: string;
  avatarUrl: string;
  // Coordenadas que aparecem no mapa
  latitude: number;
  longitude: number;
  // Visível no mapa?
  visivelNoMapa: boolean;
}

interface UserContextType {
  usuario: UsuarioLogado;
  atualizarUsuario: (dados: Partial<UsuarioLogado>) => void;
}

// ─── Dados iniciais (mock — futuramente vem da API) ──────────────────────────
const dadosIniciais: UsuarioLogado = {
  nome: '',
  especialidade: '',
  bio: '',
  cidade: '',
  avatarUrl: '',
  latitude: -23.555,
  longitude: -46.67,
  visivelNoMapa: false,
};

const UserContext = createContext<UserContextType>({} as UserContextType);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioLogado>(dadosIniciais);

  function atualizarUsuario(dados: Partial<UsuarioLogado>) {
    setUsuario((prev) => ({ ...prev, ...dados }));
  }

  return (
    <UserContext.Provider value={{ usuario, atualizarUsuario }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUsuario() {
  return useContext(UserContext);
}
