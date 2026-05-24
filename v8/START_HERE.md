# 🚀 Intégration SonarQube dans Jenkins

## 📋 Vue d'ensemble

Ce projet intègre l'analyse de qualité du code avec SonarQube dans le pipeline Jenkins CI/CD.

---

## ✅ Ce qui est déjà configuré

- ✅ SonarQube installé et lancé (http://localhost:9000)
- ✅ SonarScanner installé
- ✅ Fichier de configuration `sonar-project.properties` créé
- ✅ Jenkinsfile mis à jour avec les stages SonarQube

---

## 🎯 Configuration Jenkins (10 minutes)

Pour que l'intégration fonctionne, vous devez configurer Jenkins. Consultez le guide détaillé :

👉 **[README_INTEGRATION_JENKINS.md](./README_INTEGRATION_JENKINS.md)**

### Résumé des étapes :

1. **Créer le projet dans SonarQube**
   - Clé : `portfolio-siakha-kaba`
   - Générer et sauvegarder le token

2. **Configurer Jenkins**
   - Installer le plugin SonarQube Scanner
   - Ajouter le token dans Credentials (ID: `sonarqube-token`)
   - Configurer le serveur SonarQube
   - Configurer SonarScanner Tool

3. **Tester**
   - Lancer un build dans Jenkins
   - Vérifier l'analyse SonarQube
   - Consulter les résultats sur http://localhost:9000

---

## 📊 Nouveau workflow du pipeline

```
Checkout → Preparation env
    ↓
🔍 ANALYSE SONARQUBE
    ↓
✅ QUALITY GATE
    ├─❌ Échec → STOP
    └─✅ OK → Continue
        ↓
Build → Push Docker Hub → Déploiement
```

---

## 📖 Documentation

- **[README_INTEGRATION_JENKINS.md](./README_INTEGRATION_JENKINS.md)** - Guide complet de configuration

---

## 🔧 Fichiers du projet

- `sonar-project.properties` - Configuration SonarQube
- `Jenkinsfile` - Pipeline Jenkins avec intégration SonarQube
- `docker-compose.yml` - Configuration Docker du projet

---

## 📞 Besoin d'aide ?

Consultez le guide détaillé : [README_INTEGRATION_JENKINS.md](./README_INTEGRATION_JENKINS.md)
