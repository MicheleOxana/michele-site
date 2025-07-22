import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function BotAuth() {
  const router = useRouter();
  const [status, setStatus] = useState('Aguardando código...');
  const [tokens, setTokens] = useState<{ access_token: string; refresh_token: string } | null>(null);

  useEffect(() => {
    const code = router.query.code as string;
    if (!code) return;

    const fetchToken = async () => {
      setStatus('Enviando código para o backend...');
      try {
        const res = await fetch('/api/twitch/auth-bot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        });
        const data = await res.json();

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

    fetchToken();
  }, [router.query.code]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-8">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-xl w-full">
        <h1 className="text-2xl font-bold mb-4">Autenticação do Bot Unixana 🦄</h1>
        <p className="mb-4">{status}</p>

        {tokens && (
          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-pink-400">TWITCH_BOT_ACCESS_TOKEN:</label>
              <textarea
                readOnly
                className="w-full bg-gray-800 p-2 rounded text-sm break-all"
                rows={3}
                value={tokens.access_token}
              />
            </div>
            <div>
              <label className="block font-semibold text-pink-400">TWITCH_BOT_REFRESH_TOKEN:</label>
              <textarea
                readOnly
                className="w-full bg-gray-800 p-2 rounded text-sm break-all"
                rows={3}
                value={tokens.refresh_token}
              />
            </div>
            <p className="text-yellow-400 text-sm mt-4">
              Copie os tokens acima e cole no seu <code>.env</code> local. 💅✨
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
