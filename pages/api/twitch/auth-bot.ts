// pages/api/twitch/auth-bot.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { code } = req.body;

  const params = new URLSearchParams({
    client_id: process.env.TWITCH_BOT_CLIENT_ID!,
    client_secret: process.env.TWITCH_BOT_CLIENT_SECRET!,
    code,
    grant_type: 'authorization_code',
    redirect_uri: 'https://micheleoxana.live/auth/bot'
  });

  try {
    const response = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao trocar código por token', details: error });
  }
}
