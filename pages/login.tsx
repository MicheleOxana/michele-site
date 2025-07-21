import React from 'react';

export default function Login() {
  const clientId = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!;
  const redirectUri = 'https://micheleoxana.live/auth/voltei';
  const scope = 'user:read:email';

  const twitchLoginUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;

  return (
    <div className="h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">✨ Conecte-se com a Twitch ✨</h1>
        <a
          href={twitchLoginUrl}
          className="bg-purple-600 px-6 py-3 rounded hover:bg-purple-700 transition"
        >
          Entrar com Twitch
        </a>
      </div>
    </div>
  );
}
