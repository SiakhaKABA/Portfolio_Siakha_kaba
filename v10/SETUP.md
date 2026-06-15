# Guide de mise en place — Terraform IaC pour PortfolioSonar

## Vue d'ensemble de l'architecture

```
Git Push
   │
   ▼
Jenkins Pipeline
   ├─ Checkout
   ├─ SonarQube Analysis
   ├─ Build Docker images
   ├─ Push Docker Hub
   ├─ Terraform Init  ──┐
   ├─ Terraform Plan    ├─── IaC : déclare l'infra Kubernetes
   ├─ Terraform Apply ──┘
   ├─ Rollout (mise à jour des images)
   └─ Vérification

Docker Desktop Kubernetes
   ├─ Secret (ADMIN_PASSWORD_HASH, JWT_SECRET)
   ├─ PVC mongo-pvc (1Gi)
   ├─ Deployment mongo  → Service mongo:27017
   ├─ Deployment backend  → Service backend:3001
   └─ Deployment frontend → Service frontend:80 (NodePort 30080)
```

---

## Étape 0 — Configurer Kubeconfig pour Jenkins

Jenkins a besoin d'un kubeconfig propre avec uniquement le contexte `docker-desktop`.

**Créer le kubeconfig :**

```bash
# Créer le répertoire
mkdir C:\ProgramData\Jenkins\.jenkins\.kube

# Extraire uniquement docker-desktop
kubectl config view --minify --flatten --context=docker-desktop > C:\ProgramData\Jenkins\.jenkins\.kube\config
```

**Vérifier :**

```bash
set KUBECONFIG=C:\ProgramData\Jenkins\.jenkins\.kube\config
kubectl cluster-info
kubectl get nodes
```

> 📖 Voir [KUBECONFIG-SETUP.md](KUBECONFIG-SETUP.md) pour plus de détails.

---

## Étape 1 — Installer Terraform

**Télécharger Terraform :**
- https://developer.hashicorp.com/terraform/downloads
- Extraire dans `C:\Program Files\Terraform\`
- Ajouter au PATH Windows

**Vérifier l'installation :**

```powershell
terraform version
# Terraform v1.8.4 ou supérieur
```

---

## Étape 2 — Vérifier l'environnement

**Vérifier que tout est prêt :**

```powershell
# Docker Desktop avec Kubernetes activé
docker version
kubectl version

# Terraform installé
terraform version

# Jenkins accessible
# http://localhost:8080
```

---

## Étape 3 — Créer les credentials Jenkins

Aller dans **Jenkins → Manage Jenkins → Credentials → System → Global**

Créer **2 credentials** de type `Secret text` :

| ID | Description | Valeur |
|----|-------------|--------|
| `tf-admin-password-hash` | Hash bcrypt du mot de passe admin | `$2a$12$...` |
| `tf-jwt-secret` | Secret JWT | valeur de JWT_SECRET |

---

## Étape 4 — Déploiement initial manuel (recommandé)

Avant le premier lancement Jenkins, initialiser Terraform manuellement :

```powershell
cd v10\terraform

# Initialiser
terraform init -backend-config="path=C:\ProgramData\Jenkins\.jenkins\terraform-states\portfolio\terraform.tfstate"

# Planifier
terraform plan `
  -var="admin_password_hash=VOTRE_HASH_BCRYPT" `
  -var="jwt_secret=VOTRE_JWT_SECRET" `
  -var="backend_image_tag=latest" `
  -var="frontend_image_tag=latest"

# Appliquer
terraform apply `
  -var="admin_password_hash=VOTRE_HASH_BCRYPT" `
  -var="jwt_secret=VOTRE_JWT_SECRET" `
  -auto-approve
```

Vérifier le déploiement :

```powershell
terraform output
# frontend_url  = "http://localhost:30080"
# backend_service = "http://backend:3001"
# mongo_service   = "mongodb://mongo:27017/portfolio"

kubectl get pods
# NAME                        READY   STATUS    RESTARTS
# mongo-xxx                   1/1     Running   0
# backend-xxx                 1/1     Running   0
# frontend-xxx                1/1     Running   0
```

---

## Étape 5 — Lancer le pipeline Jenkins

Le pipeline s'exécute automatiquement à chaque push Git.

Lors du premier build, Terraform crée toutes les ressources.
Les builds suivants mettent à jour uniquement ce qui a changé.

---

## Gestion du State Terraform

Le fichier d'état est stocké de façon persistante hors du workspace :

```
C:\ProgramData\Jenkins\.jenkins\terraform-states\portfolio\terraform.tfstate
```

**Pourquoi hors du workspace ?**
- Le workspace Jenkins est effacé à chaque build
- Le state doit persister entre les builds pour que Terraform
  sache ce qui est déjà déployé

**Sauvegarder le state :**

```powershell
copy "C:\ProgramData\Jenkins\.jenkins\terraform-states\portfolio\terraform.tfstate" `
     "C:\backups\terraform-$(Get-Date -Format 'yyyyMMdd').tfstate"
```

---

## Rollback vers un build précédent

Rollback Kubernetes natif :

```powershell
kubectl rollout undo deployment/backend  -n default
kubectl rollout undo deployment/frontend -n default
```

---

## Détruire toute l'infrastructure

```powershell
cd v10\terraform
terraform destroy -auto-approve
```

---

## Résolution des problèmes courants

### Erreur : "Backend configuration changed"

```powershell
terraform init -reconfigure `
  -backend-config="path=C:\ProgramData\Jenkins\.jenkins\terraform-states\portfolio\terraform.tfstate"
```

### Erreur : "Error acquiring the state lock"

```powershell
terraform force-unlock LOCK_ID
```

### Erreur : TLS / x509 (certificat Kubernetes)

```powershell
Copy-Item "$env:USERPROFILE\.kube\config" "C:\ProgramData\Jenkins\.jenkins\.kube\config"
```

### Voir l'état actuel de l'infra

```powershell
cd v10\terraform
terraform show
terraform state list
```

---

## Structure complète du projet v10

```
v10/
├── Jenkinsfile                    ← Pipeline CI/CD complet
├── .gitignore
├── docker-compose.yml             ← Développement local
├── sonar-project.properties
├── KUBECONFIG-SETUP.md            ← Guide config kubeconfig Jenkins
├── SETUP.md                       ← Guide d'installation
├── LINKEDIN-POST.md               ← Posts LinkedIn pour le projet
│
├── backend/                       ← API Node.js
│   ├── .env.example               ← Template variables d'environnement
│   └── ...
│
├── frontend/                      ← App React
│   └── ...
│
└── terraform/                     ← IaC - Gère TOUTE l'infra Kubernetes
    ├── main.tf                    ← Configuration provider Kubernetes
    ├── variables.tf               ← Variables paramétrables
    ├── secret.tf                  ← Secret Kubernetes (credentials)
    ├── mongo.tf                   ← MongoDB (PVC + Deployment + Service)
    ├── backend.tf                 ← Backend (Deployment + Service)
    ├── frontend.tf                ← Frontend (Deployment + Service NodePort)
    ├── outputs.tf                 ← Outputs (URLs, images déployées)
    └── README.md
```

**Note importante :** Terraform gère TOUTE la configuration Kubernetes de façon déclarative. 
Il n'y a pas de dossier k8s/ avec des manifests YAML manuels - tout est défini dans les fichiers .tf
