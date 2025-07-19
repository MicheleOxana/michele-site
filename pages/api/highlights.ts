// pages/api/updateHighlight.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// 🔐 Carrega a variável de ambiente
const HIGHLIGHT_SECRET = process.env.HIGHLIGHT_SECRET;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = req.headers.authorization;

  // 🛡️ Validação com o token do .env
  if (auth !== `Bearer ${HIGHLIGHT_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const data = req.body;

  try {
    const filePath = path.join(process.cwd(), 'public/data/highlight.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Erro ao salvar highlight:', err);
    res.status(500).json({ error: 'Erro ao salvar highlight' });
  }
}
