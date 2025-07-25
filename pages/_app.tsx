import '../src/styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../src/context/AuthContext';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
