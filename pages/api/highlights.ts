import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../src/services/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== `Bearer ${process.env.HIGHLIGHT_SECRET}`) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  try {
    const data = req.body;

    // Salva na coleção highlights, você pode ajustar a estrutura
    await db.collection('highlights').add({
      ...data,
      createdAt: new Date().toISOString(),
    });

    return res.status(200).json({ message: 'Highlight salvo com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar highlight:', error);
    return res.status(500).json({ error: 'Erro interno' });
  }
}
