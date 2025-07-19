// pages/login.tsx
import { useEffect } from 'react';

export default function LoginPage() {
  const clientId = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!;
  const redirectUri = process.env.NEXT_PUBLIC_TWITCH_REDIRECT_URI!;
  const scopes = 'channel:read:subscriptions moderator:read:followers user:read:email';

  const loginUrl = `https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}`;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      window.location.href = '/';
    }
  }, []);

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-black text-white">
      <h1 className="text-3xl mb-6">✨ Faça login com a Twitch para acessar o surto</h1>
      <a
        href={loginUrl}
        className="bg-purple-600 px-6 py-3 rounded-lg text-lg font-bold hover:bg-purple-700 transition"
      >
        Entrar com Twitch
      </a>
    </div>
  );
}
