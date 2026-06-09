# ==============================================================================
# setup-jenkins-credentials.ps1
# Cree les credentials Jenkins necessaires pour Terraform via Jenkins CLI
# Prerequis : Jenkins tourne sur http://localhost:8080
# ==============================================================================

param(
    [string]$JenkinsUrl      = "http://localhost:8080",
    [string]$JenkinsUser     = "admin",
    [string]$JenkinsPassword = "",
    [string]$AdminHash       = "",
    [string]$JwtSecret       = ""
)

# Demande interactive si les params ne sont pas fournis
if (-not $JenkinsPassword) {
    $secPass = Read-Host "Mot de passe Jenkins admin" -AsSecureString
    $JenkinsPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secPass)
    )
}
if (-not $AdminHash) {
    $secHash = Read-Host "ADMIN_PASSWORD_HASH (bcrypt)" -AsSecureString
    $AdminHash = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secHash)
    )
}
if (-not $JwtSecret) {
    $secJwt = Read-Host "JWT_SECRET" -AsSecureString
    $JwtSecret = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secJwt)
    )
}

Write-Host "`nCreation des credentials Jenkins..." -ForegroundColor Cyan

# Telecharge jenkins-cli.jar
$cliJar = "$env:TEMP\jenkins-cli.jar"
if (-not (Test-Path $cliJar)) {
    Write-Host "Telechargement de jenkins-cli.jar..."
    Invoke-WebRequest -Uri "$JenkinsUrl/jnlpJars/jenkins-cli.jar" -OutFile $cliJar -UseBasicParsing
}

function Create-Credential($id, $description, $secret) {
    $xml = @"
<org.jenkinsci.plugins.plaincredentials.impl.StringCredentialsImpl>
  <scope>GLOBAL</scope>
  <id>$id</id>
  <description>$description</description>
  <secret>$secret</secret>
</org.jenkinsci.plugins.plaincredentials.impl.StringCredentialsImpl>
"@
    $tmpFile = "$env:TEMP\cred_$id.xml"
    $xml | Out-File -FilePath $tmpFile -Encoding UTF8

    java -jar $cliJar -s $JenkinsUrl -auth "${JenkinsUser}:${JenkinsPassword}" `
        create-credentials-by-xml system::system::jenkins _ < $tmpFile

    Remove-Item $tmpFile
    Write-Host "  [OK] Credential '$id' cree" -ForegroundColor Green
}

Create-Credential `
    "tf-admin-password-hash" `
    "Terraform - ADMIN_PASSWORD_HASH (bcrypt)" `
    $AdminHash

Create-Credential `
    "tf-jwt-secret" `
    "Terraform - JWT_SECRET" `
    $JwtSecret

Write-Host "`nCredentials crees avec succes !" -ForegroundColor Green
Write-Host "Verifiez dans : $JenkinsUrl/manage/credentials/" -ForegroundColor Cyan
