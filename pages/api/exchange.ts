import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.body;

  try {
    const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
      params: {
        client_id: process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.NEXT_PUBLIC_TWITCH_REDIRECT_URI,
      },
    });

    res.status(200).json({ access_token: response.data.access_token });
  } catch (error) {
    console.error('Erro ao trocar código por token:', error.response?.data || error.message);
    res.status(500).json({ error: 'Falha ao trocar código por token' });
  }
}
