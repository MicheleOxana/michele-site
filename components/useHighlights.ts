import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase'; // Firebase client
import { doc, onSnapshot } from 'firebase/firestore';

interface Highlights {
  sub: string;
  bits: string;
  follow: string;
}

export function useHighlights() {
  const [highlights, setHighlights] = useState<Highlights>({
    sub: 'ninguém',
    bits: 'ninguém',
    follow: 'ninguém',
  });

  useEffect(() => {
    const docRef = doc(db, 'highlights', 'current');
    const unsub = onSnapshot(docRef, (snap) => {
      const data = snap.data();
      setHighlights({
        sub: typeof data?.ultimoSub === 'string' && data.ultimoSub !== '' ? data.ultimoSub : 'ninguém',
        bits:
          typeof data?.ultimosBits?.nome === 'string' && data.ultimosBits.nome !== ''
            ? `${data.ultimosBits.nome} — ${data.ultimosBits.quantidade} bits`
            : 'ninguém',
        follow: typeof data?.ultimoFollow === 'string' && data.ultimoFollow !== '' ? data.ultimoFollow : 'ninguém',
      });
    });

    return () => unsub();
  }, []);

  return highlights;
}
