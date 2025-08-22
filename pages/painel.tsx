"use client";
import { useEffect, useState } from "react";
import { auth, db, storage, googleProvider } from "@/lib/firebaseClient"; // ajuste o alias/caminho
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

export default function Painel() {
  const [user, setUser] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [msg, setMsg] = useState("");

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  async function login() { await signInWithPopup(auth, googleProvider); }
  async function logout() { await signOut(auth); }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // opcional: trava por e-mail enquanto não usa custom claim
    const allowed = ["SEUEMAIL@GMAIL.COM"].includes(user.email);
    if (!allowed) { setMsg("Sem permissão para enviar."); return; }

    const id = crypto.randomUUID();
    const storagePath = `overlayAssets/${id}-${file.name}`;
    const storageRef = ref(storage, storagePath);
    const task = uploadBytesResumable(storageRef, file);

    task.on("state_changed",
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
        await setDoc(doc(db, "overlays", "main", "state", "current"),
          { id, at: Date.now() }, { merge: true });
        setMsg("Enviado e definido como atual!");
      }
    );
  }

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>Painel (privado)</h1>
      {!user ? (
        <button onClick={login}>Entrar com Google</button>
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
