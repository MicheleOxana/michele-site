// pages/api/twitch/auth-main.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Código não fornecido' });
  }

  try {
    const clientId = process.env.TWITCH_CLIENT_ID!;
    const clientSecret = process.env.TWITCH_CLIENT_SECRET!;
    const redirectUri = 'https://micheleoxana.live/auth/token-michele';

    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);
    params.append('code', code);
    params.append('grant_type', 'authorization_code');
    params.append('redirect_uri', redirectUri);

    const response = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const data = await response.json();

    if (data.access_token) {
      res.status(200).json({
        access_token: data.access_token,
        refresh_token: data.refresh_token
      });
    } else {
      res.status(500).json({ error: 'Erro ao obter o token', data });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erro interno', details: err });
  }
}
