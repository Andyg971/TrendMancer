import React from 'react';
import DebugSupabase from '../utils/debug-supabase';
import Head from 'next/head';

const DebugPage = () => {
  return (
    <>
      <Head>
        <title>Débogage Supabase - TrendMancer</title>
      </Head>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Débogage de la connexion Supabase</h1>
        <DebugSupabase />
      </div>
    </>
  );
};

export default DebugPage; 