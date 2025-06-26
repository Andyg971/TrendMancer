import dynamic from 'next/dynamic';
import React from 'react';
import type { FC } from 'react';
import type { CalendarProps } from 'react-big-calendar';
import type { ComponentType } from 'react';

// Types pour les composants dynamiques
interface LoadingProps {
  message: string;
}

// Composant de chargement réutilisable
const LoadingComponent: FC<LoadingProps> = ({ message }) => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mr-2" />
    <span>{message}</span>
  </div>
);

// Configuration commune pour les imports dynamiques
const commonOptions = {
  ssr: false,
};

// Import dynamique du calendrier
export const DynamicCalendar = dynamic(
  () => import('react-big-calendar').then((mod) => mod.Calendar),
  {
    ...commonOptions,
    loading: () => <LoadingComponent message="Chargement du calendrier..." />,
  }
);

// Import dynamique des graphiques
export const DynamicLineChart = dynamic(
  () => import('recharts').then((mod) => mod.LineChart),
  {
    ...commonOptions,
    loading: () => <LoadingComponent message="Chargement du graphique..." />,
  }
);

// Import dynamique des animations
export const DynamicMotion = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.div),
  {
    ...commonOptions,
    loading: () => <LoadingComponent message="Chargement des animations..." />,
  }
);

// Export des types pour l'utilisation externe
export type { CalendarProps };
export type { LineChart } from 'recharts';
export type { HTMLMotionProps } from 'framer-motion'; 