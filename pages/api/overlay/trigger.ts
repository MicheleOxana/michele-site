// pages/api/overlay/trigger.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, applicationDefault, cert } from 'firebase-admin/app';

// 🔐 Ajuste conforme seu projeto. Se já tem "@/lib/firebaseAdmin", use ele.
if (!getApps().length) {
  initializeApp({
    // Se você já usa credencial via GOOGLE_APPLICATION_CREDENTIALS, pode deixar vazio
    credential: applicationDefault(),
  });
}

const db = getFirestore();

const CLIENT_ID = process.env.TWITCH_CLIENT_ID!;
const BROADCASTER_ID = process.env.TWITCH_BOT_BROADCASTER_ID!; // seu ID
const OVERLAY_ID = process.env.OVERLAY_ID || 'main';

// === Se você já tem isso pronto, importe do seu util (ex.: getUserTokenFromFirebase)
async function getBroadcasterUserToken(): Promise<string> {
  // Retorne o token **da conta principal** (broadcaster) com scope channel:read:subscriptions
  // Ex.: const { getUserTokenFromFirebase } = await import('@/utils/getUserTokenFromFirebase');
  // return await getUserTokenFromFirebase();
  throw new Error('Implemente getBroadcasterUserToken() ou troque para seu util existente.');
}

async function helix(path: string, token: string) {
  const r = await fetch(`https://api.twitch.tv/helix${path}`, {
    headers: {
      'Client-ID': CLIENT_ID,
      Authorization: `Bearer ${token}`,
    },
  });
  if (!r.ok) throw new Error(`Helix ${path} -> ${r.status} ${await r.text()}`);
  return r.json();
}

async function isModerator(userId: string, token: string) {
  const data = await helix(`/moderation/moderators?broadcaster_id=${BROADCASTER_ID}&user_id=${userId}`, token);
  return (data?.data?.length || 0) > 0;
}
async function isVIP(userId: string, token: string) {
  const data = await helix(`/channels/vips?broadcaster_id=${BROADCASTER_ID}&user_id=${userId}`, token);
  return (data?.data?.length || 0) > 0;
}
async function isSubscriber(userId: string, token: string) {
  // Founder cai aqui como sub
  const data = await helix(`/subscriptions?broadcaster_id=${BROADCASTER_ID}&user_id=${userId}`, token);
  return (data?.data?.length || 0) > 0;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method Not Allowed' });

    // Payload esperado vindo do bot/site: { cmd: "!viralizar", user_id: "123", forceId?: "assetDocId" }
    const { cmd, user_id, forceId } = (req.body || {}) as {
      cmd?: string;
      user_id?: string;
      forceId?: string;
    };

    if (!cmd || !cmd.startsWith('!') || !user_id) {
      return res.status(400).json({ ok: false, error: 'payload inválido: cmd ("!...") e user_id são obrigatórios' });
    }

    const cmdLower = cmd.slice(1).trim().toLowerCase();

    // 1) resolve o asset (por id explícito ou por cmdLower)
    let assetDocId: string | null = forceId || null;
    if (!assetDocId) {
      const snap = await db
        .collection('overlays').doc(OVERLAY_ID)
        .collection('assets')
        .where('cmdLower', '==', cmdLower) // <- normalize isso quando cadastrar
        .limit(1)
        .get();
      if (snap.empty) {
        return res.status(404).json({ ok: false, error: `asset não encontrado para cmd=${cmdLower}` });
      }
      assetDocId = snap.docs[0].id;
    }

    // 2) checa permissão na Twitch (server-side)
    const isBroadcaster = user_id === BROADCASTER_ID;
    let allowed = false;

    if (isBroadcaster) {
      allowed = true;
    } else {
      const token = await getBroadcasterUserToken(); // precisa scope channel:read:subscriptions
      const [mod, vip, sub] = await Promise.all([
        isModerator(user_id, token),
        isVIP(user_id, token),
        isSubscriber(user_id, token),
      ]);
      allowed = mod || vip || sub;
    }

    if (!allowed) {
      return res.status(403).json({ ok: false, error: 'sem permissão: precisa ser sub/mod/vip/broadcaster' });
    }

    // 3) escreve o “sino” que teu Overlay.tsx está ouvindo
    const at = Date.now();
    await db
      .collection('overlays').doc(OVERLAY_ID)
      .collection('commands').doc('play')
      .set({ at, id: assetDocId }, { merge: true });

    return res.json({ ok: true, at, id: assetDocId });
  } catch (e: any) {
    console.error('overlay/trigger error:', e?.message || e);
    return res.status(500).json({ ok: false, error: 'erro interno' });
  }
}
