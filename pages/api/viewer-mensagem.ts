import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const FILE_PATH = path.join(process.cwd(), 'data/viewers.json');
const ADMIN_TOKEN = process.env.HIGHLIGHT_SECRET || 'unixanaSurta2025';

interface Comentario {
  nome: string;
  mensagem: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const file = fs.readFileSync(FILE_PATH, 'utf-8');
      const data = JSON.parse(file);
      res.status(200).json(data);
    } catch (err) {
      res.status(200).json([]); // se o arquivo não existir ainda
    }
  }

  else if (req.method === 'POST') {
    const { nome, mensagem } = req.body;

    if (!nome || !mensagem) {
      return res.status(400).json({ error: 'Nome e mensagem são obrigatórios.' });
    }

    try {
      const file = fs.existsSync(FILE_PATH) ? fs.readFileSync(FILE_PATH, 'utf-8') : '[]';
      const data = JSON.parse(file) as Comentario[];
      data.push({ nome, mensagem });

      fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
      res.status(200).json({ sucesso: true });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao salvar mensagem.' });
    }
  }

  else if (req.method === 'DELETE') {
    const token = req.headers.authorization?.split(' ')[1];

    if (token !== ADMIN_TOKEN) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    const { index } = req.body;
    try {
      const file = fs.readFileSync(FILE_PATH, 'utf-8');
      const data = JSON.parse(file) as Comentario[];
      if (index >= 0 && index < data.length) {
        data.splice(index, 1);
        fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
        res.status(200).json({ sucesso: true });
      } else {
        res.status(400).json({ error: 'Índice inválido' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Erro ao deletar mensagem' });
    }
  }

  else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}
