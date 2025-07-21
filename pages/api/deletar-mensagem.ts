import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const MENSAGENS_PATH = path.resolve('./data/viewers.json');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const auth = req.headers.authorization;
  if (auth !== process.env.MODERACAO_SECRET) {
    return res.status(401).json({ error: 'Não autorizade, mana!' });
  }

  const { id } = req.body;

  try {
    const raw = fs.readFileSync(MENSAGENS_PATH, 'utf-8');
    const mensagens = JSON.parse(raw);
    const atualizadas = mensagens.filter((m: any) => m.id !== id);
    fs.writeFileSync(MENSAGENS_PATH, JSON.stringify(atualizadas, null, 2));
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao deletar' });
  }
}