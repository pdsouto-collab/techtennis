import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'ADMIN' | 'ENCORDOADOR' | 'PROFESSOR' | 'PROFESSOR_PREMIUM' | 'CLIENTE';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  status: 'active' | 'pending' | 'blocked';
  numericId?: number;
  phone?: string;
  yearsOfExperience?: string;
  trainingTypes?: string;
  photoUrl?: string;
}

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  login: (email: string, pass: string) => Promise<boolean | string>;
  logout: () => void;
  registerClient: (name: string, email: string, pass: string, phone: string) => void;
  registerProfessor: (name: string, email: string, pass: string, phone: string, experience: string, training: string) => void;
  updateUserStatus: (id: string, status: User['status'], role?: UserRole, numericId?: number) => void;
  deleteUser: (id: string) => void;
  adminCreateUser: (user: Partial<User>) => void;
  adminUpdateUser: (id: string, updates: Partial<User>) => void;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
}

const defaultUsers: User[] = [
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

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

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
      // Carrega lista atualizada do backend se tiver token
      const token = localStorage.getItem('tt_auth_token');
      if (token && (currentUser.role === 'ADMIN' || currentUser.role === 'ENCORDOADOR')) {
         fetch(`${API_URL}/api/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
         }).then(res => res.json()).then(data => {
            if (Array.isArray(data)) setUsers(data);
         }).catch(err => console.error('Erro ao buscar users:', err));
      }
    } else {
      localStorage.removeItem('tt_current_user');
    }
  }, [currentUser]);

  const login = async (email: string, pass: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      const data = await res.json();
      
      if (!res.ok) {
        return data.error || 'Falha na autenticação';
      }
      
      setCurrentUser(data.user);
      localStorage.setItem('tt_auth_token', data.token);
      
      // Sincronizar o usuário logado com a lista local
      setUsers(prev => {
        if (!prev.find(u => u.email === data.user.email)) {
           return [...prev, data.user];
        }
        return prev.map(u => u.email === data.user.email ? data.user : u);
      });
      
      return true;
    } catch(err) {
      console.error(err);
      return 'Erro de conexão com o servidor';
    }
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

  const registerClient = async (name: string, email: string, pass: string, phone: string) => {
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
    
    // Disparo pro Servidor Vercel
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: pass, phone, role: 'CLIENTE' })
      });
      if (!res.ok) {
         const d = await res.json().catch(() => ({}));
         throw new Error(d.error || 'Erro Crítico no Banco de Dados (API).');
      }
    } catch(e: any) {
      console.error('Erro API:', e);
      throw e;
    }

    // ===== INTEGRAÇÃO DE ENVIO DE E-MAIL (EmailJS) =====
    // Para funcionar na vida real:
    // 1. Crie uma conta grátis em https://www.emailjs.com/ usando seu e-mail pessoal provisório.
    // 2. Adicione um "Email Service" (ex: Gmail).
    // 3. Crie um "Email Template" com um botão/link confirmando.
    // 4. Substitua suas chaves abaixo:
    const EMAILJS_SERVICE_ID = 'SEU_SERVICE_ID_AQUI';
    const EMAILJS_TEMPLATE_ID = 'SEU_TEMPLATE_ID_AQUI';
    const EMAILJS_PUBLIC_KEY = 'SUA_PUBLIC_KEY_AQUI';

    const confirmationLink = `${window.location.origin}${window.location.pathname}#/confirm?token=${newUser.id}`;

    try {
      if (EMAILJS_SERVICE_ID !== 'SEU_SERVICE_ID_AQUI') {
        await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service_id: EMAILJS_SERVICE_ID,
            template_id: EMAILJS_TEMPLATE_ID,
            user_id: EMAILJS_PUBLIC_KEY,
            template_params: {
              to_email: email,
              to_name: name,
              confirmation_link: confirmationLink
            }
          })
        });
        console.log("E-mail de confirmação disparado com sucesso para:", email);
      } else {
        console.warn("EmailJS não configurado. Simulação de envio para:", email);
        console.warn("Link de confirmação gerado:", confirmationLink);
      }
    } catch (err) {
      console.error("Erro ao enviar e-mail:", err);
    }
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

  const updateUserStatus = async (id: string, status: User['status'], role?: UserRole, numericId?: number) => {
    const userToUpdate = users.find(u => u.id === id);
    if (!userToUpdate) return;
    
    const updates = { status, ...(role ? { role } : {}), ...(numericId !== undefined ? { numericId } : {}) };
    const payload = { ...userToUpdate, ...updates };
    
    try {
      const res = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('tt_auth_token')}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(prev => prev.map(u => u.id === id ? data : u));
        
        if (status === 'active' && (data.role.includes('PROFESSOR') || data.role === 'ENCORDOADOR' || data.role === 'ADMIN')) {
           setTimeout(() => syncToProfessors(data), 100);
        }
        if (status === 'active' && data.role === 'CLIENTE') {
           setTimeout(() => syncToCustomers(data.name, data.email, data.phone || ''), 100);
        }
      } else {
        alert('Erro ao atualizar status.');
      }
    } catch(e) {
      console.error('Erro ao atualizar status', e);
    }
  };

  const adminUpdateUser = async (id: string, updates: Partial<User>) => {
    const userToUpdate = users.find(u => u.id === id);
    if (!userToUpdate) return;
    
    try {
      const res = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('tt_auth_token')}`
        },
        body: JSON.stringify({ ...userToUpdate, ...updates })
      });
      
      if (res.ok) {
        const data = await res.json();
        setUsers(prev => prev.map(u => u.id === id ? data : u));
        
        if (data.status === 'active' && (data.role.includes('PROFESSOR') || data.role === 'ENCORDOADOR' || data.role === 'ADMIN')) {
            setTimeout(() => syncToProfessors(data), 100);
        }
        if (data.status === 'active' && data.role === 'CLIENTE') {
            setTimeout(() => syncToCustomers(data.name, data.email, data.phone || ''), 100);
        }
      } else {
        const errData = await res.json();
        alert(errData.error || 'Erro ao atualizar usuário');
      }
    } catch(e) {
      console.error('Erro ao atualizar usuario', e);
      alert('Erro de conexão ao atualizar usuário');
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('tt_auth_token')}`
        }
      });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== id));
      } else {
        alert('Erro ao deletar usuário');
      }
    } catch(e) {
      console.error('Erro ao deletar usuario', e);
    }
  };

  const adminCreateUser = async (user: Partial<User>) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: user.name || '', 
          email: user.email || '', 
          password: user.password || '123', 
          phone: user.phone || '', 
          role: user.role || 'CLIENTE',
          status: user.status || 'active',
          numericId: user.numericId || null
        })
      });
      
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Erro ao criar usuário no banco.');
        return;
      }
      
      // Update local state exactly as DB returned
      setUsers(prev => [...prev, data.user]);
    } catch(e) {
      console.error('Erro ao salvar usuario no banco de dados', e);
      alert('Erro de conexão ao criar usuário');
    }
  };


  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('tt_auth_token')}`
        },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setCurrentUser(prev => prev ? { ...prev, ...updatedUser } : updatedUser);
        setUsers(prev => {
          if (!prev.find(u => u.email === updatedUser.email)) {
            return [...prev, updatedUser];
          }
          return prev.map(u => u.id === (currentUser?.id || updatedUser.id) || u.email === updatedUser.email ? { ...u, ...updatedUser } : u);
        });

        // Sincroniza dados com o cadastro central
        const oldEmail = currentUser?.email;
        if (updatedUser.role === 'CLIENTE') {
          const savedC = localStorage.getItem('tt_customers');
          if (savedC) {
            let customers = JSON.parse(savedC);
            let isUpdated = false;
            customers = customers.map((c: any) => {
              if (c.email === oldEmail || c.email === updatedUser.email) {
                isUpdated = true;
                return { ...c, name: updatedUser.name, email: updatedUser.email, phone: updatedUser.phone || c.phone };
              }
              return c;
            });
            if (isUpdated) {
              localStorage.setItem('tt_customers', JSON.stringify(customers));
              window.dispatchEvent(new StorageEvent('storage', { key: 'tt_customers', newValue: JSON.stringify(customers) }));
            }
          }
        } else if (updatedUser.role.includes('PROFESSOR') || updatedUser.role === 'ENCORDOADOR' || updatedUser.role === 'ADMIN') {
          const savedP = localStorage.getItem('tt_professors');
          if (savedP) {
            let professors = JSON.parse(savedP);
            let isUpdated = false;
            professors = professors.map((p: any) => {
              if (p.email === oldEmail || p.email === updatedUser.email) {
                isUpdated = true;
                return { ...p, name: updatedUser.name, email: updatedUser.email, phone: updatedUser.phone || p.phone };
              }
              return p;
            });
            if (isUpdated) {
              localStorage.setItem('tt_professors', JSON.stringify(professors));
              window.dispatchEvent(new StorageEvent('storage', { key: 'tt_professors', newValue: JSON.stringify(professors) }));
            }
          }
        }
        return true;
      }
      return false;
    } catch(e) {
      console.error(e);
      return false;
    }
  };

  return (

    <AuthContext.Provider value={{ currentUser, users, login, logout, registerClient, registerProfessor, updateUserStatus, deleteUser, adminCreateUser, adminUpdateUser, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
