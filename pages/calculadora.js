import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function CalculadoraRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/calculadora-hyrox'); }, [router]);
  return (
    <>
      <Head>
        <title>Calculadora HYROX | Hybrid Race Hub</title>
        <meta httpEquiv="refresh" content="0;url=/calculadora-hyrox" />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://hybridracehub.com/calculadora-hyrox" />
      </Head>
      <div style={{ background: '#08090C', minHeight: '100vh' }} />
    </>
  );
}
