# ⚙️ Guide de Configuration Jenkins - Étape par Étape

## 🎯 Objectif
Configurer Jenkins pour qu'il utilise SonarQube lors de chaque build.

**Temps estimé : 10 minutes**

**Prérequis :** Vous devez avoir le token SonarQube généré à l'étape précédente.

---

## ✅ ÉTAPE 1 : Installer le plugin SonarQube Scanner (2 min)

1. Ouvrez Jenkins dans votre navigateur : **http://localhost:8080**

2. Dans le menu de gauche, cliquez sur **"Manage Jenkins"**

3. Cliquez sur **"Manage Plugins"** (ou **"Plugins"** selon la version)

4. Allez sur l'onglet **"Available"** (Disponibles)

5. Dans la barre de recherche en haut, tapez : **`SonarQube Scanner`**

6. Cochez la case à côté de **"SonarQube Scanner for Jenkins"**

7. Cliquez sur **"Install without restart"** (en bas de la page)

8. Attendez que l'installation soit terminée (vous verrez "Success" ✅)

9. **Ne redémarrez PAS Jenkins** pour l'instant

---

## ✅ ÉTAPE 2 : Ajouter le token SonarQube dans Jenkins (2 min)

1. Retournez au **Dashboard** Jenkins (cliquez sur le logo Jenkins en haut à gauche)

2. Cliquez sur **"Manage Jenkins"**

3. Cliquez sur **"Manage Credentials"**

4. Sous **"Stores scoped to Jenkins"**, cliquez sur **"(global)"**
   - Ou cliquez sur **"System"** puis **"Global credentials (unrestricted)"**

5. Dans le menu de gauche, cliquez sur **"Add Credentials"**

6. Remplissez le formulaire :
   ```
   Kind: Secret text
   Scope: Global (Jenkins, nodes, items, all child items, etc)
   Secret: [COLLEZ ICI LE TOKEN SONARQUBE QUE VOUS AVEZ COPIÉ]
   ID: sonarqube-token
   Description: SonarQube Authentication Token
   ```

7. Cliquez sur **"Create"** ou **"OK"**

8. Vérifiez que le credential **"sonarqube-token"** apparaît dans la liste

---

## ✅ ÉTAPE 3 : Configurer le serveur SonarQube (3 min)

1. Retournez au **Dashboard** Jenkins

2. Cliquez sur **"Manage Jenkins"**

3. Cliquez sur **"Configure System"** (ou **"System"**)

4. Faites défiler vers le bas jusqu'à trouver la section **"SonarQube servers"**
   - Si vous ne la trouvez pas, c'est que le plugin n'est pas encore chargé. Redémarrez Jenkins :
     - Allez sur `http://localhost:8080/restart`
     - Confirmez le redémarrage
     - Attendez 1-2 minutes puis reconnectez-vous

5. Cliquez sur **"Add SonarQube"**

6. Remplissez les champs :
   ```
   Name: SonarQube
   Server URL: http://localhost:9000
   Server authentication token: [Sélectionnez "sonarqube-token" dans la liste déroulante]
   ```

7. **Important :** Décochez la case **"Enable injection of SonarQube server configuration"** si elle est cochée (optionnel)

8. Cliquez sur **"Save"** en bas de la page

---

## ✅ ÉTAPE 4 : Configurer SonarScanner Tool (3 min)

1. Retournez au **Dashboard** Jenkins

2. Cliquez sur **"Manage Jenkins"**

3. Cliquez sur **"Global Tool Configuration"** (ou **"Tools"**)

4. Faites défiler vers le bas jusqu'à la section **"SonarQube Scanner"**

5. Cliquez sur **"Add SonarQube Scanner"**

6. Remplissez les champs :
   ```
   Name: SonarScanner
   ☐ Install automatically (DÉCOCHER cette case - très important !)
   SONAR_RUNNER_HOME: C:\Users\Soni-info Tech\sonar-scanner
   ```

7. Vérifiez bien que la case **"Install automatically"** est **DÉCOCHÉE** ☐

8. Cliquez sur **"Save"** en bas de la page

---

## ✅ ÉTAPE 5 : Configurer un Webhook SonarQube → Jenkins (Optionnel mais recommandé)

Cette étape permet à SonarQube de notifier Jenkins du résultat du Quality Gate.

### Dans SonarQube :

1. Ouvrez SonarQube : **http://localhost:9000**

