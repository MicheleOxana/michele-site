import type { NextApiRequest, NextApiResponse } from 'next';
import { getMicheleAccessToken } from '../../../src/utils/getUserTokenFromFirebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { access_token } = await getMicheleAccessToken();

    const twitchRes = await fetch('https://api.twitch.tv/helix/chat/chatters?broadcaster_id=517861418&moderator_id=517861418', {
      headers: {
        'Client-ID': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!,
        'Authorization': `Bearer ${access_token}`,
      },
    });

    const data = await twitchRes.json();

    if (!data || !data.data || !Array.isArray(data.data)) {
      throw new Error('❌ Dados inesperados da API da Twitch');
    }

    const viewers = data.data.map((user: any) => user.user_login);

    return res.status(200).json({ viewers });
  } catch (error) {
    console.error('❌ Erro ao buscar viewers:', error);
    return res.status(500).json({ viewers: [] });
  }
}
