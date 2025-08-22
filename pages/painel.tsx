"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  auth, db, storage, googleProvider
} from "@/lib/firebaseClient";
import {
  signInWithPopup, onAuthStateChanged, signOut, User
} from "firebase/auth";
import {
  ref, uploadBytesResumable, getDownloadURL, deleteObject
} from "firebase/storage";
import {
  collection, doc, onSnapshot, orderBy, query,
  setDoc, getDoc, updateDoc, deleteDoc, serverTimestamp
} from "firebase/firestore";

// CONFIG
const ALLOWED_EMAILS = ["jeffersonloyola@gmail.com"];
const OVERLAY_DOC = { root: "overlays", id: "main" };
const OVERLAY_URL = "https://micheleoxana.live/overlay";

type Asset = {
  id: string;
  cmd?: string;
  type: "video" | "image";
  storagePath: string;
  url: string;
  createdAt?: any;
};

export default function Painel() {
  const [user, setUser] = useState<User | null>(null);
  const [allowed, setAllowed] = useState<boolean>(false);

  const [cmd, setCmd] = useState("viralizar");
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [msg, setMsg] = useState("");

  const [current, setCurrent] = useState<Asset | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preview local do arquivo
  const filePreview = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);
  useEffect(() => () => filePreview && URL.revokeObjectURL(filePreview), [filePreview]);

  // Auth
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAllowed(!!u && ALLOWED_EMAILS.includes(u.email || ""));
    });
  }, []);

  async function login() { await signInWithPopup(auth, googleProvider); }
  async function logout() { await signOut(auth); }

  // Ouve o "current"
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, OVERLAY_DOC.root, OVERLAY_DOC.id, "state", "current"),
      async (snap) => {
        const data = snap.data() as { id?: string } | undefined;
        if (!data?.id) { setCurrent(null); return; }
        const a = await getDoc(doc(db, OVERLAY_DOC.root, OVERLAY_DOC.id, "assets", data.id));
        if (a.exists()) setCurrent({ id: a.id, ...(a.data() as any) });
        else setCurrent(null);
      }
    );
    return () => unsub();
  }, []);

  // Lista de assets (últimos primeiro)
  useEffect(() => {
    const q = query(
      collection(db, OVERLAY_DOC.root, OVERLAY_DOC.id, "assets"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const arr: Asset[] = [];
      snap.forEach((d) => arr.push({ id: d.id, ...(d.data() as any) }));
      setAssets(arr);
    });
    return () => unsub();
  }, []);

  // Upload
  async function handleUpload() {
    try {
      setMsg("");
      if (!user) { setMsg("Faça login."); return; }
      if (!allowed) { setMsg("Sem permissão."); return; }
      if (!file) { setMsg("Escolha um arquivo."); return; }

      const id = crypto.randomUUID();
      const storagePath = `overlayAssets/${id}-${(cmd || "asset")}-${file.name}`;
      const sref = ref(storage, storagePath);
      const task = uploadBytesResumable(sref, file);

      await new Promise<void>((resolve, reject) => {
        task.on("state_changed",
          (s) => setProgress(Math.round((s.bytesTransferred / s.totalBytes) * 100)),
          reject,
          () => resolve()
        );
      });

      const url = await getDownloadURL(sref);
      const type = file.type.startsWith("video/") ? "video" : "image";

      // Salva asset
      const asset: Asset = { id, cmd, type, storagePath, url, createdAt: serverTimestamp() };
      await setDoc(doc(db, OVERLAY_DOC.root, OVERLAY_DOC.id, "assets", id), asset);

      // Define como atual
      await setDoc(
        doc(db, OVERLAY_DOC.root, OVERLAY_DOC.id, "state", "current"),
        { id, bump: Date.now() }, // bump: ajuda a re-tocar o mesmo
        { merge: true }
      );

      setMsg("✅ Enviado e definido como atual!");
      setProgress(0);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (e: any) {
      console.error(e);
      setMsg("❌ Erro ao enviar/salvar: " + (e?.message || e));
    }
  }

  async function tocarAgora() {
    if (!current) return;
    try {
      await setDoc(
        doc(db, OVERLAY_DOC.root, OVERLAY_DOC.id, "state", "current"),
        { id: current.id, bump: Date.now() },
        { merge: true }
      );
      setMsg("▶️ Tocando no overlay…");
    } catch (e: any) {
      setMsg("❌ Erro ao acionar: " + (e?.message || e));
    }
  }

  async function tornarAtual(a: Asset) {
    try {
      await setDoc(
        doc(db, OVERLAY_DOC.root, OVERLAY_DOC.id, "state", "current"),
        { id: a.id, bump: Date.now() },
        { merge: true }
      );
      setMsg("✅ Definido como atual!");
    } catch (e: any) {
      setMsg("❌ Erro: " + (e?.message || e));
    }
  }

  async function renomear(a: Asset) {
    const novo = prompt("Novo nome do comando:", a.cmd || "");
    if (novo === null) return;
    try {
      await updateDoc(doc(db, OVERLAY_DOC.root, OVERLAY_DOC.id, "assets", a.id), { cmd: novo });
      setMsg("✏️ Comando atualizado.");
    } catch (e: any) {
      setMsg("❌ Erro: " + (e?.message || e));
    }
  }

  async function excluir(a: Asset) {
    if (!confirm("Excluir este asset?")) return;
    try {
      await deleteDoc(doc(db, OVERLAY_DOC.root, OVERLAY_DOC.id, "assets", a.id));
      await deleteObject(ref(storage, a.storagePath));
      if (current?.id === a.id) {
        await setDoc(doc(db, OVERLAY_DOC.root, OVERLAY_DOC.id, "state", "current"), { id: null }, { merge: true });
      }
      setMsg("🗑️ Excluído.");
    } catch (e: any) {
      setMsg("❌ Erro ao excluir: " + (e?.message || e));
    }
  }

  const canUse = !!user && allowed;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-black text-white font-sans">
      {/* topo */}
      <header className="bg-purple-950 border-b border-purple-700/60 shadow-lg shadow-purple-800/30">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">💜 MicheleOxana™</span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-fuchsia-700/40 border border-fuchsia-400/40">
              Painel Privado
            </span>
          </div>
          <div className="text-sm">
            {!user ? (
              <button onClick={login} className="px-3 py-1 rounded bg-fuchsia-600 hover:bg-fuchsia-500">
                Entrar com Google
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-fuchsia-300">{user.email}</span>
                <button onClick={logout} className="px-3 py-1 rounded bg-purple-700 hover:bg-purple-600">
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 grid md:grid-cols-2 gap-6">
        {/* Coluna Upload */}
        <section className="bg-purple-950/50 backdrop-blur rounded-2xl border border-purple-700/50 p-5 shadow-xl shadow-purple-900/20">
          <h2 className="text-xl font-semibold mb-4">Upload (vídeo/imagem) + comando</h2>

          {!canUse && (
            <div className="text-sm text-yellow-300 mb-4">
              Faça login com o e-mail autorizado para enviar.
            </div>
          )}

          <label className="block text-sm text-purple-200 mb-1">
            Nome do comando (ex: <span className="font-mono">viralizar</span>)
          </label>
          <input
            value={cmd} onChange={(e) => setCmd(e.target.value)}
            className="w-full bg-purple-900/60 border border-purple-700 rounded px-3 py-2 mb-3 outline-none"
            placeholder="viralizar"
          />

          <div className="flex items-center gap-3 mb-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*,image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block"
              disabled={!canUse}
            />
            {file && <span className="text-purple-300 text-sm truncate">{file.name}</span>}
          </div>

          {/* Preview do arquivo selecionado */}
          {filePreview && (
            <div className="mb-3">
              {file?.type.startsWith("video/") ? (
                <video src={filePreview} controls className="w-full rounded-lg border border-purple-700" />
              ) : (
                <img src={filePreview} className="w-full rounded-lg border border-purple-700" />
              )}
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!canUse || !file}
            className="w-full py-3 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 disabled:opacity-40"
          >
            Enviar & definir como atual
          </button>

          <div className="mt-3 text-sm text-purple-200">
            Progresso: {progress}%
            <div className="h-2 bg-purple-900 rounded mt-1">
              <div className="h-2 bg-fuchsia-500 rounded" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {msg && <div className="mt-3 text-sm">{msg}</div>}
        </section>

        {/* Coluna Overlay/Atual */}
        <section className="bg-purple-950/50 backdrop-blur rounded-2xl border border-purple-700/50 p-5 shadow-xl shadow-purple-900/20">
          <h2 className="text-xl font-semibold mb-4">Overlay & OBS</h2>
          <label className="block text-sm text-purple-200 mb-1">URL do overlay (Browser Source no OBS)</label>
          <div className="flex gap-2 mb-3">
            <input
              value={OVERLAY_URL}
              readOnly
              className="flex-1 bg-purple-900/60 border border-purple-700 rounded px-3 py-2 outline-none"
            />
            <button
              onClick={() => navigator.clipboard.writeText(OVERLAY_URL)}
              className="px-3 rounded bg-purple-700 hover:bg-purple-600"
            >
              Copiar
            </button>
          </div>
          <p className="text-xs text-purple-300 mb-4">
            Dica: 1920×1080 e desmarque “Shutdown source when not visible”.
          </p>

          <h3 className="font-semibold mb-2">Pronto para tocar (preview do atual):</h3>
          <div className="rounded-xl border border-purple-700 p-3 min-h-[260px] flex items-center justify-center bg-purple-900/40">
            {!current ? (
              <span className="text-purple-300 text-sm">Nenhum asset definido ainda.</span>
            ) : current.type === "video" ? (
              <video src={current.url} controls className="w-full rounded" />
            ) : (
              <img src={current.url} className="max-h-[320px] object-contain rounded" />
            )}
          </div>

          <button
            onClick={tocarAgora}
            disabled={!current}
            className="mt-3 px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40"
          >
            Tocar agora
          </button>
        </section>

        {/* Lista de assets */}
        <section className="md:col-span-2 bg-purple-950/40 rounded-2xl border border-purple-700/50 p-5">
          <h2 className="text-xl font-semibold mb-4">Seus assets</h2>
          {!assets.length ? (
            <div className="text-purple-300 text-sm">Nenhum asset enviado ainda.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {assets.map((a) => (
                <div key={a.id} className="rounded-xl border border-purple-700 bg-purple-900/40 p-3">
                  <div className="text-sm text-purple-300 mb-2">
                    <b>Comando:</b> {a.cmd || <em className="text-purple-400/70">sem nome</em>}
                  </div>
                  <div className="aspect-video overflow-hidden rounded border border-purple-700 mb-3">
                    {a.type === "video" ? (
                      <video src={a.url} className="w-full h-full object-cover" />
                    ) : (
                      <img src={a.url} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => tornarAtual(a)}
                      className="flex-1 py-2 rounded bg-emerald-600 hover:bg-emerald-500">Tornar atual</button>
                    <button onClick={() => renomear(a)}
                      className="px-3 rounded bg-yellow-600 hover:bg-yellow-500">Renomear</button>
                    <button onClick={() => excluir(a)}
                      className="px-3 rounded bg-rose-600 hover:bg-rose-500">Excluir</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
