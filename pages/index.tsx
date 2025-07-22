import React from 'react';

export default function Home() {
  return (
    <div className="h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-fuchsia-400">✨ Página Temporária ✨</h1>
        <p>Essa página está temporariamente ativa só pra gerar o token da Unixana!</p>
        <p>Se você acabou de autorizar na Twitch, olha o console ou a URL, o token vem assim:</p>
        <code className="bg-gray-800 px-3 py-2 rounded text-sm block mt-2 break-all">
          #access_token=eyJrOi...etc
        </code>
        <p className="text-sm text-yellow-300">Depois é só voltar a página `index.tsx` original. 🦄</p>
      </div>
    </div>
  );
}