// pages/api/atualizar-coins.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const auth = req.headers.authorization;
  if (auth !== `Bearer ${process.env.HIGHLIGHT_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id, nome, coins } = req.body;

  if (!id || coins === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await setDoc(doc(db, 'xaninhasCoins', id), {
      nome,
      coins,
      updatedAt: Date.now()
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erro ao salvar no Firestore:', error);
    return res.status(500).json({ error: 'Erro interno' });
  }
}
