# Script pour créer un kubeconfig propre avec uniquement docker-desktop pour Jenkins
# Ce script doit être exécuté en tant qu'administrateur

Write-Host "=== Création kubeconfig propre pour Jenkins ===" -ForegroundColor Cyan

# Vérifier si le script est exécuté en tant qu'administrateur
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
$isAdmin = $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERREUR: Ce script doit être exécuté en tant qu'administrateur!" -ForegroundColor Red
    exit 1
}

# Chemins
$jenkinsKubeDir = "C:\ProgramData\Jenkins\.jenkins\.kube"
$jenkinsKubeconfig = "$jenkinsKubeDir\config"

# Créer le répertoire .kube pour Jenkins
if (-not (Test-Path $jenkinsKubeDir)) {
    Write-Host "Création du répertoire: $jenkinsKubeDir" -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $jenkinsKubeDir -Force | Out-Null
}

# Extraire uniquement le contexte docker-desktop du kubeconfig utilisateur
Write-Host "Extraction du contexte docker-desktop..." -ForegroundColor Yellow

# Utiliser kubectl pour créer un kubeconfig propre avec uniquement docker-desktop
$env:KUBECONFIG = "$env:USERPROFILE\.kube\config"
kubectl config view --minify --flatten --context=docker-desktop > $jenkinsKubeconfig

if (Test-Path $jenkinsKubeconfig) {
    $fileSize = (Get-Item $jenkinsKubeconfig).Length
    Write-Host "Kubeconfig créé avec succès! Taille: $fileSize octets" -ForegroundColor Green
} else {
    Write-Host "ERREUR: Échec de la création du kubeconfig" -ForegroundColor Red
    exit 1
}

# Configurer les permissions pour le compte SYSTEM
Write-Host "Configuration des permissions..." -ForegroundColor Yellow
try {
    icacls $jenkinsKubeconfig /grant "SYSTEM:(R)" /T /C | Out-Null
    icacls $jenkinsKubeconfig /grant "Administrators:(F)" /T /C | Out-Null
    Write-Host "Permissions configurées!" -ForegroundColor Green
} catch {
    Write-Host "Avertissement: Impossible de configurer les permissions" -ForegroundColor Yellow
}

# Vérifier le contenu
Write-Host "`n=== Vérification ===" -ForegroundColor Cyan
$content = Get-Content $jenkinsKubeconfig -Raw
if ($content -match "docker-desktop") {
    Write-Host "✓ Contexte docker-desktop trouvé" -ForegroundColor Green
} else {
    Write-Host "✗ Contexte docker-desktop NON trouvé!" -ForegroundColor Red
    exit 1
}

if ($content -match "eks\.amazonaws\.com") {
    Write-Host "✗ Contexte AWS EKS détecté (devrait être absent)" -ForegroundColor Red
} else {
    Write-Host "✓ Pas de contexte AWS EKS (correct)" -ForegroundColor Green
}

# Tester kubectl avec le nouveau kubeconfig
Write-Host "`nTest de connexion Kubernetes..." -ForegroundColor Yellow
$env:KUBECONFIG = $jenkinsKubeconfig
try {
    kubectl cluster-info 2>&1 | Select-Object -First 3
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Connexion réussie!" -ForegroundColor Green
    } else {
        Write-Host "✗ Échec de la connexion" -ForegroundColor Red
        Write-Host "Assurez-vous que Docker Desktop Kubernetes est démarré" -ForegroundColor Yellow
    }
} catch {
    Write-Host "✗ Erreur lors du test kubectl" -ForegroundColor Red
}

Write-Host "`n=== Configuration terminée ===" -ForegroundColor Cyan
Write-Host "Relancez maintenant votre build Jenkins." -ForegroundColor Green
