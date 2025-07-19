// scripts/registerFollowWebhook.ts
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const registerFollowWebhook = async () => {
  try {
    const res = await axios.post(
      'https://api.twitch.tv/helix/eventsub/subscriptions',
      {
        type: 'channel.follow',
        version: '2',
        condition: {
          broadcaster_user_id: process.env.TWITCH_BOT_BROADCASTER_ID
        },
        transport: {
          method: 'webhook',
          callback: `${process.env.NEXT_PUBLIC_URL}/api/twitch/follow`,
          secret: process.env.TWITCH_WEBHOOK_SECRET
        }
      },
      {
        headers: {
          'Client-ID': process.env.TWITCH_BOT_CLIENT_ID!,
          Authorization: `Bearer ${process.env.TWITCH_APP_TOKEN!}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Webhook de follow registrado com sucesso:', res.data);
  } catch (err: any) {
    console.error('❌ Erro ao registrar webhook:', err.response?.data || err.message);
  }
};

registerFollowWebhook();
