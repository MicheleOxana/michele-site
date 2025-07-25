import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useAuth } from '../src/context/AuthContext';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated === false) {
      router.replace('/login');
    }
  }, [isAuthenticated]);

  if (isAuthenticated === undefined) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <p className="text-xl">✨ Carregando o surto... segura aí!</p>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const [tempoSurto, setTempoSurto] = useState('fora do ar');
  const [viewers, setViewers] = useState('off');
  const [imagemQR, setImagemQR] = useState<'amazon' | 'pix'>('amazon');
  const [ultimos, setUltimos] = useState({
    sub: 'carregando...',
    bits: 'carregando...',
    follower: 'carregando...'
  });

  const [highlights, setHighlights] = useState({ sub: '', bits: '', follow: '' });

  useEffect(() => {
    const intervalo = setInterval(() => {
      setImagemQR(prev => (prev === 'amazon' ? 'pix' : 'amazon'));
    }, 30000);
    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    const frasesFixas = [
      "💅 Dá sub pra gatinha!",
      "👅 Bota pra fora que a Michele mama!",
      "🗑️ LIXO.",
      "✨ A beleza é uma maldição que eu carrego com glitter!",
      "🌈 Segura minha magia que eu vou de base!",
      "💋 Me respeita que eu sou a Unixana original, unicórnia do caos!"
    ];

    const frasesDinamicas = () => {
      if (tempoSurto === 'fora do ar') return [
        "Unixana tá de folga hoje, mas volta mais surtada!",
        "Cadê a live, Mona? Unixana tá entediada.",
        "🧹 A sala tá limpa, mas a live tá off!"
      ];

      const v = parseInt(viewers.toString());
      if (v > 50) return [
        "🔥 TÁ LOTADO! Unixana surtando em 3, 2, 1...",
        "🧨 Que caos gostoso! Viewer demais, surto a mais!",
        "💥 Chegou geral e a loucura tá liberada!"
      ];
      if (v > 10) return [
        "💅 O surto tá médio, mas refinado!",
        "🎭 O palco tá armado e tem gente assistindo!",
        "✨ Vem mais gente pro furdunço!"
      ];

      return [
        "🧍 Cadê os viewers, gente? Unixana sozinha nesse surto!",
        "📢 Chama o povo que a live tá tímida!",
        "💋 Até 3 viewers fazem o caos, confia!"
      ];
    };

    let i = 0;
    const frases = [...frasesFixas, ...frasesDinamicas()];
    const intervalo = setInterval(() => {
      const el = document.getElementById("fala-unixana");
      if (el) {
        i = (i + 1) % frases.length;
        el.textContent = frases[i];
      }
    }, 15000);
    return () => clearInterval(intervalo);
  }, [tempoSurto, viewers]);

  useEffect(() => {
    const atualizarRelogio = async () => {
      try {
        const res = await axios.get('/api/uptime');
        if (!res.data.isLive) {
          setTempoSurto('fora do ar');
          return;
        }
        const startedAt = new Date(res.data.startedAt);
        const interval = setInterval(() => {
          const agora = new Date();
          const diff = agora.getTime() - startedAt.getTime();
          const horas = Math.floor(diff / (1000 * 60 * 60));
          const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const segundos = Math.floor((diff % (1000 * 60)) / 1000);
          setTempoSurto(`${horas}h ${minutos}min ${segundos}s`);
        }, 1000);
        return () => clearInterval(interval);
      } catch (e) {
        setTempoSurto('fora do ar');
      }
    };
    atualizarRelogio();
  }, []);

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
    <>
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

    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-black text-white flex flex-col font-sans relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none animate-glitter z-0"></div>

      <header className="z-10 bg-purple-950 text-purple-200 p-4 flex items-center justify-between shadow-lg shadow-purple-700/30 border-b border-purple-700">
        <h1 className="text-2xl font-bold tracking-widest">💜 MicheleOxana™ <span className="text-sm font-normal italic">Live</span></h1>
        <nav className="space-x-3 text-sm font-bold tracking-wide uppercase text-fuchsia-300">
          <Link href="/" legacyBehavior><a className="hover:text-white transition-shadow duration-300 shadow-fuchsia-500 hover:shadow-glow">Início</a></Link>
          <Link href="/primeiros-passos" legacyBehavior><a className="hover:text-white transition-shadow duration-300 shadow-fuchsia-500 hover:shadow-glow">Primeiros Passos</a></Link>
          <Link href="/sobre" legacyBehavior><a className="hover:text-white transition-shadow duration-300 shadow-fuchsia-500 hover:shadow-glow">Sobre</a></Link>
          <Link href="/xaninhas-coins" legacyBehavior><a className="hover:text-white transition-shadow duration-300 shadow-fuchsia-500 hover:shadow-glow">Xaninhas Coins</a></Link>
          <Link href="/comandos" legacyBehavior><a className="hover:text-white transition-shadow duration-300 shadow-fuchsia-500 hover:shadow-glow">Comandos</a></Link>
          <Link href="/loja" legacyBehavior><a className="hover:text-white transition-shadow duration-300 shadow-fuchsia-500 hover:shadow-glow">Loja</a></Link>
          <Link href="/conteudos" legacyBehavior><a className="hover:text-white transition-shadow duration-300 shadow-fuchsia-500 hover:shadow-glow">Conteúdos</a></Link>
          <Link href="/grimward" legacyBehavior><a className="hover:text-white transition-shadow duration-300 shadow-fuchsia-500 hover:shadow-glow">Grimward</a></Link>
          <Link href="/cantinho-do-viewer" legacyBehavior><a className="hover:text-white transition-shadow duration-300 shadow-fuchsia-500 hover:shadow-glow">Cantinho do Viewer</a></Link>
          <Link href="/agradecimento" legacyBehavior><a className="hover:text-white transition-shadow duration-300 shadow-fuchsia-500 hover:shadow-glow">Agradecimento</a></Link>
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
            src="https://player.twitch.tv/?channel=micheleoxana&parent=micheleoxana.live"
            height="82%"
            width="95%"
            allowFullScreen
            className="rounded-lg shadow-2xl border-4 border-fuchsia-600 scale-105"
          ></iframe>

          <div className="absolute top-2 right-2 z-40 bg-purple-950/60 text-white px-3 py-1 text-sm rounded-xl shadow-lg border border-fuchsia-500">
            ⏰ em surto há: {tempoSurto}
          </div>

          <div className="absolute bottom-2 left-4 z-40 bg-purple-950/60 text-white px-3 py-1 text-sm rounded-xl shadow-lg border border-fuchsia-500">
            🧍 viewers: {viewers}
          </div>

                   <div className="absolute bottom-2 left-48 z-40 bg-purple-950/60 text-white px-3 py-1 text-sm rounded-xl shadow-lg border border-fuchsia-500 hover:bg-fuchsia-700 cursor-pointer transition-all"
     onClick={async () => {
       try {
         const res = await axios.post('/api/follow');
         if (res.status === 204) alert('💜 Você agora segue a MicheleOxana! Obrigado pelo carinho!');
         else alert('Algo deu errado! Já segue ou não foi possível seguir agora.');
       } catch {
         alert('⚠️ Oops! Erro ao tentar seguir. Verifique se está logado com a Twitch.');
       }
     }}>
  💜 seguir a live
