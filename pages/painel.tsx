"use client";
import { useEffect, useState } from "react";
import { auth, db, storage, googleProvider } from "@/lib/firebaseClient";
import { signInWithPopup, signInWithRedirect, onAuthStateChanged, signOut } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

const ALLOWED = new Set<string>([
  "SEUEMAIL@GMAIL.COM", // <-- troque para o seu
]);

export default function Painel() {
  const [user, setUser] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub(); // cleanup
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      // se popup bloquear/fechar, tenta redirect
      if (err?.code === "auth/popup-blocked" || err?.code === "auth/popup-closed-by-user") {
        await signInWithRedirect(auth, googleProvider);
      } else if (err?.code === "auth/unauthorized-domain") {
        setMsg("Domínio não autorizado no Firebase Auth (adicione micheleoxana.live).");
      } else {
        setMsg("Erro ao logar: " + (err?.message || String(err)));
      }
    }
  };

  const logout = async () => { await signOut(auth); };

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!ALLOWED.has(user.email)) {
      setMsg("Sem permissão para enviar.");
      return;
    }

    const id = crypto.randomUUID();
    const storagePath = `overlayAssets/${id}-${file.name}`;
    const storageRef = ref(storage, storagePath);
    const task = uploadBytesResumable(storageRef, file);

    task.on(
      "state_changed",
      s => setProgress(Math.round((s.bytesTransferred / s.totalBytes) * 100)),
      err => setMsg("Erro no upload: " + err.message),
      async () => {
        const url = await getDownloadURL(storageRef);
        const asset = {
          id,
          type: file.type.startsWith("video/") ? "video" : "image",
          storagePath,
          url,
          createdAt: Date.now(),
        };
        await setDoc(doc(db, "overlays", "main", "assets", id), asset);
        await setDoc(
          doc(db, "overlays", "main", "state", "current"),
          { id, at: Date.now() },
          { merge: true }
        );
        setMsg("Enviado e definido como atual!");
      }
    );
  }

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>Painel (privado)</h1>
      {!user ? (
        <>
          <button onClick={login}>Entrar com Google</button>
          {msg && <p>{msg}</p>}
        </>
      ) : (
        <>
          <p>Logado como <b>{user.email}</b></p>
          <button onClick={logout}>Sair</button>
          <hr />
          <input type="file" onChange={handleUpload} accept="video/*,image/*" />
          <div>Progresso: {progress}%</div>
          <div>{msg}</div>
        </>
      )}
    </div>
  );
}