2. Connectez-vous (admin)

3. Cliquez sur **"Administration"** (en haut)

4. Dans le menu de gauche, allez sur **"Configuration"** → **"Webhooks"**

5. Cliquez sur **"Create"**

6. Remplissez :
   ```
   Name: Jenkins
   URL: http://localhost:8080/sonarqube-webhook/
   Secret: (laisser vide)
   ```

7. Cliquez sur **"Create"**

---

## ✅ ÉTAPE 6 : Vérification de la configuration

### Vérifier que tout est bien configuré :

1. **Plugin installé :**
   - Manage Jenkins → Manage Plugins → Installed
   - Recherchez "SonarQube Scanner" → doit apparaître ✅

2. **Token ajouté :**
   - Manage Jenkins → Manage Credentials → (global)
   - Vous devez voir "sonarqube-token" ✅

3. **Serveur configuré :**
   - Manage Jenkins → Configure System → SonarQube servers
   - Nom : "SonarQube", URL : "http://localhost:9000" ✅

4. **Scanner configuré :**
   - Manage Jenkins → Global Tool Configuration → SonarQube Scanner
   - Nom : "SonarScanner", Path correct ✅

---

## 🎉 CONFIGURATION JENKINS TERMINÉE !

Vous avez maintenant :
- ✅ Plugin SonarQube Scanner installé
- ✅ Token SonarQube ajouté dans Jenkins Credentials
- ✅ Serveur SonarQube configuré
- ✅ SonarScanner Tool configuré
- ✅ Webhook configuré (optionnel)

---

## 🚀 ÉTAPE SUIVANTE : Lancer un build de test

### Tester l'intégration :

1. Dans Jenkins, allez sur votre **projet Portfolio**

2. Cliquez sur **"Build Now"** dans le menu de gauche

