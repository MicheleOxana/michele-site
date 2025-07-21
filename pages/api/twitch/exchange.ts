// pages/api/twitch/exchange.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { code } = req.body;

  try {
    const redirectUri =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/auth/voltei'
        : 'https://micheleoxana.live/auth/voltei';

    const params = new URLSearchParams();
    params.append('client_id', process.env.TWITCH_CLIENT_ID!);
    params.append('client_secret', process.env.TWITCH_CLIENT_SECRET!);
    params.append('code', code);
    params.append('grant_type', 'authorization_code');
    params.append('redirect_uri', redirectUri);

    const response = await axios.post('https://id.twitch.tv/oauth2/token', params);
    return res.status(200).json(response.data);
  } catch (err: any) {
    console.error('Erro no exchange:', err.response?.data || err);
    return res.status(500).json({ error: 'Erro ao trocar código pelo token' });
  }
}
