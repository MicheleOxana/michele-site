import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

const COLLECTION = 'comentarios';
const MICHELE_LOGIN = 'micheleoxana'; // login da Twitch da patroa

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET — buscar todas as mensagens
  if (req.method === 'GET') {
    try {
      const snapshot = await getDocs(collection(db, COLLECTION));
      const comentarios = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return res.status(200).json(comentarios);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      return res.status(500).json({ error: 'Erro ao buscar mensagens.' });
    }
  }

  // POST — enviar nova mensagem
  if (req.method === 'POST') {
    const { nome, mensagem } = req.body;

    if (!nome || !mensagem) {
      return res.status(400).json({ error: 'Nome e mensagem obrigatórios.' });
    }

    try {
      const docRef = await addDoc(collection(db, COLLECTION), { nome, mensagem });
      return res.status(200).json({
        sucesso: true,
        comentario: { id: docRef.id, nome, mensagem },
      });
    } catch (error) {
      console.error('Erro ao salvar mensagem:', error);
      return res.status(500).json({ error: 'Erro ao salvar mensagem.' });
    }
  }

  // DELETE — apagar mensagem (somente Michele)
  if (req.method === 'DELETE') {
    const userLogin = req.headers['x-user-login'];

    if (userLogin !== MICHELE_LOGIN) {
      return res.status(401).json({ error: 'Não autorizado.' });
    }

    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'ID não fornecido.' });
    }

    try {
      await deleteDoc(doc(db, COLLECTION, id));
      return res.status(200).json({ sucesso: true });
    } catch (error) {
      console.error('Erro ao deletar mensagem:', error);
      return res.status(500).json({ error: 'Erro ao deletar mensagem.' });
    }
  }

  // Método não permitido
  return res.status(405).json({ error: 'Método não permitido.' });
}