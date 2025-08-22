"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { auth, db, storage, googleProvider } from "@/lib/firebaseClient";
import { signInWithPopup, onAuthStateChanged, signOut, User } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc, onSnapshot, getDoc } from "firebase/firestore";

const ALLOWED_EMAIL = "jeffersonloyola@gmail.com";
const OVERLAY_URL = "https://micheleoxana.live/overlay";

type Asset = {
  id: string;
  url: string;
  type: "video" | "image";
  storagePath: string;
  createdAt: number;
};

export default function Painel() {
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState(0);
  const [msg, setMsg] = useState("");

  // estado do arquivo escolhido (preview antes do upload)
  const [pickedFile, setPickedFile] = useState<File | null>(null);
  const [pickedUrl, setPickedUrl] = useState<string | null>(null);
  const [pickedType, setPickedType] = useState<"video" | "image" | null>(null);

  const [command, setCommand] = useState("");
  const [current, setCurrent] = useState<Asset | null>(null);
  const [isPlayingNow, setIsPlayingNow] = useState(false);

  const allowed = useMemo(() => user?.email === ALLOWED_EMAIL, [user]);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  async function login() {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e: any) {
      setMsg("Falha no login: " + (e?.message || e));
    }
  }
  async function logout() {
    await signOut(auth);
  }

  // Assina o "atual" para preview
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "overlays", "main", "state", "current"),
      async (snap) => {
        const d = snap.data() as any;
        if (!d?.id) return setCurrent(null);
        const aRef = doc(db, "overlays", "main", "assets", d.id);
        const a = await getDoc(aRef);
        if (a.exists()) setCurrent(a.data() as Asset);
      }
    );
    return () => unsub();
  }, []);

  // escolher arquivo → gera preview local
  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setPickedFile(file);
    setProgress(0);
    setMsg("");
    if (file) {
      const url = URL.createObjectURL(file);
      setPickedUrl(url);
      setPickedType(file.type.startsWith("video/") ? "video" : file.type.startsWith("image/") ? "image" : null);
    } else {
      setPickedUrl(null);
      setPickedType(null);
    }
  }

  // upload do arquivo escolhido
  async function uploadNow() {
    const file = pickedFile;
    if (!file) { setMsg("Escolha um arquivo primeiro."); return; }
    if (!user || !allowed) { setMsg("Sem permissão para enviar."); return; }

    const isVid = file.type.startsWith("video/");
    const isImg = file.type.startsWith("image/");
    if (!isVid && !isImg) { setMsg("Envie apenas vídeo ou imagem."); return; }

    const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const storagePath = `overlayAssets/${id}-${file.name}`;
    const storageRef = ref(storage, storagePath);
    const task = uploadBytesResumable(storageRef, file);

    setMsg("Enviando…");
    setProgress(0);

    task.on(
      "state_changed",
      (s) => setProgress(Math.round((s.bytesTransferred / s.totalBytes) * 100)),
      (err) => setMsg("Erro no upload: " + err.message),
      async () => {
        const url = await getDownloadURL(storageRef);
        const asset: Asset = {
          id,
          type: isVid ? "video" : "image",
          storagePath,
          url,
          createdAt: Date.now(),
        };

        await setDoc(doc(db, "overlays", "main", "assets", id), asset);
        await setDoc(doc(db, "overlays", "main", "state", "current"), { id, at: Date.now() }, { merge: true });

        const cmd = command.trim().toLowerCase();
        if (cmd) {
          await setDoc(
            doc(db, "overlays", "main", "commands", cmd),
            { assetId: id, name: cmd, updatedAt: Date.now() },
            { merge: true }
          );
        }

        setMsg("Enviado com sucesso! Já definido como atual.");
        setProgress(0);
        // limpa seleção
        setPickedFile(null);
        if (pickedUrl) URL.revokeObjectURL(pickedUrl);
        setPickedUrl(null);
        setPickedType(null);
        setCommand("");
      }
    );
  }

  async function tocarAgora() {
    if (!current) return;
    setIsPlayingNow(true);
    try {
      await setDoc(
        doc(db, "overlays", "main", "state", "current"),
        { id: current.id, at: Date.now(), manual: true },
        { merge: true }
      );
      setMsg("Sinal enviado. Se o OBS está no /overlay, deve tocar.");
    } catch (e: any) {
      setMsg("Erro ao acionar overlay: " + (e?.message || e));
    } finally {
      setIsPlayingNow(false);
    }
  }

  function copyOverlayUrl() {
    navigator.clipboard.writeText(OVERLAY_URL);
    setMsg("URL do overlay copiada!");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-black text-white flex flex-col font-sans relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none animate-glitter z-0"></div>

      {/* Header */}
      <header className="z-10 bg-purple-950 text-purple-200 p-4 flex items-center justify-between shadow-lg shadow-purple-700/30 border-b border-purple-700">
        <h1 className="text-2xl font-bold tracking-widest">
          💜 MicheleOxana™ <span className="text-sm font-normal italic">Live</span>
          <span className="ml-3 text-xs px-2 py-1 rounded bg-purple-800/60 border border-purple-700">Painel Privado</span>
        </h1>
        <nav className="space-x-3 text-sm font-bold tracking-wide uppercase text-fuchsia-300">
          <Link href="/"><a className="hover:text-white transition-shadow duration-300 shadow-fuchsia-500 hover:shadow-glow">Início</a></Link>
          <Link href="/primeiros-passos"><a className="hover:text-white transition-shadow duration-300 shadow-fuchsia-500 hover:shadow-glow">Primeiros Passos</a></Link>
          <Link href="/sobre"><a className="hover:text-white transition-shadow duration-300 shadow-fuchsia-500 hover:shadow-glow">Sobre</a></Link>
          <Link href="/xaninhas-coins"><a className="hover:text-white transition-shadow duration-300 shadow-fuchsia-500 hover:shadow-glow">Xaninhas Coins</a></Link>
          <Link href="/comandos"><a className="hover:text-white transition-shadow duration-300 shadow-fuchsia-500 hover:shadow-glow">Comandos</a></Link>
          <Link href="/loja"><a className="hover:text-white transition-shadow duration-300 shadow-fuchsia-500 hover:shadow-glow">Loja</a></Link>
          <Link href="/servicos"><a className="hover:text-white transition-shadow duration-300 shadow-fuchsia-500 hover:shadow-glow">Serviços</a></Link>
          <Link href="/conteudos"><a className="hover:text-white transition-shadow duration-300 shadow-fuchsia-500 hover:shadow-glow">Conteúdos</a></Link>
          <Link href="/grimward"><a className="hover:text-white transition-shadow duration-300 shadow-fuchsia-500 hover:shadow-glow">Grimward</a></Link>
          <Link href="/cantinho-do-viewer"><a className="hover:text-white transition-shadow duration-300 shadow-fuchsia-500 hover:shadow-glow">Cantinho do Viewer</a></Link>
          <Link href="/agradecimento"><a className="hover:text-white transition-shadow duration-300 shadow-fuchsia-500 hover:shadow-glow">Agradecimento</a></Link>
        </nav>
      </header>

      {/* Main */}
      <main className="flex-1 z-10 px-4 py-8 max-w-5xl w-full mx-auto">
        {/* Login / Status */}
        {!user ? (
          <div className="mt-12 grid place-items-center">
            <div className="w-full max-w-xl rounded-2xl border border-purple-700/60 bg-purple-950/60 shadow-xl shadow-purple-900/40 p-6 text-center">
              <h2 className="text-3xl font-extrabold text-fuchsia-400 mb-4 drop-shadow-[0_0_6px_fuchsia] uppercase">Painel (privado)</h2>
              <p className="text-purple-200 mb-6">Faça login com sua conta autorizada para enviar mídias e acionar overlays no OBS.</p>
              <button onClick={login} className="px-6 py-3 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 font-bold uppercase tracking-wide shadow-lg shadow-fuchsia-700/40">
                Entrar com Google
              </button>
            </div>
          </div>
        ) : !allowed ? (
          <div className="mt-12 grid place-items-center">
            <div className="w-full max-w-xl rounded-2xl border border-red-700/60 bg-red-950/40 shadow-xl p-6 text-center">
              <p className="mb-2">Logado como <b>{user.email}</b></p>
              <h2 className="text-2xl font-bold text-red-300">Sem permissão para acessar o painel.</h2>
              <p className="text-red-200 mt-2">Use a conta autorizada.</p>
              <button onClick={logout} className="mt-6 px-4 py-2 rounded-lg bg-red-700 hover:bg-red-600 font-bold">Sair</button>
            </div>
          </div>
        ) : (
          <>
            {/* Top bar */}
            <div className="flex gap-3 items-center justify-between flex-wrap">
              <div className="text-sm text-purple-200">Logado como <b className="text-white">{user.email}</b></div>
              <button onClick={logout} className="px-4 py-2 rounded-lg bg-purple-800 hover:bg-purple-700 border border-purple-600">Sair</button>
            </div>

            {/* Cards */}
            <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Uploader + PREVIEW LOCAL */}
              <div className="rounded-2xl border border-purple-700/60 bg-purple-950/60 shadow-xl shadow-purple-900/40 p-6">
                <h3 className="text-xl font-bold text-fuchsia-300 mb-4">Upload (vídeo/imagem) + comando</h3>

                <label className="block text-sm text-purple-300 mb-2">
                  Nome do comando (ex.: <code className="text-pink-300 font-mono">viralizar</code>):
                </label>
                <input
                  value={command}
                  onChange={(e) => setCommand(e.target.value.toLowerCase())}
                  placeholder="viralizar"
                  className="w-full mb-4 px-3 py-2 rounded-lg bg-purple-900/60 border border-purple-700 outline-none focus:ring-2 focus:ring-fuchsia-500"
                />

                <label className="block text-sm text-purple-300 mb-2">Arquivo:</label>
                <input
                  type="file"
                  accept="video/*,image/*"
                  onChange={onPick}
                  className="w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-fuchsia-600 file:px-4 file:py-2 file:text-white file:font-bold hover:file:bg-fuchsia-500 cursor-pointer"
                />

                {/* PREVIEW DO ARQUIVO ESCOLHIDO */}
                {pickedUrl && pickedType && (
                  <div className="mt-4">
                    <div className="text-xs text-purple-300 mb-1">Preview do arquivo selecionado:</div>
                    <div className="rounded-xl overflow-hidden border border-purple-700 bg-black/40" style={{ height: 220 }}>
                      {pickedType === "video" ? (
                        <video
                          src={pickedUrl}
                          muted
                          loop
                          autoPlay
                          playsInline
                          controls
                          className="w-full h-full object-contain bg-black"
                        />
                      ) : (
                        <img
                          src={pickedUrl}
                          alt="preview"
                          className="w-full h-full object-contain bg-black"
                        />
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={uploadNow}
                    className="px-4 py-2 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 font-bold disabled:opacity-60"
                    disabled={!pickedFile}
                  >
                    Enviar & definir como atual
                  </button>
                </div>

                <div className="mt-4">
                  <div className="h-3 w-full bg-purple-900/60 rounded-lg overflow-hidden border border-purple-700">
                    <div className="h-full bg-fuchsia-500 transition-all" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="text-xs mt-1 text-purple-300">Progresso: {progress}%</div>
                </div>

                {msg && <div className="mt-4 text-sm text-fuchsia-300">{msg}</div>}
              </div>

              {/* Overlay / Preview do ATUAL / Acionar */}
              <div className="rounded-2xl border border-purple-700/60 bg-purple-950/60 shadow-xl shadow-purple-900/40 p-6">
                <h3 className="text-xl font-bold text-fuchsia-300 mb-4">Overlay & OBS</h3>

                <div className="mb-4">
                  <label className="block text-sm text-purple-300 mb-2">URL do overlay (para Browser Source no OBS):</label>
                  <div className="flex gap-2">
                    <input
                      value={OVERLAY_URL}
                      readOnly
                      className="flex-1 px-3 py-2 rounded-lg bg-purple-900/60 border border-purple-700 text-purple-200"
                    />
                    <button onClick={copyOverlayUrl} className="px-4 py-2 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 font-bold">
                      Copiar
                    </button>
                  </div>
                  <p className="text-xs text-purple-300 mt-2">
                    Dica: tamanho 1920×1080 (ou o da sua cena), “Shutdown source when not visible” desmarcado.
                  </p>
                </div>

                <div className="mt-6">
                  <h4 className="font-bold text-purple-200 mb-2">Pronto para tocar (preview do atual):</h4>

                  {/* PREVIEW DO ASSET ATUAL */}
                  <div className="rounded-xl overflow-hidden border border-purple-700 bg-black/40" style={{ height: 220 }}>
                    {current ? (
                      current.type === "video" ? (
                        <video
                          key={current.id}
                          src={current.url}
                          muted
                          loop
                          autoPlay
                          playsInline
                          controls
                          className="w-full h-full object-contain bg-black"
                        />
                      ) : (
                        <img
                          key={current.id}
                          src={current.url}
                          alt="atual"
                          className="w-full h-full object-contain bg-black"
                        />
                      )
                    ) : (
                      <div className="w-full h-full grid place-items-center text-purple-300 text-sm">
                        Nenhum asset definido ainda.
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <button
                      onClick={tocarAgora}
                      disabled={!current || isPlayingNow}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-bold disabled:opacity-60"
                    >
                      {isPlayingNow ? "Enviando..." : "Tocar agora"}
                    </button>
                    {current && (
                      <span className="text-xs text-purple-300 truncate">
                        <b className="text-white">{current.type.toUpperCase()}</b> • {current.url}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="z-10 bg-purple-950 text-purple-400 text-xs text-center py-2 border-t border-purple-700">
        © 2025 <span className="font-semibold text-white">MicheleOxana™</span> — Painel privado powered by <span className="italic text-pink-400">Unixana 🦄</span>
      </footer>

      <style jsx>{`
        @keyframes glitter {
          0% { background-position: 0 0; }
          100% { background-position: 1000px 1000px; }
        }
        .animate-glitter {
          background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 20px 20px;
          animation: glitter 40s linear infinite;
        }
        .shadow-glow { text-shadow: 0 0 6px rgba(255,0,255,0.6), 0 0 10px rgba(255,0,255,0.4); }
      `}</style>
    </div>
  );
}

