// src/context/AuthContext.tsx
import { createContext, useEffect, useState, useContext } from 'react';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>; // <- ESSENCIAL!
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (token: string): Promise<void> => {
    try {
      const response = await fetch('https://api.twitch.tv/helix/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Client-Id': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!
        }
      });

      const data = await response.json();
      if (data.data && data.data[0]) {
        setUser(data.data[0]);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(data.data[0]));
        localStorage.setItem('token', token);
      } else {
        console.error('Erro ao buscar dados da Twitch:', data);
      }
    } catch (err) {
      console.error('Erro na função login:', err);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
};
