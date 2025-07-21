// pages/api/viewer-messages.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

const ADMIN_TOKEN = process.env.HIGHLIGHT_SECRET!;
const COLLECTION = 'comentarios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const snapshot = await getDocs(collection(db, COLLECTION));
    const comentarios = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return res.status(200).json(comentarios);
  }

  if (req.method === 'POST') {
    const { nome, mensagem } = req.body;
    if (!nome || !mensagem) {
      return res.status(400).json({ error: 'Nome e mensagem obrigatórios.' });
    }

    const docRef = await addDoc(collection(db, COLLECTION), { nome, mensagem });
    return res.status(200).json({ sucesso: true, comentario: { id: docRef.id, nome, mensagem } });
  }

  if (req.method === 'DELETE') {
    const token = req.headers.authorization?.split(' ')[1];
    if (token !== ADMIN_TOKEN) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'ID não fornecido' });

    await deleteDoc(doc(db, COLLECTION, id));
    return res.status(200).json({ sucesso: true });
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
