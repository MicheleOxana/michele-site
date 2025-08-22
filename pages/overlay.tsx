"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { doc, onSnapshot, getDoc } from "firebase/firestore";

type Asset = { id: string; type: "video" | "image"; url: string; };

export default function Overlay() {
  const [asset, setAsset] = useState<Asset | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "overlays", "main", "state", "current"), async (snap) => {
      const id = snap.data()?.id as string | undefined;
      if (!id) { setAsset(null); return; }
      const aSnap = await getDoc(doc(db, "overlays", "main", "assets", id));
      if (aSnap.exists()) setAsset(aSnap.data() as Asset);
      else setAsset(null);
    });
    return () => unsub();
  }, []);

  if (!asset) return null;

  if (asset.type === "video") {
    return (
      <video
        src={asset.url}
        autoPlay
        muted
        playsInline
        style={{ width: "100vw", height: "100vh", objectFit: "contain", background: "transparent" }}
      />
    );
  }

  return (
    <img
      src={asset.url}
      alt=""
      style={{ width: "100vw", height: "100vh", objectFit: "contain", background: "transparent" }}
    />
  );
}
