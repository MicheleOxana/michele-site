// pages/api/atualizar-coins.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido, use POST' });
  }

  const auth = req.headers.authorization;
  if (auth !== `Bearer ${process.env.HIGHLIGHT_SECRET}`) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  const { id, nome, coins } = req.body;

  if (!id || coins === undefined || !nome) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes: id, nome ou coins' });
  }

  try {
    await setDoc(doc(db, 'xaninhasCoins', id), {
      nome,
      coins,
      updatedAt: serverTimestamp(),
    });

    return res.status(200).json({ success: true, message: 'Dados atualizados com sucesso' });
  } catch (error) {
    console.error('Erro ao salvar no Firestore:', error);
    return res.status(500).json({ error: 'Erro interno ao salvar dados' });
  }
}

