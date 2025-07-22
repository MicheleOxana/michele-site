import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function TokenMichele() {
  const router = useRouter();
  const [status, setStatus] = useState('Aguardando código...');
  const [tokens, setTokens] = useState<{ access_token: string; refresh_token: string } | null>(null);

  useEffect(() => {
    const code = router.query.code as string;
    if (!code) return;

    const trocarToken = async () => {
      setStatus('Trocando código por token da conta Michele...');
      try {
        const res = await fetch('/api/twitch/auth-main', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        });

        const data = await res.json();

        if (data.access_token && data.refresh_token) {
          setTokens({
            access_token: data.access_token,
            refresh_token: data.refresh_token
          });
          setStatus('Tokens recebidos com sucesso! Copie pro .env 🎯');
        } else {
          setStatus('Erro: ' + JSON.stringify(data));
        }
      } catch (err) {
        setStatus('Erro inesperado: ' + String(err));
      }
    };

    trocarToken();
  }, [router.query.code]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
      <div className="bg-gray-900 p-6 rounded-lg max-w-xl w-full">
        <h1 className="text-2xl font-bold mb-4">Token da Conta Michele 👑</h1>
        <p className="mb-4">{status}</p>

        {tokens && (
          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-pink-400">TWITCH_MAIN_ACCESS_TOKEN:</label>
              <textarea
                readOnly
                className="w-full bg-gray-800 p-2 rounded text-sm break-all"
                rows={3}
                value={tokens.access_token}
              />
            </div>
            <div>
              <label className="block font-semibold text-pink-400">TWITCH_MAIN_REFRESH_TOKEN:</label>
              <textarea
                readOnly
                className="w-full bg-gray-800 p-2 rounded text-sm break-all"
                rows={3}
                value={tokens.refresh_token}
              />
            </div>
            <p className="text-yellow-400 text-sm mt-4">
              Copie e cole no seu <code>.env</code> como rainha que é. 💅
            </p>
          </div>
        )}
      </div>
    </div>
  );
}