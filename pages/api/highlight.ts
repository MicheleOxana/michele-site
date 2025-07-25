import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../src/services/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }
  try {
    const docSnap = await db.collection('highlights').doc('current').get();
    if (!docSnap.exists) {
      return res.status(200).json({ sub: '', bits: '', follow: '' });
    }
    const data = docSnap.data();
    // Extrai campos garantindo tipos corretos
    const ultimoSub = typeof data?.ultimoSub === 'string' ? data.ultimoSub : '';
    const ultimoFollow = typeof data?.ultimoFollow === 'string' ? data.ultimoFollow : '';
    let bitsHighlight = '';
    if (data?.ultimosBits && typeof data.ultimosBits.nome === 'string') {
      bitsHighlight = data.ultimosBits.nome;
      if (typeof data.ultimosBits.quantidade === 'number') {
        bitsHighlight += ` — ${data.ultimosBits.quantidade} bits`;
      }
    }
    return res.status(200).json({
      sub: ultimoSub,
      bits: bitsHighlight,
      follow: ultimoFollow
    });
  } catch (error) {
    console.error('Erro ao buscar highlights:', error);
    return res.status(500).json({ sub: '', bits: '', follow: '' });
  }
}
