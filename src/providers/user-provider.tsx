import React, { createContext, useState, useContext } from 'react';
import { login as loginAccount } from '../services/api';
import { MOCK_USUARIO_LOGADO } from '../shared/data/mock-data';

interface UserContextType {
  user: typeof MOCK_USUARIO_LOGADO;
  login: (email: string, senha: string) => Promise<boolean>;
  updateProfile: (dados: Partial<typeof MOCK_USUARIO_LOGADO>) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState(MOCK_USUARIO_LOGADO);

  const login = async (email: string, senha: string) => {
    const result = await loginAccount(email.trim(), senha);
    const perfil = result.usuario.perfil as Partial<typeof MOCK_USUARIO_LOGADO> | null;

    setUser((prev) => ({
      ...prev,
      id: result.usuario.id,
      email: result.usuario.email,
      tipo: result.usuario.tipo,
      ...(perfil ?? {}),
    }));

    return true;
  };

  const updateProfile = (dados: Partial<typeof MOCK_USUARIO_LOGADO>) => {
    setUser((prev) => ({ ...prev, ...dados }));
  };

  const logout = () => {
    setUser(MOCK_USUARIO_LOGADO);
  };

  return (
    <UserContext.Provider value={{ user, login, updateProfile, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
