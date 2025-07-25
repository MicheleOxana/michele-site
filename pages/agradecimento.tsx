import React from 'react';
import Link from 'next/link';

export default function Agradecimento() {
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
        <h1 className="text-4xl font-bold text-fuchsia-400 drop-shadow-[0_0_6px_fuchsia] mb-10 uppercase tracking-wide text-center">
          💖 Agradecimento da Unixana & MicheleOxana™
        </h1>

        <div className="text-purple-200 space-y-6 text-lg">
          <p className="italic text-center text-pink-300">
            “No meio do caos, nasceu uma estrela com wi-fi instável, microfone estourado e uma vontade absurda de surtar junto com vocês.”
          </p>

          <p>
            A todos vocês que chegaram até aqui — entre um "oi Unixana", um grito no chat, uma raid inesperada, ou só uma presença caladinha no lurk — <strong>obrigado de todo o coração pixelado dessa streamer surtada</strong>.
          </p>

          <p>
            Nada disso faria sentido sem vocês:
            <br/>🧚‍♀️ Os que comentam, os que lurkam, os que apoiam no Pix ou com risadas,
            <br/>🦄 Os que fazem parte da bagunça do Discord,
            <br/>🎮 Os que riram nos reacts, surtaram nos comandos, invocaram o tarot ou grindaram as Xaninhas Coins como se fossem fragmentos da alma.
          </p>

          <p>
            Vocês são minha comunidade, meu acolhimento, meu palco de surto, e meu motivo pra continuar criando, mesmo nos dias em que o mundo parece glitchado.
          </p>

          <p className="bg-purple-950/80 border border-fuchsia-700 rounded-xl p-6 shadow-md text-pink-200 italic">
            Unixana™ — essa entidade unicórnica que nasceu pra proteger o surto — também deixa seu recado:
            <br/><br/>
            “Se você se sentiu acolhade, viu uma parte de você aqui, ou simplesmente se divertiu... então minha missão tá cumprida, monamour. E se prepare, porque o surto ainda tá só começando. A próxima fase vai ser ainda mais glitterizada.”
          </p>

          <p className="text-center font-bold text-fuchsia-300 text-2xl mt-10">
            Obrigade por existirem.<br/>Obrigade por acreditarem.<br/>Obrigade por surtarem comigo.<br/>
            E lembrem-se: aqui não é só live — <span className="text-pink-400">aqui é uma dimensão mágica de acolhimento e caos glitterizado ✨</span>
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
      `}</style>
    </div>
  );
}