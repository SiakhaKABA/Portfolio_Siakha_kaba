# 🏗️ Configuration Terraform - Jenkins

## 🎯 Objectif

Intégrer Terraform dans le pipeline Jenkins pour déployer automatiquement l'infrastructure Kubernetes après chaque build réussi.

---

## 🔍 Diagnostic du Problème

### Symptômes
- Stage Terraform s'exécute très rapidement (50ms)
- Aucune erreur visible
- Terraform ne s'exécute pas réellement

### Cause Identifiée ⚠️

**Les credentials Jenkins nécessaires sont manquants** :
- `tf-admin-password-hash` ❌ Non trouvé
- `tf-jwt-secret` ❌ Non trouvé

Sans ces credentials, le bloc `withCredentials` dans le Jenkinsfile échoue silencieusement et skip toute l'exécution Terraform.

---

## ✅ Solution : Créer les Credentials Terraform

### Étape 1 : Générer les Secrets

#### A) Hash du Mot de Passe Admin (bcrypt)

**Méthode 1 - Via Node.js** (Recommandé) :

```bash
# Installer bcryptjs si nécessaire
npm install -g bcryptjs

# Générer le hash
node -e "console.log(require('bcryptjs').hashSync('VotreMotDePasseAdmin', 12))"
```

**Méthode 2 - Via Python** :

```bash
pip install bcrypt
python -c "import bcrypt; print(bcrypt.hashpw(b'VotreMotDePasseAdmin', bcrypt.gensalt()).decode())"
```

**Méthode 3 - Via un site en ligne** (Moins sécurisé) :
- https://bcrypt-generator.com/
- Rounds: 12
- Mot de passe: `VotreMotDePasseAdmin`

**Exemple de hash généré** :
```
$2b$12$xYz123AbC...HashDeVotreMotDePasse
```

---

#### B) Secret JWT

Générez une chaîne aléatoire sécurisée :

**Méthode 1 - Via Node.js** :

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Méthode 2 - Via PowerShell** :

```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

**Méthode 3 - Via OpenSSL** :

```bash
openssl rand -hex 64
```

**Exemple de secret JWT généré** :
```
a1b2c3d4e5f6...VotreSecretJWTAléatoire64Caractères
```

---

### Étape 2 : Ajouter les Credentials dans Jenkins

#### 1. Ouvrir Jenkins

**URL** : http://localhost:8081
**Login** : `kaba` / `aws123`

---

#### 2. Naviguer vers Credentials

1. Menu gauche : **Manage Jenkins**
2. Cliquez sur : **Credentials**
3. Sous "Stores scoped to Jenkins", cliquez sur : **(global)**

---

#### 3. Créer le Premier Credential (Password Hash)

1. Cliquez sur : **Add Credentials** (menu gauche)

2. Remplissez :
   ```
   Kind:        Secret text
   Scope:       Global (Jenkins, nodes, items, all child items, etc)
   Secret:      [Collez votre hash bcrypt ici]
   ID:          tf-admin-password-hash
   Description: Terraform - Hash du mot de passe admin (bcrypt)
   ```

3. Cliquez sur : **Create**

---

#### 4. Créer le Deuxième Credential (JWT Secret)

1. Cliquez à nouveau sur : **Add Credentials**

2. Remplissez :
   ```
   Kind:        Secret text
   Scope:       Global (Jenkins, nodes, items, all child items, etc)
   Secret:      [Collez votre secret JWT ici]
   ID:          tf-jwt-secret
   Description: Terraform - Secret JWT pour authentification
   ```

3. Cliquez sur : **Create**

---

#### 5. Vérifier

Dans la liste des credentials, vous devriez maintenant voir :
- ✅ `sonarqube-token` - SonarQube Authentication Token
- ✅ `tf-admin-password-hash` - Terraform - Hash du mot de passe admin
- ✅ `tf-jwt-secret` - Terraform - Secret JWT

---

### Étape 3 : Vérifier la Configuration Kubernetes

#### A) Vérifier que Docker Desktop Kubernetes est actif

```bash
kubectl cluster-info
kubectl get nodes
```

**Résultat attendu** :
```
Kubernetes control plane is running at https://kubernetes.docker.internal:6443
NAME             STATUS   ROLES           AGE   VERSION
docker-desktop   Ready    control-plane   XXd   vX.XX.X
```

---

#### B) Vérifier le fichier kubeconfig

```bash
# Afficher le chemin
echo $KUBECONFIG

