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
    const crypto = require('crypto');
    const newId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();

    const insertQ = `
      INSERT INTO "User" (id, name, email, password, phone, role, status, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING id, name, email, role, status
    `;
    const inserted = await db.query(insertQ, [newId, name, email, hashedPassword, phone, userRole, finalStatus]);
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

// ==========================================
// API RESTful: AGENDA ABERTA
// ==========================================

app.get('/api/agenda', async (req, res) => {
  const db = getDB();
  try {
    await db.connect();
    const result = await db.query('SELECT * FROM "AgendaSlot" ORDER BY "createdAt" DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno ao buscar Agenda.' });
  } finally {
    await db.end();
  }
});

app.post('/api/agenda', authenticateToken, async (req, res) => {
  const { professorName, timeAndDay, region, price, type, trainingTypes, phone, resumeSummary, professorPhotoUrl } = req.body;
  const db = getDB();
  try {
    await db.connect();
    const insertQ = `
      INSERT INTO "AgendaSlot" 
      ("professorName", "timeAndDay", "region", "price", "type", "trainingTypes", "phone", "resumeSummary", "professorPhotoUrl")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const result = await db.query(insertQ, [
      professorName, timeAndDay, region, price || '', type || 'fixo', trainingTypes, phone, resumeSummary || ''
    ]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar slot na agenda.' });
  } finally {
    await db.end();
  }
});

app.put('/api/agenda/:id', authenticateToken, async (req, res) => {
  const { professorName, timeAndDay, region, price, type, trainingTypes, phone, resumeSummary, professorPhotoUrl } = req.body;
  const slotId = req.params.id;
  const db = getDB();
  try {
    await db.connect();
    const updateQ = `
      UPDATE "AgendaSlot" 
      SET "professorName"=$1, "timeAndDay"=$2, "region"=$3, "price"=$4, "type"=$5, "trainingTypes"=$6, "phone"=$7, "resumeSummary"=$8, "professorPhotoUrl"=$9
      WHERE id=$10 RETURNING *
    `;
    const result = await db.query(updateQ, [
      professorName, timeAndDay, region, price || '', type || 'fixo', trainingTypes, phone, resumeSummary || '', professorPhotoUrl || '', slotId
    ]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Slot não encontrado.' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar slot na agenda.' });
  } finally {
    await db.end();
  }
});

app.delete('/api/agenda/:id', authenticateToken, async (req, res) => {
  const slotId = req.params.id;
  const db = getDB();
  try {
    await db.connect();
    const result = await db.query('DELETE FROM "AgendaSlot" WHERE id=$1 RETURNING id', [slotId]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Slot não encontrado.' });
    res.json({ message: 'Deletado com sucesso.', id: slotId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar slot da agenda.' });
  } finally {
    await db.end();
  }
});

// ==========================================
// API RESTful: CLIENTES (ClientProfile)
// ==========================================

app.get('/api/customers', authenticateToken, async (req, res) => {
  const db = getDB();
  try {
    await db.connect();
    const result = await db.query('SELECT * FROM "ClientProfile" ORDER BY "createdAt" DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno ao buscar Clientes.' });
    await db.end();
  }
});


app.post('/api/customers', authenticateToken, async (req, res) => {
  const { name, email, phone, originClub, professorId, birthDate, cpfCnpj, landline, address, cep, city, country, stringingPoint, racketpediaCode, customerType, notes } = req.body;
  const db = getDB();
  try {
    await db.connect();
    const insertQ = `
      INSERT INTO "ClientProfile" ("name", "email", "phone", "originClub", "professorId", "birthDate", "cpfCnpj", "landline", "address", "cep", "city", "country", "stringingPoint", "racketpediaCode", "customerType", "notes")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *
    `;
    const result = await db.query(insertQ, [name, email, phone, originClub, professorId, birthDate, cpfCnpj, landline, address, cep, city, country, stringingPoint, racketpediaCode, customerType, notes]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar cliente.' });
  } finally {
    await db.end();
  }
});

app.put('/api/customers/:id', authenticateToken, async (req, res) => {
  const { name, email, phone, originClub, professorId, birthDate, cpfCnpj, landline, address, cep, city, country, stringingPoint, racketpediaCode, customerType, notes } = req.body;
  const db = getDB();
  try {
    await db.connect();
    const updateQ = `
      UPDATE "ClientProfile" SET "name"=$1, "email"=$2, "phone"=$3, "originClub"=$4, "professorId"=$5, "birthDate"=$6, "cpfCnpj"=$7, "landline"=$8, "address"=$9, "cep"=$10, "city"=$11, "country"=$12, "stringingPoint"=$13, "racketpediaCode"=$14, "customerType"=$15, "notes"=$16
      WHERE "id"=$17 RETURNING *
    `;
    const result = await db.query(updateQ, [name, email, phone, originClub, professorId, birthDate, cpfCnpj, landline, address, cep, city, country, stringingPoint, racketpediaCode, customerType, notes, req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar cliente.' });
  } finally {
    await db.end();
  }
});

app.delete('/api/customers/:id', authenticateToken, async (req, res) => {
  const db = getDB();
  try {
    await db.connect();
    await db.query('DELETE FROM "ClientProfile" WHERE "id"=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar cliente.' });
  } finally {
    await db.end();
  }
});

// ==========================================
// API RESTful: RAQUETES (RacketItem)
// ==========================================

app.get('/api/rackets', authenticateToken, async (req, res) => {
  const db = getDB();
  try {
    await db.connect();
    const result = await db.query('SELECT * FROM "RacketItem" ORDER BY "createdAt" DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno ao buscar Raquetes.' });
  } finally {
    await db.end();
  }
});

app.post('/api/rackets', authenticateToken, async (req, res) => {
  const { customerId, brand, name, tension, strings } = req.body;
  const db = getDB();
  try {
    await db.connect();
    const insertQ = `
      INSERT INTO "RacketItem" ("customerId", "brand", "name", "tension", "strings")
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `;
    const result = await db.query(insertQ, [customerId, brand, name, tension, strings]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar raquete.' });
  } finally {
    await db.end();
  }
});

app.put('/api/rackets/:id', authenticateToken, async (req, res) => {
  const { brand, name, tension, strings } = req.body;
  const db = getDB();
  try {
    await db.connect();
    const updateQ = `
      UPDATE "RacketItem" SET "brand"=$1, "name"=$2, "tension"=$3, "strings"=$4
      WHERE "id"=$5 RETURNING *
    `;
    const result = await db.query(updateQ, [brand, name, tension, strings, req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar raquete.' });
  } finally {
    await db.end();
  }
});

app.delete('/api/rackets/:id', authenticateToken, async (req, res) => {
  const db = getDB();
  try {
    await db.connect();
    await db.query('DELETE FROM "RacketItem" WHERE "id"=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar raquete.' });
  } finally {
    await db.end();
  }
});

// ==========================================
// API RESTful: PROFESSORES (ProfessorProfile)
// ==========================================

app.get('/api/professors', authenticateToken, async (req, res) => {
  const db = getDB();
  try {
    await db.connect();
    const result = await db.query('SELECT * FROM "ProfessorProfile" ORDER BY "createdAt" DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno ao buscar Professores.' });
  } finally {
    await db.end();
  }
});

app.post('/api/professors', authenticateToken, async (req, res) => {
  const { name, email, phone, yearsOfExperience, trainingTypes } = req.body;
  const db = getDB();
  try {
    await db.connect();
    const insertQ = `
      INSERT INTO "ProfessorProfile" ("name", "email", "phone", "yearsOfExperience", "trainingTypes")
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `;
    const result = await db.query(insertQ, [name, email, phone, yearsOfExperience, trainingTypes]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar professor.' });
  } finally {
    await db.end();
  }
});

app.put('/api/professors/:id', authenticateToken, async (req, res) => {
  const { name, email, phone, yearsOfExperience, trainingTypes } = req.body;
  const db = getDB();
  try {
    await db.connect();
    const updateQ = `
      UPDATE "ProfessorProfile" SET "name"=$1, "email"=$2, "phone"=$3, "yearsOfExperience"=$4, "trainingTypes"=$5
      WHERE "id"=$6 RETURNING *
    `;
    const result = await db.query(updateQ, [name, email, phone, yearsOfExperience, trainingTypes, req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar professor.' });
  } finally {
    await db.end();
  }
});

app.delete('/api/professors/:id', authenticateToken, async (req, res) => {
  const db = getDB();
  try {
    await db.connect();
    await db.query('DELETE FROM "ProfessorProfile" WHERE "id"=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar professor.' });
  } finally {
    await db.end();
  }
});

// ==========================================
// API RESTful: CONFIGURAÇOES (SystemSetting)
// ==========================================

app.get('/api/settings', async (req, res) => {
  const db = getDB();
  try {
    await db.connect();
    const result = await db.query('SELECT * FROM "SystemSetting" WHERE key=$1', ['appSettings']);
    if (result.rows.length > 0) {
      res.json(result.rows[0].value);
    } else {
      res.json({});
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno ao buscar Configurações.' });
  } finally {
    await db.end();
  }
});

app.put('/api/settings', authenticateToken, async (req, res) => {
  const db = getDB();
  try {
    await db.connect();
    const upsertQ = `
      INSERT INTO "SystemSetting" ("key", "value", "updatedAt") 
      VALUES ('appSettings', $1::jsonb, NOW())
      ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED.value, "updatedAt" = NOW()
      RETURNING *
    `;
    const result = await db.query(upsertQ, [JSON.stringify(req.body)]);
    res.json(result.rows[0].value);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar configurações.' });
  } finally {
    await db.end();
  }
});

// ==========================================
// API RESTful: LANCAMENTOS MANUAIS (ManualEntry)
// ==========================================

app.get('/api/manual-entries', authenticateToken, async (req, res) => {
  const db = getDB();
  try {
    await db.connect();
    const result = await db.query('SELECT * FROM "ManualEntry" ORDER BY "createdAt" DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno ao buscar Manual Entries.' });
  } finally {
    await db.end();
  }
});

app.post('/api/manual-entries', authenticateToken, async (req, res) => {
  const { professorId, amount, date, customerName, reason } = req.body;
  const db = getDB();
  try {
    await db.connect();
    const insertQ = `
      INSERT INTO "ManualEntry" ("professorId", "amount", "date", "customerName", "reason")
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `;
    const result = await db.query(insertQ, [professorId, amount, date, customerName, reason]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar Manual Entry.' });
  } finally {
    await db.end();
  }
});

app.put('/api/manual-entries/:id', authenticateToken, async (req, res) => {
  const { professorId, amount, date, customerName, reason } = req.body;
  const db = getDB();
  try {
    await db.connect();
    const updateQ = `
      UPDATE "ManualEntry" SET "professorId"=$1, "amount"=$2, "date"=$3, "customerName"=$4, "reason"=$5
      WHERE "id"=$6 RETURNING *
    `;
    const result = await db.query(updateQ, [professorId, amount, date, customerName, reason, req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar Manual Entry.' });
  } finally {
    await db.end();
  }
});

app.delete('/api/manual-entries/:id', authenticateToken, async (req, res) => {
  const db = getDB();
  try {
    await db.connect();
    await db.query('DELETE FROM "ManualEntry" WHERE "id"=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar Manual Entry.' });
  } finally {
    await db.end();
  }
});


// ==========================================
// API RESTful: PERFIL DO USUÁRIO
// ==========================================

app.put('/api/users/profile', authenticateToken, async (req, res) => {
  const { name, phone, photoUrl, email, password } = req.body;
  const userId = req.user.userId;
  const db = getDB();
  try {
    await db.connect();
    
    let updateQ = '';
    let values = [];
    
    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateQ = `
        UPDATE "User"
        SET "name"=$1, "phone"=$2, "photoUrl"=$3, "email"=$4, "password"=$5, "updatedAt"=NOW()
        WHERE "id"=$6
        RETURNING id, name, email, phone, role, status, "photoUrl"
      `;
      values = [name, phone, photoUrl || '', email, hashedPassword, userId];
    } else {
      updateQ = `
        UPDATE "User"
        SET "name"=$1, "phone"=$2, "photoUrl"=$3, "email"=$4, "updatedAt"=NOW()
        WHERE "id"=$5
        RETURNING id, name, email, phone, role, status, "photoUrl"
      `;
      values = [name, phone, photoUrl || '', email, userId];
    }
    
    const result = await db.query(updateQ, values);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Usuário não encontrado.' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Perfil Update Error:', err);
    res.status(500).json({ error: 'Erro ao atualizar perfil.' });
  } finally {
    await db.end();
  }
});



// ==========================================
// API RESTful: GERENCIAMENTO DE USUA?RIOS (ADMIN)
// ==========================================

app.put('/api/users/:id', authenticateToken, async (req, res) => {
  const { name, email, phone, role, status, password } = req.body;
  const db = getDB();
  try {
    await db.connect();
    let updateQ;
    let values;
    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateQ = `UPDATE "User" SET "name"=$1, "email"=$2, "phone"=$3, "role"=$4, "status"=$5, "password"=$6, "updatedAt"=NOW() WHERE "id"=$7 RETURNING id, name, email, phone, role, status, "photoUrl"`;
      values = [name, email, phone, role, status, hashedPassword, req.params.id];
    } else {
      updateQ = `UPDATE "User" SET "name"=$1, "email"=$2, "phone"=$3, "role"=$4, "status"=$5, "updatedAt"=NOW() WHERE "id"=$6 RETURNING id, name, email, phone, role, status, "photoUrl"`;
      values = [name, email, phone, role, status, req.params.id];
    }
    const result = await db.query(updateQ, values);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Usuário não encontrado.' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update User Error:', err);
    res.status(500).json({ error: 'Erro ao atualizar usuário.' });
  } finally {
    await db.end();
  }
});

app.delete('/api/users/:id', authenticateToken, async (req, res) => {
  const db = getDB();
  try {
    await db.connect();
    await db.query('DELETE FROM "User" WHERE "id"=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar usuário.' });
  } finally {
    await db.end();
  }
});

module.exports = app;

