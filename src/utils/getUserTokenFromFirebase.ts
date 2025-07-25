import { db } from '@/services/firebaseAdmin';

/**
 * Busca o access_token atualizado da MicheleOxana salvo no Firebase.
 * @returns Token de acesso da conta principal (MicheleOxana).
 */
export default async function getMicheleAccessToken(): Promise<string> {
  const doc = await db.collection('tokens').doc('micheleoxana').get();

  if (!doc.exists) {
    throw new Error('❌ Documento "micheleoxana" não encontrado no Firebase.');
  }

  const data = doc.data();

  if (!data || !data.access_token) {
    throw new Error('❌ Token de acesso não encontrado no documento "micheleoxana".');
  }

  return data.access_token;
}
