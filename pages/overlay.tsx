import { useEffect, useRef, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { doc, onSnapshot, getDoc } from "firebase/firestore";

type Asset = {
  id: string;
  url: string;
  type: string; // "video/mp4", "image/png", etc.
};

const OVERLAY_ID = "main";

export default function OverlayPage() {
  const vref = useRef<HTMLVideoElement>(null);
  const iref = useRef<HTMLImageElement>(null);
  const [log, setLog] = useState("overlay pronto");

  async function loadAndPlay(assetId: string, source: "state" | "command") {
    if (!assetId) return;
    try {
      setLog(`(${source}) carregando ${assetId}...`);

      const snap = await getDoc(doc(db, "overlays", OVERLAY_ID, "assets", assetId));
      if (!snap.exists()) {
        setLog(`asset ${assetId} não existe`);
        return;
      }
      const a = snap.data() as Asset;
      const isVideo = (a.type || "").startsWith("video/");

      const v = vref.current!;
      const i = iref.current!;

      if (isVideo) {
        // mostra vídeo
        i.style.display = "none";
        v.style.display = "block";
        v.src = a.url;
        v.currentTime = 0;

        try {
          v.muted = false;
          await v.play();
        } catch {
          v.muted = true;     // fallback pra browser
          await v.play().catch(()=>{});
        }
        setLog(`tocando vídeo: ${a.url}`);
      } else {
        // mostra imagem
        v.pause();
        v.style.display = "none";
        i.style.display = "block";
        i.src = a.url;
        setLog(`mostrando imagem: ${a.url}`);
      }
    } catch (e: any) {
      setLog(`erro: ${e.message || e}`);
    }
  }

  useEffect(() => {
    // 1) pega "atual" ao abrir
    const stateRef = doc(db, "overlays", OVERLAY_ID, "state", "current");
    const unsubState = onSnapshot(stateRef, (s) => {
      const d = s.data() as any;
      if (d?.id) loadAndPlay(d.id, "state");
    });

    // 2) toca quando receber comando
    const cmdRef = doc(db, "overlays", OVERLAY_ID, "commands", "now");
    const unsubCmd = onSnapshot(cmdRef, (s) => {
      const d = s.data() as any;
      if (d?.id) loadAndPlay(d.id, "command");
    });

    return () => { unsubState(); unsubCmd(); };
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "transparent", overflow: "hidden" }}>
      <video
        ref={vref}
        style={{ width: "100%", height: "100%", objectFit: "contain", display: "none" }}
        playsInline
        autoPlay
      />
      <img
        ref={iref}
        style={{ width: "100%", height: "100%", objectFit: "contain", display: "none" }}
        alt=""
      />
      {/* Debugzinho: pode remover no OBS */}
      <div style={{
        position: "absolute", left: 8, bottom: 8, fontFamily: "monospace",
        fontSize: 12, color: "#0f0", background: "rgba(0,0,0,.4)",
        padding: "6px 8px", borderRadius: 6
      }}>
        {log}
      </div>
    </div>
  );
}
