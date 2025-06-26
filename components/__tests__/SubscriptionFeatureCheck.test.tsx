import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SubscriptionFeatureCheck from '../SubscriptionFeatureCheck';
import { hasFeatureAccess } from '../../services/subscriptionService';

// Mock du service de souscription
jest.mock('../../services/subscriptionService', () => ({
  hasFeatureAccess: jest.fn(),
}));

describe('SubscriptionFeatureCheck', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('affiche le contenu enfant quand l\'utilisateur a accès', async () => {
    // Configuration du mock pour simuler un accès autorisé
    (hasFeatureAccess as jest.Mock).mockResolvedValue({ hasAccess: true });

    render(
      <SubscriptionFeatureCheck featureName="analytics_basic">
        <div>Contenu Premium</div>
      </SubscriptionFeatureCheck>
    );

    // Vérifie l'affichage du loader pendant le chargement
    expect(screen.getByRole('status')).toBeInTheDocument();

    // Attend que le contenu soit chargé
    await waitFor(() => {
      expect(screen.getByText('Contenu Premium')).toBeInTheDocument();
    });
  });

  it('affiche le message de restriction quand l\'utilisateur n\'a pas accès', async () => {
    // Configuration du mock pour simuler un accès refusé
    (hasFeatureAccess as jest.Mock).mockResolvedValue({ hasAccess: false });

    render(
      <SubscriptionFeatureCheck featureName="analytics_basic">
        <div>Contenu Premium</div>
      </SubscriptionFeatureCheck>
    );

    // Attend que le message de restriction soit affiché
    await waitFor(() => {
      expect(screen.getByText('Fonctionnalité Premium')).toBeInTheDocument();
      expect(screen.getByText('Voir les options d\'abonnement')).toBeInTheDocument();
    });
  });

  it('affiche le fallback quand fourni et que l\'utilisateur n\'a pas accès', async () => {
    // Configuration du mock pour simuler un accès refusé
    (hasFeatureAccess as jest.Mock).mockResolvedValue({ hasAccess: false });

    render(
      <SubscriptionFeatureCheck 
        featureName="analytics_basic"
        fallback={<div>Contenu de remplacement</div>}
      >
        <div>Contenu Premium</div>
      </SubscriptionFeatureCheck>
    );

    // Attend que le contenu de remplacement soit affiché
    await waitFor(() => {
      expect(screen.getByText('Contenu de remplacement')).toBeInTheDocument();
    });
  });
}); 