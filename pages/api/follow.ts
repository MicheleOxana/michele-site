// pages/api/follow.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';  // ou outra forma de obter token do usuário

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }
  const token = await getToken({ req });
  if (!token || !token.accessToken || !token.sub) {
    return res.status(401).json({ error: 'Não autenticado' });
  }
  const userAccessToken = token.accessToken as string;
  const userId = token.sub as string;
  const broadcasterId = '517861418';  // micheleoxana ID
  try {
    const twitchRes = await fetch('https://api.twitch.tv/helix/users/follows', {
      method: 'POST',
      headers: {
        'Client-ID': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!,
        'Authorization': `Bearer ${userAccessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from_id: userId,
        to_id: broadcasterId
      })
    });
    if (!twitchRes.ok) {
      // Se retornar erro, repassamos o status e mensagem
      const errData = await twitchRes.json();
      return res.status(twitchRes.status).json(errData);
    }
    return res.status(204).end(); // sucesso (No Content)
  } catch (error) {
    console.error('Erro no follow via API:', error);
    return res.status(500).json({ error: 'Falha ao seguir via API' });
  }
}
