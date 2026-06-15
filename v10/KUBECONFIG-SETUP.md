# Configuration Kubeconfig pour Jenkins

## Problème résolu

Jenkins avait des erreurs d'authentification Kubernetes car le kubeconfig utilisateur contenait plusieurs contextes (docker-desktop + AWS EKS obsolète).

## Solution appliquée

Un kubeconfig propre contenant UNIQUEMENT le contexte `docker-desktop` a été créé pour Jenkins.

## Emplacement du fichier

```
C:\ProgramData\Jenkins\.jenkins\.kube\config
```

Ce fichier contient uniquement :
- ✅ Cluster docker-desktop
- ✅ Credentials docker-desktop
- ❌ Pas de contexte AWS EKS ou autre

## Vérification

Pour tester que le kubeconfig fonctionne :

```bash
set KUBECONFIG=C:\ProgramData\Jenkins\.jenkins\.kube\config
kubectl cluster-info
kubectl get nodes
```

Devrait afficher :
```
Kubernetes control plane is running at https://kubernetes.docker.internal:6443
NAME             STATUS   ROLES           AGE   VERSION
docker-desktop   Ready    control-plane   ...   v1.34.1
```

## Recréer le kubeconfig (si nécessaire)

Si vous devez recréer le fichier kubeconfig propre :

```bash
# Extraire uniquement docker-desktop
kubectl config view --minify --flatten --context=docker-desktop > C:\ProgramData\Jenkins\.jenkins\.kube\config
```

## Prérequis

- Docker Desktop avec Kubernetes activé et démarré
- Contexte `docker-desktop` configuré dans votre kubeconfig utilisateur
