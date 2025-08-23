import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../src/services/firebaseAdmin';
import getUserTokenFromFirebase from '../../../src/utils/getUserTokenFromFirebase';

const CLIENT_ID = process.env.TWITCH_CLIENT_ID!;
const BROADCASTER_ID = process.env.TWITCH_BOT_BROADCASTER_ID!; // ex.: "517861418"

async function helix(path: string, token: string) {
  const r = await fetch(`https://api.twitch.tv/helix${path}`, {
    headers: { 'Client-ID': CLIENT_ID, Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  const text = await r.text();
  let json: any = null;
  try { json = JSON.parse(text); } catch { /* noop */ }
  return { ok: r.ok, status: r.status, text, json };
}

async function validate(token: string) {
  const r = await fetch('https://id.twitch.tv/oauth2/validate', {
    headers: { Authorization: `OAuth ${token}` },
    cache: 'no-store',
  });
  const text = await r.text();
  let json: any = null;
  try { json = JSON.parse(text); } catch { /* noop */ }
  return { ok: r.ok, status: r.status, text, json };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { user_id, user_login } = req.query as { user_id?: string; user_login?: string };
    if (!user_id && !user_login) {
      return res.status(400).json({ ok: false, error: 'Passe ?user_id= ou ?user_login=' });
    }

    const token = await getUserTokenFromFirebase(); // TOKEN **DA CONTA PRINCIPAL**
    const tokenInfo = await validate(token); // mostra scopes, quem é o dono do token, etc.

    // resolve user_id se vier login
    let uid = user_id;
    let usersResp: any = null;
    if (!uid) {
      const users = await helix(`/users?login=${encodeURIComponent(user_login!)}`, token);
      usersResp = users;
      uid = users.json?.data?.[0]?.id;
    }

    // checa sub/mod/vip
    const subs = await helix(`/subscriptions?broadcaster_id=${BROADCASTER_ID}&user_id=${uid}`, token);
    const mods = await helix(`/moderation/moderators?broadcaster_id=${BROADCASTER_ID}&user_id=${uid}`, token);
    const vips = await helix(`/channels/vips?broadcaster_id=${BROADCASTER_ID}&user_id=${uid}`, token);

    return res.json({
      ok: true,
      broadcaster_id_env: BROADCASTER_ID,
      resolved_user_id: uid,
      token_validate: tokenInfo,      // deve conter "scopes": ["channel:read:subscriptions", ...]
      users_lookup: usersResp,        // só se veio user_login
      isSub: (subs.json?.data?.length || 0) > 0,
      isMod: (mods.json?.data?.length || 0) > 0,
      isVIP: (vips.json?.data?.length || 0) > 0,
      raw: { subs, mods, vips },      // respostas cruas pra ver erro
    });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || 'erro' });
  }
}
