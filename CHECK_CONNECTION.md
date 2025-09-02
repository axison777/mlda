# 🔗 Vérification de la Connexion Backend-Frontend

## Tests de Connexion

### 1. Test de l'API Backend
```bash
# Test de santé de l'API
curl http://localhost:3000/api/health

# Réponse attendue :
# {"status":"OK","timestamp":"2024-01-20T..."}
```

### 2. Test d'Authentification
```bash
# Test de connexion
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mlda.de","password":"admin123"}'

# Réponse attendue :
# {"message":"Login successful","user":{...},"token":"eyJ..."}
```

### 3. Test Frontend-Backend

1. **Ouvrez le frontend** : http://localhost:5173
2. **Ouvrez les DevTools** (F12) → Console
3. **Connectez-vous** avec : `admin@mlda.de` / `admin123`
4. **Vérifiez** qu'il n'y a pas d'erreurs CORS dans la console

### 4. Points de Vérification

✅ **Backend démarré** sur port 3000
✅ **Frontend démarré** sur port 5173  
✅ **Base de données** MySQL connectée
✅ **Authentification** fonctionnelle
✅ **Pas d'erreurs CORS**

## Problèmes Courants

### Erreur CORS
- Vérifiez `FRONTEND_URL` dans `backend/.env`
- Redémarrez le backend après modification

### Erreur de Base de Données
```bash
# Vérifier la connexion MySQL
mysql -u mlda_user -p mlda_db

# Recréer les tables si nécessaire
cd backend
npx prisma db push --force-reset
npm run db:seed
```

### Erreur d'Authentification
- Vérifiez que `JWT_SECRET` est défini
- Videz le localStorage du navigateur
- Redémarrez les deux serveurs

## Architecture de Connexion

```
Frontend (React)     Backend (Express)     Database (MySQL)
     |                       |                     |
     |-- API Calls --------> |                     |
     |   (axios/fetch)       |-- Prisma ORM ----> |
     |                       |                     |
     |<-- JSON Responses --- |<-- Query Results --|
```

La connexion est bien configurée ! 🎉