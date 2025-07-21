// pages/index.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useAuth } from '../src/context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [tempoSurto, setTempoSurto] = useState('fora do ar');
  const [viewers, setViewers] = useState('off');
  const [imagemQR, setImagemQR] = useState<'amazon' | 'pix'>('amazon');
  const [ultimos, setUltimos] = useState({ sub: 'carregando...', bits: 'carregando...', follower: 'carregando...' });
  const [recordeViewers, setRecordeViewers] = useState(0);
  const [anunciouLive, setAnunciouLive] = useState(false);
  const [highlights, setHighlights] = useState({ sub: '', bits: '', follow: '' });

  useEffect(() => {
    if (isAuthenticated === false) {
      router.replace('/login');
    }
  }, [isAuthenticated]);

  if (isAuthenticated === undefined) {
    return <div className="h-screen flex items-center justify-center bg-black text-white text-xl">✨ Carregando o surto... segura aí!</div>;
  }
  if (!isAuthenticated) return null;

  useEffect(() => {
    const intervalo = setInterval(() => {
      setImagemQR(prev => (prev === 'amazon' ? 'pix' : 'amazon'));
    }, 30000);
    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    const frases = [
      "💅 Dá sub pra gatinha!",
      "👅 Bota pra fora que a Michele mama!",
      "🗑️ LIXO.",
      "✨ A beleza é uma maldição que eu carrego com glitter!",
      "🌈 Segura minha magia que eu vou de base!",
      "💋 Me respeita que eu sou a Unixana original, unicórnia do caos!"
    ];
    let i = 0;
    const intervalo = setInterval(() => {
      const el = document.getElementById("fala-unixana");
      if (el) {
        i = (i + 1) % frases.length;
        el.textContent = frases[i];
      }
    }, 20000);
    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const atualizarRelogio = async () => {
      try {
        const res = await axios.get('/api/uptime');
        if (!res.data.isLive) {
          setTempoSurto('fora do ar');
          setAnunciouLive(false);
          return;
        }

        const startedAt = new Date(res.data.startedAt);
        if (!anunciouLive) {
          const el = document.getElementById("fala-unixana");
          if (el) el.textContent = "🚨 A live começou! Unixana tá surtando em rede nacional!";
          setAnunciouLive(true);
        }

        interval = setInterval(() => {
          const agora = new Date();
          const diff = agora.getTime() - startedAt.getTime();
          const horas = Math.floor(diff / (1000 * 60 * 60));
          const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const segundos = Math.floor((diff % (1000 * 60)) / 1000);
          setTempoSurto(`${horas}h ${minutos}min ${segundos}s`);
        }, 1000);
      } catch (e) {
        setTempoSurto('fora do ar');
      }
    };
    atualizarRelogio();
    return () => clearInterval(interval);
  }, [anunciouLive]);

  useEffect(() => {
    const atualizarViewers = async () => {
      try {
        const res = await axios.get('/api/viewers');
        const current = res.data.viewers;
        setViewers(current);
        if (typeof current === 'number' && current > recordeViewers) {
          setRecordeViewers(current);
          const el = document.getElementById("fala-unixana");
          if (el) el.textContent = `🦄 OMG! Bateu ${current} surtades ao vivo! Pega a purpurina!`;
        }
      } catch (e) {
        setViewers('off');
      }
    };
    atualizarViewers();
    const interval = setInterval(atualizarViewers, 15000);
    return () => clearInterval(interval);
  }, [recordeViewers]);

  useEffect(() => {
    const buscarUltimos = async () => {
      try {
        const res = await axios.get('/api/ultimos');
        setUltimos(res.data);
      } catch (e) {
        setUltimos({ sub: 'erro', bits: 'erro', follower: 'erro' });
      }
    };
    buscarUltimos();
    const interval = setInterval(buscarUltimos, 15000);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-black text-white flex flex-col font-sans relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none animate-glitter z-0"></div>

      <div className="fixed top-1/2 left-2 transform -translate-y-1/2 z-50 w-[170px]">
        {imagemQR === 'amazon' ? (
          <a href="https://www.amazon.com.br/shop/micheleoxana" target="_blank" rel="noopener noreferrer">
            <img src="/icons/amazoncard.svg" alt="Compre com meu link da Amazon" className="w-full drop-shadow-[0_0_8px_gold] hover:scale-105 transition-transform" />
          </a>
        ) : (
          <img src="/icons/pixcard.svg" alt="Doe no Pix" className="w-full drop-shadow-[0_0_8px_fuchsia] hover:scale-105 transition-transform" />
        )}
      </div>

      <header className="z-10 bg-purple-950 text-purple-200 p-4 flex items-center justify-between shadow-lg shadow-purple-700/30 border-b border-purple-700">
        <h1 className="text-2xl font-bold tracking-widest">💜 MicheleOxana™ <span className="text-sm font-normal italic">Live</span></h1>
        <nav className="space-x-3 text-sm font-bold tracking-wide">
          <a href="/" className="hover:text-fuchsia-400 transition">Início</a>
          <a href="/primeiros-passos" className="hover:text-fuchsia-400 transition">Primeiros Passos</a>
          <a href="/sobre" className="hover:text-fuchsia-400 transition">Sobre</a>
          <a href="/xaninhas" className="hover:text-fuchsia-400 transition">Xaninhas Coins</a>
          <a href="/comandos" className="hover:text-fuchsia-400 transition">Comandos</a>
          <a href="/resgates" className="hover:text-fuchsia-400 transition">Resgates</a>
          <a href="/conteudos" className="hover:text-fuchsia-400 transition">Conteúdos</a>
          <a href="/grimward" className="hover:text-fuchsia-400 transition">Grimward</a>
          <a href="/cantinho" className="hover:text-fuchsia-400 transition">Cantinho do Viewer</a>
          <a href="/agradecimento" className="hover:text-fuchsia-400 transition">Agradecimento</a>
        </nav>
      </header>

    </div>
  );
}
