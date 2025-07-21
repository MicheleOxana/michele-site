import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.body;

  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!,
    client_secret: process.env.TWITCH_CLIENT_SECRET!,
    code,
    grant_type: 'authorization_code',
    redirect_uri: process.env.NEXT_PUBLIC_TWITCH_REDIRECT_URI!,
  });

  try {
    const response = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      body: params,
    });

    const data = await response.json();

    if (data.access_token) {
      res.status(200).json({ access_token: data.access_token });
    } else {
      res.status(400).json({ error: 'Token não recebido da Twitch', details: data });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erro ao trocar código por token', message: err });
  }
}
