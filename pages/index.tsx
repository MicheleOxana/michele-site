import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useAuth } from '../src/context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const [tempoSurto, setTempoSurto] = useState('fora do ar');
  const [viewers, setViewers] = useState('off');
  const [imagemQR, setImagemQR] = useState<'amazon' | 'pix'>('amazon');
  const [ultimos, setUltimos] = useState({
  sub: 'carregando...',
  bits: 'carregando...',
  follower: 'carregando...'
});

  // 🔁 Alternar entre Amazon e Pix a cada 30 segundos
  useEffect(() => {
    const intervalo = setInterval(() => {
      setImagemQR(prev => (prev === 'amazon' ? 'pix' : 'amazon'));
    }, 30000); // 30 segundos

    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    const frases = [
      "💅 Dá sub pra gatinha!",
      "👅 Bota pra fora que a Michele mama!",
      "🗑️ LIXO.",
      "✨ A beleza é uma maldição que eu carrego com glitter!",
      "🌈 Segura minha magia que eu vou de base!",
      "💋 Me respeita que eu sou a Unixana original, unicórnia do caos!"
    ];
    let i = 0;
    const intervalo = setInterval(() => {
      const el = document.getElementById("fala-unixana");
      if (el) {
        i = (i + 1) % frases.length;
        el.textContent = frases[i];
      }
    }, 20000);
    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const atualizarRelogio = async () => {
      try {
        const res = await axios.get('/api/uptime');
        if (!res.data.isLive) {
          setTempoSurto('fora do ar');
          return;
        }

        const startedAt = new Date(res.data.startedAt);

        interval = setInterval(() => {
          const agora = new Date();
          const diff = agora.getTime() - startedAt.getTime();

          const horas = Math.floor(diff / (1000 * 60 * 60));
          const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const segundos = Math.floor((diff % (1000 * 60)) / 1000);

          setTempoSurto(`${horas}h ${minutos}min ${segundos}s`);
        }, 1000);
      } catch (e) {
        setTempoSurto('fora do ar');
      }
    };

    atualizarRelogio();
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
  const buscarUltimos = async () => {
    try {
      const res = await axios.get('/api/ultimos'); // depois vamos ligar isso com a Twitch
      setUltimos(res.data);
    } catch (e) {
      setUltimos({
        sub: 'erro',
        bits: 'erro',
        follower: 'erro'
      });
    }
  };

  buscarUltimos();
  const interval = setInterval(buscarUltimos, 15000);
  return () => clearInterval(interval);
}, []);


 // ✅ Efeito para buscar os viewers
useEffect(() => {
  const atualizarViewers = async () => {
    try {
      const res = await axios.get('/api/viewers');
      setViewers(res.data.viewers);
    } catch (e) {
      setViewers('off');
    }
  };
  atualizarViewers();
  const interval = setInterval(atualizarViewers, 15000);
  return () => clearInterval(interval);
}, []);

