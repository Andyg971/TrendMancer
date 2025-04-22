# TrendMancer

TrendMancer est une plateforme moderne de gestion de contenu pour les médias sociaux, conçue pour aider les créateurs de contenu et les équipes marketing à organiser, planifier et analyser leur présence sur les réseaux sociaux.

![Dashboard Preview](/public/dashboard-preview.jpg)

## 🚀 Fonctionnalités

- **Tableau de bord intuitif** - Vue d'ensemble des statistiques et performances
- **Calendrier de publication** - Planification et organisation du contenu
- **Analytique détaillée** - Suivi des performances par plateforme
- **Mode démo intégré** - Exploration facile sans inscription
- **Gestion d'équipe** - Collaboration et attribution de tâches
- **Assistant IA** - Aide à la création de contenu et recommandations
- **Communauté** - Partage d'idées et collaboration entre utilisateurs

## 📋 Pages principales

- **Dashboard** - Vue d'ensemble des statistiques et contenu à venir
- **Calendar** - Planification des publications avec vue mensuelle/hebdomadaire/liste
- **Analytics** - Analyse des performances sur différentes plateformes
- **Team** - Gestion des membres d'équipe, projets et tâches
- **AI Assistant** - Interface conversationnelle pour l'aide à la création
- **Community** - Forum d'échange entre utilisateurs

## 🛠️ Technologies utilisées

- **Next.js** - Framework React pour le rendu côté serveur
- **TypeScript** - Typage statique pour un code plus robuste
- **Tailwind CSS** - Framework CSS utilitaire pour l'UI
- **Lucide React** - Bibliothèque d'icônes
- **Chart.js** (simulé) - Visualisation des données analytiques

## 🔧 Installation et utilisation

### Prérequis

- Node.js (version 14 ou supérieure)
- npm ou yarn

### Installation

1. Clonez ce dépôt
   ```bash
   git clone https://github.com/Andyg971/TrendMancer.git
   cd TrendMancer
   ```

2. Installez les dépendances
   ```bash
   npm install
   # ou
   yarn install
   ```

3. Démarrez le serveur de développement
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

4. Ouvrez votre navigateur à l'adresse [http://localhost:3000](http://localhost:3000)

## 💻 Mode démo

TrendMancer inclut un mode démo qui vous permet d'explorer l'application sans avoir à créer un compte :

1. Sur la page de connexion, cliquez sur "Se connecter en mode démo"
2. Explorez toutes les fonctionnalités avec des données simulées
3. Aucune donnée n'est sauvegardée de façon permanente en mode démo

## 📁 Structure du projet

```
TrendMancer/
├── components/         # Composants React réutilisables
├── pages/              # Pages de l'application (routing Next.js)
│   ├── dashboard.tsx   # Tableau de bord principal
│   ├── calendar.tsx    # Calendrier de contenu
│   ├── analytics.tsx   # Analytiques et statistiques
│   ├── team.tsx        # Gestion d'équipe
│   ├── community.tsx   # Forum communautaire
│   └── ai-assistant.tsx # Assistant IA
├── public/             # Ressources statiques
├── styles/             # Styles globaux
├── utils/              # Utilitaires et helpers
└── types/              # Définitions de types TypeScript
```

## 🔒 Authentification

L'application utilise actuellement un système d'authentification simulé en mode démo. Pour la connexion, vous pouvez utiliser :

- Email: demo@trendmancer.com
- Mot de passe: password

Les informations utilisateur sont stockées dans le localStorage sous la clé `trendmancer-demo-user`.

## 🚧 Développement futur

- Intégration avec de véritables APIs de réseaux sociaux
- Système d'authentification complet
- Fonctionnalités d'upload de médias
- Analyse prédictive basée sur les performances passées
- Applications mobiles iOS et Android

## 📄 Licence

Ce projet est sous licence [MIT](LICENSE).

---

Développé avec ❤️ par Andy Grava 