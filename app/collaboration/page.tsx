import { CollaborationView } from '@/features/collaboration/CollaborationView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Collaboration - TrendMancer',
  description: 'Gérez vos projets et tâches de collaboration.',
};

export default function CollaborationPage() {
  // La page Collaboration est un composant client car elle contient des états et des interactions
  // CollaborationView a déjà la directive 'use client'
  return <CollaborationView />;
} 