import React from 'react';
import Link from 'next/link';

export default function Comandos() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-black text-white flex flex-col font-sans relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none animate-glitter z-0"></div>

      <header className="z-10 bg-purple-950 text-purple-200 p-4 flex items-center justify-between shadow-lg shadow-purple-700/30 border-b border-purple-700">
        <h1 className="text-2xl font-bold tracking-widest">💜 MicheleOxana™ <span className="text-sm font-normal italic">Live</span></h1>
        <nav className="space-x-3 text-sm font-bold tracking-wide uppercase text-fuchsia-300">
          <Link href="/">Início</Link>
          <Link href="/primeiros-passos">Primeiros Passos</Link>
          <Link href="/sobre">Sobre</Link>
          <Link href="/xaninhas-coins">Xaninhas Coins</Link>
          <Link href="/comandos">Comandos</Link>
          <Link href="/loja">Loja</Link>
          <Link href="/conteudos">Conteúdos</Link>
          <Link href="/grimward">Grimward</Link>
          <Link href="/cantinho-do-viewer">Cantinho do Viewer</Link>
          <Link href="/agradecimento">Agradecimento</Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col justify-center items-center z-10 text-left px-4 py-20 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-fuchsia-400 drop-shadow-[0_0_6px_fuchsia] mb-10 uppercase tracking-wide text-center animate-float">
          📜 Lista dos Comandos da Live
        </h1>

        <div className="text-purple-200 space-y-10 text-lg">
          <p className="italic text-center text-pink-300 animate-fadein">
            “Unixana ouviu o surto do chat... e respondeu com uma chuva de comandos babadeiros.”
          </p>

          <section className="bg-purple-950/70 border border-fuchsia-700 rounded-2xl p-6 shadow-lg shadow-fuchsia-900">
            <h2 className="text-2xl font-bold text-fuchsia-300 mb-2">💬 Comandos Clássicos</h2>
            <p className="mt-2 text-purple-300">
              Os comandos clássicos são aqueles que viraram patrimônio da live: informativos, engraçados, icônicos e com o selo de glitter aprovado pela própria Michele. Use no chat da Twitch digitando com exclamação, tipo <code className="bg-purple-700 px-1 rounded font-mono text-pink-200">!surto</code>.
            </p>
            <ul className="list-disc list-inside mt-4 space-y-1 text-sm">
              <li><strong>!xaninhacoins</strong> — Veja quantas moedas você tem. Rumo ao luxo digital!</li>
              <li><strong>!lixo</strong> — Contador de quantas vezes a Michele já humilhou alguém com classe.</li>
              <li><strong>!discord / !tiktok / !instagram / !youtube / !streamloots</strong> — Links dos reinos do surto fora da Twitch.</li>
              <li><strong>!pix / !prime</strong> — Apoie a live com glamour e ganhe alertas ao vivo!</li>
              <li><strong>!beijo / !glitter / !tilt / !gritar / !susto / !parou / !respeito</strong> — Reações surtadas que fazem o chat ferver.</li>
              <li><strong>!mamacita / !mutante / !cadela / !piranha / !intensa / !barraqueira</strong> — Reações para seus mood.</li>
              <li><strong>!kitkiller / !main / !setup / !meta / !subathon / !alerta / !drop / !globo / !furacão / !selo</strong> — Info gamer e caos da gameplay.</li>
              <li><strong>!minecraft</strong> — Entre no mundo místico do servidor Grimward!</li>
              <li><strong>!backseat</strong> — Avisa que o coach não foi chamado, mona!</li>
              <li><strong>!baforada / !kawai / !chiclete / !vacilou / !hino / !purpurina / !torcida / !choque</strong> — Aleatoriedades escolhidas por Unixana.</li>
              <li><strong>!kitbabado / !cafuné / !fofoca / !lanche / !ban / !secret / !coceira / !close / !desmaiei</strong> — Aleatoriedades com gosto de surto e café gelado.</li>
              <li><strong>!gay / !sapatao / !poc / !fada / !maricona / !furry / !alien</strong> — Comandos LGBTQIAPN+ pra enaltecer nossas existências brilhantes!</li>
              <li><strong>!modoativo / !bugada / !quebrou / !derrota / !humilhada / !derrame / !reage</strong> — Expressões de dor, glória e caos puro.</li>
              <li><strong>!id / !steam</strong> — Pra quem quer jogar ou trolar com classe.</li>
              <li><strong>!resumo / !revanche / !ranço / !doida / !mistica / !cancelada / !satan</strong> — A alma da live em forma de palavras.</li>
              <li><strong>!onlyfans / !xvideos / !boquinha</strong> — Picantezinhos, mas com elegância, claro.</li>
            </ul>
          </section>

          <section className="bg-purple-950/70 border border-fuchsia-700 rounded-2xl p-6 shadow-lg shadow-fuchsia-900">
            <h2 className="text-2xl font-bold text-fuchsia-300 mb-2">🎲 Comandos Aleatórios & Interativos</h2>
            <p className="mt-2 text-purple-300">
              Quer um pouco de caos randômico no seu dia? Use esses comandos que mudam a cada vez e botam Unixana pra jogar roleta russa com glitter.
            </p>
            <ul className="list-disc list-inside mt-4 space-y-1 text-sm">
              <li><strong>!cm</strong> — Tamanho revelado... eita Unixana, pra que expor?</li>
              <li><strong>!xaninhometro</strong> — Mede o quanto de surto tá correndo no seu sangue hoje.</li>
              <li><strong>!carma / !signo / !surto</strong> — Seu destino místico revelado em segundos.</li>
              <li><strong>!roleta</strong> — A sorte decide: Pix imaginário ou humilhação pública?</li>
              <li><strong>!tinder / !faria / !beijaria / !casaria / !shipp</strong> — Amor, caos e flertes imaginários.</li>
              <li><strong>!cancelar / !presente / !ranque / !exposed / !tapa</strong> — Aquelas interações que viram meme na live.</li>
              <li><strong>!sexo / !virgem / !versus</strong> — O lado quente, safado e competitivo da live.</li>
              <li><strong>!agente</strong> — Randomiza agentes de Valorant, incluindo Vyse, Tejo e Waylay (e até a Michele na cama 👀).</li>
              <li><strong>!quizlgbt</strong> — Um teste de conhecimento queer pra provar que você merece o glitter!</li>
            </ul>
          </section>

          <p className="mt-12 text-center text-fuchsia-300 text-xl font-semibold animate-float">
            Todos esses comandos funcionam ao vivo na live da <span className="italic text-pink-400">MicheleOxana™</span>. Quer ver o caos em ação?
            <br/>
            💄 Vem pro chat e solta um <code className="bg-purple-700 px-1 rounded font-mono text-pink-200">!surto</code> com a gente!
          </p>
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
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes fadein {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadein {
          animation: fadein 1.5s ease-out;
        }
      `}</style>
    </div>
  );
}
