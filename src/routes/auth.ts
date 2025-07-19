import express from 'express';
import axios from 'axios';

const router = express.Router();

const clientId = process.env.OAUTH_CLIENT_ID!;
const clientSecret = process.env.OAUTH_CLIENT_SECRET!;
const redirectUri = process.env.OAUTH_REDIRECT_URI!;

router.get('/twitch', (req, res) => {
  const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=user:read:email`;
  res.redirect(authUrl);
});

router.get('/twitch/callback', async (req, res) => {
  const code = req.query.code as string;

  const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
    params: {
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri
    }
  });

  const { access_token } = response.data;
  const userResponse = await axios.get('https://api.twitch.tv/helix/users', {
    headers: {
      'Client-ID': clientId,
      'Authorization': `Bearer ${access_token}`
    }
  });

  const user = userResponse.data.data[0];
  req.session.user = user;
  res.redirect('/');
});

export default router;
