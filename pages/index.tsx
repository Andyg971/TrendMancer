import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { SubscriptionPlan } from '../types';
import { ArrowRight, Sparkles, Brain, CalendarCheck, BarChart3, Lightbulb, Zap, FileText, MessageCircle, PenTool } from 'lucide-react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { Layout } from '@/components/Layout';
import { OpportunitiesView } from '@/features/opportunities/OpportunitiesView';
import Image from 'next/image';

// Animation variants pour les éléments
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const HomePage = () => {
  const router = useRouter();
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');

  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 'free',
      name: 'Gratuit',
      description: 'Pour les débutants sur les réseaux sociaux',
      price: 0,
      interval: billingInterval,
      features: [
        'Accès à l\'assistant IA de base',
        '5 posts générés par mois',
        '1 réseau social',
        'Analyses basiques',
        'Support par email'
      ]
    },
    {
      id: 'basic',
      name: 'Basique',
      description: 'Pour les créateurs de contenu individuels',
      price: billingInterval === 'month' ? 19.99 : 199.99,
      interval: billingInterval,
      features: [
        'Accès à l\'assistant IA avancé',
        'Posts illimités',
        '3 réseaux sociaux',
        'Programmation des posts',
        'Analyses détaillées',
        'Support prioritaire'
      ]
    },
    {
      id: 'professional',
      name: 'Professionnel',
      description: 'Pour les entreprises et équipes',
      price: billingInterval === 'month' ? 49.99 : 499.99,
      interval: billingInterval,
      features: [
        'Tout du plan Basique',
        'Accès multi-utilisateurs (5)',
        'Tous les réseaux sociaux',
        'Intégrations avancées',
        'Rapports personnalisés',
        'Support 24/7'
      ]
    },
    {
      id: 'enterprise',
      name: 'Entreprise',
      description: 'Pour les grandes organisations',
      price: billingInterval === 'month' ? 99.99 : 999.99,
      interval: billingInterval,
      features: [
        'Tout du plan Professionnel',
        'Accès multi-utilisateurs illimité',
        'API dédiée',
        'Gestionnaire de compte dédié',
        'Formation personnalisée',
        'SLA garantie'
      ]
    }
  ];

  const handleSelectPlan = (planId: string) => {
    if (planId === 'free') {
      router.push('/signup?plan=free');
    } else {
      router.push(`/checkout?plan=${planId}&interval=${billingInterval}`);
    }
  };

  const features = [
    {
      title: 'Détection d\'opportunités',
      description: 'Identifiez les tendances émergentes et les opportunités de marché en temps réel.',
      icon: '🎯',
      href: '/opportunities'
    },
    {
      title: 'Collaboration intelligente',
      description: 'Travaillez efficacement avec votre équipe grâce à nos outils de collaboration avancés.',
      icon: '🤝',
      href: '/collaboration'
    },
    {
      title: 'Assistant IA',
      description: 'Bénéficiez des conseils personnalisés de notre assistant alimenté par l\'IA.',
      icon: '🤖',
      href: '/assistant'
    },
    {
      title: 'Gestion de contenu',
      description: 'Créez et gérez votre contenu avec des outils d\'optimisation intégrés.',
      icon: '📝',
      href: '/content'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-black opacity-50" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6"
            {...fadeInUp}
          >
            Maîtrisez les Tendances Digitales avec TrendMancer
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
            {...fadeInUp}
            transition={{ delay: 0.2 }}
          >
            Détectez les opportunités, créez du contenu viral et développez votre présence en ligne grâce à l'intelligence artificielle.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            {...fadeInUp}
            transition={{ delay: 0.4 }}
          >
            <Link 
              href="/register" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Commencer Gratuitement
            </Link>
            <Link 
              href="/demo" 
              className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Voir la Démo
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Fonctionnalités Principales
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des outils puissants pour transformer votre stratégie digitale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Opportunités */}
            <motion.div 
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              whileHover={{ y: -5 }}
            >
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Détection d'Opportunités</h3>
              <p className="text-gray-600 mb-4">
                Identifiez les tendances émergentes et les conversations virales en temps réel.
              </p>
              <Link href="/opportunities" className="text-blue-600 hover:text-blue-700 font-medium">
                En savoir plus →
              </Link>
            </motion.div>

            {/* Collaboration */}
            <motion.div 
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              whileHover={{ y: -5 }}
            >
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Collaboration</h3>
              <p className="text-gray-600 mb-4">
                Gérez votre équipe et vos projets avec des outils de collaboration intuitifs.
              </p>
              <Link href="/collaboration" className="text-green-600 hover:text-green-700 font-medium">
                En savoir plus →
              </Link>
            </motion.div>

            {/* Assistant IA */}
            <motion.div 
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              whileHover={{ y: -5 }}
            >
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Assistant IA</h3>
              <p className="text-gray-600 mb-4">
                Générez du contenu optimisé et des suggestions personnalisées.
              </p>
              <Link href="/assistant" className="text-purple-600 hover:text-purple-700 font-medium">
                En savoir plus →
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à Transformer Votre Présence Digitale ?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui font confiance à TrendMancer pour leur stratégie digitale.
          </p>
          <Link 
            href="/register" 
            className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold inline-block transition-colors"
          >
            Commencer Maintenant
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage; 