# Ou vérifier le fichier par défaut
dir "$HOME\.kube\config"

# Tester l'accès
kubectl get namespaces
```

---

#### C) Vérifier depuis Jenkins

Le Jenkinsfile utilise ce chemin :
```
C:\ProgramData\Jenkins\.jenkins\.kube\config
```

**Vérifiez que ce fichier existe** :

```bash
dir "C:\ProgramData\Jenkins\.jenkins\.kube\config"
```

**Si le fichier n'existe pas**, copiez votre kubeconfig :

```bash
# Créer le dossier si nécessaire
mkdir "C:\ProgramData\Jenkins\.jenkins\.kube" -Force

# Copier le kubeconfig
copy "$HOME\.kube\config" "C:\ProgramData\Jenkins\.jenkins\.kube\config"
```

---

### Étape 4 : Tester Terraform Localement

Avant de relancer Jenkins, testez Terraform en local :

```bash
cd E:\ODC-AWS\ProjetFilRouge\ProjetHTML\Portfolio_Siakha_KABA\v10\terraform

# Initialiser
terraform init

# Valider la configuration
terraform validate

# Voir le plan (sans les variables sensibles)
terraform plan -var="admin_password_hash=test" -var="jwt_secret=test"
```

**Résultat attendu** :
- ✅ Validation successful
- ✅ Plan shows resources to create (deployments, services, secrets, etc.)

---

### Étape 5 : Relancer le Build Jenkins

1. Retournez à Jenkins : http://localhost:8081
2. Ouvrez le job : **PortfolioSonar**
3. Cliquez sur : **Build Now**
4. Suivez l'exécution : Cliquez sur le numéro du build > **Console Output**

---

## 📊 Résultats Attendus

### Stage Terraform Init
```
=== Initialisation Terraform ===
Initializing the backend...
Initializing provider plugins...
- Finding hashicorp/kubernetes versions matching "~> 2.27"...
- Installing hashicorp/kubernetes v2.38.0...
Terraform has been successfully initialized!
```

### Stage Terraform Plan
```
=== Plan Terraform ===
Terraform will perform the following actions:

  # kubernetes_deployment.backend will be created
  # kubernetes_deployment.frontend will be created
  # kubernetes_service.backend will be created
  # kubernetes_service.frontend will be created
  # kubernetes_secret.admin_creds will be created
  # kubernetes_deployment.mongo will be created
  
Plan: 15 to add, 0 to change, 0 to destroy.
```

### Stage Terraform Apply
```
=== Application Terraform (deploiement Kubernetes) ===
kubernetes_secret.admin_creds: Creating...
kubernetes_deployment.mongo: Creating...
kubernetes_deployment.backend: Creating...
kubernetes_deployment.frontend: Creating...
kubernetes_service.frontend: Creating...

Apply complete! Resources: 15 added, 0 changed, 0 destroyed.

