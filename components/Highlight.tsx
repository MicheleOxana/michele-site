'use client';
import { useEffect, useState } from 'react';
import { db } from '../src/lib/firebase'; // caminho corrigido
import { doc, onSnapshot } from 'firebase/firestore';

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
    const docRef = doc(db, 'highlights', 'current');
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setHighlight(doc.data() as HighlightData);
      } else {
        setHighlight(null);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!highlight) return <p>Carregando highlights...</p>;

  return (
    <div className="p-4 rounded-2xl bg-purple-800/30 text-white shadow-lg backdrop-blur">
      <h2 className="text-xl font-bold mb-2">✨ Highlights da Live ✨</h2>
      <p>📌 Último follow: {highlight.ultimoFollow || 'ninguém ainda 😭'}</p>
      <p>🎁 Último sub: {highlight.ultimoSub || 'ninguém ainda 😭'}</p>
      <p>💎 Últimos bits: {highlight.ultimosBits.nome || 'ninguém'} — {highlight.ultimosBits.quantidade || 0} bits</p>
    </div>
  );
}
