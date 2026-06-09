#!/bin/bash

# Script de nettoyage des ressources Kubernetes existantes
# À exécuter avant le premier déploiement Terraform

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║    Nettoyage des Ressources Kubernetes Existantes           ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

NAMESPACE="default"

echo "🔍 Vérification des ressources existantes..."
echo ""

# Liste des ressources à supprimer
RESOURCES=(
  "deployment/backend"
  "deployment/frontend"
  "deployment/mongo"
  "service/backend"
  "service/frontend"
  "service/mongo"
  "secret/portfolio-secret"
  "pvc/mongo-pvc"
)

echo "📋 Ressources qui seront supprimées:"
for resource in "${RESOURCES[@]}"; do
  if kubectl get $resource -n $NAMESPACE 2>/dev/null; then
    echo "  ✅ $resource (existe)"
  else
    echo "  ⏭️  $resource (n'existe pas)"
  fi
done

echo ""
read -p "⚠️  Voulez-vous supprimer ces ressources ? (y/N): " confirm

if [[ ! $confirm =~ ^[Yy]$ ]]; then
  echo "❌ Annulé par l'utilisateur"
  exit 0
fi

echo ""
echo "🗑️  Suppression en cours..."
echo ""

# Supprimer les déploiements
echo "1️⃣  Suppression des déploiements..."
kubectl delete deployment backend frontend mongo -n $NAMESPACE --ignore-not-found=true
echo ""

# Supprimer les services
echo "2️⃣  Suppression des services..."
kubectl delete service backend frontend mongo -n $NAMESPACE --ignore-not-found=true
echo ""

# Supprimer les secrets
echo "3️⃣  Suppression des secrets..."
kubectl delete secret portfolio-secret -n $NAMESPACE --ignore-not-found=true
echo ""

# Supprimer les PVC
echo "4️⃣  Suppression des PVC..."
kubectl delete pvc mongo-pvc -n $NAMESPACE --ignore-not-found=true
echo ""

# Attendre que tout soit bien supprimé
echo "⏳ Attente de la suppression complète..."
sleep 5

echo ""
echo "✅ Nettoyage terminé!"
echo ""
echo "📊 État actuel du cluster:"
kubectl get all,pvc,secret -n $NAMESPACE
echo ""
echo "🚀 Vous pouvez maintenant relancer le build Jenkins"
echo "   Terraform créera toutes les ressources proprement"
