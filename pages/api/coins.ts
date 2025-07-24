// pages/api/coins.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'ID do usuário não informado.' });
  }

  try {
    const ref = doc(db, 'xaninhasCoins', id);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      // Usuário novo, saldo zerado
      return res.status(200).json({ coins: 0, nome: null });
    }

    const data = snapshot.data();
    return res.status(200).json({ coins: data.coins || 0, nome: data.nome || null });
  } catch (error) {
    console.error('Erro ao buscar Xaninhas Coins:', error);
    return res.status(500).json({ error: 'Erro interno ao consultar saldo.' });
  }
}
