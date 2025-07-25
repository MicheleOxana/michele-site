import type { NextApiRequest, NextApiResponse } from 'next';
import getMicheleAccessToken from '@/utils/getUserTokenFromFirebase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const access_token = await getMicheleAccessToken();

    const twitchResponse = await fetch(`https://api.twitch.tv/helix/streams?user_login=micheleoxana`, {
      headers: {
        'Client-ID': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!,
        'Authorization': `Bearer ${access_token}`
      }
    });

    const streamData = await twitchResponse.json();
    const isLive = streamData?.data?.length > 0;

    if (!isLive) {
      return res.status(200).json({ isLive: false, viewers: 'off' });
    }

    const userId = streamData.data[0].user_id;

    const chattersResponse = await fetch(`https://api.twitch.tv/helix/chat/chatters?broadcaster_id=${userId}&moderator_id=${userId}`, {
      headers: {
        'Client-ID': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!,
        'Authorization': `Bearer ${access_token}`
      }
    });

    const chattersData = await chattersResponse.json();

    if (!chattersData || !chattersData.data) {
      throw new Error('❌ Erro ao obter os viewers.');
    }

    const viewersCount = chattersData.data.length;

    return res.status(200).json({ isLive: true, viewers: viewersCount });
  } catch (error) {
    console.error('Erro ao buscar viewers:', error);
    return res.status(500).json({ error: 'Erro ao buscar viewers' });
  }
}
