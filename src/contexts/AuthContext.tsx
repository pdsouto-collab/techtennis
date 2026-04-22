import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'ADMIN' | 'ENCORDOADOR' | 'PROFESSOR' | 'PROFESSOR_PREMIUM' | 'CLIENTE';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  status: 'active' | 'pending' | 'blocked';
  phone?: string;
  yearsOfExperience?: string;
  trainingTypes?: string;
}

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  login: (email: string, pass: string) => boolean | string;
  logout: () => void;
  registerClient: (name: string, email: string, pass: string, phone: string) => void;
  registerProfessor: (name: string, email: string, pass: string, phone: string, experience: string, training: string) => void;
  updateUserStatus: (id: string, status: User['status'], role?: UserRole) => void;
  deleteUser: (id: string) => void;
  adminCreateUser: (user: Partial<User>) => void;
  adminUpdateUser: (id: string, updates: Partial<User>) => void;
}

const defaultUsers: User[] = [
  {
    id: 'master-admin',
    name: 'Administrador Oficial',
    email: 'admin@techtennis.com',
    password: 'admin',
    role: 'ADMIN',
    status: 'active'
  },
  {
    id: 'test-encordoador',
    name: 'Loja Encordoador',
    email: 'loja@techtennis.com',
    password: '123',
    role: 'ENCORDOADOR',
    status: 'active'
  },
  {
    id: 'test-professor',
    name: 'Professor Gustavo',
    email: 'guga@techtennis.com',
    password: '123',
    role: 'PROFESSOR_PREMIUM',
    status: 'active',
    yearsOfExperience: '15',
    trainingTypes: 'Competitivo, Infantil'
  },
  {
    id: 'test-cliente',
    name: 'Rafael Cliente',
    email: 'rafa@techtennis.com',
    password: '123',
    role: 'CLIENTE',
    status: 'active'
  }
];

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('tt_users');
    return saved ? JSON.parse(saved) : defaultUsers;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('tt_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('tt_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('tt_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('tt_current_user');
    }
  }, [currentUser]);

  const login = (email: string, pass: string) => {
    const u = users.find(x => x.email === email && x.password === pass);
    if (!u) return 'Credenciais inválidas';
    if (u.status === 'pending') return 'Aguardando aprovação do administrador. Prazo de até 48h.';
    if (u.status === 'blocked') return 'Conta bloqueada.';
    setCurrentUser(u);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const syncToCustomers = (name: string, email: string, phone: string) => {
    const savedC = localStorage.getItem('tt_customers');
    const customers = savedC ? JSON.parse(savedC) : [];
    if (!customers.find((c: any) => c.email === email)) {
      customers.push({
        id: 'c' + Date.now(),
        name,
        email,
        phone,
        customerType: 'PF',
        gender: '',
        birthDate: '',
        cpfCnpj: '',
        originClub: '',
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('tt_customers', JSON.stringify(customers));
      // Dispatch storage event so other components update if necessary
      window.dispatchEvent(new StorageEvent('storage', { key: 'tt_customers', newValue: JSON.stringify(customers) }));
    }
  };

  const syncToProfessors = (user: User) => {
    const savedP = localStorage.getItem('tt_professors');
    const professors = savedP ? JSON.parse(savedP) : [];
    if (!professors.find((p: any) => p.email === user.email)) {
      professors.push({
        id: 'p' + Date.now(),
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        yearsOfExperience: user.yearsOfExperience || '',
        trainingTypes: user.trainingTypes || '',
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('tt_professors', JSON.stringify(professors));
      window.dispatchEvent(new StorageEvent('storage', { key: 'tt_professors', newValue: JSON.stringify(professors) }));
    }
  };

  const registerClient = (name: string, email: string, pass: string, phone: string) => {
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password: pass,
      phone,
      role: 'CLIENTE',
      status: 'pending'
    };
    setUsers(prev => [...prev, newUser]);
  };

  const registerProfessor = (name: string, email: string, pass: string, phone: string, experience: string, training: string) => {
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password: pass,
      phone,
      role: 'PROFESSOR',
      status: 'pending',
      yearsOfExperience: experience,
      trainingTypes: training
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUserStatus = (id: string, status: User['status'], role?: UserRole) => {
    setUsers(prev => {
      const updated = prev.map(u => {
        if (u.id === id) {
          const mod = { ...u, status, ...(role ? { role } : {}) };
          if (status === 'active' && (mod.role.includes('PROFESSOR') || mod.role === 'ENCORDOADOR' || mod.role === 'ADMIN')) {
             setTimeout(() => syncToProfessors(mod), 100);
          }
          if (status === 'active' && mod.role === 'CLIENTE') {
             setTimeout(() => syncToCustomers(mod.name, mod.email, mod.phone || ''), 100);
          }
          return mod;
        }
        return u;
      });
      return updated;
    });
  };

  const adminUpdateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => {
        if (u.id === id) {
            const mod = { ...u, ...updates };
            if (mod.status === 'active' && (mod.role.includes('PROFESSOR') || mod.role === 'ENCORDOADOR' || mod.role === 'ADMIN')) {
                setTimeout(() => syncToProfessors(mod as User), 100);
            }
            if (mod.status === 'active' && mod.role === 'CLIENTE') {
                setTimeout(() => syncToCustomers(mod.name, mod.email, mod.phone || ''), 100);
            }
            return mod as User;
        }
        return u;
    }));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const adminCreateUser = (user: Partial<User>) => {
    const newUser: User = {
        id: Date.now().toString(),
        name: user.name || '',
        email: user.email || '',
        password: user.password || '123',
        phone: user.phone || '',
        role: user.role || 'CLIENTE',
        status: user.status || 'active'
    };
    setUsers(prev => [...prev, newUser]);
  };

  return (
    <AuthContext.Provider value={{ currentUser, users, login, logout, registerClient, registerProfessor, updateUserStatus, deleteUser, adminCreateUser, adminUpdateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
