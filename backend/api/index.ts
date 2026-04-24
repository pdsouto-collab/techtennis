import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Client } from 'pg';

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Cria o driver PG para contornar limitacoes do Prisma binario no Vercel Node
function getDB() {
  return new Client({
    connectionString: process.env.DATABASE_URL
  });
}

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, phone, role, experience, training } = req.body;
  const db = getDB();
  try {
    await db.connect();
    // 1. Verifica se ja existe
    const exists = await db.query('SELECT id FROM "User" WHERE email = $1', [email]);
    if (exists.rows.length > 0) {
      return res.status(400).json({ error: 'E-mail já está em uso.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role || 'CLIENTE';
    const finalStatus = userRole === 'PROFESSOR' ? 'pending' : 'active';

    const insertQ = `
      INSERT INTO "User" (name, email, password, phone, role, status, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING id, name, email, role, status
    `;
    const inserted = await db.query(insertQ, [name, email, hashedPassword, phone, userRole, finalStatus]);
    const newUser = inserted.rows[0];

    res.status(201).json({ message: 'Conta criada com sucesso!', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno ao criar conta.' });
  } finally {
    await db.end();
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const db = getDB();
  try {
    await db.connect();
    const result = await db.query('SELECT * FROM "User" WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }
    if (user.status === 'pending') {
      return res.status(403).json({ error: 'Seu cadastro está em análise. Você receberá um e-mail de confirmação em breve.' });
    }
    if (user.status === 'inactive') {
      return res.status(403).json({ error: 'Acesso bloqueado. Contate o administrador.' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPass } = user;
    res.json({ token, user: userWithoutPass });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro no servidor durante login.' });
  } finally {
    await db.end();
  }
});

app.get('/api/auth/promote-admin', async (req, res) => {
  const email = req.query.email;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email missing' });
  }
  const db = getDB();
  try {
    await db.connect();
    await db.query('UPDATE "User" SET role=$1, status=$2 WHERE email=$3', ['ADMIN', 'active', email]);
    res.json({ success: true, user: email, role: 'ADMIN' });
  } catch(e) {
    res.status(500).json({ error: 'Promotion failed' });
  } finally {
    await db.end();
  }
});

app.get('/api/health', (req, res) => {
  res.json({ message: 'TechTennis API is healthy and connected to Neon!', env: process.env.NODE_ENV });
});

module.exports = app;
