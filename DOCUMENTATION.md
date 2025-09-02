# Documentation d'Intégration Backend-Frontend MLDA

## Vue d'ensemble

Cette documentation explique les modifications apportées pour connecter le backend et le frontend de la plateforme MLDA (Meine Liebe Deutsche Academy).

## 🔧 Modifications Apportées

### 1. Ajustements du Backend

#### **Middleware d'authentification (`backend/src/middleware/auth.js`)**
- **Créé** : Middleware complet pour l'authentification JWT
- **Fonctionnalités** :
  - Vérification des tokens JWT
  - Gestion des rôles (admin, teacher, student)
  - Protection des routes selon les permissions
- **Pourquoi** : Le frontend nécessite une authentification robuste avec gestion des rôles

#### **Routes utilisateurs (`backend/src/routes/user.routes.js`)**
- **Créé** : Endpoints pour la gestion des utilisateurs
- **Fonctionnalités** :
  - CRUD complet des utilisateurs (admin uniquement)
  - Filtrage et recherche
  - Pagination
- **Pourquoi** : Le frontend admin a besoin de gérer les utilisateurs

#### **Routes de progression (`backend/src/routes/progress.routes.js`)**
- **Créé** : Suivi de la progression des étudiants
- **Fonctionnalités** :
  - Mise à jour de la progression par leçon
  - Récupération de la progression par cours
- **Pourquoi** : Le frontend étudiant affiche la progression des cours

#### **Gestionnaire d'erreurs (`backend/src/middleware/errorHandler.js`)**
- **Créé** : Gestion centralisée des erreurs
- **Fonctionnalités** :
  - Gestion des erreurs Prisma
  - Gestion des erreurs JWT
  - Logging des erreurs
- **Pourquoi** : Améliore l'expérience utilisateur avec des messages d'erreur clairs

#### **Schéma de base de données (`backend/prisma/schema.prisma`)**
- **Créé** : Schéma Prisma complet
- **Modèles** :
  - User, Course, Lesson, Quiz, Enrollment, Progress, Payment, Announcement
- **Pourquoi** : Structure de données cohérente avec les besoins du frontend

#### **Script de seed (`backend/prisma/seed.js`)**
- **Créé** : Données de test pour développement
- **Contenu** :
  - Utilisateurs de test (admin, professeurs, étudiants)
  - Cours d'exemple
  - Inscriptions de test
- **Pourquoi** : Facilite le développement et les tests

### 2. Intégration Frontend

#### **Client API (`frontend/src/lib/api.ts`)**
- **Créé** : Client API centralisé
- **Fonctionnalités** :
  - Gestion automatique des tokens
  - Endpoints pour toutes les fonctionnalités
  - Gestion d'erreurs
- **Pourquoi** : Interface unique pour communiquer avec le backend

#### **Hooks personnalisés**

**`frontend/src/hooks/useAuth.ts`**
- **Créé** : Hook pour l'authentification
- **Fonctionnalités** :
  - Login/logout
  - Inscription
  - Gestion du profil
- **Pourquoi** : Centralise la logique d'authentification

**`frontend/src/hooks/useCourses.ts`**
- **Créé** : Hook pour la gestion des cours
- **Fonctionnalités** :
  - CRUD des cours
  - Inscriptions
  - Filtrage et recherche
- **Pourquoi** : Simplifie la gestion des cours dans les composants

**`frontend/src/hooks/useStats.ts`**
- **Créé** : Hook pour les statistiques
- **Fonctionnalités** :
  - Stats admin, professeur, étudiant
  - Adaptation selon le rôle
- **Pourquoi** : Affichage dynamique des statistiques selon le rôle

#### **Store d'authentification mis à jour**
- **Modifié** : `frontend/src/store/authStore.ts`
- **Ajouts** :
  - Gestion du token JWT
  - Initialisation automatique
  - Synchronisation avec l'API
- **Pourquoi** : Persistance de l'état d'authentification

#### **Pages mises à jour**
- **Modifié** : Pages de login et signup pour utiliser la vraie API
- **Modifié** : Dashboards pour utiliser les vraies données
- **Pourquoi** : Remplacement des données mockées par les vraies données

### 3. Configuration

