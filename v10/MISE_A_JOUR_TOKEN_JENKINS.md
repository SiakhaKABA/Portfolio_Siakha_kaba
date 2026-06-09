# 🔑 Mise à Jour du Token SonarQube dans Jenkins

## ⚠️ ACTION REQUISE IMMÉDIATEMENT

Vous avez une **erreur 401 (Unauthorized)** car le credential Jenkins utilise encore l'ancien token.

---

## 📝 Nouveau Token à Utiliser

```
squ_919b46a7e81276631f816527556ffbdf48e91f05
```

**Type** : USER_TOKEN
**Créé le** : 2026-06-09
**Pour le projet** : Portfolio-Siakha-KABA

---

## 🔧 Procédure de Mise à Jour (5 minutes)

### Étape 1 : Ouvrir Jenkins

1. **URL** : http://localhost:8081
2. **Connexion** :
   - User : `kaba`
   - Pass : `aws123`

---

### Étape 2 : Accéder aux Credentials

1. Dans le menu de gauche, cliquez sur : **Manage Jenkins**

2. Cliquez sur : **Credentials**

3. Vous verrez une section **Stores scoped to Jenkins**

4. Cliquez sur : **(global)** (le lien sous "Domains")

---

### Étape 3 : Mettre à Jour le Token

#### Option A : Le credential existe déjà

1. Dans la liste des credentials, trouvez : **`sonarqube-token`**

2. Cliquez sur **`sonarqube-token`** (le lien)

3. Dans le menu de gauche, cliquez sur : **Update**

4. Dans le champ **Secret**, effacez l'ancien token et collez :
   ```
   squ_919b46a7e81276631f816527556ffbdf48e91f05
   ```

5. Cliquez sur : **Save**

#### Option B : Le credential n'existe pas

1. Cliquez sur : **Add Credentials** (menu de gauche)

2. Remplissez le formulaire :
   ```
   Kind:        Secret text
   Scope:       Global (Jenkins, nodes, items, all child items, etc)
   Secret:      squ_919b46a7e81276631f816527556ffbdf48e91f05
   ID:          sonarqube-token
   Description: SonarQube Authentication Token for Analysis
   ```

3. Cliquez sur : **Create**

---

### Étape 4 : Vérifier

1. Retournez à la liste des credentials

2. Vous devriez voir : **`sonarqube-token`** dans la liste

3. La description devrait indiquer : "SonarQube Authentication Token for Analysis"

---

### Étape 5 : Relancer le Build

1. Retournez à l'accueil Jenkins (cliquez sur le logo en haut à gauche)

2. Trouvez votre job : **PortfolioSonar**

3. Cliquez sur : **Build Now**

4. Cliquez sur le numéro du nouveau build (ex: #15)

5. Cliquez sur : **Console Output**

6. **Résultat attendu** : L'analyse SonarQube devrait maintenant **RÉUSSIR** ! ✅

---

## ✅ Vérification Réussie

Une fois le build terminé avec succès, vous verrez :

```
INFO  Analysis report uploaded in XXXms
INFO  ANALYSIS SUCCESSFUL
INFO  Note that you will be able to access the updated dashboard once the server has processed the submitted analysis report
```

---

## 🎯 Après le Build Réussi

### Consulter les Résultats

**Dashboard SonarQube** :
```
http://localhost:9100/dashboard?id=Portfolio-Siakha-KABA
```

**Quality Gate** :
```
http://localhost:9100/project/quality_gate?id=Portfolio-Siakha-KABA
```

Vous verrez :
- 🐛 Nombre de bugs détectés
- 🔒 Vulnérabilités de sécurité
- 💩 Code smells (problèmes de qualité)
- 📊 Couverture de tests
- 📈 Dette technique

---

## 🆘 En Cas de Problème

### Erreur persiste après mise à jour ?

**Vérifier que le token est valide** :

```bash
curl -H "Authorization: Bearer squ_919b46a7e81276631f816527556ffbdf48e91f05" \
  http://localhost:9100/api/authentication/validate
```

**Réponse attendue** :
```json
{"valid":true}
```

---

### Le credential n'apparaît pas dans Jenkins ?

1. Vérifiez que vous êtes bien dans **Credentials** > **(global)**
2. Essayez de rafraîchir la page (F5)
3. Vérifiez que vous êtes connecté en tant que `kaba`

---

### Toujours une erreur 401 ?

Générez un nouveau token :

1. Ouvrez SonarQube : http://localhost:9100
2. Connectez-vous : `admin` / `aws123Sia@12`
3. Allez dans : **Mon compte** > **Sécurité** > **Tokens**
4. Générez un nouveau token :
   - Name : `jenkins-final-token`
   - Type : **User Token**
   - Expires in : **90 days**
5. Copiez le token
6. Mettez à jour le credential Jenkins avec ce nouveau token

---

## 📊 Résumé de l'Erreur Actuelle

```
Erreur : 401 Unauthorized
Cause : Le credential Jenkins contient l'ancien token
Token actuel dans Jenkins : [ancien - invalide]
Token à utiliser : squ_919b46a7e81276631f816527556ffbdf48e91f05
Action : Mettre à jour le credential "sonarqube-token" dans Jenkins
```

---

## ⏱️ Temps Estimé

- **Mise à jour du token** : 2 minutes
- **Relance du build** : 1 minute
- **Analyse SonarQube** : 1-2 minutes
- **Total** : ~5 minutes

---

**Après cette mise à jour, l'intégration SonarQube-Jenkins sera 100% fonctionnelle !** 🎉

---

*Guide créé le 9 juin 2026*
*Dernière mise à jour : 18:10*
