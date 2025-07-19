// Redireciona o usuário pra Twitch OAuth
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const clientId = process.env.OAUTH_CLIENT_ID!;
  const redirectUri = process.env.OAUTH_REDIRECT_URI!;
  const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=user:read:email`;

  res.redirect(authUrl);
}
