// pages/api/coins-ranking.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const ref = collection(db, 'xaninhasCoins');
    const snapshot = await getDocs(ref);

    const ranking: { nick: string; pontos: number }[] = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      ranking.push({
        nick: doc.id,
        pontos: data.coins || 0,
      });
    });

    const ordenado = ranking
      .sort((a, b) => b.pontos - a.pontos)
      .slice(0, 20);

    res.status(200).json(ordenado);
  } catch (err) {
    console.error('Erro ao carregar ranking:', err);
    res.status(500).json({ error: 'Erro interno' });
  }
}

