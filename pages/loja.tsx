import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../src/context/AuthContext';
import axios from 'axios';

export default function Loja() {
  const { user } = useAuth();
  const [coins, setCoins] = useState(0);
  const [resgates, setResgates] = useState<string[]>([]);
  const [killerResgatado, setKillerResgatado] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    axios.get(`/api/coins/${user.id}`).then((res) => setCoins(res.data.coins));
    axios.get(`/api/resgates`).then((res) => {
      setResgates(res.data);
      setKillerResgatado(res.data.some((r: any) => r.item === 'Escolha de Killer'));
    });
  }, [user]);

  const itens = [
    { nome: 'Escolha de Killer', preco: 10000, key: 'killer' },
    { nome: 'React ao vivo', preco: 10000, key: 'react' },
    { nome: 'Assistir um filme juntos', preco: 15000, key: 'filme' },
    { nome: 'Escolher uma série', preco: 20000, key: 'serie' },
    { nome: 'Viradão Cultural', preco: 40000, key: 'viradao' },
    { nome: 'Ticket de Sorteio', preco: 8000, key: 'sorteio' },
  ];

  const handleResgate = async (item: string, preco: number) => {
    if (!user) return;
    if (coins < preco) return alert('Você não tem Xaninhas Coins suficientes!');
    if (item === 'Escolha de Killer' && killerResgatado) return alert('Esse item só pode ser resgatado uma vez por live!');

    setLoading(true);
    await axios.post('/api/resgatar', {
      user: user.display_name,
      userId: user.id,
      item,
      preco,
    });
    setCoins((prev) => prev - preco);
    setResgates((prev) => [...prev, item]);
    if (item === 'Escolha de Killer') setKillerResgatado(true);
    alert(`Você resgatou: ${item}`);
    setLoading(false);
  };

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

      <main className="flex-1 flex flex-col justify-center items-center z-10 text-left px-4 py-20 max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-fuchsia-400 drop-shadow-[0_0_6px_fuchsia] mb-10 uppercase tracking-wide text-center animate-float">
          🛒 Itens para Resgate
        </h1>
        <p className="text-pink-300 text-lg mb-4 text-center">Você tem <span className="font-bold text-fuchsia-300">{coins}</span> Xaninhas Coins</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {itens.map(({ nome, preco, key }) => (
            <div key={key} className="bg-purple-950/70 border border-fuchsia-700 rounded-2xl p-6 shadow-lg shadow-fuchsia-900 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-fuchsia-300 mb-2">{nome}</h2>
                <p className="text-purple-300">Valor: <span className="font-bold text-pink-400">{preco}</span> Xaninhas Coins</p>
              </div>
              <button
                onClick={() => handleResgate(nome, preco)}
                disabled={loading}
                className="mt-4 py-2 px-4 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold rounded disabled:opacity-40"
              >
                Resgatar
              </button>
            </div>
          ))}
        </div>
      </main>

      <footer className="z-10 bg-purple-950 text-purple-400 text-xs text-center py-2 border-t border-purple-700">
        © 2025 <span className="font-semibold text-white">MicheleOxana™</span> — powered by <span className="italic text-pink-400">Unixana 🦄</span>
      </footer>
    </div>
  );
}
