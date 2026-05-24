# 📋 Informations du Projet - Configuration SonarQube

## 🔗 Informations GitHub

### Repository URL
```
https://github.com/SiakhaKABA/Portfolio_Siakha_kaba.git
```

### Branche principale
```
Siakha-KABA
```

### Clone du repository
```bash
git clone https://github.com/SiakhaKABA/Portfolio_Siakha_kaba.git
cd Portfolio_Siakha_kaba
git checkout Siakha-KABA
```

---

## 🎯 Configuration SonarQube

### Project Key
```
portfolio-siakha-kaba
```

### Project Name
```
Portfolio Siakha KABA
```

### SonarQube URL
```
http://localhost:9000
```

### Dashboard URL (après création)
```
http://localhost:9000/dashboard?id=portfolio-siakha-kaba
```

---

## 🚀 Création du projet dans SonarQube

### Méthode 1 : Avec intégration GitHub

1. **Accéder à SonarQube** : http://localhost:9000
2. **Login** : `admin` / `admin`
3. Cliquez sur **"Create Project"** → **"GitHub"**
4. Renseignez :
   - **Repository** : `https://github.com/SiakhaKABA/Portfolio_Siakha_kaba.git`
   - **Branch** : `Siakha-KABA`
   - **Project Key** : `portfolio-siakha-kaba`
5. Cliquez sur **"Set Up"**
6. Générez le token → **📝 COPIEZ-LE**

### Méthode 2 : Création manuelle

1. **Accéder à SonarQube** : http://localhost:9000
2. **Login** : `admin` / `admin`
3. Cliquez sur **"Create Project"** → **"Manually"**
4. Renseignez :
   - **Project key** : `portfolio-siakha-kaba`
   - **Display name** : `Portfolio Siakha KABA`
5. Cliquez sur **"Next"** → **"Use the global setting"**
6. Cliquez sur **"Create Project"**
7. Sélectionnez **"Locally"**
8. Générez le token → **📝 COPIEZ-LE**

---

## 🔑 Configuration Jenkins

### Credentials à créer dans Jenkins

#### 1. Token SonarQube
```
Jenkins → Manage Jenkins → Manage Credentials → (global) → Add Credentials

Kind: Secret text
Secret: [VOTRE_TOKEN_SONARQUBE]
ID: sonarqube-token
Description: SonarQube Authentication Token
```

#### 2. Docker Hub Credentials (déjà configuré)
```
ID: dockerhub-creds
Username: siakhakaba19
Password: [votre password Docker Hub]
```

### Serveur SonarQube dans Jenkins
```
Jenkins → Manage Jenkins → Configure System → SonarQube servers

Name: SonarQube
Server URL: http://localhost:9000
Server authentication token: [Sélectionner "sonarqube-token"]
```

### SonarScanner Tool
```
Jenkins → Manage Jenkins → Global Tool Configuration → SonarQube Scanner

Name: SonarScanner
Install automatically: ☐ (DÉCOCHER)
SONAR_RUNNER_HOME: C:\Users\Soni-info Tech\sonar-scanner
```

---

## 📦 Structure du projet

```
v8/
├── backend/                  # Backend Node.js/Express
│   ├── controllers/          # Contrôleurs API
│   ├── models/               # Modèles MongoDB
│   ├── routes/               # Routes API
│   ├── middleware/           # Middleware d'authentification
│   ├── config/               # Configuration DB
│   └── app.js                # Point d'entrée backend
├── frontend/                 # Frontend React/Vite
│   └── src/
│       ├── components/       # Composants React
│       └── assets/           # Images et ressources
├── Jenkinsfile               # Pipeline CI/CD
├── docker-compose.yml        # Configuration Docker
└── sonar-project.properties  # Configuration SonarQube
```

---

## 🐳 Images Docker Hub

### Repository Docker Hub
```
https://hub.docker.com/r/siakhakaba19/portfolio
```

### Images
```
siakhakaba19/portfolio:backend-latest
siakhakaba19/portfolio:frontend-latest
```

### Commandes Docker
```bash
# Pull des images
docker pull siakhakaba19/portfolio:backend-latest
docker pull siakhakaba19/portfolio:frontend-latest

# Lancer le projet
docker compose up -d

# Arrêter le projet
docker compose down
```

---

## 🌐 URLs de l'application

### Application déployée
```
Frontend: http://localhost:8080
Backend API: http://localhost:3000
```

### Outils de développement
```
SonarQube: http://localhost:9000
Jenkins: http://localhost:8080 (si même port, ajuster)
```

---

## 📊 Métriques SonarQube

Le projet analyse :
- **Backend** : Node.js/Express (JavaScript)
- **Frontend** : React/Vite (JavaScript/JSX)

Métriques suivies :
- 🐛 Bugs
- 🔒 Vulnerabilities
- 💩 Code Smells
- 📋 Duplications
- 📊 Coverage
- 🧮 Complexity

---

## 🔄 Workflow CI/CD

```
Push sur GitHub (branche Siakha-KABA)
    ↓
Jenkins déclenche le build
    ↓
1. Checkout du code
2. Préparation environnement
3. 🔍 Analyse SonarQube
4. ✅ Quality Gate
    ├─ ❌ Échec → Pipeline arrêté
    └─ ✅ OK → Continue
5. Build des images Docker
6. Push vers Docker Hub
7. Déploiement
8. Vérification
    ↓
Email de notification avec lien SonarQube
```

---

## 📧 Contact

**Développeur** : Siakha KABA  
**Email** : siakha.kaba94@gmail.com  
**GitHub** : https://github.com/SiakhaKABA

---

## 📝 Notes importantes

- ⚠️ Le token SonarQube ne s'affiche qu'une seule fois → le copier immédiatement
- ⚠️ Ne jamais commiter le token dans le code → utiliser Jenkins Credentials
- ⚠️ Le fichier `.env` backend est copié depuis `C:\secrets\backend.env` dans le pipeline
- ✅ La branche par défaut du projet est `Siakha-KABA`
- ✅ Le Quality Gate bloque le déploiement si la qualité est insuffisante

---

## 🆘 Liens utiles

- **Documentation** : [README_INTEGRATION_JENKINS.md](./README_INTEGRATION_JENKINS.md)
- **Guide rapide** : [START_HERE.md](./START_HERE.md)
- **SonarQube Docs** : https://docs.sonarsource.com/sonarqube/
- **Jenkins Docs** : https://www.jenkins.io/doc/
