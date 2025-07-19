// pages/auth/callback.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../src/context/AuthContext';

export default function Callback() {
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get('access_token');

    if (accessToken) {
      localStorage.setItem('token', accessToken);
      login(accessToken).then(() => {
        router.push('/');
      });
    } else {
      router.push('/login');
    }
  }, []);

  return <p className="text-white p-6">🌀 Finalizando login... preparando o surto...</p>;
}
