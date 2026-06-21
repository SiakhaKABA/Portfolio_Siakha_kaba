# Terraform — PortfolioSonar IaC

Ce dossier contient l'infrastructure as code (IaC) Terraform pour déployer
le projet PortfolioSonar sur Kubernetes (Docker Desktop).

**⚠️ SOURCE DE VÉRITÉ UNIQUE :** Toute la configuration Kubernetes est gérée ici.
Il n'existe pas de manifests YAML manuels (k8s/) - Terraform gère tout de façon déclarative.

## Structure

```
terraform/
├── main.tf           # Provider Kubernetes + backend state
├── variables.tf      # Déclaration de toutes les variables
├── terraform.tfvars  # Valeurs non-sensibles (commité)
├── secret.tf         # Secret Kubernetes (admin hash + JWT)
├── mongo.tf          # PVC + Deployment + Service MongoDB
├── backend.tf        # Deployment + Service Node.js
├── frontend.tf       # Deployment + Service React/Nginx
└── outputs.tf        # URLs et infos de sortie
```

## Prérequis

- Terraform >= 1.5.0
- Docker Desktop avec Kubernetes activé
- kubectl configuré sur le contexte `docker-desktop`

## Utilisation manuelle

### 1. Initialiser Terraform
```bash
terraform init
```

### 2. Planifier le déploiement
```bash
terraform plan \
  -var="admin_password_hash=$$2a$$12$$..." \
  -var="jwt_secret=votre_secret" \
  -var="backend_image_tag=latest" \
  -var="frontend_image_tag=latest"
```

### 3. Appliquer
```bash
terraform apply \
  -var="admin_password_hash=$$2a$$12$$..." \
  -var="jwt_secret=votre_secret" \
  -auto-approve
```

### 4. Détruire l'infrastructure
```bash
terraform destroy -auto-approve
```

## Variables sensibles dans Jenkins

Créer deux credentials Jenkins de type **Secret text** :

| Credential ID            | Contenu                        |
|--------------------------|-------------------------------|
| `tf-admin-password-hash` | Valeur de ADMIN_PASSWORD_HASH |
| `tf-jwt-secret`          | Valeur de JWT_SECRET          |

Ces credentials sont injectés automatiquement via `TF_VAR_*`
dans le Jenkinsfile — jamais stockés en clair.

## Fichier .gitignore recommandé

```
terraform/.terraform/
terraform/terraform.tfstate
terraform/terraform.tfstate.backup
terraform/tfplan
terraform/.terraform.lock.hcl
```
