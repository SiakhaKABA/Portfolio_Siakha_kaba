# 🗑️ Guide : Supprimer un projet dans SonarQube

## 🎯 Objectif
Supprimer le projet associé au repository GitHub dans SonarQube.

**Temps estimé : 1 minute**

---

## ✅ MÉTHODE 1 : Via l'interface SonarQube (Recommandée)

### Étapes :

1. **Ouvrez SonarQube** : http://localhost:9000

2. **Connectez-vous**
   - Username : `admin`
   - Password : (votre mot de passe)

3. **Aller sur la page des projets**
   - Cliquez sur **"Projects"** dans le menu du haut
   - Ou allez directement sur : http://localhost:9000/projects

4. **Trouver le projet à supprimer**
   - Recherchez : `Portfolio Siakha KABA`
   - Ou cherchez par la clé : `portfolio-siakha-kaba`

5. **Accéder aux paramètres du projet**
   - Cliquez sur le projet
   - Cliquez sur **"Project Settings"** (icône engrenage) ou **"Administration"**

6. **Supprimer le projet**
   - Dans le menu de gauche, cliquez sur **"Deletion"**
   - Confirmez la suppression en cliquant sur **"Delete"**
   - Confirmez à nouveau si demandé

**✅ Le projet est supprimé !**

---

## ✅ MÉTHODE 2 : Via l'API REST (Alternative)

Si vous connaissez votre mot de passe admin et voulez utiliser l'API :

```bash
# Remplacez VOTRE_MOT_DE_PASSE par votre mot de passe admin
curl -u admin:VOTRE_MOT_DE_PASSE -X POST \
  "http://localhost:9000/api/projects/delete?project=portfolio-siakha-kaba"
```

---

## ✅ MÉTHODE 3 : Supprimer tous les projets et recommencer

Si vous voulez tout réinitialiser :

```bash
# Arrêter SonarQube
docker stop sonarqube

# Supprimer le conteneur (et toutes ses données)
docker rm sonarqube

# Relancer un nouveau SonarQube
docker run -d --name sonarqube -p 9000:9000 sonarqube:lts-community

# Attendre 2-3 minutes que SonarQube démarre
# Puis reconnectez-vous avec admin/admin
```

**⚠️ ATTENTION :** Cette méthode supprime TOUS les projets et configurations !

---

## 🔍 Vérifier que le projet est supprimé

1. Allez sur : http://localhost:9000/projects
2. Le projet ne devrait plus apparaître dans la liste
3. Ou essayez d'accéder directement :
   - http://localhost:9000/dashboard?id=portfolio-siakha-kaba
   - Vous devriez voir : "Project not found"

---

## 🎯 Après la suppression

### Si vous voulez recréer le projet :

1. Suivez le guide : **`CONFIGURATION_SONARQUBE_GUIDE.md`**
2. Ou le guide rapide : **`FAIRE_MAINTENANT.md`**

### Les étapes seront :
1. Create Project → Manually
2. Project key : `portfolio-siakha-kaba`
3. Project name : `Portfolio Siakha KABA`
4. Branch : `Siakha-KABA`
5. Générer un nouveau token

---

## 📋 Informations du projet à supprimer

- **Project Key** : `portfolio-siakha-kaba`
- **Project Name** : `Portfolio Siakha KABA`
- **GitHub URL** : https://github.com/SiakhaKABA/Portfolio_Siakha_kaba.git
- **Branch** : `Siakha-KABA`

---

## 🆘 En cas de problème

### Je ne trouve pas le projet

**Possible que :**
- Le projet n'a pas encore été créé
- Le projet a un autre nom
- Vous n'êtes pas connecté

**Solution :**
- Allez sur http://localhost:9000/projects
- Regardez tous les projets listés
- Le project key exact est : `portfolio-siakha-kaba`

### Je n'ai pas les droits de suppression

**Cause :** Vous n'êtes pas connecté en tant qu'administrateur

**Solution :**
1. Déconnectez-vous
2. Reconnectez-vous avec le compte `admin`
3. Seul l'admin peut supprimer des projets

### Le bouton "Delete" n'apparaît pas

**Cause :** Vous n'êtes pas dans les bons paramètres

**Solution :**
1. Cliquez sur le projet
2. Project Settings → Deletion
3. Le bouton devrait apparaître en bas de page

---

## ✅ Checklist

- [ ] SonarQube accessible (http://localhost:9000)
- [ ] Connecté en tant qu'admin
- [ ] Projet trouvé dans la liste
- [ ] Accès aux Project Settings
- [ ] Onglet "Deletion" ouvert
- [ ] Suppression confirmée
- [ ] Projet n'apparaît plus dans la liste

---

## 🎉 Projet supprimé !

Le projet `portfolio-siakha-kaba` a été supprimé de SonarQube.

Vous pouvez maintenant :
- Recréer un nouveau projet
- Ou laisser SonarQube sans projet

---

**Note :** La suppression du projet dans SonarQube n'affecte PAS :
- Votre code sur GitHub ✅
- Votre configuration Jenkins ✅
- Vos fichiers locaux ✅

Seules les données d'analyse dans SonarQube sont supprimées.
