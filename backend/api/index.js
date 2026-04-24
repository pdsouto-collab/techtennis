const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Client } = require('pg');

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

// ==========================================
// API RESTful: JOBS (SERVIÇOS DA AGENDA)
// ==========================================

// Middleware para verificar TOKEN
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token não fornecido.' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido/expirado.' });
    req.user = user;
    next();
  });
};

app.get('/api/jobs', authenticateToken, async (req, res) => {
  const db = getDB();
  try {
    await db.connect();
    // Exemplo Simples: Retorna todos os jobs
    // Num sistema real filtraríamos por cargo, permissão, etc.
    const result = await db.query('SELECT * FROM "Job" ORDER BY "createdAt" DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno ao buscar Jobs.' });
  } finally {
    await db.end();
  }
});

app.post('/api/jobs', authenticateToken, async (req, res) => {
  const { customerId, customerNameAlias, racketModel, type, tension, price, stringMains, stringCross } = req.body;
  const db = getDB();
  try {
    await db.connect();
    const insertQ = `
      INSERT INTO "Job" 
      ("id", "customerId", "customerNameAlias", "racketModel", "type", "tension", "price", "status", "stringMains", "stringCross", "createdAt", "updatedAt")
      VALUES 
      (gen_random_uuid(), $1, $2, $3, $4, $5, $6, 'Pendente', $7, $8, NOW(), NOW())
      RETURNING *
    `;
    // Se o customerId vier vazio do front, usar string fallback temporario
    const cId = customerId || 'temp_cust_id';
    const result = await db.query(insertQ, [
      cId, customerNameAlias || 'Desconhecido', racketModel || 'N/A', type || 'encordoamento', tension, price || 0, stringMains, stringCross
    ]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar o serviço.' });
  } finally {
    await db.end();
  }
});

app.put('/api/jobs/:id/status', authenticateToken, async (req, res) => {
  const { status } = req.body;
  const jobId = req.params.id;
  const db = getDB();
  try {
    await db.connect();
    const updateQ = `UPDATE "Job" SET status=$1, "updatedAt"=NOW() WHERE id=$2 RETURNING *`;
    const result = await db.query(updateQ, [status, jobId]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Serviço não encontrado.' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar status do Job.' });
  } finally {
    await db.end();
  }
});

app.delete('/api/jobs/:id', authenticateToken, async (req, res) => {
  const jobId = req.params.id;
  const db = getDB();
  try {
    await db.connect();
    const result = await db.query('DELETE FROM "Job" WHERE id=$1 RETURNING id', [jobId]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Serviço não encontrado.' });
    res.json({ message: 'Deletado com sucesso.', id: jobId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar o serviço.' });
  } finally {
    await db.end();
  }
});

module.exports = app;
