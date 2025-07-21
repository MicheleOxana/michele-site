import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.YOUTUBE_API_KEY; 
  const channelId = 'UChCg0CXAgnr9X73QwQzqkxA';

  if (!apiKey) {
    return res.status(500).json({ error: 'API key não encontrada. Verifique seu .env e variáveis da Vercel.' });
  }

  try {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=3`);
    const data = await response.json();

    if (!response.ok) {
      console.error('Erro da API do YouTube:', data);
      return res.status(response.status).json({ error: data.error?.message || 'Erro ao buscar vídeos do YouTube' });
    }

    return res.status(200).json(data);
  } catch (err: any) {
    console.error('Erro geral na rota /api/youtube:', err);
    return res.status(500).json({ error: err.message || 'Erro desconhecido' });
  }
}