Outputs:
frontend_url = "http://localhost:30080"
```

---

## 🔧 Dépannage

### Problème 1 : "Error acquiring the state lock"

**Cause** : Un ancien processus Terraform n'a pas libéré le lock

**Solution** :
```bash
cd E:\ODC-AWS\ProjetFilRouge\ProjetHTML\Portfolio_Siakha_KABA\v10\terraform
terraform force-unlock [LOCK_ID]
```

---

### Problème 2 : "Unable to connect to Kubernetes"

**Cause** : Jenkins ne trouve pas le kubeconfig

**Solution** : Vérifiez que le fichier existe et est accessible :
```bash
dir "C:\ProgramData\Jenkins\.jenkins\.kube\config"
```

Si absent, copiez-le :
```bash
copy "$HOME\.kube\config" "C:\ProgramData\Jenkins\.jenkins\.kube\config"
```

---

### Problème 3 : "Error validating credentials"

**Cause** : Les credentials Terraform sont invalides

**Solution** : 
1. Vérifiez dans Jenkins que les credentials existent
2. Régénérez les secrets si nécessaire
3. Mettez à jour les credentials dans Jenkins

---

### Problème 4 : Stage Terraform toujours rapide (50ms)

**Cause** : Les credentials n'existent toujours pas ou ont un mauvais ID

**Solution** :
1. Vérifiez les IDs exacts dans Jenkins :
   - `tf-admin-password-hash` (pas de typo !)
   - `tf-jwt-secret` (pas de typo !)

2. Les IDs doivent correspondre EXACTEMENT au Jenkinsfile :
```groovy
withCredentials([
    string(credentialsId: 'tf-admin-password-hash', variable: 'TF_VAR_admin_password_hash'),
    string(credentialsId: 'tf-jwt-secret', variable: 'TF_VAR_jwt_secret')
])
```

---

## 📋 Checklist de Vérification

Avant de considérer Terraform comme fonctionnel :

- [ ] Terraform installé et dans le PATH
- [ ] Docker Desktop Kubernetes actif
- [ ] kubectl fonctionne en local
- [ ] Kubeconfig copié dans le répertoire Jenkins
- [ ] Hash bcrypt du mot de passe admin généré
- [ ] Secret JWT généré
- [ ] Credential `tf-admin-password-hash` créé dans Jenkins
- [ ] Credential `tf-jwt-secret` créé dans Jenkins
- [ ] Terraform init fonctionne en local
- [ ] Terraform plan fonctionne en local
- [ ] Build Jenkins avec Terraform réussi
- [ ] Application déployée sur Kubernetes
- [ ] Frontend accessible sur http://localhost:30080

---

## 🎯 Architecture Déployée par Terraform

```
┌─────────────────────────────────────────────┐
│         Kubernetes (Docker Desktop)         │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────┐  ┌──────────────┐         │
│  │  Frontend   │  │   Backend    │         │
│  │  (React)    │  │   (Node.js)  │         │
│  │  Port: 3000 │  │   Port: 4000 │         │
│  └─────┬───────┘  └───────┬──────┘         │
│        │                  │                 │
│  ┌─────▼──────────────────▼──────┐         │
│  │       LoadBalancer            │         │
│  │   Frontend: NodePort 30080    │         │
│  │   Backend: ClusterIP          │         │
│  └───────────────────────────────┘         │
│                  │                          │
│         ┌────────▼────────┐                │
│         │    MongoDB      │                │
│         │   Port: 27017   │                │
│         │   PVC: 1Gi      │                │
│         └─────────────────┘                │
│                                             │
│  ┌─────────────────────────────┐           │
│  │  Kubernetes Secrets         │           │
│  │  - admin_password_hash      │           │
│  │  - jwt_secret               │           │
│  └─────────────────────────────┘           │
└─────────────────────────────────────────────┘
```

---

## 🚀 Workflow Complet avec Terraform

```
Git Push
   │
   ▼
Jenkins Checkout
   │
   ▼
SonarQube Analysis ✅
   │
   ▼
Docker Build ✅
   │
   ▼
Docker Push ✅
   │
   ▼
Terraform Init ⚠️ (À configurer)
   │
   ▼
Terraform Plan
   │
   ▼
Terraform Apply → Kubernetes Deployment
   │
   ▼
Application Live 🎉
http://localhost:30080
```

---

## 📚 Documentation Terraform du Projet

Les fichiers Terraform se trouvent dans : `v10/terraform/`

| Fichier | Description |
|---------|-------------|
| `main.tf` | Configuration provider et backend |
| `variables.tf` | Variables (kubeconfig, images, secrets) |
| `backend.tf` | Déploiement backend Node.js |
| `frontend.tf` | Déploiement frontend React |
| `mongo.tf` | Déploiement MongoDB avec PVC |
| `secret.tf` | Secrets Kubernetes (admin, JWT) |
| `outputs.tf` | URLs et infos de déploiement |
| `terraform.tfvars` | Valeurs par défaut des variables |

---

## ✨ Conclusion

Une fois les credentials créés dans Jenkins, Terraform déploiera automatiquement votre infrastructure Kubernetes à chaque build réussi !

**Temps estimé** : 10-15 minutes pour la configuration initiale

**Prochaine action** : Créer les 2 credentials Terraform dans Jenkins puis relancer le build ! 🚀

---

*Guide créé le 9 juin 2026*
*Terraform v1.15.5 | Kubernetes v2.38.0*
