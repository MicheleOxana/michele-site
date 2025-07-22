import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Grimward() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-black text-white flex flex-col font-sans relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none animate-glitter z-0"></div>

      <header className="z-10 bg-purple-950 text-purple-200 p-4 flex items-center justify-between shadow-lg shadow-purple-700/30 border-b border-purple-700">
        <h1 className="text-2xl font-bold tracking-widest">🛡️ Grimward <span className="text-sm font-normal italic">by MicheleOxana™</span></h1>
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

      <main className="flex-1 flex flex-col justify-center items-center z-10 text-left px-4 py-20 max-w-4xl mx-auto space-y-6">
        <Image
          src="/img/grimward.png"
          alt="Banner Grimward"
          width={1200}
          height={600}
          className="rounded-xl shadow-lg shadow-fuchsia-700 border border-fuchsia-600"
        />

        <article className="text-purple-200 text-lg space-y-5">
          <p><strong>Grimward</strong> não é só um servidor de Minecraft. É uma experiência. Um universo. Um reino encantado e brutal, nascido das trevas da fantasia medieval e pelo toque inconfundível da MicheleOxana™.</p>
          <p>Aqui, não se entra apenas pra minerar ou construir casinhas. Você entra para escrever sua própria lenda.</p>

          <h2 className="text-2xl text-fuchsia-300 font-bold">🏰 O QUE É GRIMWARD?</h2>
          <p>Grimward é um servidor de Minecraft 1.20.1 com forge 47.4.3 com ambientação medieval, inspirado em universos como Game of Thrones, The Witcher e outros. Cada detalhe do servidor foi cuidadosamente construído pra fundir o roleplay com uma atmosfera envolvente de guerra, feitiçaria, alianças traiçoeiras e rpg.</p>

          <h2 className="text-2xl text-fuchsia-300 font-bold">🛡️ As Grandes Casas</h2>
          <p>Ao entrar no mundo de Grimward, você será convidado a escolher sua lealdade entre facções (ou casas) lendárias, cada uma com sua cultura, estética, poderes e objetivos.</p>
          <ul className="list-disc list-inside space-y-1">
            <li>🏔️ <strong>Ferrosangue:</strong> Guerreiros endurecidos das montanhas. A força é sua fé.</li>
            <li>🌫️ <strong>Sombravéu:</strong> Ocultistas da floresta escura. Alquimia, encantamentos e segredos antigos.</li>
            <li>💎 <strong>Casa Reluzente:</strong> Diplomatas, mercadores e estrategistas. Manipulam com ouro e palavras doces.</li>
            <li>❄️ <strong>Ventanoite:</strong> Nômades do norte gelado. Neutros, mas perigosamente imprevisíveis.</li>
            <li>🔥 <strong>Valen:</strong> Casa que moldou tudo que há em Grimward.</li>
            <li>🌿 <strong>Silenciosos de Elaren:</strong> Um culto florestal antigo e enigmático, que serve aos segredos do mundo. (Em breve)</li>
          </ul>
          <p>Cada Casa possui um spawn temático, kits próprios, sistema de guerra e alianças, e até missões exclusivas que evoluem com a lore do servidor.</p>

          <h2 className="text-2xl text-fuchsia-300 font-bold">⚔️ Guerras e Alianças</h2>
          <p>Grimward respira política, conflito e diplomacia.<br/>As casas podem formar alianças, assinar tratados no Conselho de Grimward, e declarar guerras oficiais.</p>
          <p><strong>Mensalmente, eventos são realizados, como:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Conquistas territoriais</li>
            <li>Caça ao Tesouro com recompensas mágicas</li>
            <li>Festivais de Aliança</li>
            <li>Sessões do Conselho, onde os líderes debatem o destino do mundo</li>
          </ul>
          <p>Tudo isso com registro público em um <strong>Mural de Crônicas</strong>, pra deixar a lore vivinha e dramática!</p>

          <h2 className="text-2xl text-fuchsia-300 font-bold">🧙‍♂️ Magia, RPG e Personalização</h2>
          <p>Além da estética de cair o c* da armadura, o servidor é recheado de:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Classes e habilidades mágicas</li>
            <li>Itens únicos e encantados</li>
            <li>Trilha sonora personalizada</li>
            <li>Interfaces com brasões e títulos reais</li>
            <li>Eventos narrativos com lore canônica</li>
          </ul>
          <p>Você não joga Minecraft, você vive um RPG cinematográfico com shader e drama.</p>

          <h2 className="text-2xl text-fuchsia-300 font-bold">🖥️ Otimizado e acessível</h2>
          <p>O servidor é totalmente otimizado para os jogadores simultâneos, com mods escolhidos a dedo pra manter a performance estável e a experiência imersiva.<br/>
          Você entra, e já sente o peso da atmosfera. A música toca, os portões se abrem, e o mundo te observa.</p>

          <h2 className="text-2xl text-fuchsia-300 font-bold">✨ Por que jogar em Grimward?</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Porque você merece ser personagem principal de uma saga épica.</li>
            <li>Porque PvP com contexto é mais gostoso.</li>
            <li>Porque aqui até o caos tem estética.</li>
            <li>Porque no Grimward, você não sobrevive. Você deixa um legado.</li>
          </ul>

          <h2 className="text-2xl text-fuchsia-300 font-bold">🎮 Como entrar</h2>
          <p>Se você é sub da live <strong>MicheleOxana™</strong>, pode ganhar acesso exclusivo ao servidor.<br/>
          O modpack, regras, lore completa e mapas estarão disponíveis no discord <a href="https://discord.gg/gdDFgZCRCE" className="text-pink-400 underline">https://discord.gg/gdDFgZCRCE</a> com allow list para quem não é sub.<br/>
          E você pode saber mais no próprio site do servidor: <a href="https://grimwardmc.com" className="text-pink-400 underline">https://grimwardmc.com</a><br/>
          E claro: todo mundo tem seu papel, mesmo que seja causar surtos no Conselho.</p>

          <h2 className="text-2xl text-fuchsia-300 font-bold">🦄 Grimward é um surto?</h2>
          <p>Sim. Mas é um surto medieval, com armadura de diamante encantada, vinho quente, espada de fogo e drama de novela.</p>
        </article>
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
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}