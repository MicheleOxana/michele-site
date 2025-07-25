import React from 'react';
import Link from 'next/link';

export default function PrimeirosPassos() {
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
          💫 Cheguei agora, e o surto é real... e agora?
        </h1>
        <div className="text-purple-200 space-y-6 text-lg">
          <p>Calma, calmíssima! A mamãe tá aqui pra te pegar no colo do surto e te ensinar tudo com glitter e paciência.</p>

          <p>Atualmente faço live em duas plataformas — Twitch e TikTok — e se você tá aqui, é porque já caiu nessa dimensão mágica. Na <strong>Twitch</strong>, temos os moderadores (ícone de espadinha 🗡️) que tão sempre de olho no caos do chat. Qualquer dúvida, dá um grito neles! Eles são os braços armados do surto controlado.</p>

          <p>Você pode acessar a aba <Link href="/comandos"><a className="text-fuchsia-400 underline">Comandos</a></Link> pra ver tudo que pode fazer com o nosso mascote <strong>Unixana</strong>. Ele é mais que um bot — ele é uma entidade unicórnica que distribui <strong>Xaninhas Coins</strong> (que você entende melhor na aba <Link href="/xaninhas-coins"><a className="text-fuchsia-400 underline">Xaninhas Coins</a></Link>).</p>

          <p><strong>O que são bits?</strong> São créditos virtuais que você compra e usa pra causar na live, tipo mandar alertas, escolher killers no Dead by Daylight e muito mais. Digita <code>!bits</code> no chat e descubra o caos que isso pode liberar.</p>

          <p><strong>Subs</strong> são como o passe VIP do surto: você ganha emotes exclusivos, ignora os anúncios, pode mandar links, recebe tag de sub no Discord e ainda tem acesso à <em>Sala de Stream</em>. Ah, e se você assina o Amazon Prime, pode dar sub de graça com o <strong>Prime Gaming</strong>! Usa o comando <code>!prime</code> pra isso — e se usar meu link, me apoia ainda mais, mona!</p>

          <p>No <strong>TikTok</strong>, a vibe é parecida: temos subs e presentes, e o sistema de pontuação das Xaninhas Coins também funciona aqui no site, bonitinho.</p>

          <p><strong>As regras do surto são simples:</strong><br/>
          ❌ Sem preconceito (racismo, lgbtfobia, xenofobia, etc)<br/>
          ❌ Sem xingamento — aqui é ban direto, sem julgamento<br/>
          ❌ Sem spam, flood ou CAPS desnecessário<br/>
          🤝 Respeita as mana — tretou? Resolve fora do chat ou fala com a mamãe direto.<br/>
          ✅ E acima de tudo: SE DIVIRTA!</p>

          <p>Tá com dúvida técnica? Clica <a href="https://help.twitch.tv/" target="_blank" className="text-fuchsia-300 underline">aqui</a> e fala com o suporte da própria Twitch.</p>

          <h2 className="text-2xl font-bold mt-10 text-pink-300">🔐 Por que tenho que logar com a Twitch?</h2>
          <p>Porque esse site é mais interativo que meus surtos. Ele se conecta com sua conta pra:</p>
          <ul className="list-disc list-inside ml-4">
            <li>Mostrar quantas <strong>Xaninhas Coins</strong> você tem</li>
            <li>Liberar comandos e interações exclusivas</li>
            <li>Deixar o bot e a Unixana te reconhecerem como viewer VIP</li>
          </ul>

          <p className="mt-4">E não, meu amor, eu <strong>NÃO</strong> vou roubar seus dados. Eu sou surtada, mas sou ética. O login é feito diretamente com a Twitch usando OAuth — ou seja, é seguro, autorizado por você, e eu não vejo sua senha nem nada. É só pra liberar a magia mesmo ✨</p>

          <p className="mt-6">Seja muito bem-vinde ao caos! Qualquer dúvida, pergunta mesmo! Melhor perguntar do que fazer merda no susto 💋</p>
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