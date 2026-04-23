import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ message: 'TechTennis API is healthy and running.' });
});

app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({ include: { customer: true } });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  // Placeholder para o login real que substituiremos completamente na Fase 3
  res.json({ token: 'jwt_mock_token', user: { role: 'ADMIN' } });
});

// A Vercel vai procurar esse `export default app` nativamente
export default app;
