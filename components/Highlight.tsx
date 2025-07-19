// components/Highlight.tsx
'use client';
import { useEffect, useState } from 'react';

interface HighlightData {
  ultimoFollow: string | null;
  ultimoSub: string | null;
  ultimosBits: {
    nome: string | null;
    quantidade: number;
  };
}

export default function Highlight() {
  const [highlight, setHighlight] = useState<HighlightData | null>(null);

  useEffect(() => {
    fetch('/data/highlight.json')
      .then(res => res.json())
      .then(setHighlight)
      .catch(console.error);
  }, []);

  if (!highlight) return null;

  return (
    <div className="p-4 rounded-2xl bg-purple-800/30 text-white shadow-lg backdrop-blur">
      <h2 className="text-xl font-bold mb-2">✨ Highlights da Live ✨</h2>
      <p>📌 Último follow: {highlight.ultimoFollow || 'ninguém ainda 😭'}</p>
      <p>🎁 Último sub: {highlight.ultimoSub || 'ninguém ainda 😭'}</p>
      <p>💎 Últimos bits: {highlight.ultimosBits.nome || 'ninguém'} — {highlight.ultimosBits.quantidade || 0} bits</p>
    </div>
  );
}