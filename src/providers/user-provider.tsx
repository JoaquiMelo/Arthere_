import React, { createContext, useState, useContext } from 'react';
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

  // Simula o login sem precisar do banco
  const login = async (email: string, senha: string) => {
    // Aceita qualquer e-mail/senha digitados para a apresentação
    setUser({
      ...MOCK_USUARIO_LOGADO,
      email: email || MOCK_USUARIO_LOGADO.email,
    });
    return true;
  };

  // Atualiza o perfil em memória durante o uso do app
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
