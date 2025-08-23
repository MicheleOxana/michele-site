// pages/api/overlay/trigger.ts
import type { NextApiRequest, NextApiResponse } from 'next';

// ✅ usa o db central (teu firebaseAdmin)
import { db } from '../../../src/services/firebaseAdmin';
// ✅ pega o token da CONTA PRINCIPAL (default export)
import getUserTokenFromFirebase from '../../../src/utils/getUserTokenFromFirebase';

const CLIENT_ID = process.env.TWITCH_CLIENT_ID!;
const BROADCASTER_ID = process.env.TWITCH_BOT_BROADCASTER_ID!; // ex.: 517861418
const OVERLAY_ID = process.env.OVERLAY_ID || 'main';

// --- Helix helpers ---
async function helix(path: string, token: string) {
  const r = await fetch(`https://api.twitch.tv/helix${path}`, {
    headers: { 'Client-ID': CLIENT_ID, Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  const text = await r.text();
  if (!r.ok) throw new Error(`Helix ${path} -> ${r.status} ${text}`);
  try { return JSON.parse(text); } catch { return text as any; }
}

async function resolveUserId(
  { user_id, user_login, token }:
  { user_id?: string; user_login?: string; token: string }
): Promise<string> {
  if (user_id) return user_id;
  if (!user_login) throw new Error('Informe user_id ou user_login');
  const data = await helix(`/users?login=${encodeURIComponent(user_login)}`, token);
  const id = data?.data?.[0]?.id;
  if (!id) throw new Error(`Não achei user_id para login=${user_login}`);
  return id;
}

async function isSubscriber(broadcasterToken: string, userId: string) {
  const data = await helix(`/subscriptions?broadcaster_id=${BROADCASTER_ID}&user_id=${userId}`, broadcasterToken);
  return (data?.data?.length || 0) > 0; // founders contam aqui
}

// --- API ---
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const debug = req.query.debug === '1';
  try {
    if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method Not Allowed' });

    const { cmd, user_id, user_login, forceId } = (req.body || {}) as {
      cmd?: string; user_id?: string; user_login?: string; forceId?: string;
    };
    if (!cmd || !cmd.startsWith('!')) {
      return res.status(400).json({ ok: false, error: 'cmd obrigatório e deve começar com !' });
    }

    const cmdLower = cmd.slice(1).trim().toLowerCase();

    // 1) localizar asset
    let assetDocId = forceId ?? null;
    if (!assetDocId) {
      const snap = await db.collection('overlays').doc(OVERLAY_ID)
        .collection('assets')
        .where('cmdLower', '==', cmdLower)
        .limit(1)
        .get();
      if (snap.empty) {
        if (debug) console.warn(`[overlay] asset não encontrado para cmd=${cmdLower}`);
        return res.status(404).json({ ok: false, error: `asset não encontrado para cmd=${cmdLower}` });
      }
      assetDocId = snap.docs[0].id;
    }

    // 2) checar permissão (sub ou broadcaster)
    const broadcasterToken = await getUserTokenFromFirebase(); // precisa scope channel:read:subscriptions
    const uid = await resolveUserId({ user_id, user_login, token: broadcasterToken });
    const isOwner = uid === BROADCASTER_ID;
    const isSub = isOwner ? true : await isSubscriber(broadcasterToken, uid);

    if (!isSub) {
      if (debug) console.warn(`[overlay] bloqueado: uid=${uid} não é sub`);
      return res.status(403).json({ ok: false, error: 'sem permissão (precisa ser sub ou broadcaster)' });
    }

    // 3) tocar: escreve o “sino” que o Overlay.tsx assina
    const at = Date.now();
    await db.collection('overlays').doc(OVERLAY_ID)
      .collection('commands').doc('play')
      .set({ at, id: assetDocId }, { merge: true });

    if (debug) console.log(`[overlay] disparado cmd=${cmdLower} id=${assetDocId} at=${at}`);
    return res.json({ ok: true, id: assetDocId, at });
  } catch (e: any) {
    if (debug) console.error('overlay/trigger error:', e?.message || e);
    return res.status(500).json({ ok: false, error: e?.message || 'erro interno' });
  }
}
