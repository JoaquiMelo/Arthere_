import React, { createContext, useContext, useState } from "react";
import { MOCK_USUARIO_LOGADO } from "../shared/data/mock-data";

export type TipoUsuario = "AGENTE" | "CONTRATANTE" | "ADMIN";

export interface LocalUser {
  id: string;
  documento?: string;
  nome: string;
  nomeSocial?: string;
  pronomes?: string;
  email: string;
  tipo: TipoUsuario;
  especialidade?: string;
  cidade?: string;
  latitude?: number;
  longitude?: number;
  bio?: string;
  telefone?: string;
  foto?: string;
  avatarUrl?: string;
  empresa?: string;
  descricao?: string;
  site?: string;
  endereco?: string;
  categoria?: string;
}

interface UserContextType {
  user: LocalUser;
  login: (email: string, senha: string) => Promise<boolean>;
  updateProfile: (dados: Partial<LocalUser>) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<LocalUser>(MOCK_USUARIO_LOGADO as LocalUser);
  const [registeredUser, setRegisteredUser] = useState<LocalUser | null>(null);

  const login = async (email: string, _senha: string) => {
    const emailNormalizado = email.trim().toLowerCase();

    if (
      registeredUser &&
      registeredUser.email.toLowerCase() === emailNormalizado
    ) {
      setUser(registeredUser);
      return true;
    }

    setUser((prev) => ({
      ...prev,
      id: prev.id || "local-user",
      email: emailNormalizado,
    }));

    return true;
  };

  const updateProfile = (dados: Partial<LocalUser>) => {
    setUser((prev) => {
      const atualizado = { ...prev, ...dados };
      setRegisteredUser(atualizado);
      return atualizado;
    });
  };

  const logout = () => {
    setUser(MOCK_USUARIO_LOGADO as LocalUser);
  };

  return (
    <UserContext.Provider value={{ user, login, updateProfile, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
