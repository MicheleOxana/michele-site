import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Conteudos() {
  const [videos, setVideos] = useState<any[]>([]);

useEffect(() => {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  const channelId = 'UCQ_ElHRwpREHimV0HyjDBWw';

  fetch(`https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=3`)
    .then((res) => res.json())
    .then((data) => setVideos(data.items || []))
    .catch((err) => console.error('Erro ao buscar vídeos do YouTube:', err));
}, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-black text-white flex flex-col font-sans relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none animate-glitter z-0"></div>

      <header className="z-10 bg-purple-950 text-purple-200 p-4 flex items-center justify-between shadow-lg shadow-purple-700/30 border-b border-purple-700">
        <h1 className="text-2xl font-bold tracking-widest">💜 MicheleOxana™ <span className="text-sm font-normal italic">Live</span></h1>
        <nav className="space-x-3 text-sm font-bold tracking-wide uppercase text-fuchsia-300">
          <Link href="/"><a className="hover:text-white transition-shadow duration-300 shadow-fuchsia-500 hover:shadow-glow">Início</a></Link>
          <Link href="/primeiros-passos"><a className="hover:text-white transition-shadow duration-300 shadow-fuchsia-500 hover:shadow-glow">Primeiros Passos</a></Link>
          <Link href="/sobre"><a className="hover:text-white transition-shadow duration-300 shadow-fuchsia-500 hover:shadow-glow">Sobre</a></Link>
          <Link href="/xaninhas-coins"><a className="hover:text-white transition-shadow duration-300 shadow-fuchsia-500 hover:shadow-glow">Xaninhas Coins</a></Link>
          <Link href="/comandos"><a className="hover:text-white transition-shadow duration-300 shadow-fuchsia-500 hover:shadow-glow">Comandos</a></Link>
          <Link href="/loja"><a className="hover:text-white transition-shadow duration-300 shadow-fuchsia-500 hover:shadow-glow">Loja</a></Link>
          <Link href="/conteudos"><a className="hover:text-white transition-shadow duration-300 shadow-fuchsia-500 hover:shadow-glow">Conteúdos</a></Link>
          <Link href="/grimward"><a className="hover:text-white transition-shadow duration-300 shadow-fuchsia-500 hover:shadow-glow">Grimward</a></Link>
          <Link href="/cantinho-do-viewer"><a className="hover:text-white transition-shadow duration-300 shadow-fuchsia-500 hover:shadow-glow">Cantinho do Viewer</a></Link>
          <Link href="/agradecimento"><a className="hover:text-white transition-shadow duration-300 shadow-fuchsia-500 hover:shadow-glow">Agradecimento</a></Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col justify-center items-center z-10 text-left px-4 py-20 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-fuchsia-400 drop-shadow-[0_0_6px_fuchsia] mb-6 uppercase tracking-wide text-center">
          ✨ Conteúdos da Mamãe MicheleOxana
        </h1>
        <div className="text-purple-200 space-y-6 text-lg text-center max-w-3xl">
          <p>Seja na live, no fogão ou no caos do chat, aqui o conteúdo é tão diverso quanto os surtos da mamãe. A transmissão principal gira em torno de games como <strong>Teamfight Tactics</strong>, <strong>Dead by Daylight</strong>, <strong>Valorant</strong> e <strong>Minecraft</strong> — mas não se engane, mona! O surto é completo, com lives culinárias (sim, a <strong>Michele na Cuzinha</strong> é real), joguinhos indies, terror, desafios e até bate-papo reflexivo quando bate a Lua em Leão 🌕🦡.</p>

          <div className="grid grid-cols-2 gap-4 mt-10">
            <img src="/img/tft.jpeg" className="rounded-lg shadow-md" alt="Teamfight Tactics" />
            <img src="/img/dbd.jpeg" className="rounded-lg shadow-md" alt="Dead by Daylight" />
            <img src="/img/valorant.jpeg" className="rounded-lg shadow-md" alt="Valorant" />
            <img src="/img/minecraft.jpeg" className="rounded-lg shadow-md" alt="Minecraft" />
          </div>

          <h2 className="text-2xl font-bold mt-16 text-pink-300">📺 Conteúdos no YouTube</h2>
          <p>As lives deixam rastros e surtos eternizados em vídeos no canal do YouTube! Tem gameplay, compilado de momentos icônicos, treta com killer no DBD, faxina espiritual no Minecraft e, claro, as receitas mais insanas da <strong>Cuzinha da Mamãe</strong>. Se você perdeu a live, é lá que você se encontra de novo com o caos. Inscreva-se no canal e ative o sininho, mona! Porque aqui o babado é constante ✨</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
            {videos.map((video) => (
              <div key={video.id.videoId} className="rounded overflow-hidden shadow-md bg-purple-950 border border-fuchsia-600">
                <a
                  href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} className="w-full" />
                  <div className="p-2 text-sm text-purple-100 font-semibold hover:text-white transition duration-200">
                    {video.snippet.title}
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="z-10 bg-purple-950 text-purple-400 text-xs text-center py-2 border-t border-purple-700">
        © 2025 <span className="font-semibold text-white">MicheleOxana™</span> — powered by <span className="italic text-pink-400">Unixana 🦤</span>
      </footer>

      <style jsx>{`
        @keyframes glitter {
          0% { background-position: 0 0; }
          100% { background-position: 1000px 1000px; }
        }
        .animate-glitter {
          background-image: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 20px 20px;
          animation: glitter 40s linear infinite;
        }
        .shadow-glow {
          text-shadow: 0 0 6px rgba(255, 0, 255, 0.6), 0 0 10px rgba(255, 0, 255, 0.4);
        }
      `}</style>
    </div>
  );
}
