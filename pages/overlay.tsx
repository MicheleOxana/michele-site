"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

type Asset = {
  id: string;
  cmd: string;
  url: string;
  type: "video" | "image";
  enabled?: boolean;
};

export default function Overlay() {
  const [asset, setAsset] = useState<Asset | null>(null);
  const [at, setAt] = useState<number | null>(null);
  const [status, setStatus] = useState("carregando…");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // modo debug (exibe logs na tela)
  const debug = useMemo(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).has("debug");
  }, []);

  // Escuta o "estado atual"
  useEffect(() => {
    // precisa do doc overlays/main com { public: true }
    const unsub = onSnapshot(
      doc(db, "overlays", "main", "state", "current"),
      async (snap) => {
        const data = snap.data() as any;
        const id = data?.id || null;
        const atTS = data?.at || null;
        setAt(atTS ?? null);

        if (!id) {
          setAsset(null);
          setStatus("sem asset");
          return;
        }

        const a = await getDoc(doc(db, "overlays", "main", "assets", id));
        if (!a.exists()) {
          setAsset(null);
          setStatus("asset não encontrado");
          return;
        }
        const adata = a.data() as Asset;
        if (adata.enabled === false) {
          setAsset(null);
          setStatus("asset desabilitado");
          return;
        }
        setAsset({ id: a.id, ...adata });
        setStatus(`ok: ${adata.cmd} (${adata.type})`);
      }
    );
    return unsub;
  }, []);

  // sempre que trocar o asset/at, forçar tocar
  useEffect(() => {
    if (!asset) return;

    const tryPlay = async () => {
      try {
        setStatus((s) => s + " | carregando…");

        // para vídeos, garanta load+play
        if (asset.type === "video" && videoRef.current) {
          const v = videoRef.current;
          v.pause();
          v.load();         // força recarregar a mídia
          // OBS costuma permitir autoplay com som, mas se falhar,
          // tentamos com mute e desmutamos depois.
          try {
            v.muted = false;
            await v.play();
          } catch {
            v.muted = true;
            await v.play();
            setTimeout(() => { v.muted = false; }, 300);
          }
        }

        // para áudio independente (se preferir usar <audio>)
        if (asset.type === "video" && audioRef.current) {
          const a = audioRef.current;
          a.pause();
          a.load();
          try { await a.play(); } catch { /* opcional: fallback */ }
        }

        setStatus((s) => s.replace(" | carregando…", " | tocando"));
      } catch (e: any) {
        setStatus("erro ao tocar: " + (e?.message || e));
      }
    };

    // espera a renderização aplicar o src
    const t = setTimeout(tryPlay, 50);
    return () => clearTimeout(t);
  }, [asset?.id, at]);

  // Chave muda quando “at” muda → força recriar o elemento e reiniciar vídeo
  const mediaKey = `${asset?.id || "none"}-${at || 0}`;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        // fundo transparente para usar como Overlay no OBS
        background: "transparent",
      }}
    >
      {!asset ? (
        debug ? (
          <div style={{
            color: "#fff", fontFamily: "sans-serif",
            position: "absolute", top: 20, left: 20
          }}>
            Overlay: {status}
          </div>
        ) : null
      ) : asset.type === "image" ? (
        <img
          key={mediaKey}
          src={asset.url}
          alt={asset.cmd}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      ) : (
        <>
          {/* Se quiser áudio separado, descomente */}
          {/* <audio ref={audioRef} src={asset.url} /> */}
          <video
            key={mediaKey}
            ref={videoRef}
            src={asset.url}
            autoPlay
            playsInline
            // se quiser sempre repetir, deixe loop; se quer tocar 1x, remova loop
            //loop
            controls={false}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </>
      )}

      {debug && (
        <div style={{
          color: "#0ff", fontFamily: "monospace",
          position: "absolute", bottom: 16, left: 16,
          background: "rgba(0,0,0,.5)", padding: "8px 10px", borderRadius: 8
        }}>
          status={status} | id={asset?.id} | at={at} | cmd={asset?.cmd}
        </div>
      )}
    </div>
  );
}
