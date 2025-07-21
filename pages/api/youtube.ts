// pages/api/youtube.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelId = 'UCQ_ElHRwpREHimV0HyjDBWw';

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=3`
    );

    if (!response.ok) {
      throw new Error('Erro ao buscar vídeos do YouTube');
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erro desconhecido' });
  }
}