#### **Variables d'environnement**
- **Backend** : `.env.example` avec toutes les variables nécessaires
- **Frontend** : `.env.example` avec l'URL de l'API
- **Pourquoi** : Configuration flexible selon l'environnement

## 🚀 Comment Démarrer

### 1. Configuration du Backend

```bash
cd backend
npm install
cp .env.example .env
# Configurez votre base de données PostgreSQL dans .env
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

### 2. Configuration du Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Configurez VITE_API_URL=http://localhost:3000/api
npm run dev
```

### 3. Comptes de Test

Après le seeding, vous pouvez utiliser :
- **Admin** : `admin@mlda.de` / `admin123`
- **Professeur** : `hans.mueller@mlda.de` / `teacher123`
- **Étudiant** : `marie.dubois@email.com` / `student123`

## 🔄 Flux de Données

### Authentification
1. L'utilisateur se connecte via le frontend
2. Le frontend envoie les credentials au backend
3. Le backend vérifie et retourne un JWT
4. Le frontend stocke le token et l'utilisateur
5. Toutes les requêtes suivantes incluent le token

### Gestion des Cours
1. Les professeurs créent des cours via l'interface
2. Les données sont envoyées au backend via l'API
3. Le backend valide et stocke en base
4. Les étudiants voient les cours publiés
5. Les inscriptions créent des relations en base

### Progression
1. L'étudiant progresse dans les leçons
2. Le frontend envoie les mises à jour de progression
3. Le backend met à jour la table Progress
4. Les statistiques sont calculées en temps réel

## 🛡️ Sécurité

### Authentification JWT
- Tokens sécurisés avec expiration
- Vérification automatique sur chaque requête
- Déconnexion automatique si token invalide

### Autorisation par Rôles
- **Admin** : Accès complet à toutes les fonctionnalités
- **Teacher** : Gestion de ses propres cours et étudiants
- **Student** : Accès aux cours inscrits uniquement

### Validation des Données
- Validation côté backend avec Joi
- Validation côté frontend avec les formulaires
- Messages d'erreur explicites

## 📊 Architecture

### Backend (Node.js + Express + Prisma)
```
backend/
├── src/
│   ├── controllers/     # Logique métier
│   ├── middleware/      # Authentification, validation
│   ├── routes/          # Définition des endpoints
│   ├── services/        # Services métier
│   └── utils/           # Utilitaires
├── prisma/
│   ├── schema.prisma    # Modèle de données
│   └── seed.js          # Données de test
└── tests/               # Tests unitaires
```

### Frontend (React + TypeScript + Zustand)
```
frontend/
├── src/
│   ├── components/      # Composants réutilisables
│   ├── hooks/           # Hooks personnalisés
│   ├── lib/             # Client API
│   ├── pages/           # Pages de l'application
│   ├── store/           # État global (Zustand)
│   └── types/           # Types TypeScript
```

## 🔗 Points de Connexion

### API Endpoints Principaux
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `GET /api/courses` - Liste des cours
- `POST /api/enrollments` - Inscription à un cours
- `GET /api/stats/{role}` - Statistiques par rôle

### État Global
- **AuthStore** : Utilisateur connecté et token
- **CourseStore** : Cache des cours (optionnel avec React Query)

### Communication
- **React Query** : Cache et synchronisation des données
- **Axios/Fetch** : Requêtes HTTP avec gestion d'erreurs
- **Toast** : Notifications utilisateur

## 🎯 Prochaines Étapes

1. **Configurer la base de données PostgreSQL**
2. **Lancer les deux serveurs** (backend port 3000, frontend port 5173)
3. **Tester l'authentification** avec les comptes de test
4. **Vérifier les fonctionnalités** selon chaque rôle
5. **Personnaliser** selon vos besoins spécifiques

## 🐛 Dépannage

### Erreurs Communes
- **CORS** : Vérifiez que `FRONTEND_URL` est correct dans `.env`
- **Database** : Assurez-vous que PostgreSQL est démarré
- **Tokens** : Videz le localStorage si problèmes d'auth
- **Ports** : Vérifiez que les ports 3000 et 5173 sont libres

### Logs
- Backend : Logs dans la console et fichiers `logs/`
- Frontend : Console du navigateur pour les erreurs

Cette intégration crée une base solide pour votre plateforme e-learning avec une architecture moderne et scalable.