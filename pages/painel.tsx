"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  collection, doc, onSnapshot, orderBy, query,
  setDoc, updateDoc, deleteDoc, getDoc
} from "firebase/firestore";
import { ref as sref, deleteObject } from "firebase/storage";
import { auth, db, storage, googleProvider } from "@/lib/firebaseClient";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";

type Asset = {
  id: string;
  cmd: string;
  url: string;
  type: "video" | "image";
  storagePath: string;
  createdAt: number;
  enabled?: boolean;
  by?: string;
};

export default function Painel() {
  const [user, setUser] = useState<any>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filter, setFilter] = useState("");
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [currentAsset, setCurrentAsset] = useState<Asset | null>(null);
  const [busy, setBusy] = useState<string>("");

  // login/logout
  useEffect(() => onAuthStateChanged(auth, async (u) => {
    setUser(u);
    if (u) {
      // garante o overlay base público para o OBS
      await setDoc(doc(db, "overlays", "main"), { public: true }, { merge: true });
    }
  }), []);
  const login = () => signInWithPopup(auth, googleProvider);
  const logout = () => signOut(auth);

  // stream de assets
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "overlays", "main", "assets"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const a: Asset[] = [];
      snap.forEach(d => a.push({ id: d.id, ...(d.data() as any) }));
      setAssets(a);
    });
    return unsub;
  }, [user]);

  // stream do "atual" + resolve para Asset
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, "overlays", "main", "state", "current"), async (d) => {
      const id = d.exists() ? (d.data() as any).id as string : null;
      setCurrentId(id || null);
      if (!id) { setCurrentAsset(null); return; }
      const aDoc = await getDoc(doc(db, "overlays", "main", "assets", id));
      setCurrentAsset(aDoc.exists() ? ({ id: aDoc.id, ...(aDoc.data() as any) } as Asset) : null);
    });
    return unsub;
  }, [user]);

  // filtro
  const filtered = useMemo(() => {
    const f = filter.trim().toLowerCase();
    if (!f) return assets;
    return assets.filter(a =>
      a.cmd?.toLowerCase().includes(f) ||
      a.storagePath?.toLowerCase().includes(f)
    );
  }, [assets, filter]);

  // ações
  async function toggleEnabled(a: Asset) {
    setBusy(a.id);
    try {
      await updateDoc(doc(db, "overlays", "main", "assets", a.id), {
        enabled: !(a.enabled ?? true)
      });
    } finally { setBusy(""); }
  }

  async function renameCmd(a: Asset) {
    const novo = prompt("Novo nome do comando (sem !):", a.cmd || "");
    if (!novo) return;
    setBusy(a.id);
    try {
      await updateDoc(doc(db, "overlays", "main", "assets", a.id), { cmd: novo.trim() });
    } finally { setBusy(""); }
  }

  async function setAsCurrent(a: Asset) {
    setBusy(a.id);
    try {
      await setDoc(doc(db, "overlays", "main", "state", "current"),
        { id: a.id, at: Date.now() }, { merge: true });
    } finally { setBusy(""); }
  }

  async function removeAsset(a: Asset) {
    if (!confirm(`Apagar "${a.cmd}"? Isso remove do site e do Storage.`)) return;
    setBusy(a.id);
    try {
      // 1) Firestore
      await deleteDoc(doc(db, "overlays", "main", "assets", a.id));
      if (currentId === a.id) {
        await setDoc(doc(db, "overlays", "main", "state", "current"), { id: null }, { merge: true });
      }
      // 2) Storage
      if (a.storagePath) {
        await deleteObject(sref(storage, a.storagePath));
      }
    } finally { setBusy(""); }
  }

  const overlayUrl = "https://micheleoxana.live/overlay";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-black text-white flex flex-col relative">
      {/* Header */}
      <header className="bg-purple-950 text-purple-200 px-5 py-3 flex items-center justify-between border-b border-purple-700">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-widest">💜 MicheleOxana™ <span className="text-sm italic">Painel Privado</span></h1>
          <nav className="hidden md:flex gap-3 text-sm uppercase text-fuchsia-300">
            <Link href="/" className="hover:text-white">Início</Link>
            <Link href="/primeiros-passos" className="hover:text-white">Primeiros Passos</Link>
            <Link href="/comandos" className="hover:text-white">Comandos</Link>
          </nav>
        </div>
        <div>
          {!user ? (
            <button onClick={login} className="px-3 py-1.5 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-700 font-semibold">
              Entrar com Google
            </button>
          ) : (
            <div className="flex items-center gap-3 text-sm">
              <span className="text-purple-300">Logado: <b>{user.email}</b></span>
              <button onClick={logout} className="px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800">Sair</button>
            </div>
          )}
        </div>
      </header>

      {/* Body */}
      {!user ? (
        <main className="flex-1 grid place-items-center p-10 text-purple-200">
          <p>Faça login para gerenciar seus vídeos/imagens.</p>
        </main>
      ) : (
        <main className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-6 p-6">

          {/* Coluna esquerda: busca + grid */}
          <section className="xl:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <input
                className="w-full rounded-xl bg-purple-900/50 border border-purple-700 px-4 py-2 outline-none focus:ring-2 focus:ring-fuchsia-500"
                placeholder="Buscar por comando ou arquivo…"
                value={filter}
                onChange={e => setFilter(e.target.value)}
              />
              <span className="text-purple-300 text-sm">{filtered.length} itens</span>
            </div>

            {/* Grid de cartões */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((a) => (
                <article key={a.id}
                  className="rounded-2xl overflow-hidden bg-purple-900/40 border border-purple-700 shadow-lg">
                  <div className="aspect-video bg-black">
                    {a.type === "video" ? (
                      <video src={a.url} muted playsInline loop className="w-full h-full object-cover" />
                    ) : (
                      // imagem
                      <img src={a.url} alt={a.cmd} className="w-full h-full object-cover" />
                    )}
                  </div>

                  <div className="p-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-purple-300">Comando</div>
                        <div className="text-lg font-semibold">{a.cmd || "(sem nome)"}</div>
                      </div>
                      {/* toggle */}
                      <button
                        onClick={() => toggleEnabled(a)}
                        disabled={busy === a.id}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
                          (a.enabled ?? true) ? "bg-emerald-500/80" : "bg-purple-700"
                        }`}
                        title={(a.enabled ?? true) ? "Desativar" : "Ativar"}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                            (a.enabled ?? true) ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setAsCurrent(a)}
                        disabled={busy === a.id}
                        className="px-3 py-2 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-700 text-sm font-semibold"
                      >
                        Definir como atual
                      </button>
                      <button
                        onClick={() => renameCmd(a)}
                        disabled={busy === a.id}
                        className="px-3 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-sm"
                      >
                        Renomear
                      </button>
                      <a
                        href={a.url}
                        target="_blank"
                        className="px-3 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-sm text-center"
                      >
                        Abrir arquivo
                      </a>
                      <button
                        onClick={() => removeAsset(a)}
                        disabled={busy === a.id}
                        className="px-3 py-2 rounded-lg bg-red-600/80 hover:bg-red-600 text-sm"
                      >
                        Deletar
                      </button>
                    </div>

                    <div className="text-xs text-purple-400 truncate">
                      <span className="opacity-60">Storage:</span> {a.storagePath}
                    </div>
                  </div>
                </article>
              ))}

              {filtered.length === 0 && (
                <div className="col-span-full text-purple-300">
                  Nenhum asset enviado ainda.
                </div>
              )}
            </div>
          </section>

          {/* Coluna direita: URL do OBS + preview do atual */}
          <aside className="xl:col-span-1 space-y-4">
            <div className="rounded-2xl bg-purple-900/40 border border-purple-700 p-4">
              <h3 className="text-xl font-bold mb-2">Overlay & OBS</h3>
              <label className="text-sm text-purple-300">URL do overlay (Browser Source no OBS)</label>
              <div className="mt-1 flex gap-2">
                <input className="flex-1 rounded-lg bg-purple-950 border border-purple-700 px-3 py-2"
                       value={overlayUrl} readOnly />
                <button
                  onClick={() => navigator.clipboard.writeText(overlayUrl)}
                  className="px-3 py-2 rounded-lg bg-purple-700 hover:bg-purple-800">Copiar</button>
              </div>
              <p className="mt-2 text-xs text-purple-400">
                Dica: 1920×1080, “Shutdown source when not visible” desmarcado.
              </p>
            </div>

            <div className="rounded-2xl bg-purple-900/40 border border-purple-700 p-4">
              <h3 className="text-xl font-bold mb-3">Pronto para tocar (atual)</h3>

              {!currentAsset ? (
                <div className="h-48 grid place-items-center text-purple-400 text-sm">
                  Nenhum asset definido ainda.
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="aspect-video rounded-xl overflow-hidden bg-black border border-purple-700">
                    {currentAsset.type === "video" ? (
                      <video src={currentAsset.url} muted playsInline loop className="w-full h-full object-cover" />
                    ) : (
                      <img src={currentAsset.url} alt={currentAsset.cmd} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="text-sm text-purple-300">
                    <b>Comando:</b> {currentAsset.cmd} &nbsp;•&nbsp; <b>ID:</b> {currentAsset.id}
                  </div>
                  <button
                    onClick={() => currentAsset && setAsCurrent(currentAsset)}
                    className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 font-semibold"
                  >
                    Tocar agora (definir novamente)
                  </button>
                </div>
              )}
            </div>
          </aside>
        </main>
      )}

      <footer className="bg-purple-950 text-purple-400 text-xs text-center py-2 border-t border-purple-700">
        © 2025 <span className="font-semibold text-white">MicheleOxana™</span> — Painel com glitter ✨
      </footer>
    </div>
  );
}
