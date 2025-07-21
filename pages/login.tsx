import React, { useEffect } from 'react';

export default function Login() {
  const clientId = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!;
  const redirectUri = process.env.NEXT_PUBLIC_TWITCH_REDIRECT_URI!;
  const scope = 'user:read:email';

  const twitchLoginUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;

  useEffect(() => {
    const particles: HTMLDivElement[] = [];
    const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8B00FF'];

    const createRainbowSparkle = (x: number, y: number) => {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';

      const color = colors[Math.floor(Math.random() * colors.length)];
      sparkle.style.background = color;
      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;

      document.body.appendChild(sparkle);
      particles.push(sparkle);

      setTimeout(() => {
        sparkle.remove();
        const index = particles.indexOf(sparkle);
        if (index !== -1) particles.splice(index, 1);
      }, 1000);
    };

    const handleMove = (e: MouseEvent) => {
      createRainbowSparkle(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-black">
      {/* Fundo com vídeo */}
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/The_scene_in_202506190918.mp4" type="video/mp4" />
      </video>

      {/* Camada de contraste */}
      <div className="absolute inset-0 bg-black bg-opacity-60 z-10" />

      {/* Conteúdo principal */}
      <div className="relative z-20 h-full flex items-center justify-center text-white sparkle-cursor">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6 drop-shadow-xl">
            🦄 Conecte-se com a Twitch no surto 🌈
          </h1>
          <a
            href={twitchLoginUrl}
            className="bg-purple-600 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-all shadow-xl hover:shadow-2xl"
          >
            Entrar com Twitch
          </a>
        </div>
      </div>

      {/* Estilos para partículas e cursor */}
      <style jsx global>{`
        .sparkle-cursor {
          cursor: url('https://cur.cursors-4u.net/cursors/cur-9/cur812.cur'), auto;
        }

        .sparkle {
          position: fixed;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          box-shadow: 0 0 10px white;
          animation: sparkleFade 1s ease-out forwards;
        }

        @keyframes sparkleFade {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(2);
          }
        }
      `}</style>
    </div>
  );
}
