import type { NextApiRequest, NextApiResponse } from 'next';
import getMicheleAccessToken from '@/utils/getUserTokenFromFirebase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const access_token = await getMicheleAccessToken();

    const twitchRes = await fetch(
      `https://api.twitch.tv/helix/streams?user_login=micheleoxana`,
      {
        headers: {
          'Client-ID': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!,
          'Authorization': `Bearer ${access_token}`,
        },
      }
    );

    const data = await twitchRes.json();

    if (data.data && data.data.length > 0) {
      const startedAt = data.data[0].started_at;
      return res.status(200).json({ isLive: true, startedAt });
    }

    return res.status(200).json({ isLive: false });
  } catch (error) {
    console.error('Erro ao buscar uptime:', error);
    return res.status(500).json({ error: 'Erro ao buscar uptime' });
  }
}
