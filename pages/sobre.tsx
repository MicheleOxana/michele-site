import React from 'react';
import Link from 'next/link';

export default function Sobre() {
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
          👑 Sobre a Mamãe Michele Oxana
        </h1>
        <div className="text-purple-200 space-y-6 text-lg">
          <p>LGBTQIA+, Assistente de Importação e Exportação, viciado em viajar e virginiano (isso mesmo, sou do tipo que faz planilha até pra surtar). Tenho 33 anos, mas com energia de 15 quando o surto bate. Direto do Rio de Janeiro para o mundo, tô aqui pra servir entretenimento, deboche e caos nas lives da Twitch, TikTok e agora nesse meu império pessoal — meu sitezinho surtado!</p>

          <p>Comecei as lives na extinta Trovo em 26 de agosto de 2021 (RIP). Nunca fui geek de carteirinha, mas tem uma memória que moldou minha essência gamer: sentar na frente da TV com meu pai e irmão pra jogar The Legend Of Zelda – Ocarina Of Time. Aquelas tardes foram meu batismo nerd.</p>

          <p>📼 Curiosidades? Meu pai comprava TODAS as edições da revista da Nintendo. Quando a gente se perdia no jogo e a revista ainda não tinha a parte que a gente tava, ele LIGAVA pra São Paulo (isso mesmo, por telefone fixo, mona!) e perguntava como passar da parte. Ele era mais gamer que eu, acredita?</p>

          <p>👣 Outra pérola: ele escondia fitas novas do Nintendo 64 dentro das meias e fazia a gente tirar o sapato dele quando chegava do trabalho. E era sempre briga! Meu irmão sempre tirava o pé com o jogo bom, mas no final todo mundo jogava junto. Briga, tapa, choro, minha mãe metendo bronca... ah, infância!</p>

          <p>O tempo passou, fui pra faculdade, fiz teatro, encarei a vida adulta. Mas foi vendo Samira Close jogar que me apaixonei por Cyber Hunter e voltei ao mundo dos games. Precisava de um nome pra criar meu personagem — e lembrando da série <i>Tales of the City</i>, nasceu Michele Oxana: minha drag espiritual e codinome do caos.</p>

          <p>Montei meu primeiro PC gamer pós término de um relacionamento de quase 4 anos. Conheci Dead by Daylight, GTA RP, Valorant, e principalmente conheci gente incrível. Quando a pandemia veio, eu tava isolado, sem chão. Mas colocar o headset era minha salvação. A live virou meu mundo e meu remédio. Nunca pensei que me descobriria tanto ali, surtando, rindo e jogando com vocês.</p>

          <p>Comecei na Trovo, passei um ano lá... até que me hackearam AO VIVO. Sim, em live! Fiquei arrasado. Nenhum suporte, só tristeza. Perdi meu gato neném logo depois — meu mascote, minha luz. Aquilo me derrubou. Parei tudo.</p>

          <p>Mas como boa resiliente surtada que sou, voltei! Twitch, TikTok e esse surto glamouroso que é meu site. Aqui você tem tudo: comandos, coins, conteúdos exclusivos e caos organizado com glitter.</p>

          <p>🎥 Tem vídeo no YouTube contando o drama da Trovo: <a href="https://www.youtube.com/watch?v=v7uYEs9zML8&t=3503s" target="_blank" className="text-fuchsia-300 underline">Assista aqui</a></p>

          <p className="font-semibold italic">Se você chegou até aqui, saiba: você nunca vai estar sozinho. Aqui é sua casa. Aqui é surto, é amor, é acolhimento. E não precisa ficar com medo: pra usar o site, sim, você precisa logar com sua conta da Twitch. Mas relaxa, eu não tenho acesso a nada além do seu nome, e isso é só pra te dar as <strong>Xaninhas Coins</strong>, permitir seus resgates e deixar sua experiência mais babadeira. Sem riscos, sem roubo, só glitter.</p>

          <p>Às vezes, a gente precisa cair lá no fundo do poço pra entender que a gente mesmo é a corda. E ninguém vai puxar a gente além de nós mesmos. Então agarra essa corda, mona, e sobe brilhando!</p>

          <p className="text-right text-fuchsia-300 font-bold text-lg">
            Com carinho (e surto),<br />
            Michele Oxana 🦄
          </p>
        </div>
      </main>

      <footer className="z-10 bg-purple-950 text-purple-400 text-xs text-center py-2 border-t border-purple-700">
        © 2025 <span className="font-semibold text-white">MicheleOxana™</span> — powered by <span className="italic text-pink-400">Unixana 🦄</span>
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