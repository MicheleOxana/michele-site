// pages/auth/callback.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../src/context/AuthContext';
import axios from 'axios';

export default function CallbackPage() {
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const hash = window.location.hash;

    if (!hash.includes('access_token=')) {
      router.replace('/login');
      return;
    }

    const token = new URLSearchParams(hash.substring(1)).get('access_token');

    if (!token) {
      router.replace('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get('https://api.twitch.tv/helix/users', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Client-Id': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!,
          },
        });

        const user = res.data.data[0];

        // 🟢 salva manualmente no localStorage (já que login só aceita 1 param)
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        login(token); // agora passa só o token
        router.replace('/');
      } catch (err) {
        console.error('Erro ao buscar usuário da Twitch:', err);
        router.replace('/login');
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="h-screen flex items-center justify-center bg-black text-white">
      <p className="text-xl animate-pulse">🔮 Invocando o surto da Twitch...</p>
    </div>
  );
}
