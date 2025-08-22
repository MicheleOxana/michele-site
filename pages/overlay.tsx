"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { doc, onSnapshot, getDoc } from "firebase/firestore";

type Asset = { id:string; url:string; type:"video"|"image" };

export default function Overlay() {
  const [asset, setAsset] = useState<Asset|null>(null);

  useEffect(() => {
    const stateRef = doc(db, "overlays", "main", "state", "current");
    return onSnapshot(stateRef, async (snap) => {
      const d = snap.data() as any;
      if (!d?.id) return setAsset(null);

      const aRef = doc(db, "overlays", "main", "assets", d.id);
      const a = await getDoc(aRef);
      if (!a.exists()) return setAsset(null);

      const data = a.data() as any;
      setAsset({ id: d.id, url: data.url, type: data.type });
    });
  }, []);

  if (!asset) return null;

  return (
    <div style={{width:"100vw",height:"100vh",display:"grid",placeItems:"center",background:"transparent"}}>
      {asset.type === "video" ? (
        <video
          key={asset.id} // força recarregar quando muda
          src={asset.url}
          autoPlay
          playsInline
          muted // tire se quiser com áudio
          onEnded={() => setAsset(null)} // some quando termina
          style={{maxWidth:"100%",maxHeight:"100%"}}
        />
      ) : (
        <img
          key={asset.id}
          src={asset.url}
          style={{maxWidth:"100%",maxHeight:"100%"}}
          onLoad={() => setTimeout(() => setAsset(null), 10000)} // imagem some em 10s
          alt=""
        />
      )}
    </div>
  );
}
