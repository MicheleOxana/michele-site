import { db } from '../services/firebaseAdmin';

export async function getMicheleAccessToken() {
  const doc = await db.collection('tokens').doc('micheleoxana').get();

  if (!doc.exists) {
    throw new Error('Token da Michele não encontrado!');
  }

  const data = doc.data();

  return {
    access_token: data?.access_token,
    refresh_token: data?.refresh_token,
    updated_at: data?.updated_at,
  };
}
