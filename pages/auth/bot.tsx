// pages/auth/bot.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function BotAuth() {
  const router = useRouter();
  const [status, setStatus] = useState('Aguardando código...');
  const [tokens, setTokens] = useState<{ access_token: string; refresh_token: string } | null>(null);

  useEffect(() => {
    const code = router.query.code as string;

    if (!code) return;

    const getTokens = async () => {
      setStatus('Trocando código pelo token...');
      try {
        const response = await fetch('https://id.twitch.tv/oauth2/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: process.env.NEXT_PUBLIC_TWITCH_BOT_CLIENT_ID!,
            client_secret: process.env.NEXT_PUBLIC_TWITCH_BOT_CLIENT_SECRET!,
            code,
            grant_type: 'authorization_code',
            redirect_uri: 'https://micheleoxana.live/auth/bot'
          })
        });

        const data = await response.json();

        if (data.access_token) {
          setTokens({
            access_token: data.access_token,
            refresh_token: data.refresh_token
          });
          setStatus('Tokens recebidos com sucesso!');
        } else {
          setStatus('Erro ao obter token: ' + JSON.stringify(data));
        }
      } catch (err) {
        setStatus('Erro inesperado: ' + String(err));
      }
    };

    getTokens();
  }, [router.query.code]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-8">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-xl w-full">
        <h1 className="text-2xl font-bold mb-4">Autenticação do Bot Unixana 🦄</h1>
        <p className="mb-4">{status}</p>

        {tokens && (
          <div className="space-y-4">
            <div>
              <label className="block font-semibold">TWITCH_BOT_ACCESS_TOKEN:</label>
              <textarea readOnly className="w-full bg-gray-800 p-2 rounded" rows={3}>
                {tokens.access_token}
              </textarea>
            </div>
            <div>
              <label className="block font-semibold">TWITCH_BOT_REFRESH_TOKEN:</label>
              <textarea readOnly className="w-full bg-gray-800 p-2 rounded" rows={3}>
                {tokens.refresh_token}
              </textarea>
            </div>
            <p className="text-sm mt-4 text-yellow-400">
              Copie os tokens acima e cole no seu <code>.env</code> local ✨
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
