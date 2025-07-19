// pages/api/twitch/follow.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.body.challenge) {
    // Twitch está testando/validando o webhook
    return res.status(200).send(req.body.challenge);
  }

  const event = req.body?.event;

  if (event && event.user_name) {
    const filePath = path.join(process.cwd(), 'public/data/highlight.json');
    let highlight = {
      ultimoFollow: event.user_name,
      ultimoSub: '',
      ultimosBits: {
        nome: '',
        quantidade: 0
      }
    };

    try {
      if (fs.existsSync(filePath)) {
        const existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        highlight = {
          ...existing,
          ultimoFollow: event.user_name
        };
      }

      fs.writeFileSync(filePath, JSON.stringify(highlight, null, 2));
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('Erro ao salvar follow:', err);
      return res.status(500).json({ error: 'Erro ao salvar follow' });
    }
  }

  return res.status(200).json({ received: true });
}