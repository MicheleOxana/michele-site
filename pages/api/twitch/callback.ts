import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const clientId = process.env.OAUTH_CLIENT_ID!;
const clientSecret = process.env.OAUTH_CLIENT_SECRET!;
const redirectUri = process.env.OAUTH_REDIRECT_URI!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const code = req.query.code as string;

  try {
    const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri
      }
    });

    const { access_token } = response.data;

    const userResponse = await axios.get('https://api.twitch.tv/helix/users', {
      headers: {
        'Client-ID': clientId,
        'Authorization': `Bearer ${access_token}`
      }
    });

    const user = userResponse.data.data[0];

    // Envia o token pro frontend via hash na URL
    res.redirect(`/auth/callback#access_token=${access_token}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro no callback da Twitch' });
  }
}
