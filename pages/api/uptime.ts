// pages/api/uptime.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const clientId = process.env.TWITCH_CLIENT_ID!;
  const channel = process.env.TWITCH_CHANNEL_NAME!;
  const origin = req.headers.origin || process.env.NEXT_PUBLIC_URL!;

  try {
    const tokenRes = await fetch(`${origin}/api/twitch-token`);
    const { token } = await tokenRes.json();

    const userRes = await fetch(`https://api.twitch.tv/helix/users?login=${channel}`, {
      headers: {
        'Client-ID': clientId,
        'Authorization': `Bearer ${token}`,
      },
    });

    const userData = await userRes.json();
    const userId = userData.data?.[0]?.id;

    if (!userId) {
      return res.status(200).json({ isLive: false });
    }

    const streamRes = await fetch(`https://api.twitch.tv/helix/streams?user_id=${userId}`, {
      headers: {
        'Client-ID': clientId,
        'Authorization': `Bearer ${token}`,
      },
    });

    const streamData = await streamRes.json();

    if (!streamData.data || streamData.data.length === 0) {
      return res.status(200).json({ isLive: false });
    }

    const startedAt = streamData.data[0].started_at;
    res.status(200).json({ isLive: true, startedAt });

  } catch (err) {
    console.error('Erro ao buscar uptime:', err);
    res.status(500).json({ error: 'Erro ao buscar uptime' });
  }
}
