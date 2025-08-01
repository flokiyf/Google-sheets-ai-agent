# Google Sheets AI - Assistant Intelligent pour Feuilles de Calcul

Une application Next.js moderne qui combine la puissance de Google Sheets avec l'intelligence artificielle d'OpenAI pour créer, analyser et optimiser vos données de manière intelligente.

## 🚀 Fonctionnalités

### 📊 Gestion Google Sheets
- **Création de feuilles** : Créez des feuilles de calcul directement depuis l'interface
- **Lecture/Écriture** : Accédez et modifiez vos données en temps réel
- **Navigation intuitive** : Naviguez entre vos feuilles et onglets facilement
- **Recherche avancée** : Trouvez rapidement les données dont vous avez besoin

### 🤖 Intelligence Artificielle
- **Assistant conversationnel** : Posez des questions sur vos données en langage naturel
- **Analyse automatique** : Obtenez des insights et des statistiques instantanément
- **Génération de données** : Créez des jeux de données d'exemple réalistes
- **Suggestions de formules** : L'IA propose des formules adaptées à vos besoins
- **Chat interactif** : Interface de chat flottante pour une assistance continue

### 🎯 Types de données supportés
- Données de ventes
- Gestion des employés
- Catalogues produits
- Données financières
- Gestion d'inventaire
- Bases clients
- Suivi de projets

## 🛠 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Compte Google Cloud Platform
- Clé API OpenAI

### 1. Cloner le projet
```bash
git clone <repository-url>
cd google-sheets-ai
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration Google Cloud

#### Créer un compte de service
1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API Google Sheets :
   - Allez dans "APIs & Services" > "Library"
   - Recherchez "Google Sheets API" et activez-la
4. Créez un compte de service :
   - Allez dans "IAM & Admin" > "Service Accounts"
   - Cliquez "Create Service Account"
   - Donnez un nom et une description
   - Assignez le rôle "Editor" ou "Owner"
5. Générez une clé JSON :
   - Cliquez sur votre compte de service
   - Onglet "Keys" > "Add Key" > "Create New Key"
   - Choisissez JSON et téléchargez le fichier

#### Configurer les permissions
1. Ouvrez le fichier JSON téléchargé
2. Copiez l'email du compte de service (`client_email`)
3. Partagez vos Google Sheets avec cet email (avec permissions d'édition)

### 4. Configuration OpenAI
1. Créez un compte sur [OpenAI](https://platform.openai.com/)
2. Générez une clé API dans la section "API Keys"
3. Assurez-vous d'avoir des crédits disponibles

### 5. Variables d'environnement
Créez un fichier `.env.local` à la racine du projet :

```env
# Google Cloud Configuration
GOOGLE_PROJECT_ID=your-google-project-id
GOOGLE_PRIVATE_KEY_ID=your-private-key-id
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=your-client-id

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

**Note** : Remplacez les valeurs par celles de votre fichier JSON Google Cloud.

### 6. Démarrer l'application
```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📱 Utilisation

### Créer une nouvelle feuille
1. Cliquez sur "Nouvelle feuille" dans l'interface
2. Donnez un nom à votre feuille
3. La feuille sera créée automatiquement dans votre Google Drive

### Générer des données d'exemple
1. Sélectionnez un type de données (ventes, employés, etc.)
2. Cliquez sur "Générer données IA"
3. L'IA créera des données réalistes pour vos tests

### Analyser vos données
1. Sélectionnez une feuille contenant des données
2. Cliquez sur "Analyser IA"
3. Obtenez un rapport détaillé avec insights et recommandations

### Utiliser l'assistant IA
1. Cliquez sur le bouton "Assistant IA" en bas à droite
2. Posez des questions sur vos données :
   - "Quelle est la moyenne des ventes ?"
   - "Trouve les valeurs aberrantes"
   - "Suggère des formules pour calculer les totaux"
3. L'IA vous répondra et pourra effectuer des actions automatiquement

## 🔧 API Endpoints

### Google Sheets
- `POST /api/sheets/create` - Créer une nouvelle feuille
- `GET /api/sheets/[id]` - Obtenir les informations d'une feuille
- `GET /api/sheets/[id]/data` - Lire les données d'une feuille
- `POST /api/sheets/[id]/update` - Mettre à jour les données

### Intelligence Artificielle
- `POST /api/ai/process` - Traiter une requête IA générale
- `POST /api/ai/analyze` - Analyser les données d'une feuille
- `POST /api/ai/generate-data` - Générer des données d'exemple
- `POST /api/ai/chat` - Chat conversationnel avec l'IA

## 🏗 Architecture

```
src/
├── app/                    # App Router Next.js
│   ├── api/               # Routes API
│   │   ├── sheets/        # Endpoints Google Sheets
│   │   └── ai/            # Endpoints IA
│   ├── page.tsx           # Page principale
│   └── layout.tsx         # Layout global
├── components/            # Composants React
│   ├── SheetsExplorer.tsx # Explorateur de feuilles
│   └── AIChat.tsx         # Chat IA
├── contexts/              # Contextes React
│   └── SheetsContext.tsx  # État global des feuilles
└── lib/                   # Services et utilitaires
    ├── google-sheets.ts   # Service Google Sheets
    └── openai-agent.ts    # Agent OpenAI
```

## 🚀 Déploiement

### Vercel (Recommandé)
1. Connectez votre repository à Vercel
2. Ajoutez les variables d'environnement dans les paramètres Vercel
3. Déployez automatiquement

### Autres plateformes
L'application est compatible avec toutes les plateformes supportant Next.js :
- Netlify
- Railway
- Render
- AWS Amplify

## 🔒 Sécurité

- Les clés API sont stockées de manière sécurisée côté serveur
- Authentification Google Cloud via compte de service
- Validation des entrées utilisateur
- Gestion des erreurs robuste

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment contribuer :

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour obtenir de l'aide :
1. Consultez la documentation
2. Ouvrez une issue sur GitHub
3. Contactez l'équipe de développement

## 🔄 Mises à jour

- **v1.0.0** : Version initiale avec Google Sheets et OpenAI
- Fonctionnalités à venir : Graphiques, exports, collaborations temps réel

---

**Développé avec ❤️ en utilisant Next.js, Google Sheets API et OpenAI**
#   G o o g l e - s h e e t s - a i - a g e n t  
 