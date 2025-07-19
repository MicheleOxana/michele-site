// pages/api/ultimos.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { getAppAccessToken } from '@/lib/twitchAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = await getAppAccessToken();
    const clientId = process.env.TWITCH_CLIENT_ID!;
    const userLogin = process.env.TWITCH_BOT_CHANNEL!;

    // Pega o ID do canal
    const userRes = await axios.get(`https://api.twitch.tv/helix/users?login=${userLogin}`, {
      headers: {
        'Client-ID': clientId,
        'Authorization': `Bearer ${token}`
      }
    });

    const userId = userRes.data.data[0]?.id;

    if (!userId) return res.status(404).json({ error: 'Usuário não encontrado' });

    // Últimos seguidores
    const followersRes = await axios.get(`https://api.twitch.tv/helix/users/follows?to_id=${userId}&first=1`, {
      headers: {
        'Client-ID': clientId,
        'Authorization': `Bearer ${token}`
      }
    });

    const followerName = followersRes.data.data[0]?.from_name || 'nenhum';

    // Últimos subs e bits precisam de escopos com OAuth user token (não só app token)
    // Aqui vamos manter o follower real, e fakear o resto até ligar o bot do canal com OAuth user_access_token
    const ultimos = {
      sub: 'rolaNoSub',
      bits: 'glitterzona',
      follower: followerName
    };

    res.status(200).json(ultimos);
  } catch (err: any) {
    console.error('Erro ao buscar dados da Twitch:', err.response?.data || err.message);
    res.status(500).json({ error: 'Erro ao buscar dados da Twitch' });
  }
}
