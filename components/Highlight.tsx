'use client';
import { useEffect, useState } from 'react';
import { db } from '../src/lib/firebase';
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
  const [highlight, setHighlight] = useState<HighlightData>({
    ultimoFollow: null,
    ultimoSub: null,
    ultimosBits: {
      nome: null,
      quantidade: 0,
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, 'highlights', 'current');
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setHighlight({
            ultimoFollow:
              typeof data.ultimoFollow === 'string' && data.ultimoFollow.trim() !== ''
                ? data.ultimoFollow
                : null,
            ultimoSub:
              typeof data.ultimoSub === 'string' && data.ultimoSub.trim() !== ''
                ? data.ultimoSub
                : null,
            ultimosBits: {
              nome:
                typeof data?.ultimosBits?.nome === 'string' && data.ultimosBits.nome.trim() !== ''
                  ? data.ultimosBits.nome
                  : null,
              quantidade:
                typeof data?.ultimosBits?.quantidade === 'number'
                  ? data.ultimosBits.quantidade
                  : 0,
            },
          });
        } else {
          setHighlight({
            ultimoFollow: null,
            ultimoSub: null,
            ultimosBits: {
              nome: null,
              quantidade: 0,
            },
          });
        }
        setLoading(false);
      },
      (error) => {
        console.error('Erro ao ouvir highlights:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) return <p className="text-white">Carregando highlights...</p>;

  return (
    <div className="p-4 rounded-2xl bg-purple-800/30 text-white shadow-lg backdrop-blur">
      <h2 className="text-xl font-bold mb-2">✨ Highlights da Live ✨</h2>
      <p>📌 Último follow: {highlight.ultimoFollow || 'ninguém ainda 😭'}</p>
      <p>🎁 Último sub: {highlight.ultimoSub || 'ninguém ainda 😭'}</p>
      <p>
        💎 Últimos bits:{' '}
        {highlight.ultimosBits.nome
          ? `${highlight.ultimosBits.nome} — ${highlight.ultimosBits.quantidade} bits`
          : 'ninguém ainda 😭'}
      </p>
    </div>
  );
}
