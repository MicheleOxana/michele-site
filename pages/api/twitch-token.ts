// pages/api/twitch-token.ts
import type { NextApiRequest, NextApiResponse } from 'next';

let cachedToken = '';
let tokenExpiration = 0;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Se já temos token válido em cache, usamos ele
  if (cachedToken && Date.now() < tokenExpiration) {
    return res.status(200).json({ token: cachedToken });
  }

  const clientId = process.env.TWITCH_CLIENT_ID!;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET!;

  // Checagem de segurança: não pode faltar nada
  if (!clientId || !clientSecret) {
    console.error('❌ Faltando client_id ou client_secret nas env vars');
    return res.status(400).json({ message: 'missing client secret' });
  }

  try {
    // Solicita novo token
    const response = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
      }),
    });

    const data = await response.json();

    if (!data.access_token) {
      console.error('❌ Erro ao pegar o token da Twitch:', data);
      return res.status(400).json({ message: 'erro ao pegar token', details: data });
    }

    cachedToken = data.access_token;
    tokenExpiration = Date.now() + data.expires_in * 1000;

    res.status(200).json({ token: cachedToken });
  } catch (error) {
    console.error('❌ Erro inesperado ao buscar token da Twitch:', error);
    res.status(500).json({ message: 'Erro interno', error });
  }
}
