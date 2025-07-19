import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const clientId = process.env.TWITCH_CLIENT_ID!;
  const channel = process.env.TWITCH_CHANNEL_NAME!;
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

  const tokenRes = await fetch(`${baseUrl}/api/twitch-token`);
  const { token } = await tokenRes.json();

  const userRes = await fetch(`https://api.twitch.tv/helix/users?login=${channel}`, {
    headers: {
      'Client-ID': clientId,
      'Authorization': `Bearer ${token}`,
    },
  });
  const userData = await userRes.json();
  const userId = userData.data?.[0]?.id;

  const streamRes = await fetch(`https://api.twitch.tv/helix/streams?user_id=${userId}`, {
    headers: {
      'Client-ID': clientId,
      'Authorization': `Bearer ${token}`,
    },
  });

  const streamData = await streamRes.json();

  if (!streamData.data || streamData.data.length === 0) {
    return res.status(200).json({ isLive: false, viewers: 0 });
  }

  const viewers = streamData.data[0].viewer_count;
  res.status(200).json({ isLive: true, viewers });
}
