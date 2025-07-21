// pages/auth/voltei.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../src/context/AuthContext';
import axios from 'axios';

export default function VolteiCallbackPage() {
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (!code) {
      router.replace('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        // Troca o código pelo token
        const tokenRes = await axios.post('/api/twitch/exchange', { code });
        const { access_token } = tokenRes.data;

        // Busca os dados do usuário
        const userRes = await axios.get('https://api.twitch.tv/helix/users', {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Client-Id': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!,
          },
        });

        const user = userRes.data.data[0];

        // Salva no contexto: precisa passar os dois parâmetros
        login(access_token, user);

        // Redireciona pra home
        router.replace('/');
      } catch (err) {
        console.error('Erro ao autenticar com Twitch:', err);
        router.replace('/login');
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="h-screen flex items-center justify-center bg-black text-white">
      <p className="text-xl animate-pulse">🌀 Invocando os surtos de volta...</p>
    </div>
  );
}
