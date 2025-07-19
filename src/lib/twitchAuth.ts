import axios from 'axios';

export async function getAppAccessToken(): Promise<string> {
  const clientId = process.env.TWITCH_BOT_CLIENT_ID!;
  const clientSecret = process.env.TWITCH_BOT_CLIENT_SECRET!;

  const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
    params: {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
    },
  });

  return response.data.access_token;
}
