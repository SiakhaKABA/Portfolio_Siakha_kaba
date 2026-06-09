# ==============================================================================
# destroy.ps1
# Supprime toute l'infrastructure Terraform (pods, services, secrets, PVC)
# ATTENTION : supprime les donnees MongoDB si confirm
# ==============================================================================

param(
    [switch]$Force,
    [string]$TfDir      = ".\terraform",
    [string]$TfStateDir = "C:\ProgramData\Jenkins\.jenkins\terraform-states\portfolio"
)

Write-Host ""
Write-Host "=================================================" -ForegroundColor Red
Write-Host "  DESTRUCTION de l'infrastructure Terraform" -ForegroundColor Red
Write-Host "  ATTENTION : Suppression du PVC MongoDB incluse" -ForegroundColor Red
Write-Host "=================================================" -ForegroundColor Red

if (-not $Force) {
    $confirm = Read-Host "`nConfirmez la destruction en tapant 'DESTROY'"
    if ($confirm -ne "DESTROY") {
        Write-Host "Annule." -ForegroundColor Green
        exit 0
    }
}

Push-Location $TfDir

# Init avec le bon state
terraform init -input=false -reconfigure `
    -backend-config="path=$TfStateDir\terraform.tfstate"

# Destroy
terraform destroy -input=false -auto-approve

Pop-Location

Write-Host "`nInfrastructure detruite." -ForegroundColor Green
Write-Host "Pour redeployer : relancez le pipeline Jenkins." -ForegroundColor Cyan
