import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { DemoAuthProvider } from '../utils/demoAuthProvider';
import { useEffect, useState } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  // Hydration fix
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <DemoAuthProvider>
      <Component {...pageProps} />
    </DemoAuthProvider>
  );
} 