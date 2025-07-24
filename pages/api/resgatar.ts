import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const auth = req.headers.authorization;
  if (auth !== process.env.HIGHLIGHT_SECRET) {
    return res.status(401).json({ error: 'Não autorizado.' });
  }

  const { id, username, item, valor } = req.body;

  if (!id || !username || !item || valor === undefined || valor === null) {
    return res.status(400).json({ error: 'Dados incompletos.' });
  }

  try {
    const userRef = doc(db, 'xaninhasCoins', id);
    const userSnap = await getDoc(userRef);

    let saldoAtual = 0;
    if (userSnap.exists()) {
      saldoAtual = userSnap.data().coins || 0;
    }

    if (saldoAtual < valor) {
      return res.status(400).json({ error: 'Você não tem Xaninhas Coins suficientes!' });
    }

    if (item === 'Escolha de Killer') {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      const q = query(
        collection(db, 'resgates'),
        where('item', '==', 'Escolha de Killer'),
        where('timestamp', '>=', Timestamp.fromDate(hoje))
      );

      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return res.status(400).json({ error: 'Esse item já foi resgatado nesta live.' });
      }
    }

    const novoSaldo = saldoAtual - valor;
    if (userSnap.exists()) {
      await updateDoc(userRef, { coins: novoSaldo });
    } else {
      await setDoc(userRef, { coins: novoSaldo });
    }

    await addDoc(collection(db, 'resgates'), {
      userId: id,
      username,
      item,
      valor,
      timestamp: Timestamp.now()
    });

    return res.status(200).json({ ok: true, novoSaldo });
  } catch (error) {
    console.error('Erro ao processar resgate:', error);
    return res.status(500).json({ error: 'Erro interno ao processar o resgate.' });
  }
}
