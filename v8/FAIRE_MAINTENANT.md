# 🎯 À FAIRE MAINTENANT - Liste Simple

## ⏱️ Total : 15 minutes

---

## 📍 ÉTAPE 1 : Configuration SonarQube (5 min)

### 🌐 Ouvrez : http://localhost:9000

### ✅ Actions à faire :

1. **Se connecter**
   - Login : `admin`
   - Password : `admin` (ou votre mot de passe)

2. **Créer le projet**
   - Cliquez : "Create Project" → "Manually"
   - Project name : `Portfolio Siakha KABA`
   - Project key : `portfolio-siakha-kaba`
   - Branch : `Siakha-KABA`
   - Cliquez : "Set Up"

3. **Générer le token**
   - Sélectionnez : "Locally"
   - Token name : `jenkins-portfolio-token`
   - Cliquez : "Generate"
   - **📝 COPIEZ LE TOKEN** (exemple : `sqp_abc123...`)
   - Sauvegardez-le dans : `C:\temp\sonarqube-token.txt`

**✅ SonarQube configuré !**

👉 **Guide détaillé :** `CONFIGURATION_SONARQUBE_GUIDE.md`

---

## 📍 ÉTAPE 2 : Configuration Jenkins (10 min)

### 🌐 Ouvrez : http://localhost:8080

### ✅ Action 1 : Installer le plugin (2 min)

- Manage Jenkins → Manage Plugins → Available
- Rechercher : `SonarQube Scanner`
- Cocher → Install without restart

### ✅ Action 2 : Ajouter le token (2 min)

- Manage Jenkins → Manage Credentials → (global) → Add Credentials
- Kind : `Secret text`
- Secret : **[COLLEZ VOTRE TOKEN]**
- ID : `sonarqube-token`
- Description : `SonarQube Authentication Token`
- Cliquez : OK

### ✅ Action 3 : Configurer le serveur (3 min)

- Manage Jenkins → Configure System → SonarQube servers
- Add SonarQube
- Name : `SonarQube`
- Server URL : `http://localhost:9000`
- Token : Sélectionnez `sonarqube-token`
- Cliquez : Save

### ✅ Action 4 : Configurer le scanner (3 min)

- Manage Jenkins → Global Tool Configuration → SonarQube Scanner
- Add SonarQube Scanner
- Name : `SonarScanner`
- ☐ Install automatically (DÉCOCHER)
- Path : `C:\Users\Soni-info Tech\sonar-scanner`
- Cliquez : Save

**✅ Jenkins configuré !**

👉 **Guide détaillé :** `CONFIGURATION_JENKINS_GUIDE.md`

---

## 📍 ÉTAPE 3 : Tester (2 min)

### 🌐 Dans Jenkins : http://localhost:8080

### ✅ Actions à faire :

1. **Lancer un build**
   - Allez sur votre projet Portfolio
   - Cliquez : "Build Now"

2. **Vérifier la console**
   - Cliquez sur le numéro du build
   - Cliquez : "Console Output"
   - Attendez de voir : `ANALYSIS SUCCESSFUL` ✅
   - Puis : `Quality Gate passed!` ✅

3. **Voir les résultats**
   - Ouvrez : http://localhost:9000/dashboard?id=portfolio-siakha-kaba
   - Vous devriez voir les métriques de votre code

**✅ Intégration complète réussie ! 🎉**

---

## 📊 Résultat attendu

Après ces 3 étapes, **chaque build Jenkins** va automatiquement :

1. ✅ Analyser votre code avec SonarQube
2. ✅ Vérifier la qualité (Quality Gate)
3. ✅ Bloquer le déploiement si la qualité est insuffisante
4. ✅ Vous envoyer un email avec le lien SonarQube

---

## 🆘 Besoin d'aide ?

### Si un problème survient :

**SonarQube ne répond pas :**
```bash
docker ps | grep sonarqube
docker start sonarqube
```

**Token oublié :**
- SonarQube → Mon compte → Security → Tokens → Generate New Token

**Plugin non trouvé :**
- Vérifiez votre connexion internet
- Redémarrez Jenkins : http://localhost:8080/restart

---

## 📚 Documentation complète

Si vous voulez plus de détails :

| Fichier | Pour quoi ? |
|---------|-------------|
| **CONFIGURATION_SONARQUBE_GUIDE.md** | Guide détaillé SonarQube avec captures |
| **CONFIGURATION_JENKINS_GUIDE.md** | Guide détaillé Jenkins avec troubleshooting |
| **INFOS_PROJET.md** | Toutes les infos (URLs, tokens, project keys) |
| **README_INTEGRATION_JENKINS.md** | Documentation technique complète |

---

## ✅ Checklist finale

Avant de considérer que c'est terminé :

- [ ] SonarQube accessible (http://localhost:9000)
- [ ] Projet "Portfolio Siakha KABA" créé dans SonarQube
- [ ] Token généré et sauvegardé
- [ ] Plugin SonarQube Scanner installé dans Jenkins
- [ ] Token ajouté dans Jenkins Credentials
- [ ] Serveur SonarQube configuré dans Jenkins
- [ ] SonarScanner configuré dans Jenkins
- [ ] Build de test lancé et réussi
- [ ] Dashboard SonarQube montre les métriques

---

## 🚀 C'EST PARTI !

**Commencez maintenant par l'ÉTAPE 1 : http://localhost:9000**

Bon courage ! 💪