3. Attendez que le build démarre, puis cliquez sur le **numéro du build** (ex: #1, #2, etc.)

4. Cliquez sur **"Console Output"**

5. **Vérifiez que vous voyez :**
   ```
   === Analyse de la qualite du code avec SonarQube ===
   INFO: Scanner configuration file: ...
   INFO: Project root configuration file: sonar-project.properties
   INFO: Analyzing on SonarQube server 9.9
   INFO: Base dir: E:\ODC-AWS\ProjetFilRouge\ProjetHTML\Portfolio_Siakha_KABA\v8
   INFO: Working dir: ...
   INFO: Source paths: backend, frontend/src
   INFO: Sensor JavaScript/TypeScript analysis
   ...
   INFO: ANALYSIS SUCCESSFUL
   INFO: Task total time: ...
   
   === Verification du Quality Gate SonarQube ===
   Checking status of SonarQube task ...
   SonarQube task id: AZ5Z...
   Quality Gate status: OK ✅
   Quality Gate passed!
   ```

6. **Consultez les résultats dans SonarQube :**
   - Ouvrez : http://localhost:9000/dashboard?id=portfolio-siakha-kaba
   - Vous devriez voir les métriques de votre code :
     - Bugs
     - Vulnerabilities
     - Code Smells
     - Coverage
     - Duplications

---

## 📊 Comprendre les résultats

### Dashboard SonarQube

Après l'analyse, vous verrez :

```
┌────────────────────────────────────────────────────┐
│ Portfolio Siakha KABA                              │
│ Last analysis: a few seconds ago                   │
├────────────────────────────────────────────────────┤
│                                                    │
│  Bugs              Vulnerabilities    Code Smells  │
│  [  0  ]          [  0  ]            [  12  ]     │
│   A                A                   C           │
│                                                    │
│  Coverage          Duplications       Hotspots     │
│  [  0% ]          [  0% ]            [  0  ]      │
│   -                A                   -           │
│                                                    │
└────────────────────────────────────────────────────┘
```

### Ratings :
- **A** = Excellent (vert)
- **B** = Bon (vert clair)
- **C** = Moyen (jaune)
- **D** = Mauvais (orange)
- **E** = Très mauvais (rouge)

---

## 🎯 Que faire ensuite ?

### 1. Corriger les problèmes détectés

1. Dans SonarQube, cliquez sur le nombre de **Code Smells** (ou Bugs/Vulnerabilities)
2. Vous verrez la liste détaillée des problèmes
3. Cliquez sur un problème pour voir :
   - Le fichier concerné
   - La ligne de code
   - L'explication du problème
   - Comment le corriger

### 2. Améliorer progressivement

Priorités :
1. **🔴 Bugs** → À corriger immédiatement
2. **🔴 Vulnerabilities** → Failles de sécurité critiques
3. **🟡 Code Smells** → Améliorer la qualité
4. **🟢 Duplications** → Refactoriser si nécessaire

### 3. Surveiller l'évolution

À chaque build Jenkins :
- L'analyse SonarQube se lance automatiquement
- Le Quality Gate vérifie les seuils
- Si échec → le build s'arrête ❌
- Si succès → le build continue ✅

---

## 🆘 Résolution de problèmes

### ❌ Erreur : "SonarQube scanner exited with code 1"

**Causes possibles :**
1. Token invalide ou expiré
2. SonarQube non accessible
3. Project key incorrect

**Solutions :**
```bash
# 1. Vérifier que SonarQube est lancé
docker ps | grep sonarqube

# 2. Tester l'accès à SonarQube
curl http://localhost:9000/api/system/status

# 3. Vérifier le project key dans SonarQube
# http://localhost:9000/projects
```

### ❌ Erreur : "Quality Gate timeout"

**Cause :** SonarQube met trop de temps à calculer le Quality Gate

**Solution :** Augmenter le timeout dans le Jenkinsfile
```groovy
timeout(time: 10, unit: 'MINUTES') {
```

### ❌ Erreur : "Server authentication token : Invalid credentials"

**Cause :** Le token est incorrect ou mal configuré

**Solution :**
1. Régénérez un nouveau token dans SonarQube
2. Mettez à jour le credential dans Jenkins :
   - Manage Jenkins → Manage Credentials
   - Cliquez sur "sonarqube-token" → Update
   - Collez le nouveau token → Save

### ❌ Le stage SonarQube n'apparaît pas

**Cause :** Le Jenkinsfile n'est pas à jour

**Solution :**
1. Vérifiez que vous avez bien pull les derniers changements du repository
2. Vérifiez que le Jenkinsfile contient les stages "SonarQube Analysis" et "Quality Gate"

---

## 📋 Checklist finale

Avant de considérer la configuration terminée :

- [ ] Plugin SonarQube Scanner installé dans Jenkins
- [ ] Token SonarQube ajouté dans Jenkins Credentials (ID: sonarqube-token)
- [ ] Serveur SonarQube configuré (Name: SonarQube, URL: http://localhost:9000)
- [ ] SonarScanner Tool configuré (Name: SonarScanner, Path correct)
- [ ] Webhook SonarQube → Jenkins créé (optionnel)
- [ ] Build de test lancé et réussi
- [ ] Console Output montre "ANALYSIS SUCCESSFUL"
- [ ] Quality Gate montre "OK"
- [ ] Dashboard SonarQube affiche les métriques
- [ ] Email de notification reçu avec lien SonarQube

---

## 🎉 FÉLICITATIONS !

Votre intégration Jenkins + SonarQube est complète et fonctionnelle !

### Ce qui se passe maintenant à chaque build :

```
1. Checkout du code depuis GitHub
2. Préparation de l'environnement
3. 🔍 ANALYSE SONARQUBE
   → Scan du code backend et frontend
   → Détection des problèmes
   → Envoi des résultats à SonarQube
4. ✅ QUALITY GATE
   → Vérification des seuils
   → Si échec → STOP ❌
   → Si OK → Continue ✅
5. Build des images Docker
6. Push vers Docker Hub
7. Déploiement
8. 📧 Email avec lien SonarQube
```

---

## 📚 Documentation de référence

- **INFOS_PROJET.md** - Toutes les informations du projet
- **README_INTEGRATION_JENKINS.md** - Guide complet
- **START_HERE.md** - Vue d'ensemble

---

## 🎓 Pour aller plus loin

### Configurer un Quality Gate personnalisé

1. SonarQube → Quality Gates
2. Create
3. Définissez vos conditions :
   - Bugs > 0 → Failed
   - Coverage < 80% → Failed
   - Duplications > 3% → Failed
4. Assignez-le à votre projet

### Ajouter des tests unitaires

Pour augmenter la couverture de code :
1. Ajoutez des tests dans `backend/` et `frontend/`
2. Configurez la génération de rapports de couverture
3. SonarQube détectera automatiquement les rapports

---

**🚀 Bon développement avec votre nouveau pipeline de qualité ! 💻**
