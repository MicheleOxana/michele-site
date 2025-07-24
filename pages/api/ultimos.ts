// pages/api/ultimos.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../src/services/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const highlightDoc = await db.collection('highlights').doc('current').get();
    if (!highlightDoc.exists) {
      return res.status(200).json({
        sub: 'nenhum',
        bits: 'nenhum',
        follower: 'nenhum'
      });
    }
    const highlightData = highlightDoc.data();

    return res.status(200).json({
      sub: highlightData?.ultimoSub || 'nenhum',
      bits: highlightData?.ultimosBits?.quantidade || 'nenhum',
      follower: highlightData?.ultimoFollow || 'nenhum'
    });
  } catch (err) {
    console.error('Erro ao buscar dados do Firebase:', err);
    return res.status(500).json({ error: 'Erro ao buscar dados do Firebase' });
  }
}
