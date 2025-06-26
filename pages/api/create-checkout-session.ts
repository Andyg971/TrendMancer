import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabaseClient';
import { subscriptionPlans } from '@/config/subscriptionPlans';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { planId } = req.body;
    
    // Vérifier l'authentification
    const { user } = await supabase.auth.getUser(req.headers.authorization);
    if (!user) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    // Trouver le plan
    const plan = subscriptionPlans.find(p => p.id === planId);
    if (!plan) {
      return res.status(400).json({ error: 'Plan non trouvé' });
    }

    // Créer la session Stripe
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: plan.name,
              description: plan.description,
            },
            unit_amount: plan.price * 100, // Convertir en centimes
            recurring: {
              interval: plan.billingPeriod,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: {
        userId: user.id,
        planId: planId,
      },
    });

    return res.status(200).json({ session });
  } catch (error) {
    console.error('Erreur lors de la création de la session:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
} 