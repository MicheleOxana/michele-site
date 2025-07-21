import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';

interface Comentario {
  nome: string;
  mensagem: string;
}

export default function CantinhoDoViewer() {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [nome, setNome] = useState('');
  const [mensagem, setMensagem] = useState('');
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetch('/api/viewers')
      .then((res) => res.json())
      .then((data) => setComentarios(data));
  }, []);

  const handleEnviar = async () => {
    if (!nome || !mensagem) return;

    const novoComentario = { nome, mensagem };
    const res = await fetch('/api/viewers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoComentario),
    });

    if (res.ok) {
      setComentarios((prev) => [...prev, novoComentario]);
      setNome('');
      setMensagem('');
    }
  };

  const handleApagar = async (index: number) => {
    const confirm = window.confirm('Tem certeza que deseja apagar essa mensagem?');
    if (!confirm) return;

    const res = await fetch('/api/viewers', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_HIGHLIGHT_SECRET}`,
      },
      body: JSON.stringify({ index }),
    });

    if (res.ok) {
      setComentarios((prev) => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-black text-white flex flex-col font-sans relative overflow-hidden">
      <Head>
        <title>Cantinho do Viewer — MicheleOxana™</title>
        <meta name="description" content="Deixe sua mensagem no cantinho do viewer da MicheleOxana. Uma página para amor, desabafos e surtos com glitter." />
      </Head>

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

      <main className="flex-1 flex flex-col justify-center items-center z-10 text-left px-4 py-20 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-fuchsia-400 drop-shadow-[0_0_6px_fuchsia] mb-6 uppercase tracking-wide text-center">
          🦄 Cantinho do Viewer
        </h1>

        <div className="text-purple-200 space-y-6 text-lg">
          <blockquote className="italic border-l-4 border-fuchsia-500 pl-4 text-pink-200">
            “Vai passar, tu sabes que vai passar. Talvez não amanhã, mas dentro de uma semana, um mês ou dois, quem sabe?...”
            <br />
            <span className="block mt-2 font-bold">— Caio Fernando Abreu</span>
          </blockquote>

          <p>
            Esse cantinho é todinho seu, meu amor. 💖 Aqui é onde a magia da nossa comunidade vira memória e carinho eterno. Escreve, desabafa, declara, ou só deixa um "oi" com glitter — aqui tudo vira parte da história da live!
          </p>

          <div className="mt-10">
            <h2 className="text-2xl text-fuchsia-300 font-semibold mb-4">📝 Deixe sua mensagem:</h2>
            <input
              type="text"
              placeholder="Seu nome ou nick do surto"
              className="w-full p-2 mb-2 rounded bg-purple-950 border border-fuchsia-700 text-white"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <textarea
              placeholder="Sua mensagem linda, surtada ou emocionada 💜"
              className="w-full p-2 rounded bg-purple-950 border border-fuchsia-700 text-white mb-4"
              rows={4}
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
            ></textarea>
            <button
              onClick={handleEnviar}
              className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-2 px-4 rounded shadow-md"
            >
              Enviar Mensagem
            </button>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl text-fuchsia-300 font-semibold mb-4">💌 Mensagens deixadas:</h2>
            <div className="space-y-4">
              {comentarios.length === 0 ? (
                <p className="text-sm text-purple-400">Nenhuma mensagem ainda... Seja o primeirx a deixar seu recado ✨</p>
              ) : (
                comentarios.map((c, i) => (
                  <div key={i} className="bg-purple-950/60 p-4 rounded border border-purple-700">
                    <p className="text-fuchsia-400 font-bold">{c.nome}</p>
                    <p className="text-purple-200 mt-1">{c.mensagem}</p>
                    {isAuthenticated && user?.login === 'micheleoxana' && (
                      <button
                        className="mt-2 text-xs text-pink-400 underline hover:text-red-500"
                        onClick={() => handleApagar(i)}
                      >
                        🗑️ Apagar
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
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
