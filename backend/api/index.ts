import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const prisma = new PrismaClient();

// Permite chamadas do frontend hospedado na Vercel e do localhost
app.use(cors({
  origin: ['https://techtennis-web.vercel.app', 'http://localhost:5173']
}));
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Cadastro genérico (Professor ou Cliente)
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, phone, role, experience, training } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'E-mail indisponível.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role === 'PROFESSOR' ? 'PROFESSOR' : 'CLIENTE';
    
    // Status pendente padrão por segurança
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        role: userRole,
        status: 'pending',
        experience: userRole === 'PROFESSOR' ? experience : null,
        training: userRole === 'PROFESSOR' ? training : null
      }
    });

    res.status(201).json({ message: 'Conta criada com sucesso e aguardando aprovação.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno ao criar conta.' });
  }
});

// Autenticação (Login)
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ error: 'Sua conta está bloqueada.' });
    }

    if (user.status === 'pending') {
      if (user.role === 'CLIENTE') {
        return res.status(403).json({ error: 'Por favor, confirme seu e-mail no link que enviamos.' });
      }
      return res.status(403).json({ error: 'Sua conta de professor está aguardando aprovação administrativa.' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' } // Expira em 7 dias
    );

    // Esconde a senha no retorno
    const { password: _, ...userWithoutPass } = user;
    
    res.json({ token, user: userWithoutPass });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro no servidor durante login.' });
  }
});

// Rota temporária de backend para promoção segura local (remover depois)
app.get('/api/auth/promote-admin', async (req, res) => {
  const email = req.query.email;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email missing' });
  }
  const user = await prisma.user.update({
    where: { email },
    data: { role: 'ADMIN', status: 'active'}
  });
  res.json({ success: true, user: user.email, role: user.role });
});

app.get('/api/health', (req, res) => {
  res.json({ message: 'TechTennis API is healthy and connected to Neon!', env: process.env.NODE_ENV });
});

export default app;
