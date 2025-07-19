// scripts/getAppToken.ts
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config(); // Carrega os valores do .env automaticamente

const clientId = process.env.TWITCH_CLIENT_ID!;
const clientSecret = process.env.TWITCH_CLIENT_SECRET!;

async function getAppToken() {
  try {
    const res = await axios.post('https://id.twitch.tv/oauth2/token', null, {
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
      },
    });

    console.log('✅ TOKEN GERADO:');
    console.log(res.data);
  } catch (err: any) {
    console.error('❌ ERRO AO GERAR TOKEN:', err.response?.data || err.message);
  }
}

getAppToken();
