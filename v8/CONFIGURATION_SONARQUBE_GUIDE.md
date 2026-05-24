# 🔧 Guide de Configuration SonarQube - Étape par Étape

## 🎯 Objectif
Créer le projet Portfolio dans SonarQube et générer le token pour Jenkins.

**Temps estimé : 5 minutes**

---

## ✅ ÉTAPE 1 : Accéder à SonarQube

1. Ouvrez votre navigateur
2. Allez sur : **http://localhost:9000**
3. Vous devriez voir la page SonarQube

---

## ✅ ÉTAPE 2 : Se connecter

1. Cliquez sur **"Log in"** (en haut à droite)
2. Entrez les identifiants :
   - **Login** : `admin`
   - **Password** : `admin` (ou votre mot de passe si vous l'avez changé)
3. Cliquez sur **"Log in"**

**Note :** Si c'est votre première connexion, SonarQube vous demandera de changer le mot de passe.

---

## ✅ ÉTAPE 3 : Créer le projet

### Option A : Création Manuelle (Recommandée)

1. Sur la page d'accueil, cliquez sur **"Create Project"** ou **"+"** (en haut à droite)

2. Sélectionnez **"Manually"** ou **"Create a local project"**

3. Remplissez le formulaire :
   ```
   Project display name: Portfolio Siakha KABA
   Project key: portfolio-siakha-kaba
   Main branch name: Siakha-KABA
   ```

4. Cliquez sur **"Set Up"** ou **"Create"**

### Option B : Avec GitHub

1. Cliquez sur **"Create Project"** → **"GitHub"**
2. Entrez l'URL : `https://github.com/SiakhaKABA/Portfolio_Siakha_kaba.git`
3. Sélectionnez la branche : `Siakha-KABA`
4. Suivez les instructions

---

## ✅ ÉTAPE 4 : Configurer l'analyse locale

1. Après la création du projet, vous verrez une page "How do you want to analyze your repository?"

2. Sélectionnez **"Locally"** (Analyse locale)

3. SonarQube vous demande de choisir votre méthode d'analyse :
   - Sélectionnez **"Other"** (for JS, TS, Go, Python, PHP, ...)

---

## ✅ ÉTAPE 5 : Générer le token d'authentification

1. Dans la section "Provide a token", vous verrez :
   ```
   Generate a token to authenticate your scanner
   ```

2. Entrez un nom pour le token :
   ```
   Token name: jenkins-portfolio-token
   ```

3. Cliquez sur **"Generate"**

4. **🔴 IMPORTANT : Un token s'affiche (exemple : `sqp_1234567890abcdef...`)**

5. **📝 COPIEZ CE TOKEN IMMÉDIATEMENT** et collez-le dans un fichier texte

   **⚠️ CE TOKEN NE SERA PLUS JAMAIS AFFICHÉ !**

6. Sauvegardez le token, par exemple dans :
   ```
   C:\temp\sonarqube-token.txt
   ```

---

## ✅ ÉTAPE 6 : Configuration du scanner (IGNOREZ cette partie)

SonarQube vous montrera des commandes pour lancer le scanner. **Vous n'avez PAS besoin de les exécuter** car Jenkins le fera automatiquement.

Vous pouvez :
- Cliquer sur **"Continue"** ou **"Finish this tutorial"**
- Ou simplement fermer cette page

---

## ✅ ÉTAPE 7 : Vérifier que le projet est créé

1. Cliquez sur **"Projects"** dans le menu en haut
2. Vous devriez voir votre projet : **"Portfolio Siakha KABA"**
3. Le project key doit être : `portfolio-siakha-kaba`

---

## 🎉 CONFIGURATION SONARQUBE TERMINÉE !

Vous avez maintenant :
- ✅ Le projet créé dans SonarQube
- ✅ Le token d'authentification copié

---

## 📋 INFORMATIONS À NOTER

Copiez ces informations pour la suite :

```
SonarQube URL: http://localhost:9000
Project Key: portfolio-siakha-kaba
Project Name: Portfolio Siakha KABA
Branch: Siakha-KABA
Token: [VOTRE_TOKEN_COPIÉ]
```

---

## 🔄 PROCHAINE ÉTAPE : Configurer Jenkins

Maintenant que SonarQube est configuré, passez à Jenkins :

👉 **Ouvrez le fichier : `CONFIGURATION_JENKINS_GUIDE.md`**

Ou suivez directement ces étapes :

### Résumé rapide Jenkins (10 min)

1. **Installer le plugin SonarQube Scanner**
   - Jenkins → Manage Jenkins → Manage Plugins → Available
   - Rechercher "SonarQube Scanner" → Install

2. **Ajouter le token dans Jenkins**
   - Manage Jenkins → Manage Credentials → Add Credentials
   - Kind: Secret text
   - Secret: [VOTRE TOKEN]
   - ID: `sonarqube-token`

3. **Configurer le serveur SonarQube**
   - Manage Jenkins → Configure System → SonarQube servers
   - Name: `SonarQube`
   - URL: `http://localhost:9000`
   - Token: Sélectionner `sonarqube-token`

4. **Configurer SonarScanner Tool**
   - Manage Jenkins → Global Tool Configuration → SonarQube Scanner
   - Name: `SonarScanner`
   - Path: `C:\Users\Soni-info Tech\sonar-scanner`

---

## 🆘 Problèmes courants

### Je ne me souviens plus du mot de passe admin

**Solution :** Réinitialiser SonarQube
```bash
docker stop sonarqube
docker rm sonarqube
docker run -d --name sonarqube -p 9000:9000 sonarqube:lts-community
```
Puis attendez 2-3 minutes et reconnectez-vous avec `admin` / `admin`

### Le token n'a pas été copié

**Solution :** Générer un nouveau token
1. SonarQube → Mon compte (icône utilisateur en haut à droite)
2. Security → Tokens
3. Generate New Token
4. Nom : `jenkins-portfolio-token-2`
5. Type : User Token
6. Expiration : No expiration
7. Generate → COPIER LE TOKEN

### Le projet existe déjà

**Solution :** Utilisez le projet existant ou supprimez-le
1. Projects → Trouvez votre projet
2. Project Settings → Deletion → Delete
3. Puis recréez-le

---

## 📸 Captures d'écran de référence

### Écran de création de projet
```
┌─────────────────────────────────────────┐
│  Create Project                         │
│                                         │
│  ○ GitHub                               │
│  ● Manually                             │
│                                         │
│  Project display name:                  │
│  [Portfolio Siakha KABA            ]   │
│                                         │
│  Project key:                           │
│  [portfolio-siakha-kaba            ]   │
│                                         │
│  Main branch name:                      │
│  [Siakha-KABA                      ]   │
│                                         │
│            [Set Up]                     │
└─────────────────────────────────────────┘
```

### Écran de génération de token
```
┌─────────────────────────────────────────┐
│  Generate a token                       │
│                                         │
│  Token name:                            │
│  [jenkins-portfolio-token          ]   │
│                                         │
│            [Generate]                   │
│                                         │
│  Your token:                            │
│  sqp_1234567890abcdef1234567890abcdef  │
│                                         │
│  ⚠️ Make sure you copy it now,          │
│  you won't be able to see it again!    │
│                                         │
│            [Continue]                   │
└─────────────────────────────────────────┘
```

---

## ✅ Checklist finale

Avant de passer à Jenkins, vérifiez :

- [ ] SonarQube accessible sur http://localhost:9000
- [ ] Connecté avec le compte admin
- [ ] Projet "Portfolio Siakha KABA" créé
- [ ] Project key = `portfolio-siakha-kaba`
- [ ] Token généré et copié dans un fichier texte
- [ ] Token sauvegardé en lieu sûr

---

## 🎯 ÉTAPE SUIVANTE

Une fois cette configuration terminée, passez à :

👉 **`CONFIGURATION_JENKINS_GUIDE.md`**

Ou consultez la documentation complète :

👉 **`README_INTEGRATION_JENKINS.md`**

---

**🚀 Bon travail ! La partie SonarQube est terminée, passons à Jenkins !**
