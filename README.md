# Mon Budget — Gestion de revenus

Application web mobile-first pour gérer vos revenus et dépenses au quotidien.

## Fonctionnalités

- Tableau de bord avec solde restant en temps réel
- Ajout de revenus et dépenses par catégories (alimentation, transport, salaire, etc.)
- Vue mensuelle des totaux
- Statistiques visuelles (graphique en camembert par catégorie, évolution mensuelle)
- Stockage local sécurisé sur votre appareil (aucune donnée envoyée)
- Export JSON de vos données
- Installable comme application mobile (PWA)
- Interface premium en mode sombre

## Stack

- Vite + React + TypeScript
- Tailwind CSS
- Recharts
- Lucide Icons

## Développement local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Déploiement Netlify

1. Aller sur [netlify.com](https://app.netlify.com/)
2. **Add new site → Import an existing project**
3. Connecter GitHub et sélectionner `irchhjc/Gestion-de-revenues`
4. Build settings (déjà dans `netlify.toml`) :
   - Build command : `npm run build`
   - Publish directory : `dist`
5. **Deploy site**

L'app sera accessible sur une URL `https://<nom>.netlify.app` à ouvrir sur votre téléphone.

## Installation sur téléphone

Ouvrir l'URL Netlify dans Chrome/Safari → menu → **Ajouter à l'écran d'accueil**.
