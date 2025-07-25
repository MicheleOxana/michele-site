import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Método GET — sem proteção
  if (req.method === 'GET') {
    try {
      const ref = doc(db, 'highlights', 'current');
      const snapshot = await getDoc(ref);

      if (!snapshot.exists()) {
        return res.status(200).json({ sub: '', bits: '', follow: '' });
      }

      const data = snapshot.data();

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
        follow: ultimoFollow,
      });
    } catch (error) {
      console.error('Erro ao buscar highlights:', error);
      return res.status(500).json({ sub: '', bits: '', follow: '' });
    }
  }

  // Método POST — protegido por senha
  if (req.method === 'POST') {
    const token = req.headers.authorization?.replace('Bearer ', '').trim();

    if (!token || token !== process.env.HIGHLIGHT_SECRET) {
      return res.status(403).json({ error: 'Acesso não autorizado' });
    }

    try {
      const { ultimoSub, ultimoFollow, ultimosBits } = req.body;

      await setDoc(
        doc(db, 'highlights', 'current'),
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

  // Método não permitido
  return res.status(405).json({ error: 'Método não permitido' });
}
