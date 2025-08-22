"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  collection, doc, onSnapshot, orderBy, query,
  setDoc, updateDoc, deleteDoc, getDoc
} from "firebase/firestore";
import { ref as sref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
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

// util simples
const sanitizeCmd = (s: string) => s.trim().replace(/^!+/, "").toLowerCase();

export default function Painel() {
  const [user, setUser] = useState<any>(null);

  // ===== Upload state =====
  const [cmd, setCmd] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [upPct, setUpPct] = useState(0);
  const [upMsg, setUpMsg] = useState("");

  // ===== Lista / atual =====
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filter, setFilter] = useState("");
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [currentAsset, setCurrentAsset] = useState<Asset | null>(null);
  const [busy, setBusy] = useState<string>("");

  // login/logout
  useEffect(() => onAuthStateChanged(auth, async (u) => {
    setUser(u);
    if (u) {
      // garante doc público para o OBS
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

  // stream do "atual"
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

  const filtered = useMemo(() => {
    const f = filter.trim().toLowerCase();
    if (!f) return assets;
    return assets.filter(a =>
      a.cmd?.toLowerCase().includes(f) ||
      a.storagePath?.toLowerCase().includes(f)
    );
  }, [assets, filter]);

  // ===== Upload handlers =====
  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setUpMsg("");
    setUpPct(0);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  async function doUpload() {
    try {
      if (!user) { setUpMsg("Faça login."); return; }
      if (!file) { setUpMsg("Escolha um arquivo."); return; }
      const _cmd = sanitizeCmd(cmd);
      if (!_cmd) { setUpMsg("Digite o nome do comando."); return; }

      const id = crypto.randomUUID();
      const storagePath = `overlayAssets/${id}-${file.name}`;
      const r = sref(storage, storagePath);
      const task = uploadBytesResumable(r, file);

      setUpMsg("Enviando…");
      task.on("state_changed", s => {
        setUpPct(Math.round((s.bytesTransferred / s.totalBytes) * 100));
      });

      await new Promise<void>((resolve, reject) => {
        task.on("state_changed",
          () => {},
          (err) => reject(err),
          () => resolve()
        );
      });

      const url = await getDownloadURL(r);
      const asset: Asset = {
        id,
        cmd: _cmd,
        type: file.type.startsWith("video/") ? "video" : "image",
        storagePath,
        url,
        createdAt: Date.now(),
        enabled: true,
        by: user.email,
      };

      // salva na coleção e define como atual
      await setDoc(doc(db, "overlays", "main", "assets", id), asset);
      await setDoc(doc(db, "overlays", "main", "state", "current"),
        { id, at: Date.now() }, { merge: true });

      setUpMsg("✅ Enviado e definido como atual!");
      setCmd("");
      setFile(null);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      setUpPct(0);
    } catch (err: any) {
      console.error(err);
      setUpMsg("❌ Erro: " + (err?.message || err));
    }
  }

  // ===== Ações nos cards =====
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
      await updateDoc(doc(db, "overlays", "main", "assets", a.id), { cmd: sanitizeCmd(novo) });
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
    if (!confirm(`Apagar "${a.cmd}"?`)) return;
    setBusy(a.id);
    try {
      await deleteDoc(doc(db, "overlays", "main", "assets", a.id));
      if (currentId === a.id) {
        await setDoc(doc(db, "overlays", "main", "state", "current"), { id: null }, { merge: true });
      }
      if (a.storagePath) await deleteObject(sref(storage, a.storagePath));
    } finally { setBusy(""); }
  }

    async function triggerPlayById(id: string) {
  // “bipe” que o overlay escuta
  await setDoc(
    doc(db, "overlays", "main", "commands", "now"),
    { id, at: Date.now() },   // 'at' força mudança pra onSnapshot disparar
    { merge: true }
  );
}

  const overlayUrl = "https://micheleoxana.live/overlay";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-black text-white flex flex-col">
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

      {!user ? (
        <main className="flex-1 grid place-items-center p-10 text-purple-200">
          <p>Faça login para gerenciar e enviar seus vídeos/imagens.</p>
        </main>
      ) : (
        <main className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-6 p-6">

          {/* Coluna esquerda (upload + lista) */}
          <section className="xl:col-span-2 space-y-6">

            {/* === Upload card === */}
            <div className="rounded-2xl bg-purple-900/40 border border-purple-700 p-4">
              <h3 className="text-xl font-bold mb-3">Upload (vídeo/imagem) + comando</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-sm text-purple-300">Nome do comando (ex: <b>viralizar</b>)</label>
                  <input
                    value={cmd}
                    onChange={e => setCmd(e.target.value)}
                    placeholder="viralizar"
                    className="w-full rounded-lg bg-purple-950 border border-purple-700 px-3 py-2 outline-none focus:ring-2 focus:ring-fuchsia-500"
                  />

                  <label className="text-sm text-purple-300">Arquivo</label>
                  <input
                    type="file"
                    accept="video/*,image/*"
                    onChange={onSelectFile}
                    className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-fuchsia-600 file:px-3 file:py-2 file:text-white hover:file:bg-fuchsia-700"
                  />

                  <button
                    onClick={doUpload}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-700 font-semibold"
                  >
                    Enviar & definir como atual
                  </button>

                  <div className="text-sm text-purple-300">
                    Progresso: {upPct}%
                    <div className="h-2 mt-1 rounded bg-purple-800 overflow-hidden">
                      <div className="h-2 bg-fuchsia-500" style={{ width: `${upPct}%` }} />
                    </div>
                    {upMsg && <div className="mt-2 text-purple-200">{upMsg}</div>}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-purple-300 mb-2">Preview do arquivo selecionado:</div>
                  <div className="aspect-video rounded-xl overflow-hidden bg-black border border-purple-700">
                    {!preview ? (
                      <div className="w-full h-full grid place-items-center text-purple-500 text-sm">
                        Nenhum arquivo selecionado.
                      </div>
                    ) : file?.type.startsWith("video/") ? (
                      <video src={preview} muted playsInline loop className="w-full h-full object-cover" />
                    ) : (
                      <img src={preview} alt="preview" className="w-full h-full object-cover" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* === Busca + grid de cards === */}
            <div className="flex items-center gap-3">
              <input
                className="w-full rounded-xl bg-purple-900/50 border border-purple-700 px-4 py-2 outline-none focus:ring-2 focus:ring-fuchsia-500"
                placeholder="Buscar por comando ou arquivo…"
                value={filter}
                onChange={e => setFilter(e.target.value)}
              />
              <span className="text-purple-300 text-sm">{filtered.length} itens</span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((a) => (
                <article key={a.id}
                  className="rounded-2xl overflow-hidden bg-purple-900/40 border border-purple-700 shadow-lg">
                  <div className="aspect-video bg-black">
                    {a.type === "video" ? (
                      <video src={a.url} muted playsInline loop className="w-full h-full object-cover" />
                    ) : (
                      <img src={a.url} alt={a.cmd} className="w-full h-full object-cover" />
                    )}
                  </div>

                  <div className="p-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-purple-300">Comando</div>
                        <div className="text-lg font-semibold">{a.cmd || "(sem nome)"}</div>
                      </div>
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

          {/* Coluna direita: overlay + atual */}
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
  onClick={async () => {
    if (!currentAsset) return;
    await setAsCurrent(currentAsset);       // continua definindo como "atual"
    await triggerPlayById(currentAsset.id); // e manda tocar agora
  }}
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
