import type { NextApiRequest, NextApiResponse } from 'next';
import { getMicheleAccessToken } from '@/utils/getUserTokenFromFirebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { access_token } = await getMicheleAccessToken();

    // Consulta a API de streams para obter informações da live (incluindo viewer count)
    const twitchRes = await fetch(
      'https://api.twitch.tv/helix/streams?user_login=micheleoxana',
      {
        headers: {
          'Client-ID': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!,
          'Authorization': `Bearer ${access_token}`,
        },
      }
    );

    const data = await twitchRes.json();

    if (data.data && data.data.length > 0) {
      const viewerCount = data.data[0].viewer_count;
      return res.status(200).json({ viewers: viewerCount });
    } else {
      // Se a live não estiver no ar, retornamos 'off' para indicar offline
      return res.status(200).json({ viewers: 'off' });
    }
  } catch (error) {
    console.error('❌ Erro ao buscar viewers:', error);
    return res.status(500).json({ viewers: 'off' });
  }
}