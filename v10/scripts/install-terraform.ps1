# ==============================================================================
# install-terraform.ps1
# Script d'installation et de verification de Terraform sur Windows
# A executer en tant qu'Administrateur sur la machine Jenkins
# ==============================================================================

param(
    [string]$TerraformVersion = "1.8.4"
)

$ErrorActionPreference = "Stop"

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "  Installation de Terraform v$TerraformVersion" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# ── 1. Verifier si Terraform est deja installe ─────────────────────────────
Write-Host "`n[1/5] Verification de l'installation existante..." -ForegroundColor Yellow
try {
    $existing = terraform version 2>&1
    if ($existing -match "Terraform v") {
        Write-Host "Terraform deja installe :" -ForegroundColor Green
        Write-Host $existing[0]
        $choice = Read-Host "Reinstaller ? (o/N)"
        if ($choice -ne "o") {
            Write-Host "Installation annulee." -ForegroundColor Green
            exit 0
        }
    }
} catch {
    Write-Host "Terraform non trouve — installation en cours..." -ForegroundColor Yellow
}

# ── 2. Telechargement ─────────────────────────────────────────────────────
Write-Host "`n[2/5] Telechargement de Terraform v$TerraformVersion..." -ForegroundColor Yellow

$url      = "https://releases.hashicorp.com/terraform/${TerraformVersion}/terraform_${TerraformVersion}_windows_amd64.zip"
$zipPath  = "$env:TEMP\terraform_${TerraformVersion}.zip"
$installDir = "C:\terraform"

try {
    Invoke-WebRequest -Uri $url -OutFile $zipPath -UseBasicParsing
    Write-Host "Telechargement termine." -ForegroundColor Green
} catch {
    Write-Host "ERREUR : Impossible de telecharger Terraform." -ForegroundColor Red
    Write-Host "URL : $url"
    Write-Host "Verifiez votre connexion ou telechargez manuellement depuis https://www.terraform.io/downloads"
    exit 1
}

# ── 3. Extraction ─────────────────────────────────────────────────────────
Write-Host "`n[3/5] Extraction vers $installDir..." -ForegroundColor Yellow

if (-not (Test-Path $installDir)) {
    New-Item -ItemType Directory -Path $installDir | Out-Null
}

Expand-Archive -Path $zipPath -DestinationPath $installDir -Force
Remove-Item $zipPath
Write-Host "Extraction terminee." -ForegroundColor Green

# ── 4. Ajout au PATH systeme ───────────────────────────────────────────────
Write-Host "`n[4/5] Ajout de $installDir au PATH systeme..." -ForegroundColor Yellow

$currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
if ($currentPath -notlike "*$installDir*") {
    [Environment]::SetEnvironmentVariable("Path", "$currentPath;$installDir", "Machine")
    $env:Path = "$env:Path;$installDir"
    Write-Host "PATH mis a jour." -ForegroundColor Green
} else {
    Write-Host "$installDir deja dans le PATH." -ForegroundColor Green
}

# ── 5. Verification ───────────────────────────────────────────────────────
Write-Host "`n[5/5] Verification de l'installation..." -ForegroundColor Yellow

try {
    $version = & "$installDir\terraform.exe" version
    Write-Host $version[0] -ForegroundColor Green
    Write-Host "`nTerraform installe avec succes !" -ForegroundColor Green
} catch {
    Write-Host "ERREUR : Terraform non accessible apres installation." -ForegroundColor Red
    exit 1
}

# ── Verification Kubernetes ────────────────────────────────────────────────
Write-Host "`n=================================================" -ForegroundColor Cyan
Write-Host "  Verification de l'environnement Kubernetes" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

Write-Host "`nContexte actuel :"
kubectl config current-context

Write-Host "`nCluster info :"
kubectl cluster-info --request-timeout=5s

# ── Creation du dossier de state Terraform ────────────────────────────────
Write-Host "`n=================================================" -ForegroundColor Cyan
Write-Host "  Creation du dossier de state Terraform" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

$stateDir = "C:\ProgramData\Jenkins\.jenkins\terraform-states\portfolio"
if (-not (Test-Path $stateDir)) {
    New-Item -ItemType Directory -Path $stateDir -Force | Out-Null
    Write-Host "Dossier cree : $stateDir" -ForegroundColor Green
} else {
    Write-Host "Dossier existant : $stateDir" -ForegroundColor Green
}

Write-Host "`n=================================================" -ForegroundColor Green
Write-Host "  Tout est pret ! Vous pouvez lancer Jenkins." -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
Write-Host "`nProchaine etape : creer les credentials Jenkins :"
Write-Host "  - tf-admin-password-hash  (Secret text)"
Write-Host "  - tf-jwt-secret           (Secret text)"
