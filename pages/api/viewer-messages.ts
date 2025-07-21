import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

const FILE_PATH = path.join(process.cwd(), 'data/viewers.json');
const ADMIN_TOKEN = process.env.HIGHLIGHT_SECRET;

interface Comentario {
  id: string;
  nome: string;
  mensagem: string;
}

function ensureFile() {
  if (!fs.existsSync(FILE_PATH)) {
    fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
    fs.writeFileSync(FILE_PATH, '[]');
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse): void {
  ensureFile();

  // GET - Qualquer um pode ver as mensagens
  if (req.method === 'GET') {
    try {
      const file = fs.readFileSync(FILE_PATH, 'utf-8');
      const comentarios = JSON.parse(file) as Comentario[];
      return res.status(200).json(comentarios);
    } catch {
      return res.status(200).json([]);
    }
  }

  // POST - Qualquer um pode enviar mensagem
  if (req.method === 'POST') {
    const { nome, mensagem } = req.body;

    if (!nome || !mensagem) {
      return res.status(400).json({ error: 'Nome e mensagem são obrigatórios.' });
    }

    try {
      const file = fs.readFileSync(FILE_PATH, 'utf-8');
      const comentarios = JSON.parse(file) as Comentario[];

      const novoComentario: Comentario = {
        id: randomUUID(),
        nome,
        mensagem,
      };

      comentarios.push(novoComentario);
      fs.writeFileSync(FILE_PATH, JSON.stringify(comentarios, null, 2));
      return res.status(200).json({ sucesso: true, comentario: novoComentario });
    } catch {
      return res.status(500).json({ error: 'Erro ao salvar mensagem.' });
    }
  }

  // DELETE - Apenas Michele (com token)
  if (req.method === 'DELETE') {
    const token = req.headers.authorization?.split(' ')[1];
    if (token !== ADMIN_TOKEN) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'ID não fornecido.' });
    }

    try {
      const file = fs.readFileSync(FILE_PATH, 'utf-8');
      const comentarios = JSON.parse(file) as Comentario[];

      const atualizados = comentarios.filter((comentario) => comentario.id !== id);

      if (comentarios.length === atualizados.length) {
        return res.status(404).json({ error: 'Comentário não encontrado.' });
      }

      fs.writeFileSync(FILE_PATH, JSON.stringify(atualizados, null, 2));
      return res.status(200).json({ sucesso: true });
    } catch {
      return res.status(500).json({ error: 'Erro ao deletar mensagem.' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido.' });
}
