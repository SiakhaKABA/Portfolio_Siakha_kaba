# Résolution des erreurs Terraform

## Problèmes rencontrés et solutions

### 1. ✅ Erreur TLS Certificate (RÉSOLU)
**Erreur:** `x509: certificate signed by unknown authority`

**Cause:** Docker Desktop Kubernetes utilise des certificats auto-signés.

**Solution:** Ajout de `insecure = true` dans le provider Kubernetes (déjà fait dans main.tf)

### 2. ✅ Erreur "Unauthorized" (RÉSOLU)
**Erreur:** `Error: Unauthorized` lors du refresh de l'état Terraform

**Cause:** Le kubeconfig de Jenkins contenait des certificats expirés ou invalides.

**Solution:** Copie du kubeconfig valide de l'utilisateur vers Jenkins
```bash
cp ~/.kube/config C:\ProgramData\Jenkins\.jenkins\.kube\config
```

### 3. ⚠️ Variables manquantes dans Jenkins

**Erreur:** `No value for required variable: admin_password_hash` et `jwt_secret`

**Solution:** 
Dans Jenkins, les credentials sont déjà configurés via `withCredentials`:
- `tf-admin-password-hash` → `TF_VAR_admin_password_hash`
- `tf-jwt-secret` → `TF_VAR_jwt_secret`

Ces variables sont automatiquement injectées par Jenkins lors de l'exécution du pipeline.

Pour tester localement, un fichier `terraform.tfvars` a été créé (ignoré par Git).

## Actions effectuées

1. ✅ Ajout de `insecure = true` au provider Kubernetes dans main.tf
2. ✅ Mise à jour du kubeconfig Jenkins avec des certificats valides
3. ✅ Création de terraform.tfvars pour tests locaux
4. ✅ Ajout de terraform.tfvars au .gitignore

## Prochain build Jenkins

Le prochain build Jenkins devrait fonctionner correctement car :
1. Le code mis à jour (main.tf avec insecure=true) sera récupéré
2. Le kubeconfig de Jenkins est maintenant valide
3. Les credentials Jenkins fourniront les variables nécessaires

## Test manuel (si nécessaire)

```bash
# Dans le workspace Jenkins
cd C:\ProgramData\Jenkins\.jenkins\workspace\PortfolioSonar\v10\terraform

# Vérifier que kubectl fonctionne
kubectl get nodes --kubeconfig="C:\ProgramData\Jenkins\.jenkins\.kube\config"

# Test Terraform (avec les variables)
terraform plan -input=false \
  -var="backend_image_tag=107" \
  -var="frontend_image_tag=107" \
  -var="admin_password_hash=$TF_VAR_admin_password_hash" \
  -var="jwt_secret=$TF_VAR_jwt_secret"
```

## Maintenance

### Renouvellement du kubeconfig
Si Docker Desktop est redémarré ou si les certificats expirent, refaire :
```bash
cp ~/.kube/config C:\ProgramData\Jenkins\.jenkins\.kube\config
```

### Vérification rapide
```bash
# Test connexion Kubernetes
kubectl get nodes --kubeconfig="C:\ProgramData\Jenkins\.jenkins\.kube\config"

# Test Terraform (depuis le workspace)
cd terraform && terraform validate
```
