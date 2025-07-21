import React, { useEffect, useState } from 'react';
import { useAuth } from '../src/context/AuthContext';

interface Comentario {
  nome: string;
  mensagem: string;
  id: number;
}

export default function Moderacao() {
  const { user, isAuthenticated } = useAuth();
  const [comentarios, setComentarios] = useState<Comentario[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/viewer-mensagem')
        .then((res) => res.json())
        .then(setComentarios);
    }
  }, [isAuthenticated]);

  const handleDelete = async (id: number) => {
    const confirm = window.confirm('Tem certeza que deseja apagar essa mensagem do surto?');
    if (!confirm) return;

    await fetch('/api/deletar-mensagem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.NEXT_PUBLIC_MODERACAO_SECRET || '', // só pros devs, safe no client
      },
      body: JSON.stringify({ id }),
    });

    setComentarios((prev) => prev.filter((c) => c.id !== id));
  };

  if (!isAuthenticated || user?.login !== 'micheleoxana') {
    return (
      <div className="h-screen flex items-center justify-center text-white bg-black">
        <p>🚫 Acesso negado. Essa área é exclusiva da MicheleOxana™.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl text-fuchsia-400 font-bold mb-6">🛠️ Moderação do Cantinho do Viewer</h1>
      {comentarios.length === 0 ? (
        <p className="text-purple-300">Nenhuma mensagem registrada ainda.</p>
      ) : (
        <div className="space-y-4">
          {comentarios.map((c) => (
            <div key={c.id} className="bg-purple-950 p-4 rounded border border-fuchsia-600">
              <p className="text-pink-300 font-bold">{c.nome}</p>
              <p className="text-white mb-2">{c.mensagem}</p>
              <button
                onClick={() => handleDelete(c.id)}
                className="text-sm text-red-400 hover:text-red-200 underline"
              >
                Apagar mensagem
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
