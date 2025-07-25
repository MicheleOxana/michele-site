// pages/api/status.ts
import type { NextApiRequest, NextApiResponse } from 'next';
// (Se usar NextAuth)
import { getToken } from 'next-auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verifica se usuário está autenticado
  const token = await getToken({ req });
  if (!token || !token.accessToken || !token.sub) {
    return res.status(401).json({ error: 'Não autenticado' });
  }
  const userAccessToken = token.accessToken as string;
  const userId = token.sub as string;           // Twitch user ID do usuário logado
  const broadcasterId = '517861418';            // ID numérica da micheleoxana (exemplo)
  
  try {
    // Verifica se usuário segue o canal
    const followRes = await fetch(
      `https://api.twitch.tv/helix/channels/followed?user_id=${userId}&broadcaster_id=${broadcasterId}`,
      {
        headers: {
          'Client-ID': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!,
          'Authorization': `Bearer ${userAccessToken}`,
        },
      }
    );
    const followData = await followRes.json();
    const isFollowing = followData.data && followData.data.length > 0;

    // Verifica se usuário é inscrito (sub) do canal
    const subRes = await fetch(
      `https://api.twitch.tv/helix/subscriptions/user?broadcaster_id=${broadcasterId}&user_id=${userId}`,
      {
        headers: {
          'Client-ID': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!,
          'Authorization': `Bearer ${userAccessToken}`,
        },
      }
    );
    let isSubscribed = false;
    if (subRes.status === 200) {
      const subData = await subRes.json();
      isSubscribed = subData.data && subData.data.length > 0;
    } else if (subRes.status === 404) {
      isSubscribed = false;
    }

    return res.status(200).json({ following: isFollowing, subscribed: isSubscribed });
  } catch (error) {
    console.error('Erro ao verificar follow/sub status:', error);
    return res.status(500).json({ following: false, subscribed: false });
  }
}
