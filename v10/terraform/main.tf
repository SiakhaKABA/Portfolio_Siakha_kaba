terraform {
  required_version = ">= 1.5.0"

  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.27"
    }
  }

  # Backend local — fichier d'état stocké dans le workspace Jenkins
  backend "local" {
    path = "terraform.tfstate"
  }
}

# ── Provider : Docker Desktop Kubernetes ────────────────────────────────────
provider "kubernetes" {
  config_path    = var.kubeconfig_path
  config_context = var.kube_context

  # Skip TLS verification for Docker Desktop (self-signed cert)
  insecure = true
}
