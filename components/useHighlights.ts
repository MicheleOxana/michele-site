import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useHighlights() {
  const [data, setData] = useState({
    sub: 'carregando...',
    bits: 'carregando...',
    follow: 'carregando...',
  });

  useEffect(() => {
    // Só executa no client
    if (typeof window === 'undefined') return;

    const fetchData = async () => {
      const docRef = doc(db, 'highlights', 'current');
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const d = snap.data();
        const sub = d.ultimoSub || 'ninguém';
        const follow = d.ultimoFollow || 'ninguém';
        let bits = 'ninguém';
        if (d.ultimosBits?.nome) {
          bits = `${d.ultimosBits.nome} — ${d.ultimosBits.quantidade || 0} bits`;
        }

        setData({ sub, bits, follow });
      }
    };

    fetchData();
  }, []);

  return data;
}
