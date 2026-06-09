# ==============================================================================
# rollback.ps1
# Rollback du deploiement Kubernetes vers le build precedent
# Usage : .\rollback.ps1 [-BuildTag <numero>]
# ==============================================================================

param(
    [string]$BuildTag      = "",
    [string]$Namespace     = "default",
    [string]$DockerRepo    = "siakhakaba19/portfolio",
    [string]$TfStateDir    = "C:\ProgramData\Jenkins\.jenkins\terraform-states\portfolio",
    [string]$TfDir         = ".\terraform"
)

$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "=================================================" -ForegroundColor Red
Write-Host "  ROLLBACK PortfolioSonar" -ForegroundColor Red
Write-Host "=================================================" -ForegroundColor Red

# ── Choix du tag cible ────────────────────────────────────────────────────
if (-not $BuildTag) {
    Write-Host "`nBuilds disponibles sur Docker Hub (derniers tags connus) :"
    docker images "$DockerRepo" --format "{{.Tag}}\t{{.CreatedAt}}" | Sort-Object -Descending | Select-Object -First 10
    $BuildTag = Read-Host "`nEntrez le BUILD_TAG cible pour le rollback"
}

Write-Host "`nRollback vers le tag : $BuildTag" -ForegroundColor Yellow

# ── Rollback kubectl (rapide) ─────────────────────────────────────────────
Write-Host "`n[1/3] Rollback des images Kubernetes..." -ForegroundColor Cyan

kubectl set image deployment/backend  backend="${DockerRepo}:backend-${BuildTag}"  -n $Namespace
kubectl set image deployment/frontend frontend="${DockerRepo}:frontend-${BuildTag}" -n $Namespace

Write-Host "Attente du rollout backend..."
kubectl rollout status deployment/backend  -n $Namespace --timeout=120s
Write-Host "Attente du rollout frontend..."
kubectl rollout status deployment/frontend -n $Namespace --timeout=120s

# ── Verification ──────────────────────────────────────────────────────────
Write-Host "`n[2/3] Verification de l'etat des pods..." -ForegroundColor Cyan
kubectl get pods -n $Namespace

# ── Mise a jour du state Terraform ───────────────────────────────────────
Write-Host "`n[3/3] Synchronisation du state Terraform..." -ForegroundColor Cyan
if (Test-Path $TfDir) {
    Push-Location $TfDir
    terraform apply -input=false -auto-approve `
        -var="backend_image_tag=$BuildTag" `
        -var="frontend_image_tag=$BuildTag"
    Pop-Location
    Write-Host "State Terraform mis a jour." -ForegroundColor Green
} else {
    Write-Host "Dossier Terraform non trouve — state non mis a jour." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=================================================" -ForegroundColor Green
Write-Host "  Rollback termine vers le tag : $BuildTag" -ForegroundColor Green
Write-Host "  Application : http://localhost:30080" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
