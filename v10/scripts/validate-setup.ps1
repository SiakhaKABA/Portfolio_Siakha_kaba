# ==============================================================================
# validate-setup.ps1
# Verifie que tout l'environnement est pret avant de lancer le pipeline
# A executer sur la machine Jenkins avant le premier build
# ==============================================================================

$ErrorActionPreference = "Continue"
$allOk = $true

function Check($label, $ok, $fix = "") {
    if ($ok) {
        Write-Host "  [OK]  $label" -ForegroundColor Green
    } else {
        Write-Host "  [KO]  $label" -ForegroundColor Red
        if ($fix) { Write-Host "        FIX : $fix" -ForegroundColor Yellow }
        $script:allOk = $false
    }
}

Write-Host ""
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "  Validation de l'environnement PortfolioSonar" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# ── Terraform ─────────────────────────────────────────────────────────────
Write-Host "`n--- Terraform ---" -ForegroundColor White
try {
    $tfv = terraform version 2>&1
    Check "Terraform installe" ($tfv -match "Terraform v") "Executez scripts\install-terraform.ps1 en admin"
    if ($tfv -match "Terraform v(\d+\.\d+)") {
        $major = [int]($Matches[1].Split(".")[0])
        $minor = [int]($Matches[1].Split(".")[1])
        Check "Terraform >= 1.5" ($major -gt 1 -or ($major -eq 1 -and $minor -ge 5)) "Mettez a jour Terraform"
    }
} catch {
    Check "Terraform installe" $false "Executez scripts\install-terraform.ps1 en admin"
}

# ── Kubernetes ─────────────────────────────────────────────────────────────
Write-Host "`n--- Kubernetes ---" -ForegroundColor White
try {
    $ctx = kubectl config current-context 2>&1
    Check "kubectl disponible"              ($ctx -ne $null)            "Installez kubectl"
    Check "Contexte docker-desktop actif"   ($ctx -eq "docker-desktop") "kubectl config use-context docker-desktop"
    $nodes = kubectl get nodes 2>&1
    Check "Cluster accessible"             ($nodes -match "Ready")     "Verifiez Docker Desktop > Settings > Kubernetes"
} catch {
    Check "kubectl disponible" $false "Installez kubectl"
}

$kubeconfigJenkins = "C:\ProgramData\Jenkins\.jenkins\.kube\config"
Check "kubeconfig Jenkins present" (Test-Path $kubeconfigJenkins) `
    "Copy-Item `"`$env:USERPROFILE\.kube\config`" `"$kubeconfigJenkins`""

# ── Docker ─────────────────────────────────────────────────────────────────
Write-Host "`n--- Docker ---" -ForegroundColor White
try {
    $docker = docker info 2>&1
    Check "Docker Desktop en cours" ($docker -match "Server Version") "Demarrez Docker Desktop"
} catch {
    Check "Docker Desktop en cours" $false "Demarrez Docker Desktop"
}

# ── Jenkins ────────────────────────────────────────────────────────────────
Write-Host "`n--- Jenkins ---" -ForegroundColor White
$jenkinsHome = "C:\ProgramData\Jenkins\.jenkins"
Check "Dossier Jenkins present"   (Test-Path $jenkinsHome)           "Verifiez l'installation Jenkins"
Check "kubeconfig dans Jenkins"   (Test-Path "$jenkinsHome\.kube\config") `
    "Copy-Item `"`$env:USERPROFILE\.kube\config`" `"$jenkinsHome\.kube\config`""

$stateDir = "$jenkinsHome\terraform-states\portfolio"
Check "Dossier state Terraform"   (Test-Path $stateDir) `
    "mkdir `"$stateDir`""

# ── Secrets ────────────────────────────────────────────────────────────────
Write-Host "`n--- Secrets Jenkins (verification manuelle requise) ---" -ForegroundColor White
Write-Host "  [??]  Credential 'dockerhub-creds'        -> A verifier dans Jenkins > Manage Credentials" -ForegroundColor Yellow
Write-Host "  [??]  Credential 'tf-admin-password-hash' -> A verifier dans Jenkins > Manage Credentials" -ForegroundColor Yellow
Write-Host "  [??]  Credential 'tf-jwt-secret'          -> A verifier dans Jenkins > Manage Credentials" -ForegroundColor Yellow

# ── Fichiers du projet ─────────────────────────────────────────────────────
Write-Host "`n--- Fichiers Terraform ---" -ForegroundColor White
$tfFiles = @("main.tf","variables.tf","terraform.tfvars","secret.tf","mongo.tf","backend.tf","frontend.tf","outputs.tf")
foreach ($f in $tfFiles) {
    $path = ".\terraform\$f"
    Check "terraform\$f present" (Test-Path $path) "Verifiez l'archive v10.zip"
}

# ── Resultat final ─────────────────────────────────────────────────────────
Write-Host ""
Write-Host "=================================================" -ForegroundColor Cyan
if ($allOk) {
    Write-Host "  TOUT EST OK - Vous pouvez lancer le pipeline !" -ForegroundColor Green
} else {
    Write-Host "  DES PROBLEMES ONT ETE DETECTES" -ForegroundColor Red
    Write-Host "  Corrigez les [KO] ci-dessus avant de lancer Jenkins." -ForegroundColor Yellow
}
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""
