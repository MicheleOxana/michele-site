import React from 'react';
import Link from 'next/link';

interface Item {
  nome: string;
  preco: number;
  descricao: string;
  detalhes: string;
  key: string;
}

export default function Servicos() {
  const itens: Item[] = [
    { 
      nome: 'Bot para Discord Pessoal e de Live Stream 🎮', 
      preco: 300, 
      descricao: 'Seu próprio assistente virtual para o Discord, preparado para interagir e gerenciar sua comunidade.',
      detalhes: 'Comandos personalizados para interação. Automação de mensagens e comandos de moderação. Notificações de live automáticas para seu Discord. Reações criativas para engajar. Conteúdos e jogos personalizados! Além disso, há uma mensalidade de R$ 5 para hospedagem do bot, com manutenção contínua e suporte 24h.',
      key: 'botDiscord'
    },
    { 
      nome: 'Bot para Servidores 🚗💥', 
      preco: 400, 
      descricao: 'Aumente a diversão do seu servidor com bots personalizados e com comandos exclusivos, eventos automatizados e integração com a comunidade.',
      detalhes: 'Sistema de economia para RP. Missões e eventos automáticos para engajar os jogadores. Comandos personalizados para interações específicas do servidor. Integração com Discord para avisos e interações de chat. Tudo personalizável de acordo com a necessidade! Além disso, há uma mensalidade de R$ 15 para hospedagem do bot, com manutenção contínua e suporte 24h.',
      key: 'botRP'
    },

    { 
      nome: 'Bot com Integração Discord + Twitch 💖', 
      preco: 700, 
      descricao: 'Integração entre Discord e Twitch com comandos personalizados e interação automática para engajar seus seguidores nas duas plataformas.',
      detalhes: 'Integração com Twitch para eventos de subs, bits e raides. Comandos personalizados no Discord para interação com seus seguidores. Sistema de ranking e pontos entre Discord e Twitch. Notificações automáticas de live e eventos. São dois bots (um discord + um twitch como moderador). Personalizado de acordo com seu jeito e suas necessidades. Além disso, há uma mensalidade de R$ 20 para hospedagem do bot, com manutenção contínua e suporte 24h.',
      key: 'botDiscordTwitch'
    },

    { 
      nome: 'Bot com Integração Discord + Twitch + Site Personalizado ✨', 
      preco: 1700, 
      descricao: 'O pacote definitivo e exclusivo! Inclui bot personalizado, integração Twitch + Discord e um site exclusivo para uma experiência completa de interação com seus seguidores.',
      detalhes: 'Bot personalizado para Discord e Twitch. Integração entre plataformas para gerenciamento de seguidores, notificações e interações automáticas. Site exclusivo com design glamouroso e funcionalidades personalizadas para a sua comunidade. Sistema de pontos integrado na Twitch e ao site. Bot Twitch moderador com várias funcionalidades diferenciadas e personalizáveis de acordo com a necessidade da pessoa. Suporte completo para manutenção e melhorias após a entrega. Além disso, há uma mensalidade de R$ 40 para hospedagem, manutenção contínua e suporte 24h.',
      key: 'botCompleto'
    },
  ];

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
          <Link href="/servicos">Serviços</Link>
          <Link href="/conteudos">Conteúdos</Link>
          <Link href="/grimward">Grimward</Link>
          <Link href="/cantinho-do-viewer">Cantinho do Viewer</Link>
          <Link href="/agradecimento">Agradecimento</Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col justify-center items-center z-10 text-left px-4 py-20 max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-fuchsia-400 drop-shadow-[0_0_6px_fuchsia] mb-10 uppercase tracking-wide text-center animate-float">
          🛒 Serviços Disponíveis
        </h1>
        <p className="text-pink-300 text-lg mb-4 text-center">Entre em contato para mais informações e contratação!</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {itens.map(({ nome, preco, descricao, detalhes, key }) => (
            <div key={key} className="bg-purple-950/70 border border-fuchsia-700 rounded-2xl p-6 shadow-lg shadow-fuchsia-900 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-fuchsia-300 mb-2">{nome}</h2>
                <p className="text-purple-300">{descricao}</p>
                <p className="text-purple-300 mt-2">R${preco}</p>
                <p className="text-purple-300 mt-2">{detalhes}</p>
              </div>

              {/* Botão para contato via WhatsApp ou E-mail */}
              <div className="mt-4 space-x-4">
                <a
                  href={`https://wa.me/5521997613983?text=Olá! Gostaria de mais informações sobre o serviço: ${nome}`}
                  target="_blank"
                  className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded"
                >
                  Contatar no WhatsApp
                </a>
              </div>
            </div>
          ))}
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