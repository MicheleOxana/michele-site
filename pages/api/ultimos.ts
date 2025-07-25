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

    const data = highlightDoc.data();

    const bits =
      typeof data?.ultimosBits?.nome === 'string'
        ? `${data.ultimosBits.nome} — ${data.ultimosBits.quantidade || 0} bits`
        : 'nenhum';

    return res.status(200).json({
      sub: data?.ultimoSub || 'nenhum',
      bits,
      follower: data?.ultimoFollow || 'nenhum'
    });
  } catch (err) {
    console.error('Erro ao buscar dados do Firebase:', err);
    return res.status(500).json({ error: 'Erro ao buscar dados do Firebase' });
  }
}
