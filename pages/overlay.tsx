// pages/overlay.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { doc, onSnapshot, getDoc } from "firebase/firestore";

type Asset = {
  id: string;
  cmd: string;
  url: string;
  type: "video" | "image";
};

export default function Overlay() {
  const [asset, setAsset] = useState<Asset | null>(null);
  const [visible, setVisible] = useState(false);
  const [nonce, setNonce] = useState(0); // força re-start do <video>
  const lastAtRef = useRef<number>(0);

  // debug = mostra controles para você testar no OBS via Interact
  const debug =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).has("debug");

  useEffect(() => {
    // Assina o "sino" de play
    const unsub = onSnapshot(
      doc(db, "overlays", "main", "commands", "play"),
      async (snap) => {
        const data = (snap.data() as any) || {};
        const at = Number(data.at || 0);
        if (!at || at === lastAtRef.current) return; // já tocado
        lastAtRef.current = at;

        // 1) pega id que veio no comando, ou cai no state/current
        let id: string | null = data.id || null;
        if (!id) {
          const cur = await getDoc(doc(db, "overlays", "main", "state", "current"));
          id = (cur.data() as any)?.id || null;
        }
        if (!id) return;

        // 2) carrega o asset e toca
        const aDoc = await getDoc(doc(db, "overlays", "main", "assets", id));
        if (!aDoc.exists()) return;

        const a = { id: aDoc.id, ...(aDoc.data() as any) } as Asset;
        setAsset(a);
        setVisible(true);
        setNonce((n) => n + 1); // reinicia o <video>

        // 3) se for imagem, some em N segundos
        if (a.type !== "video") {
          setTimeout(() => setVisible(false), 6000); // 6s para imagens
        }
      }
    );
    return unsub;
  }, []);

  // estilos simples – ajuste posição/tamanho como preferir
  const boxStyle: React.CSSProperties = {
    position: "absolute",
    top: 100,
    right: 100,
    width: 360,
    height: 640 * 0.56, // só pra dar uma base, ajuste livre
    pointerEvents: "none",
    borderRadius: 16,
    overflow: "hidden",
    opacity: visible ? 1 : 0,
    transition: "opacity .2s",
  };

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {asset && (
        <div style={boxStyle}>
          {asset.type === "video" ? (
            <video
              key={nonce}
              src={asset.url}
              autoPlay
              playsInline
              muted={false}
              controls={debug}
              onEnded={() => setVisible(false)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <img
              key={nonce}
              src={asset.url}
              alt={asset.cmd}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
        </div>
      )}
    </div>
  );
}
