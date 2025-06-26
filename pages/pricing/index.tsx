import { useState } from 'react';
import { motion } from 'framer-motion';
import { subscriptionPlans } from '@/config/subscriptionPlans';
import { CheckIcon } from '@heroicons/react/24/solid';

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Choisissez votre plan
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Des solutions adaptées à tous les besoins
          </p>
        </div>

        {/* Toggle de période de facturation */}
        <div className="mt-16 flex justify-center">
          <div className="relative flex rounded-full p-1 bg-gray-200">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`${
                billingPeriod === 'monthly'
                  ? 'bg-white shadow-md'
                  : 'hover:bg-gray-100'
              } px-4 py-2 rounded-full transition-all duration-200`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`${
                billingPeriod === 'yearly'
                  ? 'bg-white shadow-md'
                  : 'hover:bg-gray-100'
              } px-4 py-2 rounded-full transition-all duration-200`}
            >
              Annuel (-20%)
            </button>
          </div>
        </div>

        {/* Grille des plans */}
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {subscriptionPlans.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`rounded-3xl p-8 ring-1 ring-gray-200 ${
                plan.highlighted
                  ? 'bg-gray-900 text-white ring-gray-900'
                  : 'bg-white text-gray-900'
              }`}
            >
              <h3 className="text-2xl font-bold tracking-tight">
                {plan.name}
              </h3>
              <p className="mt-4 text-sm leading-6 text-gray-400">
                {plan.description}
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight">
                  {billingPeriod === 'yearly' 
                    ? `${Math.floor(plan.price * 0.8 * 12)}€`
                    : `${plan.price}€`}
                </span>
                <span className="text-sm font-semibold leading-6">
                  /{billingPeriod === 'yearly' ? 'an' : 'mois'}
                </span>
              </p>
              <button
                className={`mt-6 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 shadow-sm transition-all duration-200 ${
                  plan.highlighted
                    ? 'bg-white text-gray-900 hover:bg-gray-100'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                Commencer
              </button>
              <ul className="mt-8 space-y-3 text-sm leading-6">
                {plan.features.map((feature) => (
                  <li key={feature.id} className="flex gap-x-3">
                    <CheckIcon
                      className={`h-6 w-5 flex-none ${
                        plan.highlighted ? 'text-white' : 'text-blue-600'
                      }`}
                      aria-hidden="true"
                    />
                    <span>
                      {feature.name}
                      {feature.description && (
                        <span className="text-gray-400"> - {feature.description}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 