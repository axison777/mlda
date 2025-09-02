# 🚀 Guide d'Installation MLDA - Formation Allemand

## Prérequis

1. **Node.js** (version 18 ou plus récente)
2. **MySQL** (version 8.0 ou plus récente)
3. **Git**

## 📦 Installation de MySQL

### Sur Windows :
1. Téléchargez MySQL depuis https://dev.mysql.com/downloads/installer/
2. Installez avec les paramètres par défaut
3. Notez le mot de passe root

### Sur macOS :
```bash
# Avec Homebrew
brew install mysql
brew services start mysql

# Sécuriser l'installation
mysql_secure_installation
```

### Sur Ubuntu/Debian :
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

## 🗄️ Configuration de la Base de Données

1. **Connectez-vous à MySQL :**
```bash
mysql -u root -p
```

2. **Créez la base de données :**
```sql
CREATE DATABASE mlda_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'mlda_user'@'localhost' IDENTIFIED BY 'mlda_password_2024';
GRANT ALL PRIVILEGES ON mlda_db.* TO 'mlda_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 🔧 Installation du Projet

### 1. Backend

```bash
# Aller dans le dossier backend
cd backend

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Modifier le .env avec vos paramètres MySQL
# DATABASE_URL="mysql://mlda_user:mlda_password_2024@localhost:3306/mlda_db"

# Générer le client Prisma
npx prisma generate

# Créer les tables
npx prisma db push

# Insérer les données de test
npm run db:seed

# Démarrer le serveur backend
npm run dev
```

### 2. Frontend

```bash
# Dans un nouveau terminal, aller dans le dossier frontend
cd frontend

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Démarrer le serveur frontend
npm run dev
```

## 🧪 Test de l'Installation

1. **Backend** : http://localhost:3000/api/health
2. **Frontend** : http://localhost:5173

## 👤 Comptes de Test

Après le seeding, utilisez ces comptes :

- **Admin** : `admin@mlda.de` / `admin123`
- **Professeur** : `hans.mueller@mlda.de` / `teacher123`
- **Étudiant** : `marie.dubois@email.com` / `student123`

## 🔍 Vérification de la Connexion

### Test API Backend :
```bash
curl http://localhost:3000/api/health
```

### Test de Connexion Frontend-Backend :
1. Ouvrez http://localhost:5173
2. Cliquez sur "Connexion"
3. Utilisez un compte de test
4. Vérifiez que vous êtes redirigé vers le dashboard

## 🐛 Dépannage

### Erreur de connexion MySQL :
```bash
# Vérifier que MySQL fonctionne
sudo systemctl status mysql  # Linux
brew services list | grep mysql  # macOS

# Redémarrer MySQL si nécessaire
sudo systemctl restart mysql  # Linux
brew services restart mysql  # macOS
```

### Erreur Prisma :
```bash
# Réinitialiser la base
npx prisma db push --force-reset
npm run db:seed
```

### Erreur CORS :
- Vérifiez que `FRONTEND_URL` dans `.env` correspond à votre URL frontend

## 🚀 Déploiement en Production

### Recommandations :
1. **Base de données** : MySQL 8.0 sur un serveur dédié
2. **Backend** : VPS avec Node.js (DigitalOcean, AWS, etc.)
3. **Frontend** : Netlify, Vercel, ou serveur statique
4. **Variables d'environnement** : Changez tous les secrets !

### Checklist Déploiement :
- [ ] Changer `JWT_SECRET` en production
- [ ] Configurer l'URL de base de données de production
- [ ] Activer HTTPS
- [ ] Configurer les emails (optionnel)
- [ ] Configurer Stripe pour les paiements (optionnel)

Votre projet est prêt pour le développement et le déploiement ! 🎉