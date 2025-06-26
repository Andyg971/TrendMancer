import { NextPage } from 'next';
import Head from 'next/head';
import { AssistantView } from '@/features/assistant/AssistantView';

const AssistantPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Assistant TrendMancer | Votre expert en marketing digital</title>
        <meta
          name="description"
          content="Discutez avec notre assistant IA spécialisé en marketing digital et analyse de tendances"
        />
      </Head>

      <main className="min-h-screen bg-gray-50">
        <AssistantView />
      </main>
    </>
  );
};

export default AssistantPage; 