// ✅ Estado para os destaques
const [highlights, setHighlights] = useState<{
  sub: string;
  bits: string;
  follow: string;
}>({
  sub: '',
  bits: '',
  follow: ''
});

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const res = await axios.get('/api/highlights');
        setHighlights(res.data);
      } catch (err) {
        console.error('Erro ao buscar dados da Twitch', err);
      }
    };

    fetchHighlights();
    const interval = setInterval(fetchHighlights, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-black text-white flex flex-col font-sans relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none animate-glitter z-0"></div>

      {/* 🔻 BLOCO DO QR CÓDIGO ALTERNANTE */}
      <div className="fixed top-1/2 left-2 transform -translate-y-1/2 z-50 w-[170px]">
        {imagemQR === 'amazon' ? (
          <a
            href="https://www.amazon.com.br/shop/micheleoxana"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/icons/amazoncard.svg"
              alt="Compre com meu link da Amazon"
              className="w-full drop-shadow-[0_0_8px_gold] hover:scale-105 transition-transform"
            />
          </a>
        ) : (
          <img
            src="/icons/pixcard.svg"
            alt="Doe no Pix"
            className="w-full drop-shadow-[0_0_8px_fuchsia] hover:scale-105 transition-transform"
          />
        )}
      </div>

      <header className="z-10 bg-purple-950 text-purple-200 p-4 flex items-center justify-between shadow-lg shadow-purple-700/30 border-b border-purple-700">
        <h1 className="text-2xl font-bold tracking-widest">
          💜 MicheleOxana™ <span className="text-sm font-normal italic">Live</span>
        </h1>
        <nav className="space-x-4 text-sm">
          <a href="#" className="hover:text-fuchsia-400 transition">Sobre</a>
          <a href="#" className="hover:text-fuchsia-400 transition">Comandos</a>
          <a href="#" className="hover:text-fuchsia-400 transition">Ranking</a>
        </nav>
      </header>

      <div className="flex flex-1 z-10">
        <aside className="w-48 bg-purple-950 p-4 border-r border-purple-700 shadow-inner shadow-purple-800">
  <h2 className="text-lg font-semibold mb-4">✨ Apoio ao surto</h2>
  <ul className="space-y-2 text-sm">
    <li>💜 Último Sub: <span className="text-pink-400">{highlights.sub}</span></li>
    <li>💰 Top Bits: <span className="text-fuchsia-300">{highlights.bits}</span></li>
    <li>🌈 Novo Seguidor: <span className="text-purple-300">{highlights.follow}</span></li>
  </ul>
</aside>


        <main className="flex-1 flex justify-center items-center overflow-hidden relative bg-purple-950 bg-opacity-30">
          <iframe
            src="https://player.twitch.tv/?channel=micheleoxana&parent=localhost"
            height="720"
            width="1280"
            allowFullScreen
            className="rounded-lg shadow-2xl border-4 border-fuchsia-600 scale-105"
          ></iframe>

          <div className="absolute top-2 right-2 z-40 bg-purple-950/60 text-white px-3 py-1 text-sm rounded-xl shadow-lg border border-fuchsia-500">
            ⏰ em surto há: {tempoSurto}
          </div>

          <div className="absolute bottom-0 left-4 z-40 bg-purple-950/60 text-white px-3 py-1 text-sm rounded-xl shadow-lg border border-fuchsia-500">
            🧍 viewers: {viewers}
          </div>

          <div className="absolute bottom-0 right-4 z-30 flex gap-4">
            <a href="https://discord.gg/ds7j2x3RQQ" target="_blank" rel="noopener noreferrer">
              <img src="/icons/discord.svg" alt="Discord" className="w-16 h-16 hover:scale-110 transition-transform drop-shadow-[0_0_6px_fuchsia]" />
            </a>
            <a href="https://instagram.com/jeffersonloyola" target="_blank" rel="noopener noreferrer">
              <img src="/icons/instagram.svg" alt="Instagram" className="w-16 h-16 hover:scale-110 transition-transform drop-shadow-[0_0_6px_fuchsia]" />
            </a>
            <a href="https://youtube.com/@micheleoxana" target="_blank" rel="noopener noreferrer">
              <img src="/icons/youtube.svg" alt="YouTube" className="w-14 h-14 hover:scale-110 transition-transform drop-shadow-[0_0_6px_red]" />
            </a>
            <a href="https://tiktok.com/@micheleoxana" target="_blank" rel="noopener noreferrer">
              <img src="/icons/tiktok.svg" alt="TikTok" className="w-14 h-14 hover:scale-110 transition-transform drop-shadow-[0_0_6px_cyan]" />
            </a>
          </div>

          <div className="fixed bottom-4 left-4 z-50 flex flex-col items-center w-32">
            <div
              id="fala-unixana"
              className="text-xs bg-white text-black px-3 py-1 rounded-t-xl rounded-br-xl mb-1 shadow-lg max-w-[160px] text-center font-bold border border-purple-300"
            >
              Dá sub pra gatinha!
            </div>
            <img src="/icons/unixana.svg" alt="Unixana Mascote" className="w-full h-auto drop-shadow-[0_0_12px_gold]" />
          </div>
        </main>

        <aside className="w-96 bg-purple-950 border-l border-purple-700 relative flex flex-col">
          <div className="text-center text-fuchsia-300 py-1 border-b border-purple-700 font-bold text-sm bg-purple-900">
            ✨ Chat da Galera ✨
          </div>
          <iframe
            src="https://www.twitch.tv/embed/micheleoxana/chat?parent=localhost"
            height="100%"
            width="100%"
            className="flex-1"
          ></iframe>
        </aside>
      </div>

      <footer className="z-10 bg-purple-950 text-purple-400 text-xs text-center py-2 border-t border-purple-700">
        © 2025 <span className="font-semibold text-white">MicheleOxana™</span> — Site surtado powered by <span className="italic text-pink-400">Unixana 🦄</span>
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
      `}</style>
    </div>
  );
}
