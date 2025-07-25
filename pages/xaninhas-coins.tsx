import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface RankItem {
  nick: string;
  pontos: number;
}

export default function XaninhasCoins() {
  const [ranking, setRanking] = useState<RankItem[]>([]);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const res = await fetch('/data/pontuacoeslive.json');
        const data = await res.json();

        const ordenado: RankItem[] = Object.entries(data)
          .map(([nick, pontos]) => ({
            nick,
            pontos: Number(pontos),
          }))
          .sort((a, b) => b.pontos - a.pontos)
          .slice(0, 20);

        setRanking(ordenado);
      } catch (err) {
        console.error('Erro ao carregar ranking:', err);
      }
    };

    fetchRanking();
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
          💰 Xaninhas Coins: o surto tem valor!
        </h1>

        <div className="text-purple-200 space-y-6 text-lg">
          <p>
            As <strong>Xaninhas Coins</strong> são as bitcoins mais babadeiras do entretenimento LGBTQIA+ BR, meu amor! Só que aqui, em vez de NFT, a gente dá valor real ao surto: assistiu a live? Ganhou coins. Ficou no lurk? Ganhou também. Tá presente? Já garantiu o seu pix emocional em forma de ponto.
          </p>

          <p>
            Com as Xaninhas Coins, você pode resgatar:<br/>
            🎬 Filmes ou séries pra gente assistir juntes<br/>
            👀 Reacts surtados<br/>
            🎭 Viradões culturais e participações especiais<br/>
            E em breve, SORTEIOS exclusivos que só quem é fiel do glitter participa. Por enquanto a mamãe tá humilde, mas com sua ajuda a gente chega lá e barbariza geral!
          </p>

          <p>
            📌 Informações práticas pra você não perder nada:
            <ul className="list-disc list-inside ml-4 mt-2">
              <li>Entre na aba <Link href="/loja"><a className="text-fuchsia-300 underline">Loja</a></Link> pra ver os resgates disponíveis</li>
              <li>Digite <code>!xaninhacoins</code> no chat pra ver sua pontuação</li>
              <li>Ganho por tempo de live:<br/>
                — Viewer comum: 10 coins a cada 10min<br/>
                — Sub Tier 1: 20 coins<br/>
                — Sub Tier 2: 25 coins<br/>
                — Sub Tier 3: 30 coins</li>
            </ul>
          </p>

          <p>
            💎 <strong>Sistema de Fidelidade</strong>:
            <br/>Trouxe um migo pra live? Ele só precisa seguir e dizer que foi você que indicou. Você ganha 300 coins como recompensa! Mas ó, não vem de espertinha usando conta fake. Se for pego: coins zeradas, sem choro e sem glitter.
          </p>

          <h2 className="text-3xl font-bold text-fuchsia-400 mt-10 mb-4 text-center">🏆 Top 20 do Surto — Ranking de Xaninhas</h2>
          <div className="bg-purple-950/80 border border-fuchsia-700 rounded-xl p-6 shadow-md">
            <ol className="list-decimal list-inside space-y-2 text-fuchsia-300 text-lg">
              {ranking.map((item, index) => (
                <li key={index}>
                  @{item.nick} — {item.pontos} xaninhinhas
                </li>
              ))}
            </ol>
          </div>
        </div>
      </main>

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
  );
}
