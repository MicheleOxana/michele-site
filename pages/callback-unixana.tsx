// pages/callback-unixana.tsx
import { useEffect, useState } from 'react';

export default function CallbackUnixana() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      if (accessToken) {
        setToken(accessToken);
        console.log('TOKEN:', accessToken);
      }
    }
  }, []);

  return (
    <div className="h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-purple-400">🎉 Token da SUA conta gerado!</h1>
        {token ? (
          <code className="bg-gray-800 px-4 py-2 rounded block break-all">{token}</code>
        ) : (
          <p className="text-yellow-300">Aguardando token...</p>
        )}
        <p className="text-sm mt-4 text-fuchsia-300">Agora você pode copiar o token e usar no bot!</p>
      </div>
    </div>
  );
}