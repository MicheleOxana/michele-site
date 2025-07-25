import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../src/services/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const docSnap = await db.collection('highlights').doc('current').get();
      if (!docSnap.exists) {
        return res.status(200).json({ sub: '', bits: '', follow: '' });
      }
      const data = docSnap.data();
      const ultimoSub = typeof data?.ultimoSub === 'string' ? data.ultimoSub : '';
      const ultimoFollow = typeof data?.ultimoFollow === 'string' ? data.ultimoFollow : '';
      let bitsHighlight = '';
      if (data?.ultimosBits && typeof data.ultimosBits.nome === 'string') {
        bitsHighlight = data.ultimosBits.nome;
        if (typeof data.ultimosBits.quantidade === 'number') {
          bitsHighlight += ` — ${data.ultimosBits.quantidade} bits`;
        }
      }
      return res.status(200).json({ sub: ultimoSub, bits: bitsHighlight, follow: ultimoFollow });
    } catch (error) {
      console.error('Erro ao buscar highlights:', error);
      return res.status(500).json({ sub: '', bits: '', follow: '' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { ultimoSub, ultimoFollow, ultimosBits } = req.body;

      await db.collection('highlights').doc('current').set(
        {
          ...(ultimoSub && { ultimoSub }),
          ...(ultimoFollow && { ultimoFollow }),
          ...(ultimosBits && { ultimosBits }),
        },
        { merge: true }
      );

      return res.status(200).json({ message: 'Highlights atualizados com sucesso!' });
    } catch (error) {
      console.error('Erro ao salvar highlights:', error);
      return res.status(500).json({ error: 'Erro ao salvar highlights' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
