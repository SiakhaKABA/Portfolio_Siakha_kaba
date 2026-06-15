# Script de configuration du kubeconfig pour Jenkins
# Ce script doit être exécuté en tant qu'administrateur

Write-Host "=== Configuration kubeconfig pour Jenkins ===" -ForegroundColor Cyan

# Vérifier si le script est exécuté en tant qu'administrateur
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
$isAdmin = $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERREUR: Ce script doit être exécuté en tant qu'administrateur!" -ForegroundColor Red
    Write-Host "Clic droit sur PowerShell -> Exécuter en tant qu'administrateur" -ForegroundColor Yellow
    exit 1
}

# Chemins
$sourceKubeconfig = "C:\Users\Soni-info Tech\.kube\config"
$jenkinsKubeDir = "C:\ProgramData\Jenkins\.jenkins\.kube"
$jenkinsKubeconfig = "$jenkinsKubeDir\config"

# Vérifier que le fichier source existe
if (-not (Test-Path $sourceKubeconfig)) {
    Write-Host "ERREUR: Le fichier kubeconfig source n'existe pas: $sourceKubeconfig" -ForegroundColor Red
    exit 1
}

Write-Host "Source: $sourceKubeconfig" -ForegroundColor Gray

# Créer le répertoire .kube pour Jenkins
if (-not (Test-Path $jenkinsKubeDir)) {
    Write-Host "Création du répertoire: $jenkinsKubeDir" -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $jenkinsKubeDir -Force | Out-Null
} else {
    Write-Host "Le répertoire existe déjà: $jenkinsKubeDir" -ForegroundColor Green
}

# Copier le fichier kubeconfig
Write-Host "Copie du kubeconfig vers Jenkins..." -ForegroundColor Yellow
Copy-Item -Path $sourceKubeconfig -Destination $jenkinsKubeconfig -Force

if (Test-Path $jenkinsKubeconfig) {
    Write-Host "Kubeconfig copié avec succès!" -ForegroundColor Green
} else {
    Write-Host "ERREUR: Échec de la copie du kubeconfig" -ForegroundColor Red
    exit 1
}

# Configurer les permissions pour le compte SYSTEM (utilisé par Jenkins)
Write-Host "Configuration des permissions pour le compte SYSTEM..." -ForegroundColor Yellow
try {
    icacls $jenkinsKubeconfig /grant "SYSTEM:(R)" /T /C | Out-Null
    Write-Host "Permissions configurées avec succès!" -ForegroundColor Green
} catch {
    Write-Host "Avertissement: Impossible de configurer les permissions ICACLS" -ForegroundColor Yellow
}

# Vérifier le contenu
Write-Host "`n=== Vérification ===" -ForegroundColor Cyan
Write-Host "Taille du fichier: $((Get-Item $jenkinsKubeconfig).Length) octets" -ForegroundColor Gray

# Tester kubectl avec le kubeconfig de Jenkins
Write-Host "`nTest de connexion Kubernetes..." -ForegroundColor Yellow
$env:KUBECONFIG = $jenkinsKubeconfig
try {
    $clusterInfo = kubectl cluster-info 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Connexion Kubernetes réussie!" -ForegroundColor Green
        Write-Host $clusterInfo -ForegroundColor Gray
    } else {
        Write-Host "⚠ Avertissement: Impossible de se connecter au cluster" -ForegroundColor Yellow
        Write-Host "Vérifiez que Docker Desktop Kubernetes est démarré" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠ kubectl non trouvé ou erreur de connexion" -ForegroundColor Yellow
}

Write-Host "`n=== Configuration terminée ===" -ForegroundColor Cyan
Write-Host "Vous pouvez maintenant relancer votre build Jenkins." -ForegroundColor Green