</div>

<a
  href="https://www.twitch.tv/products/micheleoxana"
  target="_blank"
  rel="noopener noreferrer"
  className="absolute bottom-2 left-[16rem] z-40 bg-purple-950/60 text-white px-3 py-1 text-sm rounded-xl shadow-lg border border-yellow-400 hover:bg-yellow-600 cursor-pointer transition-all"
>
  💰 dar sub
</a>

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
            <div id="fala-unixana" className="text-xs bg-white text-black px-3 py-1 rounded-t-xl rounded-br-xl mb-1 shadow-lg max-w-[160px] text-center font-bold border border-purple-300">
              Dá sub pra gatinha!
            </div>
            <img src="/icons/unixana.svg" alt="Unixana Mascote" className="w-full h-auto drop-shadow-[0_0_12px_gold]" />
          </div>
        </main>

      <aside className="w-[25%] min-w-[300px] max-w-[400px] bg-purple-950 border-l border-purple-700 relative flex flex-col">
          <div className="text-center text-fuchsia-300 py-1 border-b border-purple-700 font-bold text-sm bg-purple-900">
            ✨ Chat da Galera ✨
          </div>
          <iframe
            src="https://www.twitch.tv/embed/micheleoxana/chat?parent=micheleoxana.live"
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
        .shadow-glow {
          text-shadow: 0 0 6px rgba(255, 0, 255, 0.6), 0 0 10px rgba(255, 0, 255, 0.4);
        }
      `}</style>
    </div>
    </>
  );
}
