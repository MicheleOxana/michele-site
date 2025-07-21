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
        const tokenRes = await axios.post('/api/twitch/exchange', { code });
        const { access_token } = tokenRes.data;

        const userRes = await axios.get('https://api.twitch.tv/helix/users', {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Client-Id': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!,
          },
        });

        const user = userRes.data.data[0];
        login(access_token, user);
        router.replace('/');
      } catch (err) {
        console.error('Erro ao autenticar com Twitch:', err);
        router.replace('/login');
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="h-screen w-screen bg-black flex items-center justify-center relative overflow-hidden text-white">
      {/* Glitter Animado de Fundo */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-500 to-yellow-300 animate-gradient-xy opacity-30" />

      <div className="relative z-10 text-center p-8">
        <h1 className="text-4xl font-bold animate-pulse drop-shadow-glow">
          🧿 Invocando o surto via Twitch...
        </h1>
        <p className="mt-4 text-lg opacity-80 animate-fade-in">
          Segure firme, os espíritos do entretenimento estão sendo evocados! 👻
        </p>
      </div>

      {/* Estilos mágicos */}
      <style jsx global>{`
        @keyframes gradient-xy {
          0%, 100% {
            background-position: 0% 0%;
          }
          50% {
            background-position: 100% 100%;
          }
        }

        .animate-gradient-xy {
          background-size: 200% 200%;
          animation: gradient-xy 8s ease infinite;
        }

        .drop-shadow-glow {
          text-shadow: 0 0 8px #fff, 0 0 12px #f0f, 0 0 20px #f0f;